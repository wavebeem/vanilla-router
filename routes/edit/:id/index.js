const html = String.raw;

export function render({ router, match }) {
  const { id } = match.pathParams;
  router.renderRoot.innerHTML = html`
    <h1>Edit #<span class="id"></span></h1>

    <pre class="searchParams"></pre>

    <!-- Relative paths work just fine! -->
    <a href="..">Back</a>
  `;
  router.renderRoot.querySelector(".id").textContent = id;
  router.renderRoot.querySelector(".searchParams").textContent =
    "searchParams " + JSON.stringify(match.searchParams, null, 2);
}
