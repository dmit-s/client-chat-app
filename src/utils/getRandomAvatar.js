export default async function getRandomAvatar() {
  const data = await fetch("https://api.randomuser.me")
    .then((res) => res.json())
    .then((data) => data);

  return data.results[0].picture.medium;
}
