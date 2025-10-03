import { getSessions, type Session } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const SESSIONS = "sessions";

const useSessions = (opts = {}) => {
  const { data: sessions = [], ...rest } = useQuery<Session[]>({
    queryKey: [SESSIONS],
    queryFn: getSessions,
    ...opts,
  });

  return { sessions, ...rest };
};

export default useSessions;
