const enterBtn = document.getElementById("enter-btn");
function handleClick() {
  window.location.href = `${import.meta.env.VITE_CLIENT_URL}/room`;
}

enterBtn.addEventListener("click", handleClick);
