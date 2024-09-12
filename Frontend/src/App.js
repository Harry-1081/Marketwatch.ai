import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import QueryComponent from "./pages/Query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/home" exact element={<Home/>} />
          <Route path="/Query"  element={<QueryComponent/>} />
          <Route path="/about"  element={<About/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;