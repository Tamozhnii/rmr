import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import Video from "./components/MyVideoRecorder/Video";
import VideoNative from "./components/NativeVideoRecord/NativeVideoRecord";
import ReactVideoRecorder from "./components/ReactVideoRecorder/ReactVideoRecorder";
import Canvas from "./features/canvas/canvas";

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/video">Video</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/about" exact>
            About
          </Route>
          <Route path="/video">
            <div className="App">
              <Canvas />
              <Canvas />
            </div>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
