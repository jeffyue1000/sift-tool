import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import ComparisonScreen from "./screens/ComparisonScreen";
import LoginScreen from "./screens/LoginScreen";
import RankingScreen from "./screens/RankingScreen";
import UploadScreen from "./screens/UploadScreen";
import Navbar from "./components/Navbar";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route
					path="/"
					element={<LoginScreen />}
				/>
				<Route
					path="/compare"
					element={<ComparisonScreen />}
				/>
				<Route
					path="/rankings"
					element={<RankingScreen />}
				/>
				<Route
					path="upload"
					element={<UploadScreen />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
