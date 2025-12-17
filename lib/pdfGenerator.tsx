import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

// Color palette
const colors = {
  prussianBlue: "#021A2E",
  yaleBlue: "#014379",
  dodgerBlue: "#0d91fd",
  coolSky: "#5db5fe",
  icyBlue: "#c2e3fe",
  white: "#ffffff",
  gray: "#6b7280",
  lightGray: "#f3f4f6",
};

// Simple styles without problematic features
const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingBottom: 70,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: colors.prussianBlue,
  },
  coverPage: {
    padding: 50,
    fontFamily: "Helvetica",
    backgroundColor: colors.prussianBlue,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
    marginBottom: 20,
    textAlign: "center",
  },
  coverSubtitle: {
    fontSize: 18,
    color: colors.coolSky,
    marginBottom: 40,
    textAlign: "center",
  },
  coverMeta: {
    fontSize: 12,
    color: colors.icyBlue,
    textAlign: "center",
    marginTop: 10,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.dodgerBlue,
  },
  headerTitle: {
    fontSize: 10,
    color: colors.gray,
  },
  h1: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: colors.prussianBlue,
    marginBottom: 14,
    marginTop: 20,
  },
  h2: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.yaleBlue,
    marginBottom: 10,
    marginTop: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.icyBlue,
  },
  h3: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: colors.dodgerBlue,
    marginBottom: 8,
    marginTop: 12,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  listItem: {
    fontSize: 11,
    marginBottom: 4,
    marginLeft: 15,
    lineHeight: 1.4,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  italic: {
    fontFamily: "Helvetica-Oblique",
  },
  boldItalic: {
    fontFamily: "Helvetica-BoldOblique",
  },
  inlineCode: {
    fontFamily: "Courier",
    fontSize: 10,
  },
});

// Sanitize text for PDF - very strict, ASCII only
function sanitizeText(text: string): string {
  if (!text) return "";

  return (
    text
      // Replace common unicode with ASCII equivalents
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
      .replace(/[\u2013\u2014\u2015]/g, "-")
      .replace(/\u2026/g, "...")
      .replace(/[\u2022\u2023\u25E6\u2043\u2219\u00B7]/g, "*")
      .replace(/\u00A0/g, " ")
      // Remove all non-ASCII characters
      .replace(/[^\x20-\x7E\n\r\t]/g, "")
      // Normalize whitespace
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\t/g, "  ")
      .replace(/ +/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

// Parse markdown into simple sections
interface Section {
  type: "h1" | "h2" | "h3" | "paragraph" | "listItem";
  content: string;
}

// Type for inline formatting parts
type FormattedPart = {
  type: "plain" | "bold" | "italic" | "boldItalic" | "code";
  content: string;
};

// Tokenize inline markdown formatting (bold, italic, code)
function tokenizeInlineMarkdown(text: string): FormattedPart[] {
  const result: FormattedPart[] = [];
  // Regex: boldItalic (***), bold (**), italic (*), code (`)
  // Order matters - check boldItalic before bold/italic
  const pattern =
    /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*([^*\n]+)\*|`([^`\n]+)`)/g;

  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add plain text before this match
    if (match.index > lastIndex) {
      result.push({ type: "plain", content: text.slice(lastIndex, match.index) });
    }

    // Determine which capture group matched
    if (match[2] !== undefined) {
      result.push({ type: "boldItalic", content: match[2] });
    } else if (match[3] !== undefined) {
      result.push({ type: "bold", content: match[3] });
    } else if (match[4] !== undefined) {
      result.push({ type: "italic", content: match[4] });
    } else if (match[5] !== undefined) {
      result.push({ type: "code", content: match[5] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    result.push({ type: "plain", content: text.slice(lastIndex) });
  }

  return result.length > 0 ? result : [{ type: "plain", content: text }];
}

// Render formatted text with proper Text components
function renderFormattedText(text: string): React.ReactNode {
  const parts = tokenizeInlineMarkdown(text);

  // If only one plain part, return as string
  if (parts.length === 1 && parts[0].type === "plain") {
    return parts[0].content;
  }

  return parts.map((part, index) => {
    switch (part.type) {
      case "bold":
        return (
          <Text key={index} style={styles.bold}>
            {part.content}
          </Text>
        );
      case "italic":
        return (
          <Text key={index} style={styles.italic}>
            {part.content}
          </Text>
        );
      case "boldItalic":
        return (
          <Text key={index} style={styles.boldItalic}>
            {part.content}
          </Text>
        );
      case "code":
        return (
          <Text key={index} style={styles.inlineCode}>
            {part.content}
          </Text>
        );
      case "plain":
      default:
        return part.content;
    }
  });
}

function parseMarkdown(content: string): Section[] {
  const clean = sanitizeText(content);
  const lines = clean.split("\n");
  const sections: Section[] = [];
  let paragraph = "";

  const flushParagraph = () => {
    if (paragraph.trim()) {
      sections.push({ type: "paragraph", content: paragraph.trim() });
      paragraph = "";
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      sections.push({ type: "h3", content: trimmed.slice(4) });
    } else if (trimmed.startsWith("## ")) {
      flushParagraph();
      sections.push({ type: "h2", content: trimmed.slice(3) });
    } else if (trimmed.startsWith("# ")) {
      flushParagraph();
      sections.push({ type: "h1", content: trimmed.slice(2) });
    } else if (trimmed.match(/^[-*]\s/)) {
      flushParagraph();
      sections.push({ type: "listItem", content: "* " + trimmed.slice(2) });
    } else if (trimmed.match(/^\d+\.\s/)) {
      flushParagraph();
      sections.push({ type: "listItem", content: trimmed });
    } else if (trimmed === "") {
      flushParagraph();
    } else {
      paragraph += (paragraph ? " " : "") + trimmed;
    }
  }

  flushParagraph();
  return sections;
}

// Simple PRD Document
function PRDDocument({
  productName,
  content,
}: {
  productName: string;
  content: string;
}) {
  const safeName = sanitizeText(productName) || "Product";
  const sections = parseMarkdown(content);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={styles.coverTitle}>Product Requirements Document</Text>
          <Text style={styles.coverSubtitle}>{safeName}</Text>
          <Text style={styles.coverMeta}>Generated: {today}</Text>
          <Text style={styles.coverMeta}>Created with PRD Builder</Text>
        </View>
      </Page>

      {/* Content Pages */}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {safeName} - Product Requirements Document
          </Text>
        </View>

        {sections.map((section, index) => {
          const key = `section-${index}`;
          switch (section.type) {
            case "h1":
              return (
                <Text key={key} style={styles.h1}>
                  {renderFormattedText(section.content)}
                </Text>
              );
            case "h2":
              return (
                <Text key={key} style={styles.h2}>
                  {renderFormattedText(section.content)}
                </Text>
              );
            case "h3":
              return (
                <Text key={key} style={styles.h3}>
                  {renderFormattedText(section.content)}
                </Text>
              );
            case "listItem":
              return (
                <Text key={key} style={styles.listItem}>
                  {renderFormattedText(section.content)}
                </Text>
              );
            case "paragraph":
              return (
                <Text key={key} style={styles.paragraph}>
                  {renderFormattedText(section.content)}
                </Text>
              );
            default:
              return null;
          }
        })}
      </Page>
    </Document>
  );
}

// Generate PDF blob
export async function generatePRDPdf(
  productName: string,
  content: string
): Promise<Blob> {
  try {
    const safeContent = sanitizeText(content) || "No content available.";
    const safeName = sanitizeText(productName) || "Product";

    // Limit content length
    const maxLength = 30000;
    const truncatedContent =
      safeContent.length > maxLength
        ? safeContent.slice(0, maxLength) + "\n\n[Content truncated...]"
        : safeContent;

    console.log("Generating PDF:", safeName, "Length:", truncatedContent.length);

    const doc = (
      <PRDDocument productName={safeName} content={truncatedContent} />
    );
    const blob = await pdf(doc).toBlob();

    console.log("PDF generated, size:", blob.size);
    return blob;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

// Download PDF helper
export async function downloadPRDPdf(
  productName: string,
  content: string
): Promise<void> {
  const blob = await generatePRDPdf(productName, content);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const fileName = sanitizeText(productName).replace(/\s+/g, "-") || "PRD";
  link.download = `${fileName}-PRD.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
