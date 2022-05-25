import "./App.css";
import { Route } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/chat" component={Chats} />
    </div>
  );
}

export default App;
