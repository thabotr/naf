import React from 'react';
import {ImageViewContextType, Image} from '../types/images';

export const ImageViewContext = React.createContext<ImageViewContextType|null>(null);

export const ImageViewProvider = ({children}:{children: React.ReactNode}) => {
    const [images, setImages] = React.useState<Image[]>([]);
    const [onView, setOnView] = React.useState(false);
    const [sender, setSender] = React.useState(true);

    const saveImages = (images: Image[]) => setImages(images);
    const onViewOff = ()=> setOnView(false);
    const onViewOn = ()=> setOnView(true);
    const saveSender = (b: boolean) => setSender(b);

    return <ImageViewContext.Provider value={{sender, saveSender, images, saveImages, onView, onViewOn, onViewOff}}>
        {children}
    </ImageViewContext.Provider>
}