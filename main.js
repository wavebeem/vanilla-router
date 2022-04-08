import { VanillaRouter } from "./vanilla-router.js";

const html = String.raw;

// Load dynamic routes like Next.js
async function loadRouteRender(routePattern) {
  const filename = routePattern.endsWith("/")
    ? `/routes${routePattern}index.js`
    : `/routes${routePattern}.js`;
  const { render } = await import(filename);
  return render;
}

// Render functions are easy to test because they take the router and match as
// parameters, making it easy to mock those values
async function dynamicallyRenderRoute(match) {
  const render = await loadRouteRender(match.routePattern);
  render({ router, match });
}

const router = new VanillaRouter();
// Listen for link clicks anywhere
router.linkRoot = document.body;
// Tell components to render into the main element
router.renderRoot = document.querySelector("main");
// Most routes can use the same code to dynamically load and render from ES
// modules, but you can use whatever custom logic you want (e.g. a redirect).
router.addRoutes({
  "/": dynamicallyRenderRoute,
  "/edit/": dynamicallyRenderRoute,
  "/edit/:id/": dynamicallyRenderRoute,
  async "/*"(match) {
    router.renderRoot.innerHTML = html`<h1>404 Not Found</h1>`;
  },
});
router.start();
