// Only listen for links that belong to the current origin
function isRouteElement(element) {
  return (
    element.tagName === "A" &&
    new URL(element.href, location.href).origin === location.origin
  );
}

function createState({ url, routePattern, pathParams }) {
  return {
    routePattern,
    href: url.href,
    fullPath: url.pathname + url.search + url.hash,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    searchParams: Object.fromEntries(url.searchParams),
    pathParams,
  };
}

// zip(["a", "b"], ["x", "y"]) --> [["a", "x"], ["b", "y"]]
function zip(a, b) {
  const x = a.length > b.length ? a : b;
  return x.map((_, i) => [a[i], b[i]]);
}

// splitPath("/foo/bar//baz/") --> ["foo", "bar", "baz"]
function splitPath(path) {
  return path.replace(/^[/]|[/]$/g, "").split(/[/]+/g);
}

function matchPath(patternString, pathString) {
  const pattern = splitPath(patternString);
  const path = splitPath(pathString);
  if (pattern.length !== path.length && !patternString.endsWith("*")) {
    return undefined;
  }
  const obj = {};
  for (const [i, [curPattern, curPath]] of zip(pattern, path).entries()) {
    if (curPattern.startsWith(":")) {
      const name = curPattern.slice(1);
      obj[name] = curPath;
    } else if (curPattern === "*") {
      obj["*"] = path.slice(i).join("/");
      return obj;
    } else if (curPattern !== curPath) {
      return undefined;
    }
  }
  return obj;
}

export class VanillaRouter {
  constructor() {
    this.routes = [];
    this.linkRoot = document.body;
    this.renderRoot = document.body;
  }

  addRoutes(routesObject) {
    for (const [pattern, callback] of Object.entries(routesObject)) {
      this.routes.push({ pattern, callback });
    }
  }

  start() {
    // Listen for anchor tag clicks
    this.linkRoot.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey) return;
      if (event.target.target) return;
      const anchor = this._findAnchor(event.target);
      if (!anchor) return;
      // Calculate full URL from potentially relative URL
      const url = new URL(anchor.href, location.href);
      this._handleNewURL({ url, event });
    });

    // Handle back button
    addEventListener("popstate", (event) => {
      this._handleNewURL({ url: new URL(location.href), replace: true });
    });

    // Initialize router with current URL
    this._handleNewURL({ url: new URL(location.href), replace: true });
  }

  _handleNewURL({ url, replace = false, event = undefined }) {
    const { route, match } = this._findMatchingRoute(url) || {};
    if (!match || !match) return;
    if (event) event.preventDefault();
    const state = createState({
      url,
      routePattern: route.pattern,
      pathParams: match,
    });
    if (replace) {
      history.replaceState(state, "", url);
    } else {
      history.pushState(state, "", url);
    }
    route.callback(state);
  }

  _findMatchingRoute(url) {
    for (const route of this.routes) {
      const match = matchPath(route.pattern, url.pathname);
      if (match) return { route, match };
    }
    return undefined;
  }

  _findAnchor(element) {
    if (!element || element === this.linkRoot) return undefined;
    if (isRouteElement(element)) return element;
    return this._findAnchor(element.parentElement);
  }
}
