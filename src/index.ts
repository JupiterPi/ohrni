import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve the React single-page app for all routes.
    "/*": index,
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Ohrni running at ${server.url}`);
