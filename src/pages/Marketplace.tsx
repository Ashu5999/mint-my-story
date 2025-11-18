import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LicenseDialog } from "@/components/LicenseDialog";
import { FilterSheet } from "@/components/FilterSheet";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  title: string;
  creator: string;
  price: string;
  category: string;
  image: string;
  licenses: number;
}

const sampleAssets = [
  {
    id: 1,
    title: "Sunset Beach Vlog",
    creator: "@sarah_creates",
    price: "0.5 ETH",
    category: "Video",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    licenses: 3,
  },
  {
    id: 2,
    title: "Urban Street Photography",
    creator: "@alex_lens",
    price: "0.3 ETH",
    category: "Photo",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
    licenses: 5,
  },
  {
    id: 3,
    title: "Coffee Shop Aesthetic",
    creator: "@lifestyle_mike",
    price: "0.2 ETH",
    category: "Story",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    licenses: 2,
  },
  {
    id: 4,
    title: "Mountain Adventure Reel",
    creator: "@outdoor_emma",
    price: "0.8 ETH",
    category: "Video",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    licenses: 4,
  },
  {
    id: 5,
    title: "Fashion Lookbook",
    creator: "@style_guru",
    price: "0.6 ETH",
    category: "Photo",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    licenses: 6,
  },
  {
    id: 6,
    title: "Tech Review Series",
    creator: "@gadget_pro",
    price: "1.2 ETH",
    category: "Video",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    licenses: 8,
  },
];

const Marketplace = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAssets = data?.map(asset => ({
        id: asset.id,
        title: asset.title,
        creator: `@creator_${asset.user_id.slice(0, 8)}`,
        price: `${asset.price} ETH`,
        category: asset.category,
        image: asset.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        licenses: asset.licenses_sold || 0,
      })) || [];

      setAssets(formattedAssets);
    } catch (error: any) {
      toast({
        title: "Error Loading Assets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
                IP Asset Marketplace
              </h1>
              <p className="text-xl text-foreground/70">
                Discover and license premium content from top creators
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-12 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search assets..."
                  className="pl-10 glass"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="glass" onClick={() => setFilterOpen(true)}>
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No assets found. Try adjusting your search.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => (
                  <Card key={asset.id} className="glass overflow-hidden hover:scale-105 transition-smooth">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={asset.image}
                        alt={asset.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 glass">
                        {asset.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{asset.title}</h3>
                      <p className="text-sm text-foreground/60 mb-3">{asset.creator}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm text-foreground/60">Price</p>
                          <p className="font-bold gradient-text">{asset.price}</p>
                        </div>
                        <p className="text-xs text-foreground/50">
                          {asset.licenses} licenses
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="hero" size="sm" className="flex-1" onClick={() => setSelectedAsset(asset)}>
                          License
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/marketplace/${asset.id}`)}>
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      
      {selectedAsset && (
        <LicenseDialog
          open={!!selectedAsset}
          onOpenChange={(open) => !open && setSelectedAsset(null)}
          asset={selectedAsset}
        />
      )}
      
      <FilterSheet open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  );
};

export default Marketplace;
