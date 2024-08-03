import  React,{ useState } from "react";
import "./Main.css";

import { languages } from "../assets/languages";

const Main = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLang, setSelectedLang] = useState("")




  const handleInputChange = async (event) => {
    event.preventDefault();
   
    const selectedLangElement = document.getElementById('selected-lang');
    const selectedLangValue = selectedLangElement.value;

    if (selectedLang === 'none') {
      alert('Please select a language');
      return;
    }


    const response = await fetch(`${process.env.REACT_APP_API_SERVER}/translate` || `http://localhost:5000/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputText,
        targetLanguage: selectedLangValue
      })
    });


    const data = await response.json();

    if (data.error) {
      alert('Error' + data.error);
    } else {
      setTranslatedText(data.translation);
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
            <label htmlFor="selected-lang">Choose a Language  </label>
            <select id="selected-lang" value={selectedLang} onChange={handleSelectChange}>
              <option value="none" key="none"> .. </option>
              {languages.map(
                lang =>
                (
                  <option value={lang.abbr} key={lang.abbr}>
                    {lang.name}
                  </option>
                )
              )}
            </select>

            <button type="submit">Translate</button>
            {/* translated text below vvvv */}
            <h3 className="translated-text">{translatedText}</h3>
          </form>
        </div>
      </div>
    </>
  );
};

export default Main;
