import { useState } from 'react';

export default function ModeSelect({ wordCount, onSelectMode }) {
  const [count, setCount] = useState(wordCount);
  const [error, setError] = useState(null);

  const handleStart = (mode) => {
    const num = Number(count);
    if (!num || num < 1) {
      setError('1 이상의 숫자를 입력해주세요.');
      return;
    }
    if (num > wordCount) {
      setError(`최대 ${wordCount}개까지 입력할 수 있습니다.`);
      return;
    }
    setError(null);
    onSelectMode(mode, num);
  };

  return (
    <div className="mode-select">
      <h1>퀴즈 모드 선택</h1>
      <p>{wordCount}개의 단어가 로드되었습니다.</p>

      <div className="count-input">
        <label htmlFor="quiz-count">풀이할 문제 수</label>
        <input
          id="quiz-count"
          type="number"
          min={1}
          max={wordCount}
          value={count}
          onChange={(e) => { setCount(e.target.value); setError(null); }}
        />
        {error && <p className="error">{error}</p>}
      </div>

      <div className="mode-buttons">
        <button className="mode-btn" onClick={() => handleStart('wordToMeaning')}>
          단어 → 뜻
        </button>
        <button className="mode-btn" onClick={() => handleStart('meaningToWord')}>
          뜻 → 단어
        </button>
      </div>
    </div>
  );
}
