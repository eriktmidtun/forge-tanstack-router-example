import { createRoute, useRouter } from "@tanstack/react-router";
import React from "react";
import { rootRoute } from "./_root";

export const appContextRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/app-context",
	component: function Index() {
		const router = useRouter();
		const appContext = appContextRoute.useRouteContext().appContext;
		return (
			<div className="flex gap-5 flex-col p-2">
				<div className="flex justify-between">
					<h3>App Context</h3>
					<div>
						<span className="m-0 rounded bg-slate-200 p-2">
							{router.latestLocation.href}
						</span>
					</div>
				</div>
				<pre className="m-0 rounded bg-slate-200 p-10  text-wrap">
					<code>{JSON.stringify(appContext, null, 2)}</code>
				</pre>
			</div>
		);
	},
});
