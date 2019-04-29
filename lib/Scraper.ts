import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import * as download from "download";
const fs = require("fs").promises;

interface ScrapeSelectors {
  title?: string;
  location?: string;
  description?: string;
  amenities?: string;
  images?: string;
}

export default class Scraper {
  private selectors: ScrapeSelectors;
  private defaultSelectors: ScrapeSelectors = {
    title: "#room #summary h1 > span",
    location: "div[data-location] > a > div",
    description: "#summary + div > div > div > div",
    amenities: "#room #amenities td > div",
    images: "#room meta[itemprop=image] + div div > img:nth-child(2)"
  };

  constructor(private url: string, scrapeSelectors?: ScrapeSelectors) {
    this.selectors = scrapeSelectors
      ? { ...this.defaultSelectors, ...scrapeSelectors }
      : { ...this.defaultSelectors };
  }

  getUrl() {
    return this.url;
  }

  setUrl(url: string) {
    this.url = url;
  }

  getSelectors() {
    return this.selectors;
  }

  setSelectors(selectors: ScrapeSelectors) {
    this.selectors = { ...this.defaultSelectors, ...selectors };
  }

  static async saveImagesToDisk(imagesArray: string[], path: string) {
    try {
      await Promise.all(imagesArray.map(image => download(image, path))).then(
        () => {
          console.log("Files downloaded!");
        }
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  static async saveTextToDisk(text: string, path: string) {
    try {
      await fs.writeFile(path, text);
    } catch (e) {
      throw new Error(e);
    }
  }

  async fetchHTML(waitForSelector: string = "#book_it_form") {
    let browser;
    try {
      browser = await puppeteer.launch();
      const page = await browser.newPage();
      page.setViewport({ width: 1280, height: 800 });
      await page.goto(this.url);
      await page.waitForSelector(waitForSelector, { visible: true });
      const content = await page.content();
      await browser.close();
      return content;
    } catch (e) {
      if (browser) {
        await browser.close();
      }
      throw new Error(e);
    }
  }

  async scrapeHTML() {
    try {
      const html = await this.fetchHTML();
      const $ = cheerio.load(html);
      const title = $(this.selectors.title).text();
      const location = $(this.selectors.location).text();
      const description: string[] = [];

      $(this.selectors.description).each(function(i, elem) {
        description[i] = $(elem).text();
      });

      const amenities: string[] = [];
      $(this.selectors.amenities).each(function(i, elem) {
        amenities[i] = $(elem).text();
      });

      const images: string[] = [];
      $(this.selectors.images).each(function(i, elem) {
        images[i] = $(elem).attr("src");
      });

      return { title, location, description, amenities, images };
    } catch (e) {
      throw new Error(e);
    }
  }
}
