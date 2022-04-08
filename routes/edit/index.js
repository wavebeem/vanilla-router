const html = String.raw;

export function render({ router, match }) {
  const items = [
    html`
      <li>
        <p><a href="/edit/1/">Edit item #1</a></p>
      </li>
    `,
    html`
      <li>
        <p><a href="/edit/2/">Edit item #2</a></p>
      </li>
    `,
    html`
      <li>
        <p>
          <a href="/edit/2/?type=short">Edit item #2 (with search params)</a>
        </p>
      </li>
    `,
    html`
      <li>
        <p>
          <a href="/edit/3/?foo=bar&quux=baz&snoop&dup=1&dup=2"
            >Edit item #3 (with search params)</a
          >
        </p>
      </li>
    `,
  ];
  if (match.searchParams.sort === "desc") {
    items.reverse();
  }
  router.renderRoot.innerHTML = html`
    <h1>Edit</h1>

    <p>
      Sort:
      <a href="?sort=asc">Ascending</a> &bullet;
      <a href="?sort=desc">Descending</a>
    </p>

    <ul>
      ${items.join("\n")}
    </ul>
  `;
}
