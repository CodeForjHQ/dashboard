import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Repository {
  id: string;
  name: string;
  language: string;
  stars: number;
  lastSync: string;
  status: "synced" | "syncing" | "error";
  branches: string[];
  tags?: string[];
}

export interface Bug {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in-progress" | "resolved";
  assignee: string;
  createdAt: string;
}

export interface Pipeline {
  id: string;
  name: string;
  status: "success" | "running" | "failed" | "queued";
  branch: string;
  duration: string;
  timestamp: string;
  logs: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  commits: number;
  prs: number;
  reviews: number;
  activity: number[];
}

export interface PullRequest {
  id: string;
  title: string;
  author: string;
  status: "open" | "merged" | "closed" | "approved" | "changes-requested";
  reviewers: string[];
  additions: number;
  deletions: number;
  createdAt: string;
}

interface AppContextType {
  repositories: Repository[];
  bugs: Bug[];
  pipelines: Pipeline[];
  team: TeamMember[];
  pullRequests: PullRequest[];
  metrics: { label: string; value: number; change: number; suffix?: string }[];
  isDataLoading: boolean;
  addRepository: (name: string, language: string, status: Repository["status"], tags: string[]) => void;
  removeRepository: (id: string) => void;
  resolveBug: (id: string) => void;
  updatePRStatus: (id: string, status: PullRequest["status"]) => void;
  addTeamMember: (name: string, role: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

const mockRepos: Repository[] = [
  { id: "1", name: "codeforj-api", language: "TypeScript", stars: 342, lastSync: "2 min ago", status: "synced", branches: ["main", "dev", "feature/auth"] },
  { id: "2", name: "codeforj-web", language: "React", stars: 528, lastSync: "5 min ago", status: "synced", branches: ["main", "staging", "feature/dashboard"] },
  { id: "3", name: "codeforj-cli", language: "Rust", stars: 189, lastSync: "1 hr ago", status: "syncing", branches: ["main", "v2"] },
  { id: "4", name: "codeforj-sdk", language: "Python", stars: 267, lastSync: "30 min ago", status: "synced", branches: ["main", "dev"] },
  { id: "5", name: "codeforj-infra", language: "Go", stars: 95, lastSync: "3 hr ago", status: "error", branches: ["main"] },
];

const mockBugs: Bug[] = [
  { id: "1", title: "Memory leak in WebSocket handler", severity: "critical", status: "open", assignee: "Alex K.", createdAt: "2h ago" },
  { id: "2", title: "Race condition in auth middleware", severity: "high", status: "in-progress", assignee: "Sarah M.", createdAt: "5h ago" },
  { id: "3", title: "CSS overflow on mobile nav", severity: "medium", status: "open", assignee: "Jordan L.", createdAt: "1d ago" },
  { id: "4", title: "Deprecated API call in v2 endpoint", severity: "low", status: "open", assignee: "Chris P.", createdAt: "2d ago" },
  { id: "5", title: "Null pointer in user service", severity: "high", status: "resolved", assignee: "Alex K.", createdAt: "3d ago" },
];

const mockPipelines: Pipeline[] = [
  { id: "1", name: "codeforj-api / main", status: "success", branch: "main", duration: "2m 34s", timestamp: "5 min ago", logs: ["✓ Install deps", "✓ Lint", "✓ Test (42 passed)", "✓ Build", "✓ Deploy to prod"] },
  { id: "2", name: "codeforj-web / staging", status: "running", branch: "staging", duration: "1m 12s", timestamp: "now", logs: ["✓ Install deps", "✓ Lint", "▸ Running tests..."] },
  { id: "3", name: "codeforj-cli / v2", status: "failed", branch: "v2", duration: "0m 45s", timestamp: "12 min ago", logs: ["✓ Install deps", "✓ Lint", "✗ Test failed: 3 errors"] },
  { id: "4", name: "codeforj-sdk / dev", status: "queued", branch: "dev", duration: "—", timestamp: "15 min ago", logs: ["Waiting in queue..."] },
];

const mockTeam: TeamMember[] = [
  { id: "1", name: "Alex Kim", role: "Lead Engineer", avatar: "AK", commits: 147, prs: 23, reviews: 45, activity: [3, 5, 2, 8, 4, 7, 6, 9, 3, 5, 8, 2] },
  { id: "2", name: "Sarah Martinez", role: "Senior Dev", avatar: "SM", commits: 132, prs: 19, reviews: 38, activity: [5, 3, 7, 4, 6, 8, 2, 5, 9, 4, 3, 7] },
  { id: "3", name: "Jordan Lee", role: "Frontend Dev", avatar: "JL", commits: 98, prs: 15, reviews: 22, activity: [2, 4, 6, 3, 5, 7, 8, 4, 2, 6, 5, 3] },
  { id: "4", name: "Chris Park", role: "DevOps", avatar: "CP", commits: 76, prs: 12, reviews: 31, activity: [4, 6, 3, 5, 7, 2, 4, 8, 6, 3, 5, 7] },
  { id: "5", name: "Taylor Swift", role: "QA Engineer", avatar: "TS", commits: 45, prs: 8, reviews: 56, activity: [1, 3, 5, 2, 4, 6, 3, 7, 5, 2, 4, 8] },
];

const mockPRs: PullRequest[] = [
  { id: "1", title: "feat: Add WebSocket support for real-time updates", author: "Alex Kim", status: "open", reviewers: ["Sarah M.", "Jordan L."], additions: 342, deletions: 28, createdAt: "2h ago" },
  { id: "2", title: "fix: Resolve auth token refresh race condition", author: "Sarah Martinez", status: "open", reviewers: ["Alex K."], additions: 67, deletions: 45, createdAt: "4h ago" },
  { id: "3", title: "refactor: Migrate to Zustand for state management", author: "Jordan Lee", status: "merged", reviewers: ["Alex K.", "Chris P."], additions: 523, deletions: 687, createdAt: "1d ago" },
  { id: "4", title: "chore: Update CI/CD pipeline configuration", author: "Chris Park", status: "merged", reviewers: ["Alex K."], additions: 89, deletions: 34, createdAt: "2d ago" },
];

const mockMetrics = [
  { label: "Total Commits", value: 1247, change: 12.5 },
  { label: "Open PRs", value: 23, change: -8.3 },
  { label: "Code Coverage", value: 94.2, change: 2.1, suffix: "%" },
  { label: "Build Success", value: 98.7, change: 0.5, suffix: "%" },
  { label: "Active Issues", value: 37, change: -15.2 },
  { label: "Deploy Freq", value: 4.2, change: 18.0, suffix: "/day" },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [metrics, setMetrics] = useState(mockMetrics);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRepositories(mockRepos);
      setBugs(mockBugs);
      setPipelines(mockPipelines);
      setTeam(mockTeam);
      setPullRequests(mockPRs);
      setMetrics(mockMetrics);
      setIsDataLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const addRepository = (name: string, language: string, status: Repository["status"], tags: string[]) => {
    setRepositories((prev) => [...prev, {
      id: String(Date.now()),
      name,
      language,
      stars: 0,
      lastSync: "just now",
      status,
      branches: ["main"],
      tags
    }]);
  };

  const removeRepository = (id: string) => {
    setRepositories((prev) => prev.filter((r) => r.id !== id));
  };

  const resolveBug = (id: string) => {
    setBugs((prev) => prev.map((b) => b.id === id ? { ...b, status: "resolved" as const } : b));
  };

  const updatePRStatus = (id: string, status: PullRequest["status"]) => {
    setPullRequests((prev) => prev.map((pr) => pr.id === id ? { ...pr, status } : pr));
  };

  const addTeamMember = (name: string, role: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const newMember: TeamMember = {
      id: String(Date.now()),
      name,
      role,
      avatar: initials.slice(0, 2) || "U",
      commits: 0,
      prs: 0,
      reviews: 0,
      activity: Array.from({ length: 12 }, () => Math.floor(Math.random() * 10))
    };
    setTeam(prev => [...prev, newMember]);
  };

  return (
    <AppContext.Provider value={{
      repositories, bugs, pipelines, team, pullRequests, metrics, isDataLoading,
      addRepository, removeRepository, resolveBug, updatePRStatus, addTeamMember
    }}>
      {children}
    </AppContext.Provider>
  );
};
