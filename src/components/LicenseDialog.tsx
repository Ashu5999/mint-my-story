import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: {
    id: number;
    title: string;
    creator: string;
    price: string;
    category: string;
    image: string;
    licenses: number;
  };
}

export const LicenseDialog = ({ open, onOpenChange, asset }: LicenseDialogProps) => {
  const handlePurchase = () => {
    // TODO: Implement wallet connection and purchase logic
    console.log("Purchasing license for:", asset.title);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>License Asset</DialogTitle>
          <DialogDescription>
            Purchase a license for {asset.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-4">
            <img
              src={asset.image}
              alt={asset.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">{asset.title}</h3>
              <p className="text-sm text-muted-foreground">{asset.creator}</p>
              <Badge>{asset.category}</Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">License Details</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Commercial use allowed</li>
                <li>✓ Unlimited projects</li>
                <li>✓ Perpetual license</li>
                <li>✓ Attribution required</li>
              </ul>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">License Price</p>
                <p className="text-2xl font-bold gradient-text">{asset.price}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {asset.licenses} licenses already sold
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" onClick={handlePurchase}>
            Purchase License
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
