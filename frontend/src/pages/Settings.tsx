import SessionCard from "@/components/SessionCard";
import useSessions from "@/hooks/useSessions";

const Settings = () => {
  const { sessions, isPending, isError } = useSessions();

  return (
    <div className="flex justify-center px-10">
      <div className="container flex flex-col items-center py-10 gap-5">
        <h1 className="text-primary font-semibold text-4xl text-left w-full xl:text-5xl">Sessions</h1>
        {isPending ? (
          <ListSkeleton count={3}/>
        ) : isError ? (
          <p className="text-destructive">Failed to get sessions.</p>
        ) : sessions?.length ? (
          sessions.map((session) => (
            <SessionCard key={session._id} session={session} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Settings;

function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-25 w-full rounded-xl bg-muted animate-pulse"></div>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border p-6 text-center">
      <p className="text-sm text-muted-foreground">No sessions yet.</p>
    </div>
  );
}