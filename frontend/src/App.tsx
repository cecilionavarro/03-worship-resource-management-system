import { Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ui/mode-toggle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AppContainer from "./components/AppContainer";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const Home = () => {
    return (
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <ModeToggle />
            <Button>Cancel</Button>
            <Button>Delete</Button>
            home!!
        </div>
    );
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<AppContainer />}>
                <Route index element={<Profile/> }></Route>
                <Route path="settings" element={<Settings/> }></Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email/verify/:code" element={<VerifyEmail />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset" element={<ResetPassword />} />
        </Routes>
    );
}

export default App;
