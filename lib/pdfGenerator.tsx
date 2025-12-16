import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";

// Register fonts (using system fonts for simplicity)
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2",
      fontWeight: 700,
    },
  ],
});

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

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Inter",
    fontSize: 11,
    color: colors.prussianBlue,
    lineHeight: 1.5,
  },
  coverPage: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: colors.prussianBlue,
    padding: 50,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
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
    marginTop: 20,
  },
  header: {
    borderBottom: `2px solid ${colors.dodgerBlue}`,
    paddingBottom: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 10,
    color: colors.gray,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: colors.gray,
    borderTop: `1px solid ${colors.lightGray}`,
    paddingTop: 10,
  },
  h1: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.prussianBlue,
    marginBottom: 16,
    marginTop: 24,
  },
  h2: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.yaleBlue,
    marginBottom: 12,
    marginTop: 20,
    borderBottom: `1px solid ${colors.icyBlue}`,
    paddingBottom: 4,
  },
  h3: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.dodgerBlue,
    marginBottom: 8,
    marginTop: 14,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 10,
    textAlign: "justify",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 10,
  },
  bullet: {
    width: 15,
    color: colors.dodgerBlue,
  },
  listContent: {
    flex: 1,
  },
  table: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.icyBlue,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.yaleBlue,
  },
  tableHeaderCell: {
    padding: 8,
    flex: 1,
    fontSize: 10,
    fontWeight: 600,
    color: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.coolSky,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.icyBlue,
  },
  tableCell: {
    padding: 8,
    flex: 1,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: colors.icyBlue,
  },
  tocItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tocNumber: {
    width: 30,
    color: colors.dodgerBlue,
    fontWeight: 600,
  },
  tocTitle: {
    flex: 1,
  },
  tocDots: {
    flex: 1,
    borderBottom: `1px dotted ${colors.gray}`,
    marginHorizontal: 5,
    marginBottom: 4,
  },
  tocPage: {
    width: 30,
    textAlign: "right",
  },
});

// Parse markdown content into structured sections
function parseMarkdown(content: string) {
  const lines = content.split("\n");
  const sections: Array<{ type: string; content: string; level?: number }> = [];

  let currentParagraph = "";

  for (const line of lines) {
    // Headers
    if (line.startsWith("### ")) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      sections.push({ type: "h3", content: line.slice(4), level: 3 });
    } else if (line.startsWith("## ")) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      sections.push({ type: "h2", content: line.slice(3), level: 2 });
    } else if (line.startsWith("# ")) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      sections.push({ type: "h1", content: line.slice(2), level: 1 });
    }
    // List items
    else if (line.match(/^[\-\*]\s/)) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      sections.push({ type: "listItem", content: line.slice(2) });
    } else if (line.match(/^\d+\.\s/)) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      sections.push({ type: "numberedItem", content: line.replace(/^\d+\.\s/, "") });
    }
    // Empty line
    else if (line.trim() === "") {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
    }
    // Regular text
    else {
      currentParagraph += (currentParagraph ? " " : "") + line;
    }
  }

  if (currentParagraph) {
    sections.push({ type: "paragraph", content: currentParagraph.trim() });
  }

  return sections;
}

// PRD Document Component
interface PRDDocumentProps {
  productName: string;
  content: string;
}

function PRDDocument({ productName, content }: PRDDocumentProps) {
  const sections = parseMarkdown(content);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let itemNumber = 0;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverTitle}>Product Requirements Document</Text>
        <Text style={styles.coverSubtitle}>{productName}</Text>
        <View style={{ marginTop: 60 }}>
          <Text style={styles.coverMeta}>Generated: {today}</Text>
          <Text style={styles.coverMeta}>Created with PRD Builder</Text>
        </View>
      </Page>

      {/* Content Pages */}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>
            {productName} - Product Requirements Document
          </Text>
        </View>

        {sections.map((section, index) => {
          switch (section.type) {
            case "h1":
              return (
                <Text key={index} style={styles.h1}>
                  {section.content}
                </Text>
              );
            case "h2":
              return (
                <Text key={index} style={styles.h2}>
                  {section.content}
                </Text>
              );
            case "h3":
              return (
                <Text key={index} style={styles.h3}>
                  {section.content}
                </Text>
              );
            case "listItem":
              return (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listContent}>{section.content}</Text>
                </View>
              );
            case "numberedItem":
              itemNumber++;
              return (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>{itemNumber}.</Text>
                  <Text style={styles.listContent}>{section.content}</Text>
                </View>
              );
            case "paragraph":
              return section.content ? (
                <Text key={index} style={styles.paragraph}>
                  {section.content}
                </Text>
              ) : null;
            default:
              return null;
          }
        })}

        <View style={styles.footer} fixed>
          <Text>PRD Builder - AI-Powered Product Requirements</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

// Generate PDF blob
export async function generatePRDPdf(
  productName: string,
  content: string
): Promise<Blob> {
  const doc = <PRDDocument productName={productName} content={content} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}

// Download PDF
export async function downloadPRDPdf(
  productName: string,
  content: string
): Promise<void> {
  const blob = await generatePRDPdf(productName, content);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${productName.replace(/\s+/g, "-")}-PRD.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
