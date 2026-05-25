type LocalePage = "en" | "es";

type Section = {
    _type: string;
    _key: string;
};

interface Asset {
    _id: string;
    metadata: {
        dimensions: {
            width: number;
            height: number;
            aspectRatio: number;
        };
        blurHash: string;
    };
}

type Image = {
    _key: string;
    alt: string;
    asset: Asset;
    hotspot?: { x: number; y: number; height: number; width: number };
};

type Translation = {
    type: string;
    en: {
        slug: string;
    };
    es: {
        slug: string;
    };
};

type InternalLink = {
    _type: string;
    slug: string;
    language: string;
};

type Link = {
    _type?: "link";
    _key?: string;
    linkType: string;
    href?: string;
    label?: string;
    page?: InternalLink;
    inNewTab?: boolean;
    children: React.ReactNode;
    className?: string;
    onClickAction?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

type SeoMetadata = {
    metaTitle: string;
    metaDescription?: string;
    ogImage?: Image;
    noIndex: boolean;
    language: LocalePage;
};

type Page = {
    readonly _type: "page";
    title?: string;
    slug?: { current: string };
    sections?: Section[];
    metadata?: SeoMetadata;
};

type Home = {
    readonly _type: "home";
    metadata?: SeoMetadata;
    sections?: Section[];
};

type Project = {
    readonly _type: "project";
    metadata?: SeoMetadata;
    title?: string;
    slug?: { current: string };
    videoUrl?: string;
    team?: string;
    timeOfProject?: string;
    services?: { _id: string; title: string }[];
    sections?: Section[];
    gallery?: {
        _key: string;
        image: Image;
        videoUrl?: string;
        verticalOrHorizontal?: "vertical" | "horizontal";
    }[];
};

type Color = {
    label: string;
    value: string;
};

type ProjectPost = {
    _id: string;
    title: string;
    slug: { current: string };
    services: { title: string }[];
    thumbnail: Image;
    videoPreview: string;
    language: string;
}
