// src/components/InstructorsTableSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function InstructorsTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}