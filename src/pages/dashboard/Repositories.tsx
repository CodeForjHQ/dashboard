import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import WidgetCard from "@/components/dashboard/WidgetCard";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Star, RefreshCw, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

const Repositories = () => {
  const { repositories, addRepository, removeRepository } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStack, setNewStack] = useState("");
  const [newStatus, setNewStatus] = useState<"synced" | "syncing" | "error">("synced");
  const [newTags, setNewTags] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newStack.trim()) {
      toast.error("Please provide at least a name and stack.");
      return;
    }
    const tagsArray = newTags.split(',').map(tag => tag.trim()).filter(Boolean);
    addRepository(newName.trim(), newStack.trim(), newStatus, tagsArray);
    toast.success(`Repository "${newName}" added`);
    setNewName("");
    setNewStack("");
    setNewStatus("synced");
    setNewTags("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Repositories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and monitor your connected repos</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`group flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(235,32,121,0.1)] w-full sm:w-auto
            ${showAdd ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground hover:opacity-90"}`}
        >
          {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />}
          {showAdd ? "Cancel" : "Add Repo"}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            className="overflow-hidden"
          >
            <WidgetCard className="border-primary/20 bg-primary/5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Repo Name</label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. core-engine"
                    className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Tech Stack</label>
                  <input
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    placeholder="e.g. React, Node.js"
                    className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-[9px] text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  >
                    <option value="synced">Synced</option>
                    <option value="syncing">Syncing</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Tags (comma-separated)</label>
                  <input
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="frontend, auth, ver-1"
                    className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row justify-center sm:justify-end">
                <button
                  onClick={handleAdd}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary w-full sm:w-auto px-10 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  <RefreshCw className="h-4 w-4" />
                  Connect & Build Repository
                </button>
              </div>
            </WidgetCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {repositories.map((repo, i) => (
            <motion.div
              key={repo.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
            >
              <WidgetCard>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <GitBranch className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-sm">{repo.name}</h3>
                      <p className="text-xs text-muted-foreground">{repo.language}</p>
                    </div>
                  </div>
                  <button onClick={() => { removeRepository(repo.id); toast.info("Repository removed"); }} className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {repo.stars}</span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className={`h-3.5 w-3.5 ${repo.status === "syncing" ? "animate-spin text-primary" : ""}`} />
                    {repo.lastSync}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
                    ${repo.status === "synced" ? "bg-success/10 text-success" : repo.status === "syncing" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                    {repo.status === "syncing" && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />}
                    {repo.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {repo.branches.map((b) => (
                    <span key={b} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{b}</span>
                  ))}
                  {repo.tags?.map((tag) => (
                    <span key={tag} className="rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">{tag}</span>
                  ))}
                </div>
              </WidgetCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Repositories;
