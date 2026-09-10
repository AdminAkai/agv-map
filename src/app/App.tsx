import { APITester } from "./APITester";
import Map from "./components/Map";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

export function App() {
  return (
    <div className="app">
      <Map />
      <APITester />
    </div>
  );
}

export default App;
