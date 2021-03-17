import axios from "axios";
import SocksProxyAgent from "socks-proxy-agent";
import config from "../config";
const agents = config.proxies.map((proxy) => new SocksProxyAgent(proxy));

export default async (options) => {
  const agent = config.use_proxy
    ? agents[Math.floor(Math.random() * agents.length)]
    : undefined;
  const response = await axios(
    Object.assign(options, {
      httpsAgent: agent,
      httpAgent: agent,
    })
  );

  return response;
}
