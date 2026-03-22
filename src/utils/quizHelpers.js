import * as XLSX from 'xlsx';

export function parseExcel(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const words = rows
    .filter(row => row[0] && row[1])
    .map(row => ({
      word: String(row[0]).trim(),
      meaning: String(row[1]).trim(),
    }));

  return words;
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateQuiz(quizWords, mode, choicePool = null) {
  const pool = choicePool || quizWords;
  const shuffled = shuffleArray([...quizWords]);
  const choiceField = mode === 'wordToMeaning' ? 'meaning' : 'word';

  return shuffled.map(item => {
    const others = pool.filter(w => w.word !== item.word);
    const wrongChoices = shuffleArray(others).slice(0, 4);

    const choices = shuffleArray([
      item[choiceField],
      ...wrongChoices.map(w => w[choiceField]),
    ]);

    return {
      prompt: mode === 'wordToMeaning' ? item.word : item.meaning,
      correctAnswer: item[choiceField],
      choices,
      word: item.word,
      meaning: item.meaning,
    };
  });
}
