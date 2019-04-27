import Scraper from "../lib/Scraper";
import * as cheerio from "cheerio";

const airBnbURL =
  "https://www.airbnb.com/rooms/28299515?location=London%2C%20United%20Kingdom&adults=1&toddlers=0&guests=1&check_in=2019-04-26&check_out=2019-04-30&s=-xq9rVl0";

const defaultSelectors = {
  title: "#room #summary h1 > span",
  location: "div[data-location] > a > div",
  description: "#summary + div > div > div > div",
  amenities: "#room #amenities td > div",
  images: "#room meta[itemprop=image] + div div > img:nth-child(2)"
};

describe("Test Scraper module", () => {
  it("gets the URL", () => {
    const scraper = new Scraper(airBnbURL);
    expect(scraper.getUrl()).toEqual(airBnbURL);
  });

  it("sets a new URL", () => {
    const scraper = new Scraper(airBnbURL);
    scraper.setUrl("http://urlhaschanged.com");
    expect(scraper.getUrl()).toEqual("http://urlhaschanged.com");
  });

  it("gets the default selectors", () => {
    const scraper = new Scraper(airBnbURL);
    expect(scraper.getSelectors()).toMatchObject(defaultSelectors);
  });

  it("sets new selectors", () => {
    const scraper = new Scraper(airBnbURL);
    const newSelectors = {
      title: "new selector",
      location: "new selector",
      description: "new selector",
      amenities: "new selector",
      images: "new selector"
    };
    scraper.setSelectors(newSelectors);
    expect(scraper.getSelectors()).toMatchObject(newSelectors);
  });

  it("fetchHTML() fails with blank URL", async () => {
    expect.assertions(1);
    const scraper = new Scraper("");

    try {
      await scraper.fetchHTML();
    } catch (e) {
      expect(e.toString()).toEqual(
        "Error: Error: Protocol error (Page.navigate): Cannot navigate to invalid URL"
      );
    }
  });

  it("fetchHTML() fetches the HTML of an AirBnb page", async () => {
    expect.assertions(1);
    const scraper = new Scraper(airBnbURL);
    try {
      const html = await scraper.fetchHTML();
      const $ = cheerio.load(html);
      const meta = $("meta[property='og:site_name']").attr("content");
      expect(meta).toEqual("Airbnb");
    } catch (e) {
      throw e;
    }
  }, 30000);

  it("scrapeHTML() scrapes the HTML of an AirBnb page", async () => {
    expect.assertions(5);
    const scraper = new Scraper(airBnbURL);
    try {
      const result = await scraper.scrapeHTML();
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("location", "Greater London");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("amenities");
      expect(result).toHaveProperty("images");
    } catch (e) {
      throw e;
    }
  }, 30000);
});
