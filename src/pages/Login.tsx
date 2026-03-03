import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useSignIn } from "@clerk/clerk-react";

const Login = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!isLoaded) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Welcome back!", {
          description: "Successfully signed into your command center.",
        });
        navigate("/dashboard");
      } else {
        console.log(result);
        toast.error("Login failed", {
          description: "Check your credentials and try again.",
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Login failed", {
        description: err.errors?.[0]?.message || "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen lg:h-screen xl:h-screen items-center justify-center overflow-hidden bg-background p-4 sm:p-6 lg:p-8 font-body">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="mb-8 flex flex-col items-center">
          <img src="/logo.svg" alt="CodeForjHQ Logo" className="h-24 w-auto mb-2" />
          <p className="mt-2 text-sm text-muted-foreground font-medium">Elevate your workflow structure</p>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-8 backdrop-blur-xl shadow-2xl card-elevated">
          <div className="mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">Sign In</h2>
            <p className="text-sm text-muted-foreground">Access your personalized command center</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 focus-within:text-primary transition-colors">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-primary/10"
                  placeholder="Enter your email"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs font-medium text-destructive/90"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-1.5 focus-within:text-primary transition-colors">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Password</label>
              </div>
              <div className="relative group">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-primary/10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs font-medium text-destructive/90"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="relative group flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_0_20px_rgba(235,32,121,0.3)] transition-all hover:shadow-[0_0_30px_rgba(235,32,121,0.5)] disabled:opacity-50 disabled:shadow-none"
            >
              <div className="absolute inset-0 flex -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              <span>{loading ? "Verifying..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
            New to the ecosystem?{" "}
            <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/30">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
