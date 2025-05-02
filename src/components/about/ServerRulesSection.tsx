
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { ServerRule } from "@/types/about";

interface ServerRulesSectionProps {
  rules: ServerRule[];
}

const ServerRulesSection = ({ rules }: ServerRulesSectionProps) => {
  return (
    <section className="py-12 bg-card">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Правила сервера</h2>
          <p className="text-muted-foreground">Соблюдение этих правил обязательно для всех игроков</p>
        </div>
        
        <Tabs defaultValue={rules[0].category} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            {rules.map(rule => (
              <TabsTrigger key={rule.category} value={rule.category}>{rule.category}</TabsTrigger>
            ))}
          </TabsList>
          
          {rules.map(rule => (
            <TabsContent key={rule.category} value={rule.category} className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {rule.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Icon name="Check" size={18} className="text-primary mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ServerRulesSection;
