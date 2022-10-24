export type Image = {
    uri: string
}

export type ImageViewContextType = {
    sender: boolean;
    saveSender: (b:boolean) => void;
    images: Image[];
    saveImages: (images: Image[])=>void;
    onView: boolean;
    onViewOn: ()=>void;
    onViewOff: ()=>void;
}