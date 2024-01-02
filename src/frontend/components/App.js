import { Link, BrowserRouter, Routes, Route } from "react-router-dom";

import { Spinner, Navbar, Nav, Button, Container, Row } from "react-bootstrap";
import Home from "./Home.js";
import MyTokens from "./MyTokens.js";
import MyResales from "./MyResales.js";
import "./App.css";

import { createContext, useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import MusicNFTMarketplaceContract from "../contractsData/Marketplace.json";
import ListNFT from "./ListNFT";
import Setting from "./Setting.js";
import NotifyMessageGlobal from "./Notify/NotifyMessageGlobal.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

export const AppContext = createContext({});

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  // const [tab, setTab] = useState(0);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.getAddress(accounts?.[0]);
    setAccount(account);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    loadContract(signer);
  };

  const loadContract = async (signer) => {
    const contract = new ethers.Contract(
      MusicNFTMarketplaceContract.address,
      MusicNFTMarketplaceContract.abi,
      signer
    );

    setContract(contract);
    setLoading(false);
  };

  const checkIsOwner = useCallback(() => {
    return contract.checkIsOwner();
  }, [contract]);

  const checkAccountIsArtist = async () => {
    return await contract.checkArtistExisted(account);
  };

  useEffect(() => {
    connectWallet();
    window.ethereum.on("accountsChanged", async function () {
      await connectWallet();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (account) {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    if (Object.keys(contract).length) {
      checkIsOwner().then(setIsOwner);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  useEffect(() => {
    if (account && Object.keys(contract).length) {
      checkAccountIsArtist(account).then(setIsArtist);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, contract]);

  return (
    <AppContext.Provider
      value={{
        account,
        contract,
        loading,
        setAccount,
        setContract,
        setLoading,
      }}
    >
      <BrowserRouter>
        <div className="App">
          <Container fluid>
            <Row
              style={{
                flexWrap: "nowrap",
                // overflowX: "auto",
                // overflowY: "scroll",
              }}
            >
              <div className="bg-dark col-auto col-md-3 min-vh-100">
                <div className="d-none d-sm-inline">
                  <a
                    className="text-decoration-none text-white d-flex align-items-center justify-content-center"
                    style={{ textAlign: "center" }}
                    href="/"
                  >
                    <span className="ms-1 fs-4 my-1">
                      Music NFT Marketplace
                    </span>
                  </a>
                </div>
                <Nav defaultActiveKey={"/"} className="justify-content-center">
                  {account ? (
                    <Nav.Link
                      href={`https://sepolia.etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button nav-button btn-sm mx-4 d-none d-sm-block"
                    >
                      <Button className="btn btn-warning">
                        {account.slice(0, 5) + "..." + account.slice(38, 42)}
                      </Button>
                    </Nav.Link>
                  ) : (
                    <Button onClick={connectWallet} variant="outline-light">
                      Connect Wallet
                    </Button>
                  )}
                </Nav>
                <hr className="text-secondary d-none d-sm-block" />
                <Nav
                  variant="pills"
                  className="flex-column mt-3 mt-sm-0"
                  defaultActiveKey={"/"}
                >
                  <Nav.Item className="text-white fs-4 my-1 py-2 py-sm-0">
                    <Nav.Link
                      as={Link}
                      href="/"
                      to="/"
                      // onClick={() => setTab(0)}
                      // className={tab === 0 && `text-white fs-5`}
                    >
                      <i class="bi bi-house-fill" />
                      <span className="ms-2 d-none d-sm-inline">HOME</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="text-white fs-4 my-1 py-2 py-sm-0">
                    <Nav.Link
                      as={Link}
                      href="/my-tokens"
                      to="/my-tokens"
                      // onClick={() => setTab(1)}
                      // className={tab === 1 && `text-white fs-5`}
                    >
                      <i class="bi bi-music-note-beamed" />
                      <span className="ms-2 d-none d-sm-inline">MY TOKENS</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="text-white fs-4 my-1 py-2 py-sm-0">
                    <Nav.Link
                      as={Link}
                      href="/my-resales"
                      to="/my-resales"
                      // onClick={() => setTab(2)}
                      // className={tab === 2 && `text-white fs-5`}
                    >
                      <i class="bi bi-receipt" />
                      <span className="ms-2 d-none d-sm-inline">
                        MY RESALES
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                  {isArtist && (
                    <Nav.Item className="text-white fs-4 my-1 py-2 py-sm-0">
                      <Nav.Link
                        as={Link}
                        href="/list-nft"
                        to="/list-nft"
                        // onClick={() => setTab(3)}
                        // className={tab === 3 && `text-white fs-5`}
                      >
                        <i class="bi bi-cloud-arrow-up-fill" />
                        <span className="ms-2 d-none d-sm-inline">
                          LIST NFT
                        </span>
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {isOwner && (
                    <Nav.Item className="text-white fs-4 my-1 py-2 py-sm-0">
                      <Nav.Link
                        as={Link}
                        href="/setting"
                        to="/setting"
                        // onClick={() => setTab(4)}
                        // className={tab === 4 && `text-white fs-5`}
                      >
                        <i class="bi bi-gear" />
                        <span className="ms-2 d-none d-sm-inline">SETTING</span>
                      </Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>
              </div>
              <div className="col-auto col-md-9 col-sm-7 min-vh-100">
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "80vh",
                    }}
                  >
                    <Spinner animation="border" style={{ display: "flex" }} />
                    <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
                  </div>
                ) : (
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/my-tokens" element={<MyTokens />} />
                    <Route path="/my-resales" element={<MyResales />} />
                    {isArtist && (
                      <Route path="/list-nft" element={<ListNFT />} />
                    )}
                    {isOwner && <Route path="/setting" element={<Setting />} />}
                  </Routes>
                )}
              </div>
            </Row>
          </Container>
          <NotifyMessageGlobal />
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
