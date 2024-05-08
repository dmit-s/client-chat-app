const enterBtn = document.getElementById("enter-btn");
function handleClick() {
  window.location.href = "http://localhost:5173/room";
}

enterBtn.addEventListener("click", handleClick);
