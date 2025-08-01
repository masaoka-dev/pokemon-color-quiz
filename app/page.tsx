'use client';

import React, { useState, useEffect } from 'react';
import quizData from './data/pokemon_data.json';

type QuizItem = {
  id: string;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
};

export default function QuizPage() {
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    setQuizList(shuffled.slice(0, 10)); // ランダムに10問
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
            const reshuffled = [...quizData].sort(() => 0.5 - Math.random());
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
          src={`/${current.image}`}
          alt={`クイズ画像 ${currentIndex + 1}`}
          className="w-64 h-64 mx-auto object-contain mb-4 border rounded-lg"
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
              <p><strong>タイプ:</strong> {current.types.join(' / ')}</p>
              <p><strong>とくせい:</strong> {current.abilities.join(' / ')}</p>
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
