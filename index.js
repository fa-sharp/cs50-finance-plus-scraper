import puppeteer from "puppeteer";

const { MY_USER, MY_PASS } = process.env;
if (!MY_USER || !MY_PASS) throw new Error("No username/password found!");

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
page.setDefaultTimeout(5_000);

await page.goto("https://cs50-finance-plus.fly.dev/");

const usernameField = await page.waitForSelector("input[name=username]");
const passwordField = await page.waitForSelector("input[name=password]");
const loginButton = await page.waitForSelector("button[type=submit]");

console.debug("Logging in...");
await usernameField?.type(MY_USER, { delay: 100 });
await passwordField?.type(MY_PASS, { delay: 100 });
await loginButton?.click();

await page.waitForNavigation({ timeout: 10_000 });

const marketValueCell = await page.waitForSelector(
  "table tbody>tr:last-child>td:nth-child(7)"
);
const marketValue = await marketValueCell?.evaluate((el) =>
  el.textContent.trim()
);

console.log("Current market value: ", marketValue);

console.debug("Logging out...");
await page.goto("https://cs50-finance-plus.fly.dev/logout");

await browser.close();
