import { Button } from "@/components/ui/button";
import { Wallet, Menu, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { hasValidProjectId } from '@/config/web3';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export const Navigation = () => {
  const { open } = hasValidProjectId ? useWeb3Modal() : { open: () => {} };
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleWalletAction = () => {
    if (isConnected) {
      disconnect();
    } else {
      open();
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-blue rounded-lg" />
            <span className="text-xl font-bold gradient-text">Mint2Story</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/marketplace" className="text-foreground/80 hover:text-foreground transition-smooth">
              Marketplace
            </Link>
            <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-smooth">
              Dashboard
            </Link>
            <Link to="/how-it-works" className="text-foreground/80 hover:text-foreground transition-smooth">
              How It Works
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {!user && (
              <Link to="/auth">
                <Button variant="glass" size="default">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
            <Button variant="glass" size="default" onClick={handleWalletAction}>
              <Wallet className="w-4 h-4" />
              {isConnected && address ? formatAddress(address) : 'Connect Wallet'}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
