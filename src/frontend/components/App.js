import { Link, BrowserRouter, Routes, Route } from "react-router-dom";

import { Spinner, Navbar, Nav, Button, Container } from "react-bootstrap";
import Home from "./Home.js";
import MyTokens from "./MyTokens.js";
import MyResales from "./MyResales.js";
import "./App.css";

import { createContext, useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import MusicNFTMarketplaceContract from "../contractsData/Marketplace.json";
import ListNFT from "./ListNFT";
import Setting from "./Setting.js";

export const AppContext = createContext({});

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [tab, setTab] = useState(0);

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
          <>
            <Navbar expand="lg" bg="dark" variant="dark">
              <Container>
                <Navbar.Brand href="/">Music NFT Marketplace</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto flex-column">
                    <Nav.Link
                      as={Link}
                      to="/"
                      onClick={() => setTab(0)}
                      className={tab === 0 && `text-white`}
                    >
                      HOME
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/my-tokens"
                      onClick={() => setTab(1)}
                      className={tab === 1 && `text-white`}
                    >
                      MY TOKENS
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/my-resales"
                      onClick={() => setTab(2)}
                      className={tab === 2 && `text-white`}
                    >
                      MY RESALES
                    </Nav.Link>
                    {isArtist && (
                      <Nav.Link
                        as={Link}
                        to="/list-nft"
                        onClick={() => setTab(3)}
                        className={tab === 3 && `text-white`}
                      >
                        LIST NFT
                      </Nav.Link>
                    )}
                    {isOwner && (
                      <Nav.Link
                        as={Link}
                        to="/setting"
                        onClick={() => setTab(4)}
                        className={tab === 4 && `text-white`}
                      >
                        SETTING
                      </Nav.Link>
                    )}
                  </Nav>
                  <Nav>
                    {account ? (
                      <Nav.Link
                        href={`https://sepolia.etherscan.io/address/${account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button nav-button btn-sm mx-4"
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
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </>
          <div>
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
                {isArtist && <Route path="/list-nft" element={<ListNFT />} />}
                {isOwner && <Route path="/setting" element={<Setting />} />}
              </Routes>
            )}
          </div>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
