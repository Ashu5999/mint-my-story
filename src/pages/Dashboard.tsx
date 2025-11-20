import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, FileText, Zap, Plus, Loader2, UploadCloud } from "lucide-react";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { uploadMediaWithDetails, ipfsToHttp } from "@/utils/ipfs";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { hasValidProjectId } from "@/config/wallet";

interface DashboardStats {
  totalEarnings: number;
  activeAssets: number;
  totalLicenses: number;
}

interface Asset {
  id: string;
  title: string;
  price: number;
  licenses_sold: number;
  created_at: string;
}

interface CreateAssetForm {
  title: string;
  description: string;
  category: string;
  price: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    activeAssets: 0,
    totalLicenses: 0,
  });
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateAssetForm>({
    title: "",
    description: "",
    category: "Story",
    price: "0.5",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const web3Modal = useWeb3Modal();

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleCreateFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAsset = async (event: FormEvent) => {
    event.preventDefault();
    if (creating) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        toast({
          title: "Sign-in required",
          description: "Please sign in to create and mint assets.",
          variant: "destructive",
        });
        return;
      }

      if (!isConnected || !address) {
        toast({
          title: "Wallet required",
          description: "Connect your wallet before creating an asset.",
          variant: "destructive",
        });
        if (hasValidProjectId) {
          web3Modal.open();
        }
        return;
      }

      if (!selectedFile) {
        toast({
          title: "No file selected",
          description: "Please choose an image or video file to upload.",
          variant: "destructive",
        });
        return;
      }

      setCreating(true);

      // 1. Upload the user-selected file to IPFS
      const mediaResults = await uploadMediaWithDetails([selectedFile]);
      const media = mediaResults[0];

      // 2. Store the asset record in Supabase, referencing the IPFS media and creator wallet
      const priceNumber = parseFloat(createForm.price || "0");

      const { error } = await supabase.from('assets').insert({
        user_id: session.user.id,
        title: createForm.title || selectedFile.name,
        description: createForm.description || "A new IP asset minted with Mint2Story",
        category: createForm.category || "Story",
        price: isNaN(priceNumber) ? 0.5 : priceNumber,
        image_url: media.type === 'image' ? ipfsToHttp(media.uri) : null,
        metadata: {
          mediaType: media.type,
          ipfsUri: media.uri,
          creatorWallet: address,
        },
      });

      if (error) throw error;

      toast({
        title: "Asset minted!",
        description: "Your asset has been created and linked to your IPFS media.",
      });

      setShowCreateForm(false);
      setSelectedFile(null);
      setCreateForm({
        title: "",
        description: "",
        category: "Story",
        price: "0.5",
      });

      // Refresh dashboard stats and list
      fetchDashboardData();
    } catch (error: any) {
      console.error("Create asset failed", error);
      toast({
        title: "Asset creation failed",
        description: error.message || "Unable to create asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (assetsError) throw assetsError;

      const totalEarnings = assets?.reduce((sum, asset) => sum + (asset.price * asset.licenses_sold), 0) || 0;
      const activeAssets = assets?.length || 0;
      const totalLicenses = assets?.reduce((sum, asset) => sum + asset.licenses_sold, 0) || 0;

      setStats({ totalEarnings, activeAssets, totalLicenses });
      setRecentAssets(assets || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-16">
            <p className="text-center text-muted-foreground">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
                  Creator Dashboard
                </h1>
                <p className="text-xl text-foreground/70">
                  Manage your IP assets and track your earnings
                </p>
              </div>
              <Button variant="hero" size="lg" onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4" />
                Create Asset
              </Button>
            </div>

            {showCreateForm && (
              <div className="mb-12">
                <div className="glass rounded-2xl p-6 border border-border/60 max-w-2xl">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5" />
                    Mint New Asset
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your story media to IPFS and create a new asset. Nothing will be minted
                    until you confirm this form.
                  </p>
                  <form onSubmit={handleCreateAsset} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          name="title"
                          value={createForm.title}
                          onChange={handleCreateFormChange}
                          className="w-full px-3 py-2 rounded-md bg-background/60 border border-border/60 text-sm"
                          placeholder="My IP Story"
                          disabled={creating}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                          name="category"
                          value={createForm.category}
                          onChange={handleCreateFormChange}
                          className="w-full px-3 py-2 rounded-md bg-background/60 border border-border/60 text-sm"
                          placeholder="Story, Photo, Video..."
                          disabled={creating}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        name="description"
                        value={createForm.description}
                        onChange={handleCreateFormChange}
                        className="w-full px-3 py-2 rounded-md bg-background/60 border border-border/60 text-sm min-h-[80px]"
                        placeholder="Describe your story and how it can be licensed"
                        disabled={creating}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium mb-1">Price (ETH)</label>
                        <input
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={createForm.price}
                          onChange={handleCreateFormChange}
                          className="w-full px-3 py-2 rounded-md bg-background/60 border border-border/60 text-sm"
                          placeholder="0.50"
                          disabled={creating}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Media file</label>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          className="w-full text-sm"
                          disabled={creating}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Only the file you select here will be uploaded.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCreateForm(false);
                          setSelectedFile(null);
                        }}
                        disabled={creating}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="hero"
                        disabled={creating || !isConnected}
                      >
                        {creating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        {creating ? "Minting Asset..." : !isConnected ? "Connect wallet to mint" : "Confirm & Mint Asset"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Earnings
                  </CardTitle>
                  <DollarSign className="w-4 h-4 text-brand-purple" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold gradient-text">{stats.totalEarnings.toFixed(2)} ETH</div>
                  <p className="text-xs text-foreground/60 mt-1">
                    From license sales
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Assets
                  </CardTitle>
                  <FileText className="w-4 h-4 text-brand-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeAssets}</div>
                  <p className="text-xs text-foreground/60 mt-1">
                    Published assets
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Licenses
                  </CardTitle>
                  <TrendingUp className="w-4 h-4 text-brand-glow" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalLicenses}</div>
                  <p className="text-xs text-foreground/60 mt-1">
                    Licenses sold
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Price
                  </CardTitle>
                  <Zap className="w-4 h-4 text-brand-purple" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.activeAssets > 0 
                      ? (stats.totalEarnings / stats.totalLicenses || 0).toFixed(2)
                      : "0.00"} ETH
                  </div>
                  <p className="text-xs text-foreground/60 mt-1">
                    Per license
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Recent Assets</CardTitle>
              </CardHeader>
              <CardContent>
                {recentAssets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No assets yet</p>
                    <Button variant="hero" onClick={() => setShowCreateForm(true)}>
                      Create Your First Asset
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-3 glass rounded-lg">
                        <div>
                          <p className="font-medium">{asset.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {asset.licenses_sold} licenses • {asset.price} ETH
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/marketplace/${asset.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;
