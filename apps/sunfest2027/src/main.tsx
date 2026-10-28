import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/space-grotesk/wght.css";
import "@/index.css";

const root = document.querySelector("#root");
if (!root) {
  throw new Error("Root element not found");
}
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
