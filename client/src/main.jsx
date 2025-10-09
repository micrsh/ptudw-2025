import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import RoutesDef from "./RoutesDef.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);
