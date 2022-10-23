export type Image = {
    uri: string
}

export type ImageViewContextType {
    images: Image[];
    saveImages: (images: Image[])=>void;
    onView: boolean;
    onViewOn: ()=>void;
    onViewOff: ()=>void;
}