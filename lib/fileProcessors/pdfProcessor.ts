// pdf-parse requires CommonJS import
const pdfParse = require("pdf-parse");

export async function extractPDFText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error("Failed to parse PDF file");
  }
}

export async function processPDFFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return extractPDFText(buffer);
}
