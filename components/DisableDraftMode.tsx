"use client";

import {
  useDraftModeEnvironment,
  useIsPresentationTool,
} from "next-sanity/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";


export default function DisableDraftMode () {
  const isPresentationTool = useIsPresentationTool();
  const env = useDraftModeEnvironment();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    console.log("isPresentationTool", isPresentationTool);
    if (isPresentationTool === false) {
      const toastId = toast("Draft Mode Enabled", {
        description:
          env === "live"
            ? "Content is live, refreshing automatically"
            : "Refresh manually to see changes",
        duration: Infinity,
        action: {
          label: "Disable",
          onClick: async () => {
            await fetch('/api/draftMode/disable');
            startTransition(() => {
              router.refresh();
            });
          },
        },
      });

      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [env, router, isPresentationTool]);

  useEffect(() => {
    if (pending) {
      const toastId = toast.loading("Disabling draft mode...");
      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [pending]);

  return null;
}
