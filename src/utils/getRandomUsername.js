const adjectives = [
  "красивый",
  "умный",
  "смелый",
  "добрый",
  "веселый",
  "любящий",
  "талантливый",
  "сильный",
  "нежный",
  "дружелюбный",
  "внимательный",
  "честный",
];

const nouns = [
  "человек",
  "женщина",
  "мужчина",
  "ребенок",
  "учитель",
  "студент",
  "доктор",
  "медсестра",
  "пожилой человек",
  "полицейский",
  "пожарный",
  "врач",
  "писатель",
];

export default function getRandomUsername() {
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
    nouns[Math.floor(Math.random() * adjectives.length)]
  }`;
}
