import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import { sendPasswordResetEmail } from "@/lib/api"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")

  const {
    mutate: sendPasswordReset,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: sendPasswordResetEmail,
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    sendPasswordReset(email)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-sm">
        {isSuccess ? (
          <>
            <CardHeader>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>
                If an account exists for that email, we&apos;ve sent a reset link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle2Icon className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  We've sent a password reset link to your email.
                </AlertDescription>
              </Alert>
              <p className="text-sm text-center text-muted-foreground pt-2">
                Ready to log in?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Go back to login
                </Link>
              </p>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Reset your password</CardTitle>
              <CardDescription>
                We&apos;ll send you a link to reset your password. Enter the email associated with your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                {isError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error?.message || "Something went wrong. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Sending..." : "Reset password"}
                </Button>

                <p className="text-sm text-center pt-2">
                  Remember your password?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Go back to login
                  </Link>
                </p>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
