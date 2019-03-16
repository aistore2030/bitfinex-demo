export type Data = MessageEvent['data']

export class Channel {
    public id: number = 0
    public readonly name: string
    public readonly subscription: Object
    public readonly handle: (data: Data) => void

    constructor(name: string, subscription: Object, handler: (data: Data) => void) {
        this.name = name
        this.subscription = subscription
        this.handle = handler
    }
}
