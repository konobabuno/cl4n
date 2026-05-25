'use client'

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { blurHashToDataURL } from "@/lib/blurhashDataURL";
import { urlFor } from "@/sanity/lib/image";

interface ImageWithBlurProps {
    image: Image;
    sizes?: string;
    loading?: "lazy" | "eager";
    optionalAlt: string;
    classContainer?: string;
    classImg?: string;
    noBlur?: boolean;
}

export default function ImageComponent({ ...props  }: ImageWithBlurProps ) {
    const { image, sizes, loading, optionalAlt, classContainer = '', classImg = '', noBlur = false } = props;
    const width = image.asset.metadata.dimensions.width;
    const height = image.asset.metadata.dimensions.height;
    const blurhash = image.asset.metadata.blurHash;
    const base64Image = blurHashToDataURL(blurhash);

    const imgRef = useRef<HTMLImageElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleLoaded = () => {
        setIsLoaded(true);
    };

    useEffect(() => {
        if (imgRef.current?.complete) setIsLoaded(true);
    }, []);

    const pictureStyle = isLoaded
        ? undefined
        : noBlur
            ? { backgroundColor: '#195F54' }
            : { backgroundImage: `url(${base64Image})` };

    return (
        image.asset ? (
            <picture
                className={`relative w-full bg-cover bg-no-repeat block ${classContainer} `}
                style={pictureStyle}
            >
                <Image
                    ref={imgRef}
                    src={urlFor(image).width(2880).fit("max").format("webp").url()}
                    width={width}
                    height={height}
                    sizes={sizes}
                    alt={image.alt || optionalAlt}
                    loading={loading || "lazy"}
                    quality={90}
                    className={`w-full h-auto transition-opacity ${isLoaded ? '' : 'opacity-0'} ${classImg}`}
                    style={image.hotspot ? {
                        objectPosition: `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`,
                        objectFit: 'cover'
                    } : undefined}
                    onLoad={handleLoaded}
                />
            </picture>
        ) : null
    );
}