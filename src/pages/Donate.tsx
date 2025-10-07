
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonateHeroSection from "@/components/donate/DonateHeroSection";
import DonationCatalog from "@/components/donate/DonationCatalog";
import FaqSection from "@/components/donate/FaqSection";
import PromoSection from "@/components/donate/PromoSection";
import { 
  donationCategories, 
  faqItems, 
  promoCode 
} from "@/data/donationPageData";
import { DonateItem } from "@/types/donation";
import Icon from "@/components/ui/icon";

const PRODUCTS_API_URL = "https://functions.poehali.dev/6574f144-b26c-46e4-a4eb-76db7d5dca00";

const Donate = () => {
  const [items, setItems] = useState<DonateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    try {
      const response = await fetch(PRODUCTS_API_URL);
      const data = await response.json();
      
      if (data.success && data.products) {
        setItems(data.products);
      }
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Загрузка товаров...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <DonateHeroSection />
      
      <DonationCatalog 
        items={items} 
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