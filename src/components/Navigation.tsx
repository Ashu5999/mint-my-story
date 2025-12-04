import { Button } from "@/components/ui/button";
import { Wallet, Menu, LogOut, User as UserIcon, AlertTriangle, ChevronDown } from "lucide-react";
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
      disconnect();
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <span className="text-xl font-semibold tracking-tight text-foreground">Mint2Story</span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavDropdown label="Explore">
              <NavDropdownItem to="/marketplace">Marketplace</NavDropdownItem>
              <NavDropdownItem to="/how-it-works">How It Works</NavDropdownItem>
            </NavDropdown>
            <NavDropdown label="Build">
              <NavDropdownItem to="/dashboard">Dashboard</NavDropdownItem>
              <NavDropdownItem to="/create-ip">Create IP</NavDropdownItem>
            </NavDropdown>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Wallet Connection */}
            {isConnected && address ? (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">
                    {ensName || displayAddress}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    {balance ? `${Number(balance.formatted).toFixed(3)} ${balance.symbol}` : '—'}
                    {!isOnCorrectChain && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                  </span>
                </div>
                {!isOnCorrectChain && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 rounded-full"
                    disabled={isSwitchingChain}
                    onClick={() =>
                      switchChain({ chainId: PRIMARY_CHAIN.id }, {
                        onError: (error) => {
                          console.error('Network switch failed', error);
                          toast({
                            title: "Failed to switch network",
                            description: "Please switch to Sepolia manually.",
                            variant: "destructive",
                          });
                        },
                      })
                    }
                  >
                    {isSwitchingChain ? '...' : 'Switch'}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleDisconnectClick}
                >
                  <LogOut className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex rounded-full px-4 h-9"
                onClick={handleConnectClick}
                disabled={status === 'connecting'}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {status === 'connecting' ? 'Connecting...' : 'Connect'}
              </Button>
            )}

            {/* Auth */}
            {user ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full px-4 h-9"
                onClick={handleSignOut}
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium mr-2">
                  {user.email?.[0].toUpperCase() || <UserIcon className="w-3 h-3" />}
                </div>
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button className="rounded-full px-6 h-9 bg-foreground text-background hover:bg-foreground/90">
                  Get Started
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Dropdown components
const NavDropdown = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 py-2 min-w-[180px] bg-card border border-border rounded-xl shadow-xl">
          {children}
        </div>
      )}
    </div>
  );
};

const NavDropdownItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
  >
    {children}
  </Link>
);
