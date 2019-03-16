const url = (path: string, query?: Record<string, string>) => {
    const baseUrl = new URL(`https://api-pub.bitfinex.com/v2/${path}`)

    for (const [key, value] of new URLSearchParams(query))
        baseUrl.searchParams.set(key, value)

    return baseUrl.toString()
}


export const loadSymbols = () => Promise.resolve(['btcusdt', 'ltcusdt'])

export const loadTicker = async (symbol: string) => {
    const ticker = await fetch(url('tickers', { symbols: symbol })).then(r => r.text())

    console.log(ticker)
}
