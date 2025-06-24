import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { verifyEmail } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, CheckCircle2Icon, Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { code } = useParams();
  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code || ""),
  });
  return (
    <div className="flex flex-col gap-3 min-h-svh w-full items-center justify-center p-6 md:p-10">
      {isPending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <div className="flex gap-3 items-center">
          {isSuccess ? <CheckCircle2Icon /> : <AlertCircleIcon />}
          <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
            {isSuccess ? "Email Verified!" : "Invalid Link"}
          </h1>
        </div>
      )}
      {isError && (
        <p className="text-sm text-muted-foreground">
          This link is either invalid or expired.{" "}
          <Link
            className="underline text-primary font-medium underline-offset-4"
            to={"/password/forgot"}
          >
            Get a new link
          </Link>
        </p>
      )}
      <Button>Back to home</Button>
    </div>
  );
};

export default VerifyEmail;
