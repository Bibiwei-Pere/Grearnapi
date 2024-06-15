import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/global.scss";
import { AuthProvider } from "./hooks/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/*" element={<App />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);
