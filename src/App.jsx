
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./Accueil";
import Jeu from "./Jeu";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/jeu" element={<Jeu />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
