import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, FileText, Zap, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    activeAssets: 0,
    totalLicenses: 0,
  });
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleCreateAsset = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from('assets').insert({
        user_id: session.user.id,
        title: `New Story ${Date.now()}`,
        description: "A captivating story waiting to be licensed",
        category: "Story",
        price: 0.5,
        image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      });

      if (error) throw error;

      toast({
        title: "Asset Created!",
        description: "Your new asset has been added to the marketplace",
      });

      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
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
              <Button variant="hero" size="lg" onClick={handleCreateAsset}>
                <Plus className="w-4 h-4" />
                Create Asset
              </Button>
            </div>

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
                    <Button variant="hero" onClick={handleCreateAsset}>
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
