const steps = [
  {
    number: "01",
    title: "Request",
    description:
      "Provide item details and location. We match you with an expert nearby.",
    accent: false,
  },
  {
    number: "02",
    title: "Inspect",
    description:
      "Our pro visits the seller to verify condition, serials, and authenticity.",
    accent: true,
  },
  {
    number: "03",
    title: "Review",
    description:
      "Receive a detailed report with video proof and an expert score.",
    accent: false,
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "If you're happy, we handle the payment and logistics for you.",
    accent: true,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface px-4 sm:px-6 lg:px-12 py-6">
      {/* Rounded dark-green card — same max-width as all other content sections */}
      <div className="max-w-384 mx-auto bg-primary rounded-3xl overflow-hidden px-6 lg:px-14 py-20">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl lg:text-[48px] font-extrabold text-white mb-4">
            Inspect.{" "}
            <span className="text-lime">Validate.</span>{" "}
            Deliver
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Your journey to a risk-free purchase in four steps.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`rounded-3xl p-8 flex flex-col gap-4 border-2 ${
                step.accent
                  ? "bg-lime border-white"
                  : "bg-surface-alt border-lime"
              }`}
            >
              <span className="font-display text-6xl font-black leading-none text-[rgba(34,92,162,0.1)]">
                {step.number}
              </span>
              <h3 className="font-display text-2xl font-extrabold text-primary">
                {step.title}
              </h3>
              <p className={`text-sm leading-relaxed ${step.accent ? "text-white/90" : "text-copy"}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
