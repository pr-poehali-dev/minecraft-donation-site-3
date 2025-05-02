
import { Card, CardContent } from "@/components/ui/card";
import { FaqItem } from "@/types/donation";

interface FaqSectionProps {
  items: FaqItem[];
}

const FaqSection = ({ items }: FaqSectionProps) => {
  return (
    <section className="py-12 bg-card">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Часто задаваемые вопросы</h2>
          <p className="text-muted-foreground">Ответы на популярные вопросы о донате</p>
        </div>
        
        <div className="grid gap-4 md:gap-8 max-w-3xl mx-auto">
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                <p className="text-muted-foreground">
                  {item.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
