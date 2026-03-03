import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Bell, LogOut, Search, Command, LayoutDashboard, GitBranch, Brain, Code2, Bug, Workflow, Users, Settings as SettingsIcon, UserCircle, Palette, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onMobileMenu: () => void;
}

const searchItems = [
  { id: "overview", title: "Overview", icon: LayoutDashboard, path: "/dashboard", keywords: "home, main, stats" },
  { id: "repos", title: "Repositories", icon: GitBranch, path: "/dashboard/repositories", keywords: "git, code, source" },
  { id: "ai", title: "AI Analysis", icon: Brain, path: "/dashboard/ai-analysis", keywords: "artificial intelligence, scans" },
  { id: "review", title: "Code Review", icon: Code2, path: "/dashboard/code-review", keywords: "pull requests, logic" },
  { id: "bugs", title: "Bugs & Performance", icon: Bug, path: "/dashboard/bugs", keywords: "issues, fixes, errors, metrics" },
  { id: "cicd", title: "CI/CD Monitor", icon: Workflow, path: "/dashboard/cicd", keywords: "builds, pipelines, automation" },
  { id: "team", title: "Team", icon: Users, path: "/dashboard/team", keywords: "members, staff, colleagues" },
  { id: "settings", title: "Settings", icon: SettingsIcon, path: "/dashboard/settings", keywords: "config, account, logout" },
  { id: "profile", title: "Profile Settings", icon: UserCircle, path: "/dashboard/settings", keywords: "name, email, role" },
  { id: "theme", title: "Theme / Appearance", icon: Palette, path: "/dashboard/settings", keywords: "dark, light, mode" },
];

const DashboardHeader = ({ onMobileMenu }: Props) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState([
    { id: "1", title: "New PR Review", message: "Sarah requested changes on your PR", time: "5m ago", type: "info", read: false },
    { id: "2", title: "Build Success", message: "Production deployment successful", time: "1h ago", type: "success", read: false },
    { id: "3", title: "Security Alert", message: "New login from San Francisco, CA", time: "2h ago", type: "warning", read: true },
    { id: "4", title: "Bug Assigned", message: "Critical: Memory leak in worker", time: "1d ago", type: "error", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        // Dropdown closing on Escape removed as per user request
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Outside-click closing logic removed as per user request
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = searchQuery.trim() === ""
    ? []
    : searchItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSelect = (path: string) => {
    navigate(path);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markAsRead = (id: string, path?: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    if (path) {
      navigate(path);
      setShowNotifications(false);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-sidebar/80 backdrop-blur-md px-3 sm:px-6 sticky top-0 z-[60]">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <button
          onClick={onMobileMenu}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div ref={searchRef} className="flex-1 max-w-[420px] relative">
          <div className={`
            flex items-center gap-2 rounded-xl bg-secondary/50 border border-white/5 py-1.5 px-3
            transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/40 focus-within:bg-secondary/80
            ${showResults ? "w-full ring-2 ring-primary/40 bg-secondary/80" : "w-full sm:w-64"}
          `}>
            <Search className={`h-4 w-4 flex-shrink-0 transition-colors ${showResults ? "text-primary" : "text-muted-foreground"}`} />
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Search..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground/60 font-medium"
            />
            <div className="hidden sm:flex items-center gap-1 opacity-40 group-hover/search:opacity-100 transition-opacity flex-shrink-0">
              <Command className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase">K</span>
            </div>
          </div>

          <AnimatePresence>
            {showResults && (
              <>
                {/* Mobile Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowResults(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] sm:hidden"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`
                    absolute top-14 left-0 w-[calc(100vw-24px)] sm:w-[380px] 
                    rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-[0_20px_50px_rgba(0,0,0,0.8)] 
                    overflow-hidden z-50
                    max-sm:fixed max-sm:top-20 max-sm:left-3 max-sm:right-3 max-sm:w-auto
                  `}
                >
                  <div className="p-2">
                    <div className="px-3 py-2 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Command Center</p>
                      <button
                        onClick={() => setShowResults(false)}
                        className="sm:hidden p-1 rounded-md hover:bg-white/10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="max-h-[60vh] sm:max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-1 pr-1">
                      {filteredResults.length > 0 ? (
                        filteredResults.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelect(item.path)}
                            className="w-full group flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-primary/10 transition-all text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors border border-white/5">
                                <item.icon className="h-5 w-5 group-hover:text-primary transition-colors text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-bold group-hover:text-foreground transition-colors">{item.title}</p>
                                <p className="text-[10px] text-muted-foreground/60 uppercase group-hover:text-primary/60 transition-colors">{item.id}</p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/20 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          </button>
                        ))
                      ) : searchQuery.trim() === "" ? (
                        <div className="py-2 space-y-1 px-1">
                          <p className="px-3 py-2 text-[10px] font-bold text-muted-foreground/40">Global Navigation & Actions</p>
                          <button onClick={() => handleSelect("/dashboard")} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5 text-sm font-medium transition-all group">
                            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                            <span>Return to Overview</span>
                          </button>
                          <button onClick={() => handleSelect("/dashboard/settings")} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5 text-sm font-medium transition-all group">
                            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Account Configuration</span>
                          </button>
                        </div>
                      ) : (
                        <div className="px-3 py-10 text-center">
                          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                            <Search className="h-6 w-6 text-muted-foreground/40" />
                          </div>
                          <p className="text-sm font-bold">No results for "{searchQuery}"</p>
                          <p className="text-[10px] mt-1 text-muted-foreground/40 uppercase tracking-tighter font-black">Try searching for components, settings or data</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 border-t border-white/5 pt-2 px-1 pb-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-destructive/80 hover:text-white hover:bg-destructive transition-all text-xs font-black uppercase tracking-widest"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <div ref={notificationsRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-95 group
              ${showNotifications ? "bg-primary/20 text-primary" : "hover:bg-white/5"}`}
          >
            <Bell className={`h-5 w-5 transition-colors ${showNotifications ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-2 h-2.5 w-2.5 rounded-full border-[3px] border-[#0c0c0e] bg-primary shadow-sm" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                className="absolute top-14 right-0 w-[calc(100vw-32px)] sm:w-80 rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[70] max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:w-auto"
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h4 className="text-xs font-black uppercase tracking-widest">Inbox</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1 scrollbar-none">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => markAsRead(n.id, "/dashboard/ai-analysis")}
                          className={`w-full relative flex flex-col gap-1.5 p-3 rounded-xl transition-all text-left border border-transparent
                            ${n.read ? "opacity-40 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 hover:bg-white/5" : "bg-white/5 hover:bg-white/10 border-white/5"}
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full flex-shrink-0
                              ${n.type === "success" ? "bg-emerald-500" : n.type === "warning" ? "bg-amber-500" : n.type === "error" ? "bg-rose-500" : "bg-primary"}`}
                            />
                            <p className="text-xs font-bold">{n.title}</p>
                            {!n.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(235,32,121,0.5)] flex-shrink-0" />
                            )}
                            <span className="ml-auto text-[9px] text-muted-foreground/60 flex-shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{n.message}</p>
                        </button>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <Bell className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                        <p className="text-xs font-bold text-muted-foreground/40 italic">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-3 cursor-pointer p-1 rounded-xl hover:bg-white/5 transition-all active:scale-95 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-chart-1 to-primary text-xs font-black text-white shadow-lg shadow-primary/30 ring-1 ring-white/20 transform group-hover:rotate-6 transition-transform">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-wider text-foreground leading-none">{user?.name || "User"}</p>
            <p className="text-[8px] font-bold text-primary tracking-widest leading-none mt-1.5 opacity-80">ACTIVE PRO</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
