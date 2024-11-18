import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'

import "@atlaskit/css-reset";

const container = document.getElementById("root");
if (!container) {
	throw Error(
		"Could not mount React application because element with id=root was not found",
	);
}
const root = ReactDOM.createRoot(container);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
