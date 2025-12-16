"use client";

import { FileText, Cpu, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Enter Details",
    description: "Provide your product name and a brief description. Optionally upload context files like specs or mockups.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Analysis",
    description: "Claude AI analyzes your input and generates a comprehensive PRD with all standard sections.",
  },
  {
    number: "03",
    icon: Download,
    title: "Download PDF",
    description: "Get a professionally formatted PDF document ready to share with stakeholders.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section bg-near-black/50">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-h1 mb-4">How It Works</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Three simple steps to create a comprehensive PRD for any product.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection line */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-white/10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Step number with icon */}
                <div className="relative inline-flex flex-col items-center mb-6">
                  {/* Number badge */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-teal rounded-full flex items-center justify-center text-xs font-bold z-10">
                    {step.number}
                  </div>

                  {/* Icon circle */}
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-teal/10 hover:border-teal/30 transition-all duration-300 group">
                    <step.icon className="h-7 w-7 text-teal group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-h2 mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
