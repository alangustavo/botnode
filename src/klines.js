// # download a single file
// curl -s "https://data.binance.vision/data/spot/monthly/klines/ADABKRW/1h/ADABKRW-1h-2020-08.zip" -o ADABKRW-1h-2020-08.zip
// wget "https://data.binance.vision/data/spot/monthly/klines/ADABKRW/1h/ADABKRW-1h-2020-08.zip"
//

class Klines {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.opensTime = [];
    this.opens = [];
    this.highs = [];
    this.lows = [];
    this.closes = [];
    this.volumes = [];
    this.trades = [];
    this.closesTime = [];
    dataSource.subscrybe(this);
  }

  async getLastKlines() {
    const url =
      process.env.API_URL +
      "/v3/klines?symbol=" +
      this.symbol.toUpperCase() +
      "&interval=" +
      this.interval +
      "&limit=" +
      this.lenght;
    var klines = await axios.get(url);
  }
}

async function dowloadFile(url, destination) {}

module.exports = Klines;
