import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, UserPlus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useSignUp } from "@clerk/clerk-react";

const Signup = () => {
  const { isLoaded, signUp } = useSignUp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const getStrengthConfig = (score: number) => {
    if (score === 0) return { label: "", color: "text-muted-foreground", bg: "bg-white/5" };
    if (score === 1) return { label: "Weak", color: "text-destructive", bg: "bg-destructive" };
    if (score === 2) return { label: "Fair", color: "text-warning", bg: "bg-warning" };
    if (score === 3) return { label: "Strong", color: "text-primary", bg: "bg-primary" };
    return { label: "Elite", color: "text-success", bg: "bg-success" };
  };

  const strengthConfig = getStrengthConfig(strength);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Min 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!isLoaded) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const names = name.split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ");

      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // Send the email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      toast.success("Verification code sent!", {
        description: "Please check your email for the verification code.",
      });

      navigate("/verify-email", { state: { email } });
    } catch (err: any) {
      console.error(err);
      toast.error("Signup failed", {
        description: err.errors?.[0]?.message || "An error occurred during account creation.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", value: name, set: setName, type: "text", placeholder: "Enter your name", key: "name" },
    { label: "Email Address", value: email, set: setEmail, type: "email", placeholder: "Enter your email", key: "email" },
  ];

  return (
    <div className="relative flex min-h-screen lg:h-screen xl:h-screen items-center justify-center overflow-hidden bg-background p-4 sm:p-6 lg:p-8 font-body">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="mb-8 flex flex-col items-center">
          <img src="/logo.svg" alt="CodeForjHQ Logo" className="h-24 w-auto mb-2" />
          <p className="mt-2 text-sm text-muted-foreground font-medium text-center">Join the elite command center network</p>
        </div>

        <div className="rounded-[2rem] border border-white/[0.08] bg-black/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl card-elevated">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">Create Account</h2>
            <p className="text-sm text-muted-foreground">Start your journey with advanced automation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1.5 focus-within:text-primary transition-colors">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">{f.label}</label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-primary/10"
                    placeholder={f.placeholder}
                  />
                  <AnimatePresence>
                    {errors[f.key] && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] font-medium text-destructive/90"
                      >
                        {errors[f.key]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 focus-within:text-primary transition-colors">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">Security Password</label>
                {password && (
                  <motion.span
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-[10px] font-bold uppercase tracking-tighter ${strengthConfig.color}`}
                  >
                    {strengthConfig.label}
                  </motion.span>
                )}
              </div>
              <div className="relative group">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-primary/10"
                  placeholder="Min. 8 characters with caps & numbers"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Segmented Strength Meter */}
              <div className="flex gap-1.5 mt-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${strength >= step ? strengthConfig.bg : "bg-white/5"
                      }`}
                  />
                ))}
              </div>

              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[10px] font-medium text-destructive/90"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-1.5">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="relative group flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[0_0_20px_rgba(235,32,121,0.3)] transition-all hover:shadow-[0_0_30px_rgba(235,32,121,0.5)] disabled:opacity-50 disabled:shadow-none"
              >
                <div className="absolute inset-0 flex -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                <span>{loading ? "Initializing..." : "Register Account"}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm font-medium text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/30">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
