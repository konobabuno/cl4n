export const PHOTO_SERVICE_SLUGS = ['fotografia', 'photography'] as const;

export function serviceReferenceFilter() {
    return PHOTO_SERVICE_SLUGS.map((slug) => `slug.current != "photo"`).join(' && ');
}

export function serviceTitleToSlug(title: string) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
}
