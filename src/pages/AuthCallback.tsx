import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const processSession = async () => {
      try {
        // Supabase JS v2 handles OAuth code exchange automatically in the browser.
        // We just need to wait for the session and then redirect.
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session && isMounted) {
          navigate("/dashboard", { replace: true });
          toast({ title: "Signed in with Google" });
        } else if (isMounted) {
          toast({
            title: "Sign-in required",
            description: "We couldn't find an active session. Please try signing in again.",
            variant: "destructive",
          });
          navigate("/auth", { replace: true });
        }
      } catch (error: any) {
        console.error("Auth callback error", error);
        if (isMounted) {
          toast({
            title: "Authentication Error",
            description: error.message || "We couldn't complete your sign-in. Please try again.",
            variant: "destructive",
          });
          navigate("/auth", { replace: true });
        }
      } finally {
        if (isMounted) {
          setProcessing(false);
        }
      }
    };

    processSession();

    return () => {
      isMounted = false;
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass rounded-xl px-6 py-8 border border-border/60 flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
        <p className="text-sm text-muted-foreground">
          {processing ? "Finishing your sign-in with Google..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
