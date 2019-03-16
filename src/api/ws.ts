import { Connection, Data } from './Connection'


export const connect = (
    channel: string,
    subscription: Object,
    handler: (data: Data) => void,
) => {
    const connection = new Connection(channel, subscription, handler)
    connection.open()

    return connection.close
}
