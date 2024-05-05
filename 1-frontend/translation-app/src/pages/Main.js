import {useState }from "react";
import "./Main.css";





const Main = () => {

  const [inputText, setInputText] = useState("");

  const handleInputChange = (event) => {
    event.preventDefault();
    setInputText(event.target.value);
    console.log(inputText);
  };



  const handleInput = (event) => {
    setInputText(event.target.value);
  };



  return (
    <>
    <div className="content">
 
      <div>
        <h1>UNIFi</h1>
        <h3>Translate..</h3>
        <form onSubmit={handleInputChange} >
          <input type="text" value={inputText} onChange={handleInput} />
          <button type="submit">Translate</button>
        </form>
       
      </div>
    </div>
      
    </>
  );
};

export default Main;
