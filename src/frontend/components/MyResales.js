import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { ethers } from "ethers";
import { Container, Row, Spinner } from "react-bootstrap";
import { AppContext } from "./App";
import { getTokenInfo } from "../utils";
// import { useNavigate } from "react-router";
import TokenCard from "./TokenCard";

export default function MyTokens() {
  const audioRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myTokens, setMyTokens] = useState(null);
  const [selected, setSelected] = useState(0);
  const [previous, setPrevious] = useState(null);
  // const [resellId, setResellId] = useState(null);
  // const [resellPrice, setResellPrice] = useState(null);
  // const navigate = useNavigate();

  const { contract } = useContext(AppContext);

  const loadMyTokens = useCallback(async () => {
    try {
      const results = await contract.getMyResellTokens();
      const myTokens = await Promise.all(
        results.map(async (token) => getTokenInfo(token, contract))
      );
      setMyTokens(myTokens);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }, [contract]);

  // const resellItem = useCallback(
  //   async (item) => {
  //     try {
  //       if (resellPrice === "0" || item.tokenId !== resellId || !resellPrice)
  //         return;
  //       // Get royalty fee
  //       const fee = await contract.royaltyFee();
  //       const price = ethers.parseEther(resellPrice.toString());
  //       await (
  //         await contract.resellToken(item.tokenId, price, { value: fee })
  //       ).wait();
  //       alert("Resell successfully");
  //       loadMyTokens();
  //     } catch (e) {
  //       alert("Something went wrong");
  //     }
  //     navigate("/");
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [contract, resellId, resellPrice, loadMyTokens]
  // );

  const onClickPauseAndPlay = useCallback(
    (_index) => {
      setPrevious(selected);
      setSelected(_index);
      if (!isPlaying || _index === selected) {
        setIsPlaying(!isPlaying);
      }
    },
    [isPlaying, selected]
  );

  useEffect(() => {
    if (isPlaying) {
      audioRefs.current[selected].play();
      if (selected !== previous) audioRefs.current[previous].pause();
    } else if (isPlaying !== null) {
      audioRefs.current[selected].pause();
    }
  });
  useEffect(() => {
    if (contract) {
      loadMyTokens();
    }
  }, [contract, loadMyTokens]);

  const renderCardFooter = useCallback(
    (item) => (
      <>
        <p
          className="text-danger font-weight-bold card-text-bottom"
          style={{ margin: 0 }}
        >
          You are the seller of this token ({ethers.formatEther(item.price)})
        </p>
        {/* <InputGroup className="my-1">
          <Button
            onClick={() => resellItem(item)}
            id="button-addon1"
            className="btn btn-warning"
          >
            Resell
          </Button>
          <Form.Control
            onChange={(e) => {
              setResellId(item.tokenId);
              setResellPrice(e.target.value);
            }}
            size="md"
            value={resellId === item.tokenId ? resellPrice : ""}
            required
            type="number"
            placeholder="Price in ETH"
          />
        </InputGroup> */}
      </>
    ),
    []
  );

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spinner animation="border" style={{ display: "flex" }} />
      </div>
    );

  return (
    <div className="flex justify-center" style={{ paddingTop: 20, paddingBottom: 20 }}>
      {myTokens.length > 0 ? (
        <Container>
          <Row style={{ rowGap: "16px" }}>
            {myTokens.map((item, idx) => (
              <TokenCard
                audioRefs={audioRefs}
                _index={idx}
                tokenData={item}
                renderFooter={renderCardFooter}
                onClickPauseAndPlay={onClickPauseAndPlay}
                isPlaying={isPlaying}
                selected={selected}
              />
            ))}
          </Row>
        </Container>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No owned tokens</h2>
        </main>
      )}
    </div>
  );
}
