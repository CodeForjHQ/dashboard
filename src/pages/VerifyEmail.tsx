import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { useSignUp } from "@clerk/clerk-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyEmail = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!isLoaded) return;
        if (code.length < 6) {
            toast.error("Invalid code", {
                description: "Please enter the 6-digit verification code.",
            });
            return;
        }

        setLoading(true);
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                toast.success("Account verified!", {
                    description: "Welcome to the CodeForjHQ ecosystem.",
                });
                navigate("/dashboard");
            } else {
                console.error(completeSignUp);
                toast.error("Verification failed", {
                    description: "Please check your code and try again.",
                });
            }
        } catch (err: any) {
            console.error(err);
            toast.error("Verification failed", {
                description: err.errors?.[0]?.message || "There was an error verifying your email.",
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
                    <p className="mt-2 text-sm text-muted-foreground font-medium text-center">Verify your identity</p>
                </div>

                <div className="rounded-[2rem] border border-white/[0.08] bg-black/40 p-8 backdrop-blur-xl shadow-2xl card-elevated">
                    <div className="mb-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-heading font-semibold text-foreground">Check your email</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            We've sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <InputOTP
                                maxLength={6}
                                value={code}
                                onChange={(val) => setCode(val)}
                            >
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot index={0} className="w-12 h-14 rounded-xl border-white/[0.08] bg-white/[0.03] text-lg font-bold text-primary focus:ring-primary/20" />
                                    <InputOTPSlot index={1} className="w-12 h-14 rounded-xl border-white/[0.08] bg-white/[0.03] text-lg font-bold text-primary focus:ring-primary/20" />
                                    <InputOTPSlot index={2} className="w-12 h-14 rounded-xl border-white/[0.08] bg-white/[0.03] text-lg font-bold text-primary focus:ring-primary/20" />
                                    <InputOTPSlot index={3} className="w-12 h-14 rounded-xl border-white/[0.08] bg-white/[0.03] text-lg font-bold text-primary focus:ring-primary/20" />
                                    <InputOTPSlot index={4} className="w-12 h-14 rounded-xl border-white/[0.08] bg-white/[0.03] text-lg font-bold text-primary focus:ring-primary/20" />
                                    <InputOTPSlot index={5} className="w-12 h-14 rounded-xl border-white/[0.08] bg-white/[0.03] text-lg font-bold text-primary focus:ring-primary/20" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || code.length < 6}
                            className="relative group flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_0_20px_rgba(235,32,121,0.3)] transition-all hover:shadow-[0_0_30px_rgba(235,32,121,0.5)] disabled:opacity-50 disabled:shadow-none"
                        >
                            <div className="absolute inset-0 flex -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                            <span>{loading ? "Verifying..." : "Verify & Complete"}</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </motion.button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
                        Didn't receive a code?{" "}
                        <button
                            onClick={() => signUp?.prepareEmailAddressVerification({ strategy: "email_code" })}
                            className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/30"
                        >
                            Resend code
                        </button>
                    </p>

                    <div className="mt-4 text-center">
                        <Link to="/signup" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Back to Sign Up
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
