"use client";

import { ArrowUp } from "lucide-react";

interface FooterCTAProps {
  onScrollToTop?: () => void;
}

export default function FooterCTA({ onScrollToTop }: FooterCTAProps) {
  const handleClick = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="section">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-h1 mb-4">Ready to Create Your PRD?</h2>
          <p className="text-text-secondary mb-8">
            Join designers and developers who use our tool to document design systems
            quickly and professionally.
          </p>
          <button onClick={handleClick} className="btn-primary btn-lg">
            Get Started Free
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
