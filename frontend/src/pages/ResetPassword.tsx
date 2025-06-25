import { ResetPasswordForm } from "@/components/reset-password-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircleIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {linkIsValid ? (
          <ResetPasswordForm code={code} />
        ) : (
          <Card>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Invalid Link</AlertTitle>
                <AlertDescription>
                  <p>The Link is either invalid or expired.</p>
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <div className="mt-4 text-center text-sm">
                Didn&apos;t work?{" "}
                <Link
                  to="/password/forgot"
                  className="underline underline-offset-4"
                >
                  Request a new reset link
                </Link>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
