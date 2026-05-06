import Link from 'next/link';
import QuestionnaireHeader from '@/app/components/questionnaire/QuestionnaireHeader';

export const metadata = {
  title: 'Questionnaire Submitted — BuyPadi',
};

export default function QuestionnaireSuccessPage() {
  return (
    <div className="min-h-screen bg-surface">
      <QuestionnaireHeader />
      <main className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <section className="rounded-[2rem] bg-primary px-6 py-10 text-white shadow-sm sm:px-8 lg:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime">You are on the list</p>
            <h1 className="mt-4 font-display text-3xl font-black leading-tight sm:text-5xl">
              Thanks for helping shape BuyPadi.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Your response has been received. Thanks for giving us the context we need to build a safer buying and selling experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-13 items-center justify-center rounded-full bg-lime px-6 font-display text-sm font-bold text-primary transition-colors hover:bg-lime-dark"
              >
                Return to homepage
              </Link>
              <a
                href="https://wa.me/2348026100848"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:border-white/50"
              >
                Message BuyPadi
              </a>
            </div>
          </section>

          <aside className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-light text-primary">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2 className="mt-5 font-display text-xl font-black text-heading">What happens next?</h2>
            <div className="mt-5 space-y-4">
              {[
                'We review early responses to prioritize launch access.',
                'We connect your feedback with the waitlist details you submitted.',
                'We will reach out when the early access batch opens.',
              ].map((item, index) => (
                <div key={item} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface font-display text-xs font-black text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-copy">{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
