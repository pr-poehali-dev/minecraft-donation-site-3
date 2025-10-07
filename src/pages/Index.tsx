import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import DonationPreviewSection from "@/components/home/DonationPreviewSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import { features } from "@/data/homePageData";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <HeroSection />
      
      <FeaturesSection features={features} />
      
      <DonationPreviewSection />
      
      <CallToActionSection />
      
      <Footer />
    </div>
  );
};

export default Index;