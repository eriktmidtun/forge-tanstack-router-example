import Resolver from "@forge/resolver";
import z from "zod";

const resolver = new Resolver();

resolver.define("getText", (req) => {
	const schema = z.object({
		name: z.string().min(1).optional(),
	});
	const result = schema.safeParse(req.payload);
	if (result.success && result.data.name) {
		return `Hello, ${req.payload.name}!`;
	}

	return "Hello, world!";
});

export const handler = resolver.getDefinitions();
