import React from "react";

import { Link, createRoute, useRouter } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import { rootRoute } from "./_root";

export const searchParamRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/search-param",
	validateSearch: zodValidator(
		z.object({
			hasSearchParam: z.boolean({
				message: "Must include hasSearchParam in the link",
			}),
		}),
	),
	errorComponent: ({ error }) => {
		const router = useRouter();
		return (
			<div className="flex gap-5 flex-col p-2">
				<div className="flex justify-between">
					<h3>Search params page error component</h3>
					<div>
						<span className="m-0 rounded bg-slate-200 p-2">
							{router.latestLocation.href}
						</span>
					</div>
				</div>
				<pre className="m-0 rounded bg-slate-200 p-10 text-red-500">
					{error.message}
				</pre>
			</div>
		);
	},
	component: function About() {
		const router = useRouter();
		return (
			<div className="flex gap-5 flex-col p-2">
				<div className="flex justify-between">
					<h3>Search params page</h3>
					<div>
						<span className="m-0 rounded bg-slate-200 p-2">
							{router.latestLocation.href}
						</span>
					</div>
				</div>
				<p className="m-0">
					This page will spit out an error message if the link does not have the
					corrext search params
				</p>
				{/* @ts-ignore: Intentionally showing of a route that should not exist because of missing search params  */}
				<Link to="/search-param">Try out the search param validation</Link>
			</div>
		);
	},
});
