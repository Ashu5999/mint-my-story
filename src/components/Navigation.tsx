import { Button } from "@/components/ui/button";
import { Wallet, Menu, LogIn, LogOut, User as UserIcon, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect, useBalance, useEnsName, useChainId, useSwitchChain } from 'wagmi';
import { hasValidProjectId, chains } from '@/config/wallet';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const PRIMARY_CHAIN = chains[0];

export const Navigation = () => {
  const web3Modal = useWeb3Modal();
  const { address, isConnected, status } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const { data: ensName } = useEnsName({ address, chainId: PRIMARY_CHAIN.id });
  const { data: balance } = useBalance({ address, chainId: PRIMARY_CHAIN.id, query: { enabled: Boolean(address) } });
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isOnCorrectChain = useMemo(
    () => (chainId ? chainId === PRIMARY_CHAIN.id : true),
    [chainId]
  );

  const displayAddress = useMemo(() => {
    if (!address) return '';
    const addr = address as string;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, [address]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    }).catch((error) => {
      console.error("Error getting session:", error);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleConnectClick = () => {
    if (!hasValidProjectId) {
      toast({
        title: "WalletConnect not configured",
        description: "Please set VITE_WALLETCONNECT_PROJECT_ID in your environment.",
        variant: "destructive",
      });
      return;
    }
    web3Modal.open();
  };

  const handleDisconnectClick = () => {
    disconnect();
  };

  const handleSignOut = async () => {
    try {
      // 1. Disconnect wallet
      disconnect();

      // 2. Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      navigate("/auth");
      toast({ title: "Signed out successfully" });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
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
            <Link to="/create-ip" className="text-foreground/80 hover:text-foreground transition-smooth">
              Create IP
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet status / connect button */}
            <div className="hidden md:flex items-center gap-2 mr-2">
              {isConnected && address ? (
                <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-border/60">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">
                      {ensName || displayAddress}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '—'}
                      <span className={isOnCorrectChain ? "" : "text-yellow-500 flex items-center gap-1"}>
                        {!isOnCorrectChain && <AlertTriangle className="w-3 h-3" />}
                        {PRIMARY_CHAIN.name}
                      </span>
                    </span>
                  </div>
                  {!isOnCorrectChain && (
                    <Button
                      variant="outline"
                      size="xs"
                      className="text-[11px] h-7 px-2"
                      disabled={isSwitchingChain}
                      onClick={() =>
                        switchChain({ chainId: PRIMARY_CHAIN.id }, {
                          onError: (error) => {
                            console.error('Network switch failed', error);
                            toast({
                              title: "Failed to switch network",
                              description: "Please switch to Sepolia in your wallet manually.",
                              variant: "destructive",
                            });
                          },
                        })
                      }
                    >
                      {isSwitchingChain ? 'Switching…' : 'Switch to Sepolia'}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1"
                    onClick={handleDisconnectClick}
                    title="Disconnect wallet"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="glass"
                  size="default"
                  onClick={handleConnectClick}
                  disabled={status === 'connecting'}
                >
                  <Wallet className="w-4 h-4" />
                  {status === 'connecting' ? 'Connecting…' : 'Connect Wallet'}
                </Button>
              )}
            </div>

            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 glass rounded-full">
                  <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-xs font-medium">
                    {user.email?.[0].toUpperCase() || <UserIcon className="w-3 h-3" />}
                  </div>
                  <span className="text-sm text-foreground/80">{user.email}</span>
                </div>
                <Button variant="glass" size="default" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">

              </Link>
            )}
            {/* Mobile wallet button */}
            <Button
              variant="glass"
              size="default"
              onClick={isConnected ? handleDisconnectClick : handleConnectClick}
            >
              <Wallet className="w-4 h-4" />
              {isConnected && address ? (ensName || displayAddress) : 'Wallet'}
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
