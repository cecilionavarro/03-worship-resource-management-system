import { deleteSessions, type Session } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SESSIONS } from "./useSessions";

const useDeleteSession = (sessionId: Session["_id"]) => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSessions(sessionId),
    onSuccess: () => {
      // queryClient.invalidateQueries([SESSIONS])
      queryClient.setQueryData<Session[]>([SESSIONS], (cache) =>
        (cache ?? []).filter((session) => session._id !== sessionId)
      );
    },
  });

  return { deleteSession: mutate, ...rest };
};

export default useDeleteSession;
