import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App";

// Renderização da aplicaçao React dentro da div root

createRoot(document.querySelector("#root")).render(
  <StrictMode>
    <App />
    {/*componente pai App.jsx da aplicação que englobará todos os outros filhos (Header.jsx, Main.jsx, Footer.jsx) */}
  </StrictMode>
);
