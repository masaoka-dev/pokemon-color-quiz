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

const area_button_color = (on_off: boolean) => {
  return on_off ? 
      "bg-[#0044BB] text-white px-4 py-2 rounded hover:bg-[#002299]"
    : "bg-[#DDDDDD] text-black px-4 py-2 rounded hover:bg-[#BBBBBB]"
}



export default function QuizPage() {
  const [scene, setScene] = useState("title");
  const [difficulty, setDifficulty] = useState(0);
  // const [areasSelected, setAreasSelected] = useState([true, true, true, true, true, true, true, true, true, true]);
  const [areasSelected, setAreasSelected] = useState([true, true, true, false, false, false, false, false, false, false]);
  const [options, setOptionss] = useState([true, true]);
  
  const [allQuizData, setAllQuizData] = useState<QuizItem[]>([]);
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [countCorrect, setCountCorrect] = useState(0);

  const [nameList, setNameList] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const parse_jsonl = (text: string) => {
    const lines = text.trim().split('\n');
    const parsed: QuizItem[] = lines.map((line) => JSON.parse(line));
    
    const namesWithSub = parsed.map(p =>
      p.sub_name ? `${p.name}（${p.sub_name}）` : p.name
    );
    setNameList(namesWithSub);
  
    const shuffled = parsed.sort(() => 0.5 - Math.random());
      setAllQuizData(parsed);
      setQuizList(shuffled.slice(0, 10));
    }

    const initialize_game = (difficulty: number) => {
      setDifficulty(difficulty);
      setScene("game");
      fetchData();
    }

    const fetchData = async () => {
      try {
        const configStr = "area: =[1, 2]\nis_final_evolution: =true\nmega_flg: =0\ngenshi_flg: =0\nkyodai_flg: =0";
        const res = await fetch(`/api/create_group`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: configStr }),
      });
        // if (!res.ok) {
        //   throw new Error(`HTTP error. status: ${res.status}`);
        // }
        
        const data = await res.text();
        parse_jsonl(data);
      } catch (err) {
        console.error(err);
      }
    }


  // ひらがなtoカタカナ
  const toKatakana = (str: string) =>
  str.replace(/[\u3041-\u3096]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );

  const getFullName = (p: QuizItem) => 
  p.sub_name ? `${p.name}（${p.sub_name}）` : p.name;

  useEffect(() => {
    fetch('/data/pokemon_data.jsonl')
    .then((res) => res.text())
    .then(parse_jsonl);
  }, []);

  const handleInputChange = (value: string) => {
  setUserAnswer(value);
  const katakanaInput = toKatakana(value.trim());
  if (katakanaInput === '') {
    setSuggestions([]);
    return;
  }
  const filtered = nameList.filter(name =>
    name.startsWith(katakanaInput)
  );
  setSuggestions(filtered);
};

  const area_names = ["カントー", "ジョウト", "ホウエン"];

  const current = quizList[currentIndex];

  const handleCheck = () => {
    if (userAnswer.trim() === '') return;

    if (userAnswer.trim() === getFullName(current)) {
      setResult('correct');
      setCountCorrect((prev) => prev + 1);
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

  switch(scene) {
    case "title":
      return (
        
      <div className="w-screen h-screen bg-white flex items-center justify-center p-4">
      <div className="grid grid-rows-4 items-center w-full max-w-md text-center">

        <h1 className="place-items-center text-xl font-bold">ポケモン色彩クイズ</h1>

        <div className="grid grid-cols-5">
          <div></div>
          <div className="col-span-3 flex flex-col justify-center gap-2">
            <button
              onClick={() => {
                initialize_game(1);
              }}
              className="bg-red-700 text-white py-2 rounded hover:bg-red-800"
            >
              モンスターボール級
            </button>
            <button
              onClick={() => {
                initialize_game(2);
              }}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              スーパーボール級
            </button>
            <button
              onClick={() => {
                initialize_game(3);
              }}
              className="bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
            >
              ハイパーボール級
            </button>
            <button
              onClick={() => {
                initialize_game(4);
              }}
              className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              マスターボール級
            </button>
          </div>
          <div></div>
        </div>

        <div className="flex flex-row justify-center gap-2">
          {area_names.map((area_name, index) => (
            <button
              key={index}
              onClick={() => {
                setAreasSelected(prev =>
                  prev.map((selected, i) =>
                    (i === index ? !selected : selected))
                );
              }}
              className={area_button_color(areasSelected[index])}
            >
              {area_name}
            </button>
          ))}
        </div>
          
      </div>
    </div>

      )
    case "game": 
      if (quizList.length === 0) {
        return <div className="w-screen h-screen flex items-center justify-center">読み込み中...</div>;
      }

      if (currentIndex >= quizList.length) {
        return (
          <div className="w-screen h-screen flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-2xl font-bold mb-4">クイズ終了！</h1>
            <h1 className="text-2xl font-bold mb-4">10問中 {countCorrect}問 正解！</h1>
            <button
              onClick={() => {
                const reshuffled = [...allQuizData].sort(() => 0.5 - Math.random());
                setQuizList(reshuffled.slice(0, 10));
                setCurrentIndex(0);
                setResult(null);
                setShowAnswer(false);
                setUserAnswer('');
                setScene("title");
                setCountCorrect(0);
              }}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              もう一度遊ぶ
            </button>
          </div>
        );
      }

      return (
        <div className="grid grid-rows-20 h-screen bg-white flex items-center justify-center p-4">
          <div className="row-span-3 w-full max-w-md text-center">
            <h1 className="text-xl font-bold mb-4">ポケモン色彩クイズ {currentIndex + 1} / 10</h1>
            <p className="mb-2 text-gray-600">この画像のポケモンはだれ？</p>

          </div>
          <div className="row-span-5 h-full max-w-md text-center mx-auto">
            <img
              src={`/pokemon_treemaps/${current.image_treemap}`}
              alt={`クイズ画像 ${currentIndex + 1}`}
              className="h-full max-w-md object-cover"
            />
          </div>

          <div className="row-span-12 h-full max-w-md text-center">
            {!showAnswer ? (
              <div className='relative'>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="ここにポケモンの名前を入力"
                  className="w-full p-2 border rounded mb-4"
                />
                
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full border rounded bg-white text-left mb-4 max-h-40 overflow-y-auto">
                    {suggestions.map((s, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setUserAnswer(s);
                          setSuggestions([]);
                        }}
                        className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={handleCheck}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  答え合わせ
                </button>
              </div>
            ) : (
              <div className='h-[calc(100vh/2)] grid grid-rows-2 flex items-center justify-center'>
                <div className='h-[calc(100vh/4)] max-w-md mx-auto'>
                  <img
                    src={`/pokemon_images/${current.image}`}
                    alt={`正解画像 ${currentIndex + 1}`}
                    className="h-full object-contain  mx-auto"
                  />
                </div>
                <div className='h-[calc(100vh/4)] grid grid-rows-3 flex items-center justify-center text-center'>
                  <span className={`mt-4 font-bold ${result === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                  {result === 'correct' ? '正解！🎉' : `不正解… 正解は「${getFullName(current)}」でした`}
                  </span>
                  <div className="text-left mt-4 space-y-2">
                    <p><strong>名前:</strong> {getFullName(current)}</p>
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
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
}
