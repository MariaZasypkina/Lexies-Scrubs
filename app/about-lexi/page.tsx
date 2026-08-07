import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Lexi | Lexies Scrubs',
  description: 'Meet the student behind Lexies Scrubs, a future doctor exploring biology and medicine.',
};

export default function AboutLexiPage() {
  return (
    <div className="la-page min-h-screen">
      <div className="la-hero py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="la-title mb-4 text-4xl font-bold md:text-5xl">About Lexi</h1>
          <p className="la-subtitle text-lg">Meet the student behind Lexies Scrubs.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="la-heading-stack prose prose-lg max-w-none">
          <p className="mb-6 text-lg leading-relaxed text-[#3f5369]">
            Lexi is a student who wants to become a doctor and loves discovering strange, memorable facts about biology and medicine. Lexies Scrubs began as a way to turn that curiosity into something shareable: a website where science feels welcoming, visual, and easier to understand.
          </p>

          <p className="mb-6 leading-relaxed text-[#3f5369]">
            This project is also a way to practice something future doctors need every day — explaining complex ideas clearly, calmly, and honestly. That is why the site focuses on reliable sources, simple wording, and facts that connect back to patients, families, and real-world medicine.
          </p>

          <div className="la-soft-note my-8 border-l-4 border-[#bb6f88] p-6">
            <p className="text-lg italic text-[#364c63]">Curious about the human body? So is Lexi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
