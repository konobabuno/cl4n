import { stegaClean } from "next-sanity";

const ROW_COLS = 12;
const VERTICAL_COLS = 4;

export type GalleryItemLayout = "vertical" | "paired" | "full";

type GalleryOrientationItem = {
    verticalOrHorizontal?: string;
};

/** Simulates a 12-col row: vertical = 4; horizontal pairs (8) only when a vertical left 8 cols free. */
export function getGalleryItemLayouts(
    gallery: GalleryOrientationItem[] | undefined,
): GalleryItemLayout[] {
    if (!gallery?.length) return [];

    const layouts: GalleryItemLayout[] = [];
    let rowRemaining = ROW_COLS;

    for (const item of gallery) {
        const orientation = stegaClean(item.verticalOrHorizontal);
        const isVertical = orientation === "vertical";

        if (isVertical) {
            layouts.push("vertical");
            rowRemaining -= VERTICAL_COLS;
            if (rowRemaining <= 0) rowRemaining = ROW_COLS;
        } else if (rowRemaining === ROW_COLS - VERTICAL_COLS) {
            layouts.push("paired");
            rowRemaining = ROW_COLS;
        } else {
            layouts.push("full");
            rowRemaining = ROW_COLS;
        }
    }

    return layouts;
}

const layoutClassName: Record<GalleryItemLayout, string> = {
    vertical: "md:w-6/12 lg:w-4/12",
    paired: "md:w-6/12 lg:w-8/12 delay-anim-md",
    full: "w-full",
};

export function galleryLayoutClassName(layout: GalleryItemLayout): string {
    return layoutClassName[layout];
}

const imageSizes: Record<GalleryItemLayout, string> = {
    vertical:
        "100vw, (min-width: 768px) 50vw, (min-width: 993px) 33vw",
    paired: "100vw, (min-width: 768px) 50vw, (min-width: 993px) 66vw",
    full: "100vw",
};

export function galleryImageSizes(layout: GalleryItemLayout): string {
    return imageSizes[layout];
}
