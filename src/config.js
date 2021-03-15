import dotenv from "dotenv";
dotenv.config();

export default {
  salt: process.env.SALT,
  translation_api: process.env.TRANSLATION_API,
  discord_token: process.env.DISCORD_TOKEN,
  sentry_dsn: process.env.SENTRY_DSN,
  witai_token_en: process.env.WITAI_TOKEN_EN,
  witai_token_de: process.env.WITAI_TOKEN_DE,
  witai_token_zh: process.env.WITAI_TOKEN_ZH,
  use_proxy: true,
  eve_market_api: "https://api.eve-echoes-market.com",
  proxies: [
    "socks5h://tor0:9050",
    "socks5h://tor1:9050",
    "socks5h://tor2:9050",
    "socks5h://tor3:9050",
    "socks5h://tor4:9050",
    "socks5h://tor5:9050",
    "socks5h://tor6:9050",
    "socks5h://tor7:9050",
    "socks5h://tor8:9050",
    "socks5h://tor9:9050",
  ],
  command_prefix: "!",
};
