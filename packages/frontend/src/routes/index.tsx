import { Link, createRoute, useRouter } from "@tanstack/react-router";
import React from "react";
import { rootRoute } from "./_root";

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: function Index() {
		const router = useRouter();
		return (
			<div className="flex gap-5 flex-col p-2">
				<div className="flex justify-between">
					<h3>Home</h3>
					<div>
						<span className="m-0 rounded bg-slate-200 p-2">
							{router.latestLocation.href}
						</span>
					</div>
				</div>
				<div>Atlassian Forge Tanstack router example</div>	
				<Link to="/search-param" search={{hasSearchParam: true}}>Go to Search param page</Link>
			</div>
		);
	},
});
