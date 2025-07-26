import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center justify-center">
        <Skeleton className="h-6 w-6 rounded mb-2" />
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-2 w-full" />
      </CardContent>
    </Card>
  );
};

export default StatCardSkeleton;