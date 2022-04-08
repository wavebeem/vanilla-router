const html = String.raw;

export function render({ router, match }) {
  router.renderRoot.innerHTML = html`
    <h1>Edit</h1>
    <ul>
      <li>
        <p><a href="/edit/1/">Edit item #1</a></p>
      </li>
      <li>
        <p><a href="/edit/2/">Edit item #2</a></p>
      </li>
      <li>
        <p><a href="/edit/2/?type=short">Edit item #2 (type=short)</a></p>
      </li>
      <li>
        <p>
          <a href="/edit/3/?foo=bar&quux=baz&snoop&dup=1&dup=2"
            >Edit item #3 (foo=bar&quux=baz&snoop&dup=1&dup=2)</a
          >
        </p>
      </li>
    </ul>
  `;
}
