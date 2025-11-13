import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, FileText, Zap } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
                Creator Dashboard
              </h1>
              <p className="text-xl text-foreground/70">
                Manage your IP assets and track your earnings
              </p>
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
                  <div className="text-2xl font-bold gradient-text">12.5 ETH</div>
                  <p className="text-xs text-foreground/60 mt-1">
                    +20% from last month
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
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-foreground/60 mt-1">
                    8 minted this month
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
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-foreground/60 mt-1">
                    +12 this week
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Royalty
                  </CardTitle>
                  <Zap className="w-4 h-4 text-brand-purple" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15%</div>
                  <p className="text-xs text-foreground/60 mt-1">
                    Per license sold
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Recent Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 glass rounded-lg">
                        <div>
                          <p className="font-medium">Sunset Beach Vlog #{i}</p>
                          <p className="text-sm text-foreground/60">Minted 2 days ago</p>
                        </div>
                        <Button variant="glass" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Recent Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 glass rounded-lg">
                        <div>
                          <p className="font-medium">License Sale</p>
                          <p className="text-sm text-foreground/60">2 hours ago</p>
                        </div>
                        <p className="font-bold gradient-text">0.5 ETH</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
