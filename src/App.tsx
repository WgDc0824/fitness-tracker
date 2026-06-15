import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Workout } from "@/pages/Workout";
import { History } from "@/pages/History";
import { Stats } from "@/pages/Stats";
import { Settings } from "@/pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout/:date?" element={<Workout />} />
        <Route path="/history" element={<History />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
