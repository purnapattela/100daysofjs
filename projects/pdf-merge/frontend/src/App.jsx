import Navbar from "@/components/Navbar";
import Dashboard from "./components/pages/Dashboard";

export default function App() {
  const user = {};

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <div className="p-6">
        <Dashboard />
      </div>
    </div>
  );
}
