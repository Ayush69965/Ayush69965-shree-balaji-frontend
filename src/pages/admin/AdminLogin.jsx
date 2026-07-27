import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Envelope } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back!");
            navigate("/admin");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12 relative overflow-hidden">
                <div className="absolute inset-0 grain" />
                <div className="relative flex items-center gap-2.5">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 font-head font-bold">SB</div>
                    <div className="font-head font-bold text-lg">Shree Balaji Pathology Lab</div>
                </div>
                <div className="relative">
                    <h1 className="font-head text-4xl font-bold tracking-tight leading-tight">Admin Control Center</h1>
                    <p className="mt-4 text-white/70 max-w-sm">Manage appointments, tests, content, gallery and more — all from one secure dashboard.</p>
                </div>
                <div className="relative text-sm text-white/50">© {new Date().getFullYear()} Shree Balaji Pathology Lab</div>
            </div>

            <div className="flex items-center justify-center p-6">
                <form onSubmit={submit} className="w-full max-w-sm" data-testid="admin-login-form">
                    <h2 className="font-head text-2xl font-bold text-foreground">Admin Login</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Sign in to access the dashboard.</p>
                    <div className="mt-8 space-y-4">
                        <div>
                            <Label>Email</Label>
                            <div className="relative mt-1.5">
                                <Envelope size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input data-testid="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" placeholder="admin@shreebalajilab.com" />
                            </div>
                        </div>
                        <div>
                            <Label>Password</Label>
                            <div className="relative mt-1.5">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input data-testid="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11" placeholder="••••••••" />
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full rounded-full h-11" data-testid="login-submit">
                            {loading ? "Signing in…" : "Sign In"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
