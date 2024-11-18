import {view} from "@forge/bridge"
import React from "react";

import { QueryClient } from "@tanstack/react-query";
import {
	Link,
	Outlet,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { PageMainBodyLoader } from "../components/PageLoaders";

type FullContext = Awaited<ReturnType<typeof view["getContext"]>>;

export const rootRoute = createRootRouteWithContext<{
	queryClient: QueryClient;
	appContext: FullContext
}>()({
	component: () => (
		<>
			<nav className="p-2 flex gap-5 m-5">
				<Link to="/" className="[&.active]:font-bold">
					Home
				</Link>{" "}
				<Link
					to="/search-param"
					search={{ hasSearchParam: true }}
					className="[&.active]:font-bold"
				>
					Search Param
				</Link>{" "}
				<Link to="/invoke" className="[&.active]:font-bold">
					Invoke
				</Link>
				<Link to="/invokeDefer" className="[&.active]:font-bold">
					Invoke defer
				</Link>
				<Link to="/app-context" className="[&.active]:font-bold">
					App context
				</Link>
			</nav>
			<hr />
			<main className="p-5 bg-slate-100 ">
				<Outlet />
				<TanStackRouterDevtools position="bottom-right" />
			</main>
		</>
	),
	pendingComponent: () => (<PageMainBodyLoader />),
	notFoundComponent: () => {
		return (
			<div>
				<p>This is the notFoundComponent configured on root route</p>
				<Link to="/">Start Over</Link>
			</div>
		);
	},
});
