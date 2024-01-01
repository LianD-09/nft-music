import { ethers } from "ethers";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { getTokenInfo } from "../utils";
import { AppContext } from "./App";
import { useNavigate } from "react-router";
import TokenCard from "./TokenCard";

const Home = () => {
  const audioRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [marketItems, setMarketItems] = useState(null);
  const navigate = useNavigate();

  const { contract, account } = useContext(AppContext);

  const loadMarketplaceItems = useCallback(async () => {
    try {
      if (contract) {
        const unsoldTokens = await contract.getAllUnsoldTokens();
        const marketItems = await Promise.all(
          unsoldTokens.map(async (token) => getTokenInfo(token, contract))
        );
        setMarketItems(marketItems);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  }, [contract]);

  const buyMarketItem = useCallback(
    async (item) => {
      try {
        await (
          await contract.buyToken(item.tokenId, {
            value: item.price,
          })
        ).wait();
        loadMarketplaceItems();
        alert("Buy token successfully");
      } catch (e) {
        alert("Something went wrong");
        console.log(e);
      }
      navigate("/my-tokens");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contract, loadMarketplaceItems]
  );

  const onClickPauseAndPlay = useCallback(
    (_index) => {
      setPrevious(selected);
      setSelected(_index);
      if (!isPlaying || _index === selected) setIsPlaying(!isPlaying);
    },
    [isPlaying, selected]
  );

  useEffect(() => {
    if (contract) {
      loadMarketplaceItems();
    }
  }, [contract, loadMarketplaceItems]);

  useEffect(() => {
    if (isPlaying) {
      audioRefs.current[selected].play();
      if (selected !== previous) audioRefs.current[previous].pause();
    } else if (isPlaying !== null) {
      audioRefs.current[selected].pause();
    }
  });

  const renderCardFooter = useCallback(
    (item) =>
      item.resell ? (
        <span
          className="text-danger font-weight-bold card-text-bottom"
          style={{ margin: 0 }}
        >
          You are the seller of this token ({ethers.formatEther(item.price)})
        </span>
      ) : (
        <Button
          onClick={() => buyMarketItem(item)}
          className="btn btn-warning card-text-bottom"
          size="lg"
        >
          {`Buy for ${ethers.formatEther(item.price)} ETH`}
        </Button>
      ),
    [buyMarketItem]
  );

  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <div className="flex justify-center">
      {marketItems.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {marketItems.map((item, idx) => (
              <TokenCard
                key={item.tokenId}
                audioRefs={audioRefs}
                _index={idx}
                tokenData={item}
                renderFooter={renderCardFooter}
                onClickPauseAndPlay={onClickPauseAndPlay}
                isPlaying={isPlaying}
                selected={selected}
                isHomePage
              />
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No tokens</h2>
        </main>
      )}
    </div>
  );
};
export default Home;
