import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ModeSelect from './components/ModeSelect';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { generateQuiz, shuffleArray } from './utils/quizHelpers';

export default function App() {
  const [view, setView] = useState('upload');
  const [wordList, setWordList] = useState([]);
  const [mode, setMode] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleUpload = (words, baseName) => {
    setWordList(words);
    setFileName(baseName);
    setView('modeSelect');
  };

  const handleSelectMode = (selectedMode, count) => {
    setMode(selectedMode);
    const selected = shuffleArray([...wordList]).slice(0, count);
    setQuestions(generateQuiz(selected, selectedMode, wordList));
    setView('quiz');
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setView('results');
  };

  const handleRetryWrong = () => {
    const wrongItems = quizResults
      .filter(r => !r.passed)
      .map(r => wordList.find(w => w.word === r.word))
      .filter(Boolean);
    setQuestions(generateQuiz(wrongItems, mode, wordList));
    setView('quiz');
  };

  const handleRestartAll = () => {
    setQuestions(generateQuiz(wordList, mode));
    setView('quiz');
  };

  const handleNewFile = () => {
    setWordList([]);
    setMode(null);
    setQuestions([]);
    setQuizResults([]);
    setView('upload');
  };

  return (
    <div className="app">
      {view === 'upload' && <FileUpload onUpload={handleUpload} />}
      {view === 'modeSelect' && (
        <ModeSelect wordCount={wordList.length} onSelectMode={handleSelectMode} />
      )}
      {view === 'quiz' && (
        <Quiz key={questions.length + Date.now()} questions={questions} onComplete={handleQuizComplete} />
      )}
      {view === 'results' && (
        <Results
          results={quizResults}
          fileName={fileName}
          onRetryWrong={handleRetryWrong}
          onRestartAll={handleRestartAll}
          onNewFile={handleNewFile}
        />
      )}
    </div>
  );
}
