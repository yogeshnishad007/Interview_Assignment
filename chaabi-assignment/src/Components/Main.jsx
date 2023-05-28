
import { useState, useEffect, useRef } from 'react';
import "../style.css";

const SECONDS = 5;

function Main() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords(10));
  }, []);



  useEffect(() => {
    if (status === 'started') {
      textInput.current.focus();
    }
  }, [status]);



const generateWords = (count) => {
  const keys = 'asdfjkl';
  const wordLength = 20;
  const randomWords = [];

  for (let i = 0; i < count; i++) {
    let randomWord = '';
    for (let j = 0; j < wordLength; j++) {
      const randomIndex = Math.floor(Math.random() * keys.length);
      randomWord += keys[randomIndex];
    }
    randomWords.push(randomWord);
  }

  return randomWords;
};



  // Start Button for start 
  const start=()=> {
    if (status === 'finished') {
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar('');
    }

    setStatus('started');
    setWords(generateWords(10)); 
    setCurrInput('');
    setCountDown(SECONDS);
    setCurrCharIndex(-1);
    setCurrChar('');
    setCurrWordIndex(0);
    setCountDown(SECONDS);

    let interval = setInterval(() => {
      setCountDown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(interval);
          setStatus('finished');
          return SECONDS;
        } else {
          return prevCountdown - 1;
        }
      });
    }, 1000);
  }



  const handleKeyDown = ({ keyCode, key }) => {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrInput('');
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
      // backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar('');
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  };
  

  
   
  const checkMatch = () => {
    const wordToCompare = words[currWordIndex];
    const isMatch = wordToCompare === currInput.trim();
  
    if (isMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  
    if (currWordIndex === words.length - 1 && isMatch) {
      // Typing is completed and matched
      const newWords = generateWords(10); // Generate new words
      setWords(newWords);
      setCurrInput('');
      setCurrWordIndex(0);
    } else {
      setCurrWordIndex(currWordIndex + 1);
    }
  };
  
  

// Typing letter check correct or not and chnage color

  const getCharClass =(wordInx, charInx, char)=> {
    if (
      wordInx === currWordIndex &&
      charInx === currCharIndex &&
      currChar &&
      status !== 'finished'   ) {
        if (char === currChar) {
          return 'background-green';
        } else {
          return 'background-red';
        }
      } else if (wordInx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
        return 'background-red';
      } else {
        return '';
      }
    }



  return (
      <div className="App">
        <div className="timer-div">
          <h2>{countDown}s</h2>
        </div>
  
  <div className='word-outer'>
        {status === 'started' && (
          <div className="word-div">
            {words.map((word, i) => (
              <span key={i}>
                <span className={`word ${currWordIndex === i ? 'matched' : ''}`}>

                  {word.split("").map((char, inx) => (

                    <span className={getCharClass(i, inx, char)} key={inx}>{char}</span>
                  ))}
                </span>
                <span> </span>
              </span>
            ))}
          </div>
        )}
  </div>

        <div className="input-div">
          <input
            ref={textInput}
            disabled={status !== 'started'}
            type="text"
            className="input"
            onKeyDown={handleKeyDown}
            value={currInput}
            onChange={(e) => setCurrInput(e.target.value)}
          />
        </div>
  
        <div className="start-btn-div">
          <button className="start-btn" onClick={start}>
            Start
          </button>
        </div>
  
        {status === 'finished' && (
          <div className="result-main-div">

            <div className="wpm-main-div">
              <p className="wpm-heading">WPM:</p>
              <p className="wpm-value">{correct}</p>
            </div>
  
            <div className="accuracy-main-div">
              <p className="accuracy-heading">Accuracy:</p>

              {correct !== 0 ? (
                <p className="accuracy-value">
                  {Math.round((correct / (correct + incorrect)) * 100)}%
                </p>
              ) : (
                <p className="accuracy-value">0%</p>
              )}
            </div>
  
            <div className="result-btn-div">
              <button className="result-btn" onClick={() => setStatus("waiting")}>
                Cancel
              </button>
            </div>


          </div>
        )}
      </div>
    );
  
  
    }
  export default Main;
  





