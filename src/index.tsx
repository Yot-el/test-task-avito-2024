import { createRoot } from "react-dom/client";
import App from "./App";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "assets/global.css";
import { StrictMode } from "react";

const rootElement = document.querySelector("#root") as HTMLElement;
if (!rootElement) throw new Error("No root element found");

const root = createRoot(rootElement);
root.render(
	<StrictMode>
		<App />
	</StrictMode>
);