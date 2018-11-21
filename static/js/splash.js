const body = document.body;
const title = document.querySelector("#title");

body.addEventListener("mousemove", (e) => {
  let w= Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  let x = (-e.clientX + w/2)/64 + 2;
  let y = (-e.clientY + h/2)/32 + 2;

  title.style.setProperty('--x', x + "px");
  title.style.setProperty('--y', y + "px");
});