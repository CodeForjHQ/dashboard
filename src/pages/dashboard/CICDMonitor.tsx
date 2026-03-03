import { useApp } from "@/contexts/AppContext";
import WidgetCard from "@/components/dashboard/WidgetCard";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Clock, Terminal } from "lucide-react";
import { useState } from "react";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  running: { icon: Loader2, color: "text-primary", bg: "bg-primary/10" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  queued: { icon: Clock, color: "text-muted-foreground", bg: "bg-secondary" },
};

const CICDMonitor = () => {
  const { pipelines } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">CI/CD Monitor</h1>
        <p className="text-sm text-muted-foreground mt-1">Build and deployment pipeline status</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["success", "running", "failed", "queued"] as const).map((status, i) => {
          const count = pipelines.filter((p) => p.status === status).length;
          const cfg = statusConfig[status];
          const Icon = cfg.icon;
          return (
            <WidgetCard key={status} delay={i * 0.08}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cfg.bg}`}>
                  <Icon className={`h-5 w-5 ${cfg.color} ${status === "running" ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{status}</p>
                </div>
              </div>
            </WidgetCard>
          );
        })}
      </div>

      {/* Pipeline list */}
      <div className="space-y-3">
        {pipelines.map((pipeline, i) => {
          const cfg = statusConfig[pipeline.status];
          const Icon = cfg.icon;
          const isExpanded = expandedId === pipeline.id;
          return (
            <motion.div
              key={pipeline.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <WidgetCard className="cursor-pointer" delay={0}>
                <div onClick={() => setExpandedId(isExpanded ? null : pipeline.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cfg.bg}`}>
                        <Icon className={`h-4 w-4 ${cfg.color} ${pipeline.status === "running" ? "animate-spin" : ""}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{pipeline.name}</h3>
                        <p className="text-xs text-muted-foreground">{pipeline.branch} · {pipeline.duration} · {pipeline.timestamp}</p>
                      </div>
                    </div>
                    {/* Timeline bar */}
                    <motion.div
                      className={`h-2 w-24 rounded-full overflow-hidden bg-secondary hidden sm:block`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: pipeline.status === "success" ? "100%" : pipeline.status === "running" ? "60%" : pipeline.status === "failed" ? "45%" : "0%" }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`h-full rounded-full ${pipeline.status === "success" ? "bg-success" : pipeline.status === "running" ? "bg-primary" : "bg-destructive"}`}
                      />
                    </motion.div>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 rounded-lg bg-background p-4 font-mono text-xs overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                      <Terminal className="h-3.5 w-3.5" /> Build Logs
                    </div>
                    {pipeline.logs.map((log, li) => (
                      <motion.div
                        key={li}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: li * 0.15 }}
                        className={`py-0.5 ${log.startsWith("✗") ? "text-destructive" : log.startsWith("▸") ? "text-primary" : "text-success"}`}
                      >
                        {log}
                      </motion.div>
                    ))}
                    <span className="inline-block w-2 h-4 bg-primary animate-terminal-blink ml-1" />
                  </motion.div>
                )}
              </WidgetCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CICDMonitor;
