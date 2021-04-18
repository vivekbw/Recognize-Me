/*
  Vivek Bhardwaj RBC Programming Task
  Using TFJS and React to build a Food Classification Application
  April 12, 2021
*/

import React, { Component } from "react";
import { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet"; // This is the Tensorflow JS Model Used for Image Classification
import "./App.css";

function App() {
  /* API Credentials */
  const APP_ID = "8ebe31e7";
  const APP_KEY = "e5600a9da65cfab13ac82f9b2c46bbf1";

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

  /* Identify function for Image Identification */
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

  /* Loads the Machine Learning Model*/
  useEffect(() => {
    loadModel();
  }, []);

  /* When a recent image is selected, a new imageURL is assigned */
  useEffect(() => {
    if (imageURL) {
      setHistory([imageURL, ...history]);
    }
  }, [imageURL]);

  /* Checks to see if model is still loading */
  if (isModelLoading) {
    return <h2>Loading Please Wait...</h2>;
  }

  /* Individual Lists for Each Meal Type compiled via the Mobilenet TFJS Model */
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

  /* API Fetch Request to get calorieDensity (Kcal/lb)*/
  async function getData(foodName) {
    const foodNameURI = encodeURIComponent(foodName.trim());
    const response = await fetch(
      `https://api.edamam.com/api/food-database/v2/parser?nutrition-type=logging&ingr=${foodNameURI}&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const data = await response.json();
    console.log(data.hints)
  }
  return (
    <div className="page">
      <div className="container">
        <h1 className="heading">FOOD IDENTIFIER</h1>
        <div className="inputHolder">
          {/* Image Input Via Device Source */}
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
          {/* Image Input Via Image URL */}
          <input
            type="text"
            placeholder="Paste Image URL"
            ref={textInputRef}
            onChange={handleOnChange}
          />
          {/* Identify Image Button - Triggers "identify" function and the TFJS model */}
          {imageURL && (
            <button className="button" onClick={identify}>
              Identify Image
            </button>
          )}
        </div>
        {/* Image Preview - Adjusts based on other content on the application */}
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
            {/* Holds the Results from the Identify Function */}
            {results.length > 0 && (
              <div className="resultsHolder">
                {results.map((result, index) => {
                  return (
                    <div className="result" key={result.className}>
                      <span className="name">{result.className}</span>
                      {/* Confidence Level - Measures the accuracy of the prediction */}
                      <span className="confidence">
                        Confidence level:{" "}
                        {(result.probability * 100).toFixed(2)}%{" "}
                      </span>
                      {/* Decides which category the food falls into */}
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
      {/* Recent Images Feature */}
      {history.length > 0 && (
        <div className="recentPredictions">
          <h2>RECENT IMAGES</h2>
          <div className="recentImages">
            {history.slice(0, 6).map((image, index) => {
              return (
                <div className="recentPrediction" key={`${image}${index}`}>
                  {/* If Image is selected, ImageURL is set to the appropriate value */}
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
