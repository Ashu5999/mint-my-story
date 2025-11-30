import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { uploadMedia, uploadMetadata, createMetadata } from '@/utils/ipfs';
import { registerAsset } from '@/utils/story';
import { Loader2 } from 'lucide-react';
import { useAccount, useWalletClient } from 'wagmi';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    description: z.string().min(10, {
        message: 'Description must be at least 10 characters.',
    }),
    image: z.instanceof(FileList).refine((files) => files?.length === 1, 'Image is required.'),
    media: z.instanceof(FileList).refine((files) => files?.length === 1, 'Media file (audio/video) is required.'),
});

export function IPRegistrationForm() {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string>('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    // Helper to calculate SHA-256 hash
    const calculateHash = async (data: string): Promise<string> => {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return `0x${hashHex}`;
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setStatus('Uploading media to IPFS...');
        try {
            // 1. Upload Media
            const imageFile = values.image[0];
            const mediaFile = values.media[0];

            const [imageUri] = await uploadMedia([imageFile]);
            const [mediaUri] = await uploadMedia([mediaFile]);

            setStatus('Creating metadata...');

            // 2. Create IP Metadata
            const ipMetadata = {
                title: values.title,
                description: values.description,
                createdAt: Math.floor(Date.now() / 1000).toString(),
                creators: [], // Add creator info if available
                image: imageUri, // Note: Reference repo uses HTTP URL here, but IPFS URI is standard
                mediaUrl: mediaUri,
                mediaType: mediaFile.type,
            };

            // 3. Create NFT Metadata
            const nftMetadata = {
                name: values.title,
                description: values.description,
                image: imageUri,
                animation_url: mediaUri,
                attributes: [],
            };

            setStatus('Uploading metadata to IPFS...');

            // 4. Upload Metadata
            const ipMetadataUri = await uploadMetadata(ipMetadata);
            const nftMetadataUri = await uploadMetadata(nftMetadata);

            // 5. Calculate Hashes
            const ipMetadataHash = await calculateHash(JSON.stringify(ipMetadata));
            const nftMetadataHash = await calculateHash(JSON.stringify(nftMetadata));

            setStatus('Registering IP Asset on Story Protocol...');

            // 6. Register Asset
            if (!address || !walletClient) {
                throw new Error('Wallet not connected. Please connect your wallet.');
            }

            const result = await registerAsset(
                walletClient,
                address,
                ipMetadataUri,
                nftMetadataUri,
                ipMetadataHash,
                nftMetadataHash
            );

            if (result.success === true) {
                toast.success('IP Asset Registered Successfully!');
                console.log('Registered:', result.data);
            } else {
                // TypeScript knows result is { success: false; error: StoryError } here
                throw new Error(result.error.message);
            }


        } catch (error) {
            console.error('Registration failed:', error);
            toast.error(error instanceof Error ? error.message : 'Registration failed');
        } finally {
            setIsLoading(false);
            setStatus('');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md mx-auto p-6 border rounded-lg shadow-sm">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="My Creative Work" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe your work..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                            <FormLabel>Cover Image</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...rest}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="media"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                            <FormLabel>Media File (Audio/Video)</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="audio/*,video/*"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...rest}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {status}
                        </>
                    ) : (
                        'Register IP Asset'
                    )}
                </Button>
            </form>
        </Form>
    );
}
