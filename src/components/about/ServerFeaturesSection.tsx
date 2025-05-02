
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { ServerFeature } from "@/types/about";

interface ServerFeaturesSectionProps {
  features: ServerFeature[];
}

const ServerFeaturesSection = ({ features }: ServerFeaturesSectionProps) => {
  return (
    <section className="py-12 bg-card">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Особенности нашего сервера</h2>
          <p className="text-muted-foreground">Почему стоит играть именно у нас</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-secondary/50 border-primary/20">
              <CardContent className="p-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center">
                    <Icon name={feature.icon} size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServerFeaturesSection;
