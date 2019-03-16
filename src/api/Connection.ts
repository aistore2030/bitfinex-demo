import { isMatch } from 'lodash'
import { ToastsStore as toast } from 'react-toasts'

import { Channel } from './Channel'
import { Event } from './Event'
import { EventCode } from './EventCode'

const ENDPOINT = 'wss://api.bitfinex.com/ws/2'
const HEART_BEAT = 'hb'
const INITIAL_HEARTBEAT_TIMEOUT = 20000
const HEARTBEAT_TIMEOUT = 10000
const PING_TIMEOUT = 5000
const MSG_LIFETIME = 3000

export type Data = MessageEvent['data']

export class Connection {
    private ws: WebSocket | undefined
    private channels: Channel[] = []
    private ensureConnectedTimeoutId: NodeJS.Timeout | undefined
    private pingTimeoutId: NodeJS.Timeout | undefined

    public readonly open = () => {
        const ws = this.ws = new WebSocket(ENDPOINT)
        ws.onmessage = this.handleMessage
        ws.onopen = () => {
            this.success('Connected')
            this.channels.forEach(channel => ws.send(JSON.stringify({
                event: Event.Subscribe,
                channel: channel.name,
                ...channel.subscription,
            })))
        }

        this.scheduleConnectionTest(INITIAL_HEARTBEAT_TIMEOUT)
    }

    public readonly close = () => {
        const ws = this.ws!

        clearTimeout(this.ensureConnectedTimeoutId!)

        this.channels.forEach(channel => ws.send(JSON.stringify({
            event: Event.Unsubscribe,
            chanId: channel.id,
        })))

        ws.close()
    }

    public readonly attach = (channel: Channel) => {
        const ws = this.ws!

        this.channels.push(channel)

        if (ws.readyState === WebSocket.OPEN)
            ws.send(JSON.stringify({
                event: Event.Subscribe,
                channel: channel.name,
                ...channel.subscription,
            }))
    }

    public readonly detach = (channel: Channel) => {
        const ws = this.ws!

        const index = this.channels.indexOf(channel)
        if (index < 0)
            return

        this.channels.splice(index, 1)

        if (ws.readyState === WebSocket.OPEN)
            ws.send(JSON.stringify({
                event: Event.Unsubscribe,
                chanId: channel.id,
            }))
    }

    public readonly detachAll = () => this.channels.forEach(this.detach)

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
            cid: this.channels,
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
            const [ch, data] = eventData

            // if HeartBeat - schedule connection test
            if (data === HEART_BEAT)
                this.scheduleConnectionTest(HEARTBEAT_TIMEOUT)
            else {
                const channel = this.channels.find(c => c.id === ch)
                if (channel)
                    channel.handle(data)
            }

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
                const channel = this.channels.find(c => isMatch(eventData, c.subscription))
                if (channel) {
                    channel.id = eventData.chanId
                    this.success(`subscribed to ${eventData.chanId}`)
                }
                else
                    this.warning(`subscribed to unknown channel ${eventData.chanId}`)
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


    private error = (msg: unknown) => toast.error(this.message(msg), MSG_LIFETIME)

    private warning = (msg: unknown) => toast.warning(this.message(msg), MSG_LIFETIME)

    private info = (msg: unknown) => toast.info(this.message(msg), MSG_LIFETIME)

    private success = (msg: unknown) => toast.success(this.message(msg), MSG_LIFETIME)

    private message(msg: unknown) {
        return `Socket: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`
    }
}
