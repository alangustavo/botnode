const { default: axios } = require("axios");
const WebSocket = require("ws");

class binanceData {
  /**
   *
   * @param {string} symbol BASE/QUOTE
   * @param {*} interval
   * @param {*} length
   */
  constructor(symbol, interval, length = 500) {
    this.symbol = symbol;
    this.interval = interval;
    this.length = length;
    this.observers = [];
    this.openTimes = [];
    this.opens = [];
    this.highs = [];
    this.lows = [];
    this.closes = [];
    this.volumes = [];
    this.closeTimes = [];
    this.quoteAssets = [];
    this.trades = [];
    this.buyBases = [];
    this.buyQuotes = [];
    this.loadHistoricalData();
  }
  subscribe(observer) {
    this.observers.push(observer);
    observer.notify(this.data);
  }

  async loadHistoricalData() {
    this.openTimes = [];
    this.opens = [];
    this.highs = [];
    this.lows = [];
    this.closes = [];
    this.volumes = [];
    this.closeTimes = [];
    this.quoteAssets = [];
    this.trades = [];
    this.buyBases = [];
    this.buyQuotes = [];
    const url =
      process.env.API_URL +
      "/v3/klines?symbol=" +
      this.symbol.toUpperCase() +
      "&interval=" +
      this.interval +
      "&limit=" +
      this.length;

    this.klines = await axios.get(url);
    this._addKlines(this.klines);
    this.wsRegister();
  }
  /**
 * 
 * @param {Array} klines 
 * 
 * klines is an array with this structure
 * [
 *   [
 *     1499040000000,      // 0 - Kline open time
 *     "0.01634790",       // 1 - Open price
 *     "0.80000000",       // 2 - High price
 *     "0.01575800",       // 3 - Low price
 *     "0.01577100",       // 4 - Close price
 *     "148976.11427815",  // 5 - Volume
 *     1499644799999,      // 6 - Kline Close time
 *     "2434.19055334",    // 7 - Quote asset volume
 *     308,                // 8 - Number of trades
 *     "1756.87402397",    // 9 - Taker buy base asset volume
 *     "28.46694368",      // 10 - Taker buy quote asset volume
 *     "0"                 // 11 - Unused field, ignore.
 *   ]
 * ]
     
 */
  _addKlines(klines) {
    this.openTimes = klines.data.map((openTime) => new Date(openTime[0]));
    this.opens = klines.data.map((open) => parseFloat(open[1]));
    this.highs = klines.data.map((high) => parseFloat(high[2]));
    this.lows = klines.data.map((low) => parseFloat(low[3]));
    this.closes = klines.data.map((close) => parseFloat(close[4]));
    this.volumes = klines.data.map((volume) => parseFloat(volume[5]));
    this.closeTimes = klines.data.map((closeTime) => new Date(closeTime[6]));
    this.quoteAssets = klines.data.map((quoteAsset) =>
      parseFloat(quoteAsset[7])
    );
    this.trades = klines.data.map((trade) => parseInt(trade[8]));
    this.buyBases = klines.data.map((buyBase) => parseFloat(buyBase[8]));
    this.buyQuotes = klines.data.map((buyQuote) => parseFloat(buyQuote[9]));
  }

  /**
   * {
   *   "e": "kline",         // Event type
   *   "E": 1672515782136,   // Event time
   *   "s": "BNBBTC",        // Symbol
   *   "k": {
   *     "t": 1672515780000, // Kline start time
   *     "T": 1672515839999, // Kline close time
   *     "s": "BNBBTC",      // Symbol
   *     "i": "1m",          // Interval
   *     "f": 100,           // First trade ID
   *     "L": 200,           // Last trade ID
   *     "o": "0.0010",      // Open price
   *     "c": "0.0020",      // Close price
   *     "h": "0.0025",      // High price
   *     "l": "0.0015",      // Low price
   *     "v": "1000",        // Base asset volume
   *     "n": 100,           // Number of trades
   *     "x": false,         // Is this kline closed?
   *     "q": "1.0000",      // Quote asset volume
   *     "V": "500",         // Taker buy base asset volume
   *     "Q": "0.500",       // Taker buy quote asset volume
   *     "B": "123456"       // Ignore
   *   }
   * }
   */
  async wsRegister() {
    const url = `${process.env.STREAM_URL}/${this.symbol.toLowerCase()}@kline_${
      this.interval
    }`;
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const obj = JSON.parse(event.data);
      if (obj.k.x && this.openTimes.length == this.length) {
        this.openTimes.push(obj.k.t); // "t": 1672515780000, // Kline start time
        this.openTimes.shift();

        this.opens.push(obj.k.o); // "o": "0.0010",      // Open price
        this.opens.shift();

        this.highs.push(obj.k.h); // "h": "0.0025",      // High price
        this.highs.shift();

        this.lows.push(obj.k.l); // "l": "0.0015",      // Low price
        this.lows.shift();

        this.closes.push(obj.k.c); // "c": "0.0020",      // Close price
        this.closes.shift();

        this.volumes.push(obj.k.v); // "v": "1000",        // Base asset volume BASE/QUOTE
        this.volumes.shift();

        this.closeTimes.push(obj.k.T); // "T": 1672515839999, // Kline close time
        this.closeTimes.shift();

        this.quoteAssets.push(obj.k.q); // "q": "1.0000",      // Quote asset volume BASE/QUOTE
        this.quoteAssets.shift();

        this.trades.push(obj.k.n); // "n": 100,           // Number of trades
        this.trades.shift();

        this.buyBases.push(obj.k.V); // "V": "500",         // Taker buy base asset volume BASE/QUOTE
        this.buyBases.shift();

        this.buyQuotes.push(obj.k.Q); // "Q": "0.500",       // Taker buy quote asset volume BASE/QUOTE
        this.buyQuotes.shift();
        console.log(
          this.closeTimes.length,
          this.closes[this.closes.length - 1]
        );
      }
    };
  }
}

module.exports = binanceData;
