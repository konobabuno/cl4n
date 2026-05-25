"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default function RandomLogo({ logos }: { logos: Image[] }) {
  const pathname = usePathname();
  const [i, setI] = useState(0);
  const prevPathRef = useRef<string | null>(null);

  const STORAGE_KEY = "footerLogoIndex";

  const readStorage = (key: string) => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const writeStorage = (key: string, value: string) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
    }
  };

  useEffect(() => {
    if (!logos?.length) return;
    const raw = readStorage(STORAGE_KEY);
    if (raw){
      setI(raw ? Number.parseInt(raw, 10) : 0);
      writeStorage(STORAGE_KEY, String((Number.parseInt(raw, 10) + 1) % logos.length));
    } else {
      writeStorage(STORAGE_KEY, "1");
    }

   
  }, [pathname, logos?.length]);

  const logo = logos?.[i];
  if (!logo) return null;
  return (
    <Image
      src={urlFor(logo).format("webp").url()}
      alt={logo.alt || "Footer Logo"}
      quality={90}
      width={logo.asset.metadata.dimensions.width}
      height={logo.asset.metadata.dimensions.height}
      sizes="(max-width: 768px) 100vw, 33vw"
      loading="lazy"
      className="w-full h-auto"
    />
  );
}
