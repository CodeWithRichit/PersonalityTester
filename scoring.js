function score16P(questions, answers) {
  const totals = { EI: 0, NS: 0, TF: 0, JP: 0 };
  const counts = { EI: 0, NS: 0, TF: 0, JP: 0 };
  questions.forEach((q, i) => {
    const raw = answers[i];
    const score = q.reverse ? 6 - raw : raw;
    totals[q.trait] += score;
    counts[q.trait]++;
  });
  const avg = (trait) => totals[trait] / counts[trait];
  const type =
    (avg("EI") >= 3 ? "E" : "I") +
    (avg("NS") >= 3 ? "N" : "S") +
    (avg("TF") >= 3 ? "T" : "F") +
    (avg("JP") >= 3 ? "J" : "P");
  return type;
}
function scoreBig5(questions, answers) {
  const totals = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  const counts = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  questions.forEach((q, i) => {
    const raw = answers[i];
    const score = q.reverse ? 6 - raw : raw;
    totals[q.trait] += score;
    counts[q.trait]++;
  });
  const level = (trait) => {
    const avg = totals[trait] / counts[trait];
    if (avg <= 2.3) return "Low";
    if (avg <= 3.6) return "Medium";
    return "High";
  };
  return {
    O: level("O"),
    C: level("C"),
    E: level("E"),
    A: level("A"),
    N: level("N"),
  };
}