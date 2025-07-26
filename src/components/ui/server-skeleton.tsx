import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ServerSkeletonProps {
  compact?: boolean;
}

const ServerSkeleton = ({ compact = false }: ServerSkeletonProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  return (
    <Card className="server-card overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        
        <Skeleton className="h-4 w-48 mb-3" />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerSkeleton;