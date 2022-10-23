import React from 'react';
import {ImageViewContextType, Image} from '../types/images';

export const ImageViewContext = React.createContext<ImageViewContextType|null>(null);

export const ImageViewProvider = ({children}:{children: React.ReactNode}) => {
    const [images, setImages] = React.useState<Image[]>([]);
    const [onView, setOnView] = React.useState(false);

    const saveImages = (images: Image[]) => setImages(images);
    const onViewOff = ()=> setOnView(false);
    const onViewOn = ()=> setOnView(true);

    return <ImageViewContext.Provider value={{images, saveImages, onView, onViewOn, onViewOff}}>
        {children}
    </ImageViewContext.Provider>
}