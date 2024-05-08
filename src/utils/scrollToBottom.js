export default function scrollToBottom() {
  const lastElem = document.getElementById("last-elem");
  lastElem.scrollIntoView({ behavior: "smooth", block: "end" });
}
