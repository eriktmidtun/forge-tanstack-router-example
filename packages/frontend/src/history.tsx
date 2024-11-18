import { view } from "@forge/bridge";
import { QueryOptions, useQuery } from "@tanstack/react-query";
import {
	HistoryLocation,
	HistoryState,
	RootRoute,
	RouterHistory,
	RouterProvider,
	createHistory,
	createMemoryHistory,
	createRouter,
} from "@tanstack/react-router";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { queryClient } from "./queryClient";
import { routeTree } from "./router";

type HistoryFromForgeCreateHistory = Awaited<
	ReturnType<(typeof view)["createHistory"]>
>;

export function useGetForgeHistoryState():
	| { isResolvingHistory: true; forgeBridgeHistory: null }
	| {
			isResolvingHistory: false;
			forgeBridgeHistory: HistoryFromForgeCreateHistory | null;
	  } {
	const [forgeBridgeHistory, setForgeBridgeHistory] =
		useState<HistoryFromForgeCreateHistory | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const resolveForgeBridgeHistory = async () => {
		try {
			const newHistory = await view.createHistory();
			setForgeBridgeHistory(newHistory);
			setIsLoading(false);
		} catch (err) {
			setIsLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		resolveForgeBridgeHistory();
	}, []);

	if (isLoading) {
		return {
			isResolvingHistory: true,
			forgeBridgeHistory: null,
		};
	}

	return {
		isResolvingHistory: false,
		forgeBridgeHistory: forgeBridgeHistory,
	};
}

function forgeHistoryLocationToTanstackLocation(
	forgeLocation: HistoryFromForgeCreateHistory["location"],
): HistoryLocation {
	const state: HistoryState = forgeLocation.key
		? { key: forgeLocation.key }
		: forgeLocation.state || {};
	return {
		pathname: forgeLocation.pathname,
		search: forgeLocation.search,
		hash: forgeLocation.hash,
		href: forgeLocation.pathname, // This is a guess
		state: state,
	};
}

function createForgeLinkableHistory(
	forgeHistory: HistoryFromForgeCreateHistory,
): RouterHistory {
	const history = createHistory({
		getLocation: () => {
			const location = forgeHistoryLocationToTanstackLocation(
				forgeHistory.location,
			);
			return location;
		},
		getLength: () => {
			return forgeHistory.length;
		},
		pushState: (path, state) => {
			forgeHistory.push(path, state);
		},
		replaceState: (path, state) => {
			forgeHistory.replace(path, state);
		},
		back: () => {
			forgeHistory.goBack();
		},
		forward: () => {
			forgeHistory.goForward();
		},
		go: (n) => {
			forgeHistory.go(n);
		},
		createHref: (path) => {
			return path;
		},
	});

	forgeHistory.listen((location) => {
		history.notify();
	});

	return history;
}

export function useCreateforgeCompatibleRouter({
	routeTree,
}: { routeTree: RootRoute }) {
	const forgeHistoryResolver = useGetForgeHistoryState();
	const router = useMemo(() => {
		if (forgeHistoryResolver.isResolvingHistory) {
			return null;
		}
		return createRouter({
			routeTree: routeTree,
			history:
				forgeHistoryResolver.forgeBridgeHistory === null
					? createMemoryHistory()
					: createForgeLinkableHistory(forgeHistoryResolver.forgeBridgeHistory),
		});
	}, [
		routeTree,
		forgeHistoryResolver.forgeBridgeHistory,
		forgeHistoryResolver.isResolvingHistory,
	]);

	if (router === null) {
		return {
			isRouterLoaded: true,
			router: null,
		};
	}
	return {
		isRouterLoaded: false,
		router: router,
	};
}

const forgeViewContextQueryOptions =  {
		queryKey: ["forgeViewContext"],
		queryFn: () => view.getContext(),
		gcTime: Infinity, // Never fetch again during this session
		retry: 1,
		meta: {
			errorFlag: {
				title: "Failed to get Forge view context",
			},
		},
	} satisfies QueryOptions;

const useGetForgeViewContextQuery = () => {
	return useQuery(forgeViewContextQueryOptions);
};

export function ForgeCompatibleRouterProvider(props: {
	routerLoader: React.ReactNode;
	routeTree: typeof routeTree;
}) {
	const forgeHistoryResolver = useGetForgeHistoryState();
	const contextQuery = useGetForgeViewContextQuery();
	const router = useMemo(() => {
		if (forgeHistoryResolver.isResolvingHistory || !contextQuery.isSuccess) {
			return null;
		}
		return createRouter({
			routeTree: routeTree,
			history:
				forgeHistoryResolver.forgeBridgeHistory === null
					? createMemoryHistory()
					: createForgeLinkableHistory(forgeHistoryResolver.forgeBridgeHistory),
			context: {
				queryClient: queryClient,
				appContext: contextQuery.data,
			},
		});
	}, [
		forgeHistoryResolver.forgeBridgeHistory,
		forgeHistoryResolver.isResolvingHistory,
		contextQuery.data,
		contextQuery.isSuccess,
	]);

	if (contextQuery.isError) {
		return <div>Failed to get Forge view context</div>;
	}

	if (forgeHistoryResolver.isResolvingHistory || router === null) {
		return props.routerLoader;
	}

	return <RouterProvider router={router} />;
}
