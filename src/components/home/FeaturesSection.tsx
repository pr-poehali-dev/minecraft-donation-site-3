import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { FeatureItem } from "@/types/feature";

interface FeaturesSectionProps {
  features: FeatureItem[];
}

const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container relative px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Почему выбирают нас
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Особенности, которые делают наш сервер лучшим выбором для твоего игрового опыта
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:scale-105 transition-all duration-300 border-primary/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 bg-card/50 backdrop-blur"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform opacity-20 blur-sm" />
                  <div className="relative bg-gradient-to-br from-primary to-purple-600 w-full h-full rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name={feature.icon} size={32} className="text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
