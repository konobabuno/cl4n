import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { Toaster } from "sonner";
import DisableDraftMode from "@/components/DisableDraftMode";

export default async function FrontendLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isEnabled: isDraftMode } = await draftMode();
    return (
        <>
            {children}
            <Toaster />
            {isDraftMode && (
                <>
                    <DisableDraftMode />
                    <VisualEditing />
                </>
            )}
            <SanityLive />
        </>
    );
}
