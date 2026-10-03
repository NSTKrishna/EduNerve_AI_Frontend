import Skeleton from "../common/Skeleton";

/* Holds the register's shape so the page does not blank on every visit. */
export default function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      <div className="pl-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-4 h-16 w-48" />
        <Skeleton className="mt-3 h-4 w-64" />
      </div>
      <div className="grid gap-x-10 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border-t border-rule py-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-7 w-16" />
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="h-3 w-32" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="border-t border-rule py-5">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="mt-2 h-3 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
