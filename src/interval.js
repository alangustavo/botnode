class Interval {
  /**
   * A valid Binance Interval Like
   * 1s, 1m, 3m, 5m, 15m, 30m, 1h,2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
   * @param {string} interval
   */
  constructor(interval) {
    if (this.validInterval(interval)) {
      this.interval = interval;
    } else {
      throw new Error("Invalid Interval!");
    }
  }
  toString() {
    return this.interval;
  }
  getTimePeriod() {
    return parseInt(this.interval);
  }

  /**
   * Returns second, minute, hour, day, week or month
   * @returns string
   */
  getTimeUnit() {
    const unit = this.interval.slice(-1);
    let u = "";
    switch (unit) {
      case "s":
        u = "second";
        break;
      case "m":
        u = "minute";
        break;
      case "h":
        u = "hour";
        break;
      case "d":
        u = "day";
        break;
      case "w":
        u = "week";
        break;
      case "M":
        u = "month";
        break;
      default:
        throw new Error("Invalid Interval Time Unit");
    }
    if (this.getTimePeriod() > 1) {
      u += "s";
    }
    return u;
  }

  /**
   * Returns True if is a valid Interval
   * 1s, 1m, 3m, 5m, 15m, 30m, 1h,2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
   * @param {string} interval
   */
  validInterval(interval) {
    const validInterval = [
      "1s",
      "1m",
      "3m",
      "5m",
      "15m",
      "30m",
      "1h",
      "2h",
      "4h",
      "6h",
      "8h",
      "12h",
      "1d",
      "3d",
      "1w",
      "1M",
    ];
    return validInterval.includes(interval);
  }
}
module.exports = Interval;
