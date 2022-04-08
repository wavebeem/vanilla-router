const router = document.querySelector("vanilla-router");

router.addEventListener("route-changed", (event) => {
  render(event.detail.state);
});

function render(state) {
  const main = document.querySelector("main");
  main.textContent = state.href;
  console.log(state);
}

render(history.state);
