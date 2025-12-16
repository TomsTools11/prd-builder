"use client";

import {
  Sparkles,
  Layout,
  FileText,
  Upload,
  Eye,
  Download,
  Palette,
  Type,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Analysis",
    description: "Claude AI analyzes your input and generates comprehensive requirements automatically.",
  },
  {
    icon: Type,
    title: "Typography Analysis",
    description: "Identifies font families, sizes, weights, and builds a comprehensive type system.",
  },
  {
    icon: Layout,
    title: "Structured Sections",
    description: "All 15 standard PRD sections, professionally organized and formatted.",
  },
  {
    icon: CheckCircle,
    title: "Accessibility Audit",
    description: "Evaluates color contrast ratios and generates WCAG compliance documentation.",
  },
  {
    icon: FileText,
    title: "Professional PDF",
    description: "Download as beautifully formatted PDF ready for stakeholder review.",
  },
  {
    icon: Download,
    title: "Instant Results",
    description: "Complete analysis and PDF generation in under 60 seconds.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="section">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-h1 mb-4">Everything You Need</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Our AI analyzes every aspect of your product and documents it professionally.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto stagger-children">
          {features.map((feature, index) => (
            <div key={feature.title} className="card-hover group hover:scale-[1.02] transition-transform duration-200">
              <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
                <feature.icon className="h-5 w-5 text-teal" />
              </div>
              <h3 className="text-h3 mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
