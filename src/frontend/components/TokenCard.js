import React from "react";
import { Col, Card, Button } from "react-bootstrap";
import { ethers } from "ethers";

function TokenCard(props) {
  const {
    _index,
    audioRefs,
    tokenData,
    renderFooter,
    onClickPauseAndPlay,
    isPlaying,
    selected,
    isHomePage,
  } = props;

  return (
    <Col key={_index} className="overflow-hidden col-auto col-md-4" style={{ flexBasis: "25%" }}>
      <audio
        src={tokenData.audio}
        key={_index}
        ref={(el) => (audioRefs.current[_index] = el)}
      />
      <Card>
        <Card.Img
          variant="top"
          src={tokenData.identicon}
          width={200}
          style={{
            objectFit: "cover",
            aspectRatio: '1/1'
          }} />
        <Card.Body
          color="secondary"
          className="text-center"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 1
          }}
        >
          <Card.Title className="card-body-title" style={{ fontWeight: "700" }}>{tokenData.name}</Card.Title>
          {isHomePage && (
            <Card.Subtitle className="card-body-subtitle" style={{ fontWeight: "normal", lineHeight: 1.75 }}>
              {tokenData.artist}
            </Card.Subtitle>
          )}
          {isHomePage && (
            <p style={{ margin: "8px 0" }}>{tokenData.description}</p>
          )}
          <div className="d-grid px-4">
            <Button
              className="btn btn-warning"
              onClick={() => onClickPauseAndPlay(_index)}
            >
              {isPlaying && selected === _index ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  fill="currentColor"
                  className="bi bi-pause"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  fill="currentColor"
                  className="bi bi-play"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                </svg>
              )}
            </Button>
          </div>
          <Card.Text className="mt-1">
            {ethers.formatEther(tokenData.price)} ETH
          </Card.Text>
        </Card.Body>
        <Card.Footer
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderFooter(tokenData)}
        </Card.Footer>
      </Card>
    </Col>
  );
}

export default TokenCard;
