import { useState, useRef } from 'react';
import { parseExcel } from '../utils/quizHelpers';
import otter from "../../public/otter.jpg"

export default function FileUpload({ onUpload }) {
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const words = parseExcel(evt.target.result);
        if (words.length < 5) {
          setError('최소 5개 이상의 단어가 필요합니다.');
          return;
        }
        const baseName = file.name.replace(/\.[^.]+$/, '');
        onUpload(words, baseName);
      } catch {
        setError('엑셀 파일을 읽을 수 없습니다. 올바른 파일인지 확인해주세요.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="file-upload">
      <img src={otter} alt="PBIK Quiz" className="logo" />
      <h1>PBIK Quiz</h1>
      <p>1열: 단어, 2열: 뜻이 있는 엑셀 파일을 업로드하세요.</p>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        className="file-input"
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
