import useAuth from "@/hooks/useAuth";
import { Loader } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";
import UserMenu from "./UserMenu";

const AppContainer = () => {
  const { user, isLoading } = useAuth();

  return isLoading ? (
    <div>
      <Loader className="mr-2 h-4 w-4 animate-spin"></Loader>
    </div>
  ) : user ? (
    <div>
      <UserMenu />
      <Outlet />
    </div>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ redirectUrl: window.location.pathname }}
    />
  );
};

export default AppContainer;
