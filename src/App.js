import './App.css';

import Header from "./components/Header";
import GameBoard from "./components/game/GameBoard";
import GroundProvider from "./store/GroundProvider";

function App() {
  return (
    <GroundProvider>
      <div className="App">
        <header className="App-header">
          <Header></Header>
          <GameBoard></GameBoard>
        </header>
      </div>
    </GroundProvider>
  );
}

export default App;
