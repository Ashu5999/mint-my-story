import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const sampleAssets = [
  {
    id: 1,
    title: "Summer Sunset Collection",
    creator: "@creator_one",
    price: "0.05 ETH",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    licenses: 12,
  },
  {
    id: 2,
    title: "Urban Street Style",
    creator: "@fashionista",
    price: "0.08 ETH",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=600&fit=crop",
    licenses: 8,
  },
  {
    id: 3,
    title: "Food Photography Series",
    creator: "@foodie_creator",
    price: "0.03 ETH",
    category: "Food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    licenses: 24,
  },
];

export const MarketplacePreview = () => {
  return (
    <section className="py-32 relative story-bg">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
            Featured IP Assets
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-light">
            Discover and license premium creator content with transparent terms
          </p>
        </div>

        {/* Assets Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {sampleAssets.map((asset) => (
            <Card
              key={asset.id}
              className="group bg-card/50 border border-border/50 rounded-3xl overflow-hidden hover:border-border transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={asset.image}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-foreground line-clamp-1">{asset.title}</h3>
                    <p className="text-sm text-muted-foreground">{asset.creator}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                    {asset.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">License from</p>
                    <p className="text-lg font-medium text-foreground">{asset.price}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{asset.licenses} sold</p>
                </div>

                <Link to={`/marketplace/${asset.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/marketplace">
            <Button size="lg" className="min-w-[200px]">
              Explore Marketplace
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
