import { VanillaRouter } from "./vanilla-router.js";

// Load dynamic routes like Next.js
async function loadRouteRender(routePattern) {
  const filename = routePattern.endsWith("/")
    ? `/routes${routePattern}index.js`
    : `/routes${routePattern}.js`;
  const { render } = await import(filename);
  return render;
}

async function dynamicallyRenderRoute(match) {
  const render = await loadRouteRender(match.routePattern);
  render({ router, match });
}

const router = new VanillaRouter();
// Listen for link clicks anywhere
router.linkRoot = document.body;
// Tell components to render into the main element
router.renderRoot = document.querySelector("main");
router.addRoutes({
  "/": dynamicallyRenderRoute,
  "/edit/": dynamicallyRenderRoute,
  "/edit/:id/": dynamicallyRenderRoute,
  async "/*"(match) {
    router.renderRoot.textContent = "404 Not Found";
  },
});
router.start();
