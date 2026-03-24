import { scrapeUrl } from "./src/services/scrapper.service.js";
const data = await scrapeUrl('https://dev.to/arthvhannu/building-a-simple-todo-api-with-nodejs-expressjs-and-mongodb-hf1')
console.log(data);