import { Channel } from './Channel'
import { Connection, Data } from './Connection'

const connection = new Connection()
connection.open()

export const connect = (
    name: string,
    subscription: Object,
    handler: (data: Data) => void,
) => {
    const channel = new Channel(name, subscription, handler)
    connection.attach(channel)

    return () => connection.detach(channel)
}
