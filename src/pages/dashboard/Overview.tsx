import { useEffect, useState, useRef } from "react";
import { useApp } from "@/contexts/AppContext";
import WidgetCard from "@/components/dashboard/WidgetCard";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Activity, GitCommit, Clock,
  Zap, Shield, Rocket, BarChart3, Code2, Users
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const commitData = [
  { day: "Mon", commits: 24 }, { day: "Tue", commits: 38 }, { day: "Wed", commits: 45 },
  { day: "Thu", commits: 32 }, { day: "Fri", commits: 56 }, { day: "Sat", commits: 18 },
  { day: "Sun", commits: 12 },
];

const weeklyBreakdown = [
  { name: "Features", value: 42, color: "hsl(337, 95%, 49%)" },
  { name: "Fixes", value: 28, color: "hsl(200, 80%, 50%)" },
  { name: "Refactor", value: 18, color: "hsl(150, 60%, 45%)" },
  { name: "Docs", value: 12, color: "hsl(45, 90%, 55%)" },
];

const activityFeed = [
  { id: 1, user: "Alex K.", action: "merged PR #142", time: "5m ago", icon: GitCommit },
  { id: 2, user: "Sarah M.", action: "pushed 3 commits to main", time: "12m ago", icon: GitCommit },
  { id: 3, user: "Jordan L.", action: "opened issue #89", time: "28m ago", icon: Activity },
  { id: 4, user: "Chris P.", action: "deployed to production", time: "1h ago", icon: Rocket },
  { id: 5, user: "Taylor S.", action: "approved PR #138", time: "2h ago", icon: GitCommit },
  { id: 6, user: "Alex K.", action: "resolved bug #67", time: "3h ago", icon: Shield },
];

const metricIcons = [BarChart3, Code2, Shield, Rocket, Activity, Zap];

const CountUp = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.round(current * 10) / 10);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span ref={ref}>{typeof target === "number" && target % 1 !== 0 ? value.toFixed(1) : Math.round(value)}{suffix}</span>;
};

const Overview = () => {
  const { metrics, isDataLoading } = useApp();

  if (isDataLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with greeting */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor your development workflow in real-time
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse-dot" />
          All systems operational
        </div>
      </motion.div>

      {/* Metrics grid — 2 cols on mobile, 3 on md, 6 on xl */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {metrics.map((m, i) => {
          const Icon = metricIcons[i] || Activity;
          return (
            <WidgetCard key={m.label} delay={i * 0.06}>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[11px] leading-tight text-muted-foreground font-medium truncate">{m.label}</p>
              </div>
              <p className="text-2xl xl:text-3xl font-heading font-bold tracking-tight">
                <CountUp target={m.value} suffix={m.suffix} />
              </p>
              <span className={`mt-1 inline-flex items-center gap-1 text-[11px] font-semibold ${m.change >= 0 ? "text-success" : "text-destructive"}`}>
                {m.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(m.change)}%
              </span>
            </WidgetCard>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Commit Activity — spans 3 */}
        <WidgetCard title="Commit Activity" subtitle="Last 7 days" className="lg:col-span-3" delay={0.3}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={commitData}>
                <defs>
                  <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(337, 95%, 49%)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(337, 95%, 49%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="hsl(0,0%,30%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(0,0%,30%)" fontSize={11} tickLine={false} axisLine={false} width={30} />
                <Tooltip
                  contentStyle={{ background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,15%)", borderRadius: "8px", color: "hsl(144,36%,96%)", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="commits" stroke="hsl(337, 95%, 49%)" strokeWidth={2} fill="url(#commitGrad)" dot={{ r: 3, fill: "hsl(337, 95%, 49%)", strokeWidth: 0 }} activeDot={{ r: 5, fill: "hsl(337, 95%, 49%)", stroke: "hsl(337, 95%, 65%)", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </WidgetCard>

        {/* Work Breakdown — spans 2 */}
        <WidgetCard title="Work Breakdown" subtitle="This week" className="lg:col-span-2" delay={0.35}>
          <div className="flex flex-col sm:block h-[280px] sm:h-56 relative group">
            <div className="flex-1 w-full relative sm:h-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                <PieChart>
                  <Pie
                    data={weeklyBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="85%"
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1200}
                  >
                    {weeklyBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="rgba(0,0,0,0.2)"
                        strokeWidth={1}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-black/90 px-3 py-2 text-[11px] shadow-xl backdrop-blur-xl">
                            <p className="font-bold text-foreground flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full" style={{ background: payload[0].payload.color }} />
                              {payload[0].name}
                            </p>
                            <p className="mt-0.5 text-muted-foreground font-medium">
                              {payload[0].value}% Effort
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl sm:text-2xl font-heading font-black text-foreground">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">Capacity</span>
              </div>
            </div>

            {/* Legend - Responsive Positioning */}
            <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 flex flex-row sm:flex-col flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 mt-4 sm:mt-0 pb-2 sm:pb-0 px-2 sm:px-0">
              {weeklyBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2 group/item">
                  <div className="h-1.5 w-1.5 rounded-full ring-2 ring-black/20" style={{ background: item.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/80 group-hover/item:text-foreground transition-colors whitespace-nowrap">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* Activity feed + Progress bars */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Activity Feed — spans 2 */}
        <WidgetCard title="Recent Activity" className="lg:col-span-2" delay={0.4}>
          <div className="space-y-1 max-h-72 overflow-y-auto scrollbar-thin pr-1">
            {activityFeed.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-secondary/50 transition-colors group"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">
                    <span className="font-semibold">{item.user}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> {item.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </WidgetCard>

        {/* Progress / Health — spans 3 */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Sprint Progress", value: 72, color: "bg-primary", icon: Rocket },
            { label: "Test Coverage", value: 94, color: "bg-success", icon: Shield },
            { label: "Code Quality", value: 87, color: "bg-chart-2", icon: Code2 },
            { label: "Performance", value: 96, color: "bg-chart-3", icon: Zap },
          ].map((bar, i) => (
            <WidgetCard key={bar.label} delay={0.5 + i * 0.08}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bar.color}/10`}>
                  <bar.icon className={`h-4 w-4 ${bar.color === "bg-primary" ? "text-primary" : bar.color === "bg-success" ? "text-success" : bar.color === "bg-chart-2" ? "text-chart-2" : "text-chart-3"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block">{bar.label}</span>
                </div>
                <span className="text-xl font-heading font-bold">{bar.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bar.value}%` }}
                  transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                  className={`h-full rounded-full ${bar.color}`}
                />
              </div>
            </WidgetCard>
          ))}
        </div>
      </div>

      {/* Quick stats footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: "Avg Build Time", value: "2m 34s", icon: Clock },
          { label: "Active Devs", value: "12", icon: Users },
          { label: "Deployments Today", value: "8", icon: Rocket },
          { label: "Uptime", value: "99.98%", icon: Shield },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.06 }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4"
          >
            <stat.icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-heading font-bold">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Overview;
