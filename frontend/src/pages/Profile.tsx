import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { AlertCircleIcon } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { email, verified, createdAt } = user;

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>My account</CardTitle>
            <CardDescription>{email}</CardDescription>
          </CardHeader>
          <CardContent>
            {!verified && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Email not verified</AlertTitle>
                <AlertDescription>
                  <p>Please verify your email address by checking your inbox.</p>
                </AlertDescription>
              </Alert>
            )}
            <div className="mt-4 text-center text-sm">
              Created on{" "}
              {new Date(createdAt).toLocaleDateString("en-US")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
