import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import HowItWorks from "./components/HowItWorks";
import InspectionPreview from "./components/InspectionPreview";
import KeyBenefits from "./components/KeyBenefits";
import WaitlistSection from "./components/WaitlistSection";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustBadges />
      <HowItWorks />
      <InspectionPreview />
      <KeyBenefits />
      <WaitlistSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
