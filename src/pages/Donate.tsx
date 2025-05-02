
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonateHeroSection from "@/components/donate/DonateHeroSection";
import DonationCatalog from "@/components/donate/DonationCatalog";
import FaqSection from "@/components/donate/FaqSection";
import PromoSection from "@/components/donate/PromoSection";
import { 
  donateItems, 
  donationCategories, 
  faqItems, 
  promoCode 
} from "@/data/donationPageData";

const Donate = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <DonateHeroSection />
      
      <DonationCatalog 
        items={donateItems} 
        categories={donationCategories} 
        defaultCategory="vip"
      />
      
      <FaqSection items={faqItems} />
      
      <PromoSection 
        promoCode={promoCode.code}
        discount={promoCode.discount}
      />
      
      <Footer />
    </div>
  );
};

export default Donate;
