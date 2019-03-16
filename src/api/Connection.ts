// track active connections list as array of (subscription data, socket)
// on maintenance code - close/open all connections +

// methods:
// connect - create new connection, returns disconnect method
// pause/resume - to pause/resume all connections
// every connection listens for heartbeat within 6 seconds
// if no hb - send ping and await pong for a 1 second
// if none - reopen connection
import { ToastsStore as toast } from 'react-toasts'

import { Event } from './Event'
import { EventCode } from './EventCode'

const ENDPOINT = 'wss://api.bitfinex.com/ws/2'
const HEART_BEAT = 'hb'
const INITIAL_HEARTBEAT_TIMEOUT = 20000
const HEARTBEAT_TIMEOUT = 10000
const PING_TIMEOUT = 5000

export type Data = MessageEvent['data']

export class Connection {
    private readonly channel: string
    private readonly subscription: Object
    private readonly handler: (data: Data) => void
    private ws: WebSocket | undefined
    private channelId: number
    private ensureConnectedTimeoutId: NodeJS.Timeout | undefined
    private pingTimeoutId: NodeJS.Timeout | undefined

    constructor(channel: string, subscription: Object, handler: (data: Data) => void) {
        this.channel = channel
        this.subscription = subscription
        this.handler = handler
        this.channelId = 0
    }

    public readonly open = () => {
        const { channel, subscription } = this

        const ws = this.ws = new WebSocket(ENDPOINT)
        ws.onmessage = this.handleMessage
        ws.onopen = () => {
            this.success('Connected')
            ws.send(JSON.stringify({
                event: Event.Subscribe,
                channel,
                ...subscription,
            }))
        }
        this.scheduleConnectionTest(INITIAL_HEARTBEAT_TIMEOUT)
    }

    public readonly close = () => {
        const { channel, subscription } = this
        const ws = this.ws!

        clearTimeout(this.ensureConnectedTimeoutId!)

        ws.send(JSON.stringify({
            event: Event.Unsubscribe,
            channel,
            ...subscription,
        }))
        ws.close()
    }

    private scheduleConnectionTest(timeout: number) {
        console.log(`scheduleConnectionTest in ${timeout}`)
        clearTimeout(this.ensureConnectedTimeoutId!)
        this.ensureConnectedTimeoutId = setTimeout(this.ensureConnected, timeout)
    }

    private readonly ensureConnected = () => {
        console.log('ensureConnected')
        // if this function is called, timeout was not cleaned up, so need to ensure connection is alive yet
        const ws = this.ws!
        ws.send(JSON.stringify({
            event: Event.Ping,
            cid: this.channelId,
        }))

        // set isPinging flag and schedule it's test
        this.warning('ping sent')
        this.pingTimeoutId = setTimeout(
            () => {
                this.error('Ping failed - reconnect')
                this.close()
                this.open()
            },
            PING_TIMEOUT,
        )
    }

    private readonly handleMessage = (event: MessageEvent) => {
        const eventData = JSON.parse(event.data)
        // if eventData is array - it's either data payload or HeartBeat
        if (Array.isArray(eventData)) {
            const data = eventData[1]

            // if HeartBeat - schedule connection test
            if (data === HEART_BEAT)
                this.scheduleConnectionTest(HEARTBEAT_TIMEOUT)
            else
                this.handler(data)

            return
        }

        // otherwise it's system event
        switch (eventData.event) {
            case Event.Error:
                this.handleErrorEvent(eventData)
                break
            case Event.Info:
                this.handleInfoEvent(eventData)
                break
            case Event.Subscribed:
                this.success(`subscribed to ${eventData.chanId}`)
                this.channelId = eventData.chanId
                break
            case Event.Pong:
                this.success('pong')
                clearTimeout(this.pingTimeoutId!)
                break
            default:
                this.warning(eventData)
                break
        }
    }

    private handleInfoEvent(data: Data) {
        switch (data.code) {
            case EventCode.Reconnect:
                this.info('Reconnect, because requested')
                this.close()
                this.open()
                break
            case EventCode.MaintenanceBegin:
                this.info('Stop due to maintenance')
                break
            case EventCode.MaintenanceEnd:
                this.info('Open as maintenance finished')
                break
            default:
                this.info(JSON.stringify(data))
                break
        }
    }

    private handleErrorEvent(data: Data) {
        this.error(data)
    }


    private error = (msg: unknown) => toast.error(this.message(msg))

    private warning = (msg: unknown) => toast.warning(this.message(msg))

    private info = (msg: unknown) => toast.info(this.message(msg))

    private success = (msg: unknown) => toast.success(this.message(msg))

    private message(msg: unknown) {
        const { channel, subscription } = this

        return `${channel} (${JSON.stringify(subscription)}): ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`
    }
}
