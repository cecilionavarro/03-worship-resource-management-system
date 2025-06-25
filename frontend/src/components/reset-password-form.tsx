import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/lib/api";
import { CheckCircle2Icon, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Link } from "react-router-dom";

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
  code: string;
}

export function ResetPasswordForm({
  code,
  className,
  ...props
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");

  const {
    mutate: resetUserPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: resetPassword,
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        {isSuccess ? (
          <>
            <CardHeader>
              Password reset
              <CardDescription>
                Your password has been reset successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <CheckCircle2Icon />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your password has been updated. You can now sign in with your new credentials.
                </AlertDescription>
              </Alert>
              <div className="mt-4 text-center text-sm">
                Ready to continue?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Reset your password</CardTitle>
              <CardDescription>
                Enter a new password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  resetUserPassword({ verificationCode: code, password });
                }}
              >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {isError && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {error?.message ||
                          "Something went wrong. Please try again."}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={password.length < 6 || isPending}
                  >
                    {isPending && (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Reset password
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Remember your password?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
