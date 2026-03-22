import * as XLSX from 'xlsx';

export default function Results({ results, fileName, onRetryWrong, onRestartAll, onNewFile }) {
  const total = results.length;
  const correct = results.filter(r => r.passed).length;
  const wrong = results.filter(r => !r.passed);

  const handleDownloadWrong = () => {
    const data = wrong.map(item => ({ '단어': item.word, '정의': item.meaning }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0'),
    ].join('');

    XLSX.writeFile(wb, `${fileName}_${timestamp}.xlsx`);
  };

  return (
    <div className="results">
      <h1>결과</h1>
      <div className="score">
        {correct} / {total} 정답
      </div>

      {wrong.length > 0 && (
        <div className="wrong-list">
          <h2>틀린 단어</h2>
          <ul>
            {wrong.map((item, i) => (
              <li key={i}>
                <strong>{item.word}</strong> — {item.meaning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="result-buttons">
        {wrong.length > 0 && (
          <>
            <button className="result-btn retry" onClick={onRetryWrong}>
              틀린 문제 다시 풀기
            </button>
            <button className="result-btn" onClick={handleDownloadWrong}>
              틀린 단어 다운로드
            </button>
          </>
        )}
        <button className="result-btn" onClick={onRestartAll}>
          전체 다시 풀기
        </button>
        <button className="result-btn" onClick={onNewFile}>
          홈화면으로 이동
        </button>
      </div>
    </div>
  );
}
