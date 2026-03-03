import { useApp } from "@/contexts/AppContext";
import WidgetCard from "@/components/dashboard/WidgetCard";
import { motion, AnimatePresence } from "framer-motion";
import { Bug as BugIcon, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const perfData = [
  { name: "API Latency", value: 145, unit: "ms" },
  { name: "DB Query", value: 42, unit: "ms" },
  { name: "Render Time", value: 18, unit: "ms" },
  { name: "Bundle Size", value: 234, unit: "KB" },
  { name: "Memory", value: 67, unit: "MB" },
];

const severityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-warning/10 text-warning",
  medium: "bg-chart-2/10 text-chart-2",
  low: "bg-muted text-muted-foreground",
};

const BugsPerformance = () => {
  const { bugs, resolveBug } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Bugs & Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">Track issues and system performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bug list */}
        <WidgetCard title="Active Bugs" subtitle={`${bugs.filter(b => b.status !== "resolved").length} open`} delay={0.1}>
          <div className="space-y-2">
            <AnimatePresence>
              {bugs.map((bug, i) => (
                <motion.div
                  key={bug.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: bug.status === "resolved" ? 0.5 : 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <BugIcon className={`h-4 w-4 ${bug.status === "resolved" ? "text-success" : "text-destructive"}`} />
                    <div>
                      <p className={`text-sm font-medium ${bug.status === "resolved" ? "line-through text-muted-foreground" : ""}`}>{bug.title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${severityColors[bug.severity]}`}>{bug.severity}</span>
                        <span className="text-xs text-muted-foreground">{bug.assignee}</span>
                      </div>
                    </div>
                  </div>
                  {bug.status !== "resolved" && (
                    <button
                      onClick={() => { resolveBug(bug.id); toast.success("Bug resolved!"); }}
                      className="rounded-md p-1.5 hover:bg-success/10 text-muted-foreground hover:text-success transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </WidgetCard>

        <WidgetCard title="Performance Metrics" delay={0.2} subtitle="Real-time system health">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={perfData}
                layout="vertical"
                margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
                barCategoryGap="30%"
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.4)",
                    color: "hsl(var(--foreground))"
                  }}
                  formatter={(value: number, name: string, entry: any) => [
                    `${value}${entry.payload.unit}`,
                    "Metric"
                  ]}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
};

export default BugsPerformance;
