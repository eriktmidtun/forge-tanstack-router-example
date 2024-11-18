import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { ForgeCompatibleRouterProvider } from "./history";
import { queryClient } from "./queryClient";
import { routeTree } from "./router";


function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ForgeCompatibleRouterProvider
				routeTree={routeTree}
				routerLoader={<h1>...loading</h1>}
			/>
		</QueryClientProvider>
	);
}

export default App;
