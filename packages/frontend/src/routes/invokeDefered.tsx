import React from "react";

import { invoke } from "@forge/bridge";
import { useQuery } from "@tanstack/react-query";
import { Await, createRoute, defer, useRouter } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { PageMainBodyLoader } from "../components/PageLoaders";
import { rootRoute } from "./_root";

export const pathParams = z.object({
	name: z
		.string()
		.min(1)
		.optional()
		.transform((str) => (str ? str.replaceAll(" ", "") : undefined))
		.catch(undefined),
});

const getHelloWorldTextFromInvokeQueryOptions = (
	params: z.infer<typeof pathParams>,
) => {
	return {
		queryKey: ["getText", params.name],
		queryFn: () => invoke<string>("getText", { name: params.name }),
	};
};

export const invokeDeferRoute = createRoute({
	loader: async ({ context, location }) => ({
		fastData: "This is fast data",
		slowDeferedData: defer(
			context.queryClient.ensureQueryData(
				getHelloWorldTextFromInvokeQueryOptions(location.search),
			)
		)
	}),
	// loaderDeps: ({ search: { name } }) => ({ name }),
	validateSearch: zodValidator(pathParams),
	getParentRoute: () => rootRoute,
	pendingComponent: () => <PageMainBodyLoader />,
	path: "/invokeDefer",
	component: function About() {
		const {fastData, slowDeferedData} = invokeDeferRoute.useLoaderData();
		const router = useRouter();
		const navigate = invokeDeferRoute.useNavigate();
		const search = invokeDeferRoute.useSearch();
		const { isFetching } = useQuery(
			getHelloWorldTextFromInvokeQueryOptions(search),
		);
		return (
			<div className="flex gap-5 flex-col p-2">
				<div className="flex justify-between">
					<h3>Invoke defer</h3>
					<div>
						<span className="m-0 rounded bg-slate-200 p-2">
							{router.latestLocation.href}
						</span>
					</div>
				</div>
				<div>Data fetched from invokation. (Not fully implemented)</div>
				<pre className="m-0 rounded bg-slate-200 p-10 relative">
					{fastData}
					</pre>
				<div className="relative">
					{isFetching && (
						<div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-10 flex items-center justify-center z-10">
							Loading...
						</div>
					)}
					<pre className="m-0 rounded bg-slate-200 p-10 relative">
						<Await promise={slowDeferedData} fallback={"Loading slow data"}>
							{(data) => {
								return <>{data}</>
							}}
						</Await>
					</pre>
				</div>
				<form
					className="flex gap-2 flex-col"
					method="GET"
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						const name = formData.get("name")?.toString() || "";
						navigate({
							search: {
								name,
							},
						});
						router.invalidate();
					}}
				>
					<label htmlFor="name" className="text-gray-600">
						Name{" "}
					</label>
					<div className="flex flex-row gap-2">
						<input
							id="name"
							className="p-2 rounded"
							type="text"
							name="name"
							placeholder="name"
						/>
						<button
							type="submit"
							className="p-2 bg-blue-500 text-white rounded"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		);
	},
});
getHelloWorldTextFromInvokeQueryOptions;
