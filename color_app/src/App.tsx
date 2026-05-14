import { useState } from "react";
import ColorHarmonizer from "./components/ColorHarmonizer";
import ContrastChecker from "./components/ContrastChecker";
import Pyramid3D from "./components/Pyramid3D";

function App() {
  const [hue, setHue] = useState<number>(180);

  return (
    <div className="App">
      <h1>Clase de teoria del color con react</h1>
      <ColorHarmonizer hue={hue} setHue={setHue} />
      <Pyramid3D hue={hue} />
      <hr />
      <ContrastChecker />
    </div>
  );
}

export default App;
