export default function updateUsersCounter(usersData) {
  const usersCounterEl = document.getElementById("users-counter");
  usersCounterEl.textContent = usersData.length;
}
