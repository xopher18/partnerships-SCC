import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Deck from "@/pages/Deck";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Deck />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
