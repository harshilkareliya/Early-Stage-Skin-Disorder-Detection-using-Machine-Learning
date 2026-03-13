import { Link, useLocation } from "react-router-dom";
import { Activity, BarChart3, FileText } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Predict", icon: Activity },
    { to: "/dashboard", label: "Analytics", icon: BarChart3 },
    { to: "/about", label: "About", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight">SkinDetect</h1>
            <p className="text-[10px] leading-none text-muted-foreground">ML-Powered Diagnosis</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
