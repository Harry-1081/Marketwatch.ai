import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import QueryComponent from "./pages/Query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/home" exact element={<Home/>} />
          <Route path="/Query"  element={<QueryComponent/>} />
          <Route path="/about"  element={<About/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;