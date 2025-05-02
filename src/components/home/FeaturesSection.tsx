
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { FeatureItem } from "@/types/feature";

interface FeaturesSectionProps {
  features: FeatureItem[];
}

const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  return (
    <section className="py-12 bg-card">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Почему выбирают нас</h2>
          <p className="text-muted-foreground">Особенности, которые делают наш сервер уникальным</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-secondary/50 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="mb-4 mx-auto bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center">
                  <Icon name={feature.icon} size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
