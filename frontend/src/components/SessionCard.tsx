import useDeleteSession from "@/hooks/useDeleteSession";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import type { Session } from "@/lib/api";

interface Props {
  session: Session;
}

const SessionCard = ({ session }: Props) => {
  const { _id, createdAt, userAgent, isCurrent } = session;

  const { deleteSession, isPending } = useDeleteSession(_id);

  return (
    <Card className="flex flex-row w-full">
      <CardHeader className="flex-1 w-full">
        {new Date(createdAt).toLocaleString()}
        {isCurrent && " (Current session)"}
        <CardDescription>{userAgent}</CardDescription>
      </CardHeader>
      <CardContent>
        {!isCurrent ? (
          <Button variant="ghost" onClick={() => deleteSession()}>{isPending ? "Deleting..." : "Delete"}</Button>
        ) : (
          <div className="w-10" /> // or <span className="invisible">Delete</span>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionCard;
