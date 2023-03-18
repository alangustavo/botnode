require("dotenv").config();
const Interval = require("./src/interval");
const BinanceData = require("./src/binanceData");

const ws = new BinanceData("SOLUSDT", new Interval("1m"), 500);
