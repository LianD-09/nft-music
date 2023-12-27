import Identicon from "identicon.js";
import { getCID, makeGatewayURL } from "./api";

export async function getTokenInfo(token, contract) {
  try {
    const [tokenId, seller, price, resell] = token;
    const uri = await contract.tokenURI(tokenId);
    const response = await fetch(uri + "/metadata.json");
    const metadata = await response.json();
    const identicon = `data:image/png;base64,${new Identicon(
      metadata.name + metadata.price + new Date().toString(),
      330
    ).toString()}`;
    const cid = getCID(uri);
    const audio = makeGatewayURL(cid, metadata.path);

    return {
      price,
      resell,
      tokenId,
      seller,
      description: metadata.description,
      artist: metadata.artist,
      name: metadata.name,
      audio,
      identicon,
    };
  } catch (e) {
    console.log(e);
  }
}