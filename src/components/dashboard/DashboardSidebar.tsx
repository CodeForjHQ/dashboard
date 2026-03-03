import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  LayoutDashboard, GitBranch, Brain, Code2, Bug,
  Workflow, Users, Settings, X, ChevronLeft, ChevronRight,
  LogOut
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/repositories", icon: GitBranch, label: "Repositories" },
  { to: "/dashboard/ai-analysis", icon: Brain, label: "AI Analysis" },
  { to: "/dashboard/code-review", icon: Code2, label: "Code Review" },
  { to: "/dashboard/bugs", icon: Bug, label: "Bugs & Perf" },
  { to: "/dashboard/cicd", icon: Workflow, label: "CI/CD Monitor" },
  { to: "/dashboard/team", icon: Users, label: "Team" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

interface Props {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

const DashboardSidebar = ({ collapsed, mobileOpen, onToggle, onMobileClose }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 flex h-full flex-col border-r border-border bg-sidebar
        transition-all duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
        ${collapsed ? "lg:w-20" : "lg:w-[260px]"}
        w-[260px]
      `}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-1 items-center justify-center lg:justify-start"
        >
          <img src="/logo.svg" alt="Logo" className={`${collapsed ? "h-16 w-16" : "h-20 w-48"} transition-all duration-300`} />
        </motion.div>
        <button onClick={onMobileClose} className="p-1 rounded-md hover:bg-secondary lg:hidden">
          <X className="h-5 w-5" />
        </button>
        <button
          onClick={onToggle}
          className="hidden lg:flex p-1 rounded-md hover:bg-secondary"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = item.to === "/dashboard"
            ? location.pathname === "/dashboard"
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={onMobileClose}
              className={`
                group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

      </nav>

      {/* Logout & Footer */}
      <div className="mt-auto border-t border-border p-3">
        <button
          onClick={handleLogout}
          className={`
            w-full group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
            text-muted-foreground hover:bg-destructive/10 hover:text-destructive
            transition-all duration-200
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <div className="px-3 pt-2">
            <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
              v1.0.0
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
