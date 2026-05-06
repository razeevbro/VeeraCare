import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CTAForm } from "@/components/cta/CTAForm";

export default function ContactPage() {
  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <CTAForm className="bg-white" />

        <Footer />
      </main>
    </>
  );
}

