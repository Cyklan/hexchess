import "./App.css";
import { Game } from "./game";

function App() {
  return (
    <div className="container">
      <div className="col-left">
        <h1>HexChess</h1>
      </div>
      <div className="col-right">
        <Game interactive={false} />
      </div>
    </div>
  );
}

export default App;
