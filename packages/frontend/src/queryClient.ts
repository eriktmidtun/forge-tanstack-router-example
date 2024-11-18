import { showFlag } from "@forge/bridge";
import { QueryCache, QueryClient, QueryClientConfig } from "@tanstack/react-query";

const queryClientDefaultOptions: QueryClientConfig["defaultOptions"] = {
	queries: {
		refetchOnWindowFocus: false, // default: true
		refetchOnMount: false, // default: true
		retry: 1, // default: 3
	},
};


interface MyMeta extends Record<string, unknown> {
    errorFlag?: {
        title: string
        description?: string
    }
}
  
declare module '@tanstack/react-query' {
    interface Register {
        queryMeta: MyMeta
        mutationMeta: MyMeta
    }
}

export const queryClient = new QueryClient({
    defaultOptions: queryClientDefaultOptions,
     queryCache: new QueryCache({
        onError: (error, query) => {
          if (query.meta?.errorFlag !== undefined) {
            showFlag({
                id: query.queryKey.join("-"),
                title: query.meta.errorFlag.title,
                description: query.meta.errorFlag.description ?? error.message,
                type: "error",
                isAutoDismiss: true,
            });
          }
        },
      }),
})