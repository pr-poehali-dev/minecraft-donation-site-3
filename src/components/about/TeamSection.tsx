
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamMember } from "@/types/about";

interface TeamSectionProps {
  members: TeamMember[];
}

const TeamSection = ({ members }: TeamSectionProps) => {
  return (
    <section className="py-12 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Наша команда</h2>
          <p className="text-muted-foreground">Люди, которые делают CraftWorld лучше каждый день</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
