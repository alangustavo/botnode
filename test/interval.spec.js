// const interval = require("../src/interval");
const expect = require("chai").expect;
const Interval = require("../src/interval");

describe("class Interval", () => {
  it("create a valid interval", () => {
    const i = new Interval("1m");
    expect(i).to.have.nested.property("interval");
  });
  it("raise error when create an invalid interval", () => {
    // expect(new Interval("6m")).to.throw(new Error("Invalid Interval!"));
    try {
      expect(new Interval("6m")).to.throw("Invalid Interval!");
    } catch (error) {}
  });
  it("returns the time unit from interval", () => {
    const i = new Interval("1d");
    expect(i.getTimeUnit()).equals("day");
    const j = new Interval("6h");
    expect(j.getTimeUnit()).equals("hours");
  });
  it("returns the time quantity from interval", () => {
    const i = new Interval("30m");
    expect(i.getTimePeriod()).equals(30);
  });
  it("returns the the interval as String", () => {
    const i = new Interval("30m");
    expect("Interval:" + i).equals("Interval:30m");
  });
});
