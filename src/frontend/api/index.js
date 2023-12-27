// import { Web3Storage } from "web3.storage";
import { create } from '@web3-storage/w3up-client'

export async function makeConnectToStorageClient() {
  try {
    const client = await create();
    await client.login(process.env.REACT_APP_WEB3_STORAGE_LOGIN_MAIL);
    await client.setCurrentSpace(process.env.REACT_APP_WEB3_STORAGE_SPACE_KEY);

    return client;
  }
  catch (e) {
    console.log(e);
  }
  // return new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_API_KEY });
}

function createJsonFile(filename, obj) {
  return new File([JSON.stringify(obj)], filename);
}

export function makeGatewayURL(cid, path = '') {
  return `https://${cid}.ipfs.w3s.link/${path}`;
}

export function getCID(url) {
  const regx = /(https:\/\/)(\w+)(.ipfs.w3s.link)/;
  const match = url.match(regx);
  return match ? match[2] : "";
}

export async function storeFileAndMetadata(file, nftInfo) {
  // const uploadName = ["btl", nftInfo.name, new Date().toString()].join("-");
  const fileNameEncode = encodeURIComponent(file.name);
  const client = await makeConnectToStorageClient();

  const metadataFile = createJsonFile("metadata.json", {
    ...nftInfo,
    path: fileNameEncode,
  });
  const cid = await client.uploadDirectory([file, metadataFile]);

  const directoryGatewayURI = makeGatewayURL(cid);
  const metadataGatewayURI = makeGatewayURL(cid, "metadata.json");
  const audioGatewayURI = makeGatewayURL(cid, file.name);
  const audioURI = `ipfs://${cid}/${fileNameEncode}`;
  const metadataURI = `ipfs://${cid}/metadata.json`;

  return {
    cid,
    metadataURI,
    metadataGatewayURI,
    audioURI,
    audioGatewayURI,
    directoryGatewayURI
  };
}

