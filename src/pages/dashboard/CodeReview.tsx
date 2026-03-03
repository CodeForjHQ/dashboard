import { useApp } from "@/contexts/AppContext";
import WidgetCard from "@/components/dashboard/WidgetCard";
import { motion } from "framer-motion";
import { GitPullRequest, Plus, Minus, Check, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const aiSuggestions = [
  { id: 1, file: "src/auth/middleware.ts", line: 42, suggestion: "Consider using a WeakMap for token cache to prevent memory leaks", type: "performance" },
  { id: 2, file: "src/api/users.ts", line: 18, suggestion: "Add input validation before database query to prevent injection", type: "security" },
  { id: 3, file: "src/utils/parser.ts", line: 67, suggestion: "This regex can be simplified and made ~3x faster", type: "optimization" },
];

const CodeReview = () => {
  const { pullRequests, updatePRStatus } = useApp();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-success/10 text-success";
      case "merged": return "bg-chart-5/10 text-chart-5";
      case "approved": return "bg-success/20 text-success";
      case "changes-requested": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case "open": return "text-success";
      case "merged": return "text-chart-5";
      case "approved": return "text-success";
      case "changes-requested": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Code Review</h1>
        <p className="text-sm text-muted-foreground mt-1">Review pull requests with AI-assisted insights</p>
      </div>

      <div className="space-y-4">
        {pullRequests.map((pr, i) => (
          <motion.div
            key={pr.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <WidgetCard>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-lg ${getStatusColor(pr.status).split(' ')[0]}`}>
                    <GitPullRequest className={`h-4 w-4 ${getIconColor(pr.status)}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{pr.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {pr.author} · {pr.createdAt} · {pr.reviewers.length} reviewer{pr.reviewers.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(pr.status)}`}>
                  {pr.status.replace('-', ' ')}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-success"><Plus className="h-3 w-3" />{pr.additions}</span>
                <span className="flex items-center gap-1 text-destructive"><Minus className="h-3 w-3" />{pr.deletions}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><MessageSquare className="h-3 w-3" />{Math.floor(Math.random() * 8) + 1} comments</span>
              </div>

              {(pr.status === "open" || pr.status === "changes-requested") && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      updatePRStatus(pr.id, "approved");
                      toast.success("Pull request approved!");
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => {
                      updatePRStatus(pr.id, "changes-requested");
                      toast.error("Changes requested");
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Request Changes
                  </button>
                </div>
              )}
            </WidgetCard>
          </motion.div>
        ))}
      </div>

      {/* AI Suggestions */}
      <WidgetCard title="AI Code Suggestions" subtitle="Inline recommendations from analysis" delay={0.5}>
        <div className="space-y-3">
          {aiSuggestions.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.12 }}
              className="rounded-lg bg-secondary/50 p-3 border border-border"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs">{s.file}:{s.line}</code>
                <span className={`rounded-full px-2 py-0.5 text-xs ${s.type === "security" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>{s.type}</span>
              </div>
              <p className="text-sm">{s.suggestion}</p>
            </motion.div>
          ))}
        </div>
      </WidgetCard>
    </div>
  );
};

export default CodeReview;
