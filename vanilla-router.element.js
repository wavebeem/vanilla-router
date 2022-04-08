function isRouteElement(element) {
  return (
    element.tagName === "A" &&
    new URL(element.href, location.href).origin === location.origin
  );
}

function findParentWhere(element, fn) {
  if (!element) return undefined;
  if (fn(element)) return element;
  return findParentWhere(element.parentElement, fn);
}

function createState(url) {
  return {
    href: url.pathname + url.search + url.hash,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    params: Object.fromEntries(new URLSearchParams(url.search)),
  };
}

export class HTMLVanillaRouterElement extends HTMLElement {
  connectedCallback() {
    this.addEventListener("click", (event) => {
      const anchor = findParentWhere(event.target, isRouteElement);
      if (anchor) {
        const url = new URL(anchor.href, location.href);
        history.pushState(createState(url), "", url);
        const routeChangedEvent = new CustomEvent("route-changed", {
          detail: { state: history.state },
        });
        this.dispatchEvent(routeChangedEvent);
        event.preventDefault();
      }
    });

    history.replaceState(
      createState(new URL(location.href)),
      "",
      location.href
    );
  }
}

customElements.define("vanilla-router", HTMLVanillaRouterElement);
