import WidgetCard from "@/components/dashboard/WidgetCard";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Brain, Lightbulb, AlertTriangle } from "lucide-react";

const qualityData = [
  { month: "Jan", score: 72 }, { month: "Feb", score: 75 }, { month: "Mar", score: 78 },
  { month: "Apr", score: 74 }, { month: "May", score: 82 }, { month: "Jun", score: 88 },
  { month: "Jul", score: 91 },
];

const complexityData = [
  { name: "Auth", value: 34 }, { name: "API", value: 67 }, { name: "UI", value: 45 },
  { name: "DB", value: 52 }, { name: "Tests", value: 28 }, { name: "CI/CD", value: 38 },
];

const radarData = [
  { metric: "Readability", score: 85 }, { metric: "Maintainability", score: 78 },
  { metric: "Performance", score: 92 }, { metric: "Security", score: 70 },
  { metric: "Test Coverage", score: 88 }, { metric: "Documentation", score: 65 },
];

const suggestions = [
  { id: 1, title: "Reduce cyclomatic complexity in auth module", impact: "High", type: "refactor" },
  { id: 2, title: "Add error boundary to dashboard components", impact: "Medium", type: "reliability" },
  { id: 3, title: "Implement lazy loading for route-based code splitting", impact: "High", type: "performance" },
  { id: 4, title: "Add input sanitization to API endpoints", impact: "Critical", type: "security" },
];

const ttStyle = { background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,15%)", borderRadius: "8px", color: "hsl(144,36%,96%)" };

const AIAnalysis = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-heading font-bold">AI Analysis</h1>
      <p className="text-sm text-muted-foreground mt-1">AI-powered code quality insights and recommendations</p>
    </div>

    {/* Technical Debt Meter */}
    <WidgetCard title="Technical Debt Score" delay={0.1}>
      <div className="flex items-center gap-8">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(0,0%,13%)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none" stroke="hsl(337,95%,49%)" strokeWidth="8"
              strokeLinecap="round" strokeDasharray={264}
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 264 * (1 - 0.34) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-heading font-bold">34%</span>
            <span className="text-xs text-muted-foreground">debt ratio</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-sm"><AlertTriangle className="h-4 w-4 text-warning" /> 12 hotspots detected</div>
          <div className="flex items-center gap-2 text-sm"><Brain className="h-4 w-4 text-primary" /> 3 modules need refactoring</div>
          <div className="flex items-center gap-2 text-sm text-success">↓ 8% improvement this sprint</div>
        </div>
      </div>
    </WidgetCard>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <WidgetCard title="Code Quality Trend" delay={0.2}>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qualityData}>
              <XAxis dataKey="month" stroke="hsl(0,0%,30%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(0,0%,30%)" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={ttStyle} />
              <Line type="monotone" dataKey="score" stroke="hsl(337,95%,49%)" strokeWidth={2} dot={{ fill: "hsl(337,95%,49%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </WidgetCard>

      <WidgetCard title="Module Complexity" delay={0.3}>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complexityData}>
              <XAxis dataKey="name" stroke="hsl(0,0%,30%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(0,0%,30%)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={ttStyle} />
              <Bar dataKey="value" fill="hsl(337,95%,49%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </WidgetCard>
    </div>

    <WidgetCard title="Code Health Radar" delay={0.4}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(0,0%,20%)" />
            <PolarAngleAxis dataKey="metric" stroke="hsl(0,0%,40%)" fontSize={11} />
            <Radar dataKey="score" stroke="hsl(337,95%,49%)" fill="hsl(337,95%,49%)" fillOpacity={0.15} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>

    <WidgetCard title="AI Suggestions" subtitle="Optimization recommendations" delay={0.5}>
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-start gap-3 rounded-lg border border-border p-3 hover:border-primary/30 transition-colors"
          >
            <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{s.title}</p>
              <div className="mt-1 flex gap-2">
                <span className={`text-xs rounded-full px-2 py-0.5 ${s.impact === "Critical" ? "bg-destructive/10 text-destructive" : s.impact === "High" ? "bg-warning/10 text-warning" : "bg-secondary text-muted-foreground"}`}>{s.impact}</span>
                <span className="text-xs rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">{s.type}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </WidgetCard>
  </div>
);

export default AIAnalysis;
