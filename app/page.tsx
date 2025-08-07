'use client';

import React, { useState, useEffect } from 'react';

type QuizItem = {
  id: string;
  no: string;
  sub: string;
  name: string;
  sub_name: string;
  area: string;
  omosa: string;
  takasa: string;
  bunrui: string;
  tokusei_1: string;
  tokusei_2: string;
  tokusei_3: string;
  tokusei_4: string;
  type_1: string;
  type_2: string;
  mega_flg: string;
  genshi_flg: string;
  kyodai_flg: string;
  is_final_evolution: string;
  image: string;
  image_treemap: string;
};

export default function QuizPage() {
  const [allQuizData, setAllQuizData] = useState<QuizItem[]>([]);
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetch('/data/pokemon_data.jsonl')
    .then((res) => res.text())
    .then((text) => {
      const lines = text.trim().split('\n');
      const parsed: QuizItem[] = lines.map((line) => JSON.parse(line));
      const shuffled = parsed.sort(() => 0.5 - Math.random());
      setAllQuizData(parsed); // ← ここを追加
      setQuizList(shuffled.slice(0, 10));
    });
  }, []);

  const current = quizList[currentIndex];

  const handleCheck = () => {
    if (userAnswer.trim() === '') return;
    if (userAnswer.trim() === current.name) {
      setResult('correct');
    } else {
      setResult('wrong');
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setUserAnswer('');
    setResult(null);
    setShowAnswer(false);
  };

  if (quizList.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (currentIndex >= quizList.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold mb-4">クイズ終了！🎉</h1>
        <button
          onClick={() => {
            const reshuffled = [...allQuizData].sort(() => 0.5 - Math.random());
            setQuizList(reshuffled.slice(0, 10));
            setCurrentIndex(0);
            setResult(null);
            setShowAnswer(false);
            setUserAnswer('');
          }}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          もう一度遊ぶ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-4">ポケモン色彩クイズ {currentIndex + 1} / 10</h1>
        <p className="mb-2 text-gray-600">この画像のポケモンはだれ？</p>

        <img
          src={`/pokemon_treemaps/${current.image_treemap}`}
          alt={`クイズ画像 ${currentIndex + 1}`}
        />

        {!showAnswer ? (
          <>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="ここにポケモンの名前を入力"
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleCheck}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              答え合わせ
            </button>
          </>
        ) : (
          <>
            <div className={`mt-4 font-bold ${result === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {result === 'correct' ? '正解！🎉' : `不正解… 正解は「${current.name}」でした`}
            </div>
            <div className="text-left mt-4 space-y-2">
              <p><strong>名前:</strong> {current.name}</p>
              <p><strong>タイプ:</strong> {[current.type_1, current.type_2].filter(Boolean).join(' / ')}</p>
              <p><strong>とくせい:</strong> {
              [current.tokusei_1, current.tokusei_2, current.tokusei_3, current.tokusei_4]
              .filter(Boolean).join(' / ')
              }</p>
            </div>
            <button
              onClick={handleNext}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              次の問題へ
            </button>
          </>
        )}
      </div>
    </div>
  );
}
