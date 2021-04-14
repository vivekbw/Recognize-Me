/*
  Vivek Bhardwaj RBC Programming Task
  Using TFJS and React to build a Food Classification Application
  April 12, 2021
*/
import React from "react";
import { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "./App.css";
import { arrayBufferToBase64String } from "@tensorflow/tfjs-core/dist/io/io_utils";

function App() {
  /* Declaring Model Constants */
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  /* Model Results */
  const [results, setResults] = useState([]);

  /* History of Uploaded Images */
  const [history, setHistory] = useState([]);

  /* Declaring Image Constants*/
  const imageRef = useRef();
  const textInputRef = useRef();
  const fileInputRef = useRef();

  /* Asynchronous Function for Determining Loading Screen */
  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  /* Event function for Uploading Image */
  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
    } else {
      setImageURL(null);
    }
  };

  /* Event function for Image Identification */
  const identify = async () => {
    textInputRef.current.value = "";
    const results = await model.classify(imageRef.current);
    setResults(results);
  };

  /* Image Change */
  const handleOnChange = (e) => {
    setImageURL(e.target.value);
    setResults([]);
  };

  /* Trigger Upload */
  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (imageURL) {
      setHistory([imageURL, ...history]);
    }
  }, [imageURL]);

  /* Checks to see if model is still loading */
  if (isModelLoading) {
    return <h2>Loading Please Wait...</h2>;
  }

  var appetizers = [
    "bagel, beigel",
    "guacamole",
    "soup bowl",
    "French loaf",
    "pretzel",
    "consomme",
    "cheeseburger",
    "hotdog, hot dog, red hot",
  ];
  var maincourse = [
    "American lobster, Northern lobster, Maine lobster, Homarus americanus",
    "hot pot, hotpot",
    "rotisserie",
    "potpie",
    "carbonara",
    "pizza, pizza pie",
    "meat loaf, meatloaf",
  ];
  var dessert = [
    "trifle",
    "ice cream, icecream",
    "ice lolly, lolly, lollipop, popsicle",
    "strawberry",
    "chocolate sauce, chocolate syrup",
  ];

  /* Image Upload */
  /* Image can be uploaded via URL or through source */
  return (
    <div className="page">
      <div className="container">
        <h1 className="heading">FOOD IDENTIFIER</h1>
        <div className="inputHolder">
          <input
            type="file"
            accept="image/*"
            capture="camera"
            className="uploadInput"
            onChange={uploadImage}
            ref={fileInputRef}
          />
          <button className="uploadImage" onClick={triggerUpload}>
            Upload Image
          </button>
          <span className="or">OR</span>
          <input
            type="text"
            placeholder="Paste Image URL"
            ref={textInputRef}
            onChange={handleOnChange}
          />
          {imageURL && (
            <button className="button" onClick={identify}>
              Identify Image
            </button>
          )}
        </div>
        <div className="mainWrapper">
          <div className="mainContent">
            <div className="imageHolder">
              {imageURL && (
                <img
                  src={imageURL}
                  alt="Upload Preview"
                  crossOrigin="anonymous"
                  ref={imageRef}
                />
              )}
            </div>
            {results.length > 0 && (
              <div className="resultsHolder">
                {results.map((result, index) => {
                  return (
                    <div className="result" key={result.className}>
                      <span className="name">{result.className}</span>
                      <span className="confidence">
                        Confidence level:{" "}
                        {(result.probability * 100).toFixed(2)}%{" "}
                      </span>
                      {index === 0 && appetizers.includes(result.className) && (
                        <span className="answer">Appetizer</span>
                      )}
                      {index === 0 && maincourse.includes(result.className) && (
                        <span className="answer">Main Course</span>
                      )}
                      {index === 0 && dessert.includes(result.className) && (
                        <span className="answer">Dessert</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {history.length > 0 && (
        <div className="recentPredictions">
          <h2>RECENT IMAGES</h2>
          <div className="recentImages">
            {history.slice(0, 6).map((image, index) => {
              return (
                <div className="recentPrediction" key={`${image}${index}`}>
                  <img
                    src={image}
                    alt="Recent Prediction"
                    onClick={() => setImageURL(image)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
