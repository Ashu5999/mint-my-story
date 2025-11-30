import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { IPRegistrationForm } from "@/components/IPRegistrationForm";

const CreateIP = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Register Your IP</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Upload your creative work and register it as an IP Asset on the Story Protocol.
                    </p>
                </div>
                <IPRegistrationForm />
            </div>
            <Footer />
        </div>
    );
};

export default CreateIP;
