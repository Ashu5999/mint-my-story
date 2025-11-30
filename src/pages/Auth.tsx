import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wallet } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { authenticateWithWallet } from "@/utils/auth";
import { hasValidProjectId } from "@/config/wallet";

export default function Auth() {
  const [authenticating, setAuthenticating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const web3Modal = useWeb3Modal();

  // Check if user is already logged in with Supabase
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Handle wallet connection and auto-authentication
  useEffect(() => {
    const handleWalletAuth = async () => {
      if (isConnected && address && !authenticating) {
        setAuthenticating(true);
        try {
          await authenticateWithWallet(address);
          toast({
            title: "Wallet Connected",
            description: "Successfully signed in with your wallet.",
          });
          // Navigation handled by onAuthStateChange
        } catch (error: any) {
          console.error("Wallet auth error:", error);
          toast({
            title: "Authentication Failed",
            description: "Could not sign in with this wallet. Please try again.",
            variant: "destructive",
          });
          setAuthenticating(false);
        }
      }
    };

    handleWalletAuth();
  }, [isConnected, address, toast, authenticating]);

  const handleConnectClick = () => {
    if (!hasValidProjectId) {
      toast({
        title: "Configuration Error",
        description: "WalletConnect Project ID is missing.",
        variant: "destructive",
      });
      return;
    }
    web3Modal.open();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md glass border-border/50">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold gradient-text">
            Welcome to Mint2Story
          </CardTitle>
          <CardDescription>
            Connect your wallet to start minting your stories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-purple to-brand-blue rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Wallet className="w-10 h-10 text-white" />
          </div>

          {authenticating ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
              <p className="text-sm text-muted-foreground">Authenticating with wallet...</p>
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full max-w-xs"
              onClick={handleConnectClick}
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
          )}

          <p className="text-xs text-center text-muted-foreground mt-4">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
