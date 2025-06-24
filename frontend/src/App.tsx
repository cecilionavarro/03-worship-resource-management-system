import { Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ui/mode-toggle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

const Home = () => {
    return (
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <ModeToggle />
            <Button>Cancel</Button>
            <Button>Delete</Button>
        </div>
    );
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email/verify/:code" element={<VerifyEmail />} />
        </Routes>
    );
}

export default App;
