import { supabase } from "@/integrations/supabase/client";

/**
 * Authenticates a user with Supabase using their wallet address.
 * This is a frontend-only implementation that uses a deterministic email/password
 * derived from the wallet address.
 * 
 * @param address The wallet address to authenticate with
 * @returns The Supabase session
 */
export const authenticateWithWallet = async (address: string) => {
    const email = `${address.toLowerCase()}@mint2story.com`;
    const password = `wallet-auth-${address.toLowerCase()}`;

    try {
        // 1. Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (!signInError && signInData.session) {
            return signInData.session;
        }

        // 2. If sign in fails, try to sign up
        if (signInError && signInError.message.includes("Invalid login credentials")) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        wallet_address: address,
                    },
                },
            });

            if (signUpError) throw signUpError;

            if (signUpData.session) {
                return signUpData.session;
            } else if (signUpData.user) {
                // If auto-confirm is not enabled, we might not get a session immediately.
                // However, for this specific implementation to work smoothly, 
                // "Confirm email" should be disabled or "Enable email confirmations" off in Supabase.
                // Or we can try to sign in again immediately if the server auto-confirms.
                const { data: retrySignInData, error: retrySignInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (retrySignInError) throw retrySignInError;
                return retrySignInData.session;
            }
        }

        throw signInError;
    } catch (error) {
        console.error("Wallet authentication failed:", error);
        throw error;
    }
};
