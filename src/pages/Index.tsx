
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServerMonitoringSection from "@/components/home/ServerMonitoringSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import DonationPreviewSection from "@/components/home/DonationPreviewSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import { serverList, features, featuredDonationItems } from "@/data/homePageData";

const Index = () => {
  const [activeServer, setActiveServer] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <HeroSection />
      
      <ServerMonitoringSection servers={serverList} />
      
      <FeaturesSection features={features} />
      
      <DonationPreviewSection items={featuredDonationItems} />
      
      <CallToActionSection />
      
      <Footer />
    </div>
  );
};

export default Index;
