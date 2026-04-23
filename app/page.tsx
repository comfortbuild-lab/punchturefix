import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustTicker from "@/components/TrustTicker";
import ServiceGrid from "@/components/ServiceGrid";
import HowItWorks from "@/components/HowItWorks";
import BookingWidget from "@/components/BookingWidget";
import PricingTable from "@/components/PricingTable";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import InsuranceSection from "@/components/InsuranceSection";
import EmergencySection from "@/components/EmergencySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustTicker />
      <ServiceGrid />
      <HowItWorks />
      <BookingWidget />
      <PricingTable />
      <SubscriptionPlans />
      <InsuranceSection />
      <EmergencySection />
      <Footer />
    </main>
  );
}
