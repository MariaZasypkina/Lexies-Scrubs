import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Lexies Scrubs",
  description: 'A science blog built around one simple idea: surprising facts are easier to remember when they unfold like small investigations.',
};

export default function AboutPage() {
  return (
    <div className="la-page min-h-screen">
      <div className="la-hero py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="la-title mb-4 text-4xl font-bold md:text-5xl">About Lexies Scrubs</h1>
          <p className="la-subtitle text-lg">
            A science blog built around one simple idea: surprising facts are easier to remember when they unfold like small investigations.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="la-heading-stack prose prose-lg max-w-none">
          <h2 className="la-title la-section-title mb-4 text-3xl font-bold">What is Lexies Scrubs?</h2>
          <p className="mb-6 leading-relaxed text-[#3f5369]">
            Lexies Scrubs is a biology and medicine website created for curious readers, especially teens who want science to feel clear, smart, and exciting. The project is designed to work in two ways at once: as a polished public-facing blog and as a personal portfolio for a future medical student.
          </p>

          <h2 className="la-title la-section-title mb-4 mt-8 text-2xl font-bold">How It Works</h2>
          <p className="mb-6 leading-relaxed text-[#3f5369]">
            Instead of sounding like a textbook, every post on Lexies Scrubs starts with a question, follows the science step by step, and ends by explaining why the answer matters in real life and real medicine. The goal is not just to share facts, but to make readers pause, wonder, and understand something new.
          </p>

          <h2 className="la-title la-section-title mb-4 mt-8 text-2xl font-bold">The Name</h2>
          <p className="mb-6 leading-relaxed text-[#3f5369]">
            The name <span className="font-semibold">Lexies Scrubs</span> connects the project to real medicine. Scrubs are the simple uniforms worn by doctors, nurses, and medical students in hospitals and clinics, they symbolize professionalism, hygiene, and being part of a healthcare team. By using this word, the project quietly says: this is a teen-led science blog that takes real medicine seriously and is built for someone who wants to grow into that world one day, starting now with clear, accessible explanations of surprising biology and medical facts.
          </p>

          <h2 className="la-title la-section-title mb-4 mt-8 text-2xl font-bold">Reliable Sources</h2>
          <p className="mb-6 leading-relaxed text-[#3f5369]">
            Every factual claim on Lexies Scrubs is based on reliable information from trusted sources including major health institutions, medical schools, peer-reviewed research, and children&apos;s hospitals.
          </p>

          <div className="la-soft-note mt-8 mb-6 p-6">
            <p className="text-[#364c63]">
              <strong>Educational Disclaimer:</strong> Lexies Scrubs is for education only. It does not diagnose, treat, or replace a doctor, nurse, or other licensed medical professional.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="/about-lexi" className="la-btn-primary px-8 py-3">
            Learn About Lexi
          </a>
        </div>
      </div>
    </div>
  );
}
