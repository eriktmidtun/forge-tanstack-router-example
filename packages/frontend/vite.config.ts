import childProcess from "child_process";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const commitHash = "Not a git repository"
// try {
// 	commitHash = childProcess
// 		.execSync("git rev-parse --short HEAD")
// 		.toString();
// }
// catch (error) {
// 	console.error("Failed to get commit hash", error);
// }

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	base: "./",
	define: {
		__COMMIT_HASH__: JSON.stringify(commitHash),
		...(mode === "development" && { global: "window" }),
	},
	server: {
		port: 3000,
	},
	resolve: {
		preserveSymlinks: true,
	},
	plugins: [
		react(),
	],
}));
