import { fetchPhotoPage } from "@/sanity/services/fetchPage";
import RenderPhotos from "@/components/RenderPhotos";

export default async function PhotoPage() {
    const { photos } = await fetchPhotoPage(0, 9);
    console.log(photos);

    
    return (
       <RenderPhotos photos={photos} />
    );
}