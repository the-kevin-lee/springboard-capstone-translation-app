import React, { useState } from "react";
import "./Main.css";
import { languages } from "../assets/languages";
import { Navigate } from "react-router-dom";

const Main = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLang, setSelectedLang] = useState("");

  const API_SERVER =
    process.env.REACT_APP_API_SERVER || "http://localhost:5000";

  const handleInputChange = async (event) => {
    event.preventDefault();

    const selectedLangElement = document.getElementById("selected-lang");
    const selectedLangValue = selectedLangElement.value;

    if (selectedLangValue === "none") {
      alert("Please select a language");
      return;
    }

    try {
      const response = await fetch(`${API_SERVER}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputText,
          targetLanguage: selectedLangValue,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert("Error: " + data.error);
      } else {
        setTranslatedText(data.translation);

        // Save the translation to the backend
        const token = localStorage.getItem("token");
        if (token) {
          const saveResponse = await fetch(`${API_SERVER}/translations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              input_text: inputText, 
              translated_text: data.translation, 
              input_language: "en", 
              target_language: selectedLangValue,
            }),
          });

          if (saveResponse.status === 401) {
            const saveError = await saveResponse.json();
            if (saveError.message === "Token has expired") {
              alert("Failed to save translation: " + saveError.message);
              localStorage.removeItem("token");
              Navigate("/login");
            }
          } else {
            alert("You need to be logged in to save translations.");
          }
        }
      }
    } catch (error) {
      console.error("Translation error:", error);
      alert("An error occurred while translating.");
    }
  };

  const handleInput = (event) => {
    setInputText(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedLang(event.target.value);
  };

  return (
    <>
      <div className="content">
        <div>
          <h1 className="app-title">UNIFi</h1>
          <h3>Translate..</h3>
          <form onSubmit={handleInputChange}>
            <input type="text" value={inputText} onChange={handleInput} />
            <br />
            <br />
            <label htmlFor="selected-lang">Choose a Language </label>
            <select
              id="selected-lang"
              value={selectedLang}
              onChange={handleSelectChange}
            >
              <option value="none" key="none">
                {" "}
                ..{" "}
              </option>
              {languages.map((lang) => (
                <option value={lang.abbr} key={lang.abbr}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button type="submit">Translate</button>
            {/* translated text below */}
            <h3 className="translated-text">{translatedText}</h3>
          </form>
        </div>
      </div>
    </>
  );
};

export default Main;