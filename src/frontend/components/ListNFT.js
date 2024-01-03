import * as ethers from "ethers";
import { useContext, useEffect, useState, useCallback } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { makeConnectToStorageClient, storeFileAndMetadata } from "../api";
import { AppContext } from "./App";
import {
  showNotifyMessage,
  createNotifyMessage,
  NotifyTypes,
} from "./Notify/NotifyMessageGlobal";

export default function ListNFT() {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    artist: "",
    price: "",
  });
  const [message, updateMessage] = useState("");
  const [file, setFile] = useState();
  const [imageFile, setImageFile] = useState();
  const navigate = useNavigate();
  const { contract } = useContext(AppContext);

  useEffect(() => {
    const connect = async () => {
      try {
        const account = await makeConnectToStorageClient();
        if (account) {
          // alert("You are connected to web3.storage");
          showNotifyMessage(
            createNotifyMessage(
              NotifyTypes.SUCCESS,
              "You are connected to web3.storage!"
            )
          );
        } else {
          // alert(
          //   "You are not connected to web3.storage. Please go to your mail to verify before continue!"
          // );
          showNotifyMessage(
            createNotifyMessage(
              NotifyTypes.WARNING,
              "You are not connected to web3.storage. Please go to your mail to verify before continue!"
            )
          );
          navigate("/");
        }
      } catch (e) {
        console.log(e);
        // alert("You are not connected to web3.storage. Please try again");
        showNotifyMessage(
          createNotifyMessage(
            NotifyTypes.WARNING,
            "You are not connected to web3.storage. Please try again!"
          )
        );
        navigate("/");
      }
    };

    connect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeFile = async (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const changeName = (e) => {
    updateFormParams({ ...formParams, name: e.target.value });
  };

  const changeDescription = (e) => {
    updateFormParams({ ...formParams, description: e.target.value });
  };

  const changePrice = (e) => {
    updateFormParams({ ...formParams, price: e.target.value });
  };

  const changeArtist = (e) => {
    updateFormParams({ ...formParams, artist: e.target.value });
  };

  const uploadFileAndMetadata = async () => {
    const { name, description, price, artist } = formParams;
    if (!name || !description || !price || !artist) {
      return;
    }

    const result = await storeFileAndMetadata(file, {
      name,
      description,
      price,
      artist,
      identicon: imageFile,
    });

    return result.directoryGatewayURI;
  };

  const listNFT = async (e) => {
    e.preventDefault();

    try {
      updateMessage(
        "Please wait for uploading data and then metamask will open to perform this action"
      );
      const directoryURI = await uploadFileAndMetadata();
      const price = ethers.parseUnits(formParams.price, "ether");
      let royaltyFee = await contract.getRoyaltyFee();
      royaltyFee = royaltyFee.toString();

      const transaction = await contract.createToken(directoryURI, price, {
        value: royaltyFee,
      });
      await transaction.wait();
      console.log(1234);

      // alert("Upload successfully");
      showNotifyMessage(
        createNotifyMessage(NotifyTypes.SUCCESS, "Upload successfully!")
      );
      updateMessage("");
      updateFormParams({ name: "", description: "", price: "", artist: "" });
      setImageFile("");
      navigate("/");
    } catch (e) {
      updateMessage("");
      // alert("Upload failed");
      showNotifyMessage(
        createNotifyMessage(NotifyTypes.FAILURE, "Upload failed!")
      );
      console.log(e);
    }
  };

  const onSelectImage = useCallback((event) => {
    const imgFile = event.target.files[0];
    console.log("arrFiles: ", imgFile);

    let reader = new FileReader();

    if (imgFile) {
      reader.readAsDataURL(imgFile);
      reader.onload = function () {
        setImageFile(reader.result);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  }, []);

  return (
    <div className="mt-5 mb-5 container">
      <div className="row">
        <div className="col-6 offset-3">
          <form
            onSubmit={listNFT}
            className="d-flex flex-column align-items-stretch p-4 rounded"
            style={{ backgroundColor: "#f7f7f9" }}
          >
            <h3 className="">UPLOAD NFT</h3>
            <div className="d-flex flex-column align-items-start mt-3">
              <label className="2" htmlFor="name">
                NFT Name
              </label>
              <input
                className="mt-1 w-100 form-control"
                id="name"
                type="text"
                placeholder="NFT name"
                onChange={changeName}
                value={formParams.name}
                required
              ></input>
            </div>
            <div className="d-flex flex-column align-items-start mt-3">
              <label className="2" htmlFor="image">
                Upload Image
              </label>
              <input
                type="file"
                name="file"
                className="form-control mt-1"
                onChange={onSelectImage}
                accept=".jpg,.jpeg,.png"
                required
              />
            </div>
            <div className="d-flex flex-column align-items-start mt-3">
              <label className="2" htmlFor="name">
                Artist
              </label>
              <input
                className="mt-1 w-100 form-control"
                id="artist"
                type="text"
                placeholder="Artist"
                onChange={changeArtist}
                value={formParams.artist}
                required
              ></input>
            </div>
            <div className="d-flex flex-column align-items-start mt-3">
              <label className="2" htmlFor="description">
                NFT Description
              </label>
              <textarea
                className="mt-1 w-100 form-control"
                cols="40"
                rows="5"
                id="description"
                type="text"
                placeholder="NFT description"
                value={formParams.description}
                onChange={changeDescription}
                required
              />
            </div>
            <div className="d-flex flex-column align-items-start mt-3">
              <label className="2" htmlFor="price">
                Price
              </label>
              <input
                className="mt-1 w-100 form-control"
                type="number"
                placeholder="0.001"
                step="0.01"
                value={formParams.price}
                onChange={changePrice}
                required
              />
            </div>
            <div className="d-flex flex-column align-items-start mt-3">
              <label className="2" htmlFor="image">
                Upload Song
              </label>
              <input
                type="file"
                className="form-control mt-1"
                onChange={changeFile}
                accept=".mp3,.wma,.wav,.flac"
                required
              />
            </div>
            <br></br>
            <Button type="submit" disabled={!file} className="btn btn-warning">
              List NFT
            </Button>
            <div className="text-danger">{message}</div>
          </form>
        </div>
      </div>
    </div>
  );
}
