export class MediaType {
    id: string,
}

export class MessageType {
    id: string,
    text: string | null,
    sender: string,
    recipients: string[],
    media: MediaType[]
}

export class Link {
    id: string,
    nextIds: []string,
    prevIds: []string
}

export class MessageThread {
    id: string,
    title: string,
    messageLinks: Link[]
}