import SessionCard from "@/components/SessionCard";
import useSessions from "@/hooks/useSessions";
import { Loader } from "lucide-react";

const Settings = () => {
  const { sessions, isPending, isSuccess, isError } = useSessions();

  return (
    <div className="container flex flex-col items-center gap-2 py-8 md:py-16 lg:py-20 xl:gap-4">
      <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
        Sessions
      </h1>
      {isPending && <Loader />}
      {isError && <p>Failed to get sessions.</p>}
      {isSuccess && (
        <div className="flex w-full justify-center p-6 md:p-10">
          <div className="flex flex-col gap-3 w-full max-w-lg">
          {sessions.map((session) => (
            <SessionCard key={session._id} session={session} />
          ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
