import { Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ui/mode-toggle";
import Login from "./pages/Login";

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
        </Routes>
    );
}

export default App;
