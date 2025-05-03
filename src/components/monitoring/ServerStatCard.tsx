
import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatUptime } from "@/utils/serverUtils";

interface ServerStatCardProps {
  icon: string;
  title: string;
  value: React.ReactNode;
  progress?: number;
  status?: string;
  statusClass?: string;
}

const ServerStatCard = ({ 
  icon, 
  title, 
  value, 
  progress, 
  status, 
  statusClass 
}: ServerStatCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center justify-center">
        <Icon name={icon} size={24} className="text-primary mb-2" />
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        
        {progress !== undefined && (
          <Progress 
            value={progress} 
            className="h-2 mt-2 w-full"
          />
        )}
        
        {status && (
          <div className="flex items-center mt-2">
            <span className={`text-xs ${statusClass}`}>
              {status}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServerStatCard;
