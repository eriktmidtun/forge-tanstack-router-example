import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./queryClient";
import { rootRoute } from "./routes/_root";
import { appContextRoute } from "./routes/appContext";
import { indexRoute } from "./routes/index";
import { invokeRoute } from "./routes/invoke";
import { invokeDeferRoute } from "./routes/invokeDefered";
import { searchParamRoute } from "./routes/searchParam";

export const routeTree = rootRoute.addChildren([
	indexRoute,
	searchParamRoute,
	invokeRoute,
	invokeDeferRoute,
	appContextRoute,
]);

/**
 * This is a hack to get the type of the router for the Register interface.
 * We are not going to use this router in the app. Only for typing purposes.
 */

const routerForTyping = createRouter({
	routeTree,
	// biome-ignore lint/style/noNonNullAssertion: AppContext will be defined in the app
	context: { queryClient, appContext: undefined! },
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof routerForTyping;
	}
}
