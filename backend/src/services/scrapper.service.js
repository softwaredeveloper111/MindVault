import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeUrl = async (url) => {
  try {

    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
  },
    });

    
    const $ = cheerio.load(html);

   
    const getMeta = (property, fallback) =>
      $(`meta[property='${property}']`).attr("content") ||
      $(`meta[name='${property}']`).attr("content") ||
      fallback ||
      "";

    const title =
      getMeta("og:title") ||
      $("title").text().trim() ||
      "Untitled";

    const description =
      getMeta("og:description") ||
      getMeta("description") ||
      "";

    const thumbnailUrl =
      getMeta("og:image") ||
      "";

 
    $("script, style, nav, footer, header").remove();
    const extractedText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 5000);
    

    return {
      title,
      description,
      thumbnailUrl,
      extractedText,
    };

  } catch (error) {
    console.error("scrapeUrl failed:", error.message);
    
    return {
      title: "",
      description: "",
      thumbnailUrl: "",
      extractedText: "",
    };
  }
};