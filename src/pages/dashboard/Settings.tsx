import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import WidgetCard from "@/components/dashboard/WidgetCard";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Palette, Save } from "lucide-react";
import { toast } from "sonner";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Theme", icon: Palette },
];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "Developer");
  const [notifications, setNotifications] = useState({ email: true, push: false, slack: true, weekly: true });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleSave = () => {
    updateUser({ name });
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-secondary p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap
              ${activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {activeTab === tab.id && (
              <motion.div layoutId="settings-tab" className="absolute inset-0 rounded-lg bg-card border border-border" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <tab.icon className="h-4 w-4" /> {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "profile" && (
            <WidgetCard title="Profile Information" delay={0}>
              <div className="space-y-4 max-w-lg">
                {[
                  { label: "Display Name", value: name, set: setName, placeholder: "Your name" },
                  { label: "Email", value: email, set: setEmail, placeholder: "Email", disabled: true },
                  { label: "Role", value: role, set: setRole, placeholder: "Role", disabled: true },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{field.label}</label>
                    <input
                      value={field.value}
                      onChange={(e) => field.set && field.set(e.target.value)}
                      disabled={field.disabled}
                      className={`w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm outline-none transition-all 
                        ${field.disabled ? "opacity-60 cursor-not-allowed" : "focus:border-primary focus:ring-1 focus:ring-primary/30 focus:shadow-[0_0_12px_hsl(337,95%,49%,0.1)]"}`}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </WidgetCard>
          )}

          {activeTab === "notifications" && (
            <WidgetCard title="Notification Preferences" delay={0}>
              <div className="space-y-4 max-w-lg">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")} Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive {key} notifications</p>
                    </div>
                    <button
                      onClick={() => setNotifications((n) => ({ ...n, [key]: !value }))}
                      className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-secondary"}`}
                    >
                      <motion.div
                        className="absolute top-0.5 h-5 w-5 rounded-full bg-foreground"
                        animate={{ left: value ? 22 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                ))}
                <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
            </WidgetCard>
          )}

          {activeTab === "appearance" && (
            <WidgetCard title="Appearance" delay={0}>
              <p className="text-sm text-muted-foreground">Dark mode is the default theme for CodeForjHQ command center.</p>
              <div className="mt-4 flex gap-3">
                <div className="flex-1 rounded-lg border-2 border-primary bg-background p-4 text-center">
                  <div className="h-8 w-full rounded bg-card mb-2" />
                  <p className="text-xs font-medium">Dark (Active)</p>
                </div>
                <div className="flex-1 rounded-lg border border-border bg-secondary/30 p-4 text-center opacity-50 cursor-not-allowed">
                  <div className="h-8 w-full rounded bg-muted mb-2" />
                  <p className="text-xs font-medium">Light (Coming soon)</p>
                </div>
              </div>
            </WidgetCard>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Settings;
