export type MediaType = {
    id: string,
}

export type MessageType = {
    id: string,
    text: string | null,
    sender: string,
    recipients: string[],
    media: MediaType[]
}

export type Link = {
    id: string,
    nextIds: string[],
    prevIds: string[]
}

export type MessageThread = {
    id: string,
    title: string,
    messageLinks: Link[]
}

export type MessageFile = {
    size?: number;
    name?: string;
    type: string;
    uri: string;
    thumbnailUrl?: string;
    duration?: number;
}