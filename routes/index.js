const html = String.raw;

export function render({ router, match }) {
  router.renderRoot.innerHTML = html`<h1>Home page</h1>`;
}
