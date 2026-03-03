import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import WidgetCard from "@/components/dashboard/WidgetCard";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, UserPlus, X, Check } from "lucide-react";
import { toast } from "sonner";

const Team = () => {
  const { team, addTeamMember } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  const commitChartData = team.map((m) => ({ name: m.name.split(" ")[0], commits: m.commits, prs: m.prs, reviews: m.reviews }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRole) {
      toast.error("Please fill in both name and role.");
      return;
    }
    addTeamMember(newName, newRole);
    setNewName("");
    setNewRole("");
    setIsAdding(false);
    toast.success(`${newName} has been added to the team!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">Team activity and contribution metrics</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`group flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 w-full sm:w-auto
            ${isAdding ? "bg-secondary text-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_15px_rgba(235,32,121,0.2)]"}`}
        >
          {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />}
          {isAdding ? "Cancel" : "Add Member"}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <WidgetCard className="border-primary/20 bg-primary/5">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-1.5 w-full">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Full Name</label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter full name"
                    autoFocus
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex-1 space-y-1.5 w-full">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Designation / Role</label>
                  <input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Backend Engineer"
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary w-full sm:w-auto px-6 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-primary/10"
                >
                  <UserPlus className="h-4 w-4" />
                  Confirm Addition
                </button>
              </form>
            </WidgetCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <WidgetCard delay={0}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-heading font-semibold">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-secondary p-2">
                  <p className="text-lg font-heading font-bold">{member.commits}</p>
                  <p className="text-xs text-muted-foreground">Commits</p>
                </div>
                <div className="rounded-lg bg-secondary p-2">
                  <p className="text-lg font-heading font-bold">{member.prs}</p>
                  <p className="text-xs text-muted-foreground">PRs</p>
                </div>
                <div className="rounded-lg bg-secondary p-2">
                  <p className="text-lg font-heading font-bold">{member.reviews}</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
              </div>

              {/* Activity heatmap */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Activity (12 weeks)</p>
                <div className="flex gap-1">
                  {member.activity.map((val, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + j * 0.04 }}
                      className="h-6 flex-1 rounded-sm"
                      style={{
                        backgroundColor: `hsl(337, 95%, ${20 + val * 5}%)`,
                        opacity: 0.3 + val * 0.08,
                      }}
                      title={`${val} contributions`}
                    />
                  ))}
                </div>
              </div>
            </WidgetCard>
          </motion.div>
        ))}
      </div>

      {/* Commit chart */}
      <WidgetCard title="Contribution Breakdown" delay={0.5}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commitChartData}>
              <XAxis dataKey="name" stroke="hsl(0,0%,30%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(0,0%,30%)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,15%)", borderRadius: "8px", color: "hsl(144,36%,96%)" }} />
              <Bar dataKey="commits" fill="hsl(337,95%,49%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prs" fill="hsl(200,80%,50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reviews" fill="hsl(150,60%,45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </WidgetCard>
    </div>
  );
};

export default Team;
