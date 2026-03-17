import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Trust from "@/components/Trust";
import Footer from "@/components/Footer";
import MobileStickyButton from "@/components/MobileStickyButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Services />
        <Pricing />
        <Trust />
      </main>
      <Footer />
      <MobileStickyButton />
    </>
  );
}
