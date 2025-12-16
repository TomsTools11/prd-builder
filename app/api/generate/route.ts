import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getSystemPrompt, buildPRDPrompt } from "@/lib/promptBuilder";
import type { PRDFormData } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const productName = formData.get("productName") as string;
    const description = formData.get("description") as string;
    const goals = (formData.get("goals") as string) || "";
    const targetAudience = (formData.get("targetAudience") as string) || "";
    const featuresString = (formData.get("features") as string) || "[]";
    const features = JSON.parse(featuresString);

    if (!productName || !description) {
      return new Response(JSON.stringify({ error: "Product name and description are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prdFormData: PRDFormData = {
      productName,
      description,
      goals,
      targetAudience,
      features,
    };

    // Process uploaded files
    const files = formData.getAll("files") as File[];
    const processedFiles: Array<{ name: string; content: string; type: string }> = [];

    for (const file of files) {
      try {
        if (file.type.includes("pdf")) {
          // For PDFs, we'll extract text on the server
          const { processPDFFile } = await import("@/lib/fileProcessors/pdfProcessor");
          const text = await processPDFFile(file);
          processedFiles.push({
            name: file.name,
            content: text,
            type: file.type,
          });
        } else if (file.type.includes("document")) {
          // For DOCX files
          const { processDOCXFile } = await import("@/lib/fileProcessors/docxProcessor");
          const text = await processDOCXFile(file);
          processedFiles.push({
            name: file.name,
            content: text,
            type: file.type,
          });
        } else if (file.type.startsWith("image/")) {
          // Note: For images, we describe them (vision support requires different API call)
          processedFiles.push({
            name: file.name,
            content: `[Image file: ${file.name} - Visual context provided]`,
            type: file.type,
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        // Continue with other files
      }
    }

    // Initialize Anthropic
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Anthropic API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const anthropic = new Anthropic({
      apiKey,
    });

    // Build prompt for Claude
    const userPrompt = buildPRDPrompt(prdFormData, processedFiles);

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.stream({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 8192,
            system: getSystemPrompt(),
            messages: [
              {
                role: "user",
                content: userPrompt,
              },
            ],
          });

          for await (const event of response) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              const text = event.delta.text;
              if (text) {
                const data = `data: ${JSON.stringify({ text })}\n\n`;
                controller.enqueue(encoder.encode(data));
              }
            }
          }

          // Send completion signal
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error: any) {
          console.error("Streaming error:", error);
          const errorMessage = error?.message || error?.error?.message || "Error during generation";
          console.error("Error details:", JSON.stringify(error, null, 2));
          const errorData = `data: ${JSON.stringify({
            error: errorMessage,
          })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to generate PRD",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
