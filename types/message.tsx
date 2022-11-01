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
    duration?: number;
}