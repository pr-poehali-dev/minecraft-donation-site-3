
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import DonationCard from "./DonationCard";
import ProductCardSkeleton from "@/components/ui/product-skeleton";
import { DonateItem, DonationCategory } from "@/types/donation";

interface DonationCatalogProps {
  items: DonateItem[];
  categories: DonationCategory[];
  defaultCategory?: string;
}

const DonationCatalog = ({ items, categories, defaultCategory = "vip" }: DonationCatalogProps) => {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [loading, setLoading] = useState(true);
  
  const filteredItems = items.filter(item => item.category === selectedCategory);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  return (
    <section className="py-12 bg-background">
      <div className="container px-4 md:px-6">
        <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">Выберите категорию</h2>
              <p className="text-muted-foreground">Просмотрите все доступные товары и услуги</p>
            </div>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <Icon name={category.icon} size={16} />
                  <span className="hidden md:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <Separator className="mb-8" />
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))
                ) : (
                  filteredItems.map(item => (
                    <DonationCard key={item.id} item={item} />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default DonationCatalog;