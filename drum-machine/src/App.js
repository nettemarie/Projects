import React from "react";
import Keyboard from "./Keyboard";
import "./App.css";

function App() {
  const play = (key) => {
    const audio = document.getElementById(key);
    audio.currentTIme = 0;
    audio.play();
  };
  return (
    <div id="drum-machine">
      <Keyboard play={play} />
    </div>
  );
}

export default App;
