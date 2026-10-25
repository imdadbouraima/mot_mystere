import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Accueil from "./Accueil";
import Jeu from "./Jeu";
import Scores from "./Scores";
import Statistiques from "./Statistiques";
import Regles from "./Regles";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/jeu/:longueur/:difficulte/:type/:date?" element={<Jeu />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/statistiques" element={<Statistiques />} />
          <Route path="/regles" element={<Regles />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
