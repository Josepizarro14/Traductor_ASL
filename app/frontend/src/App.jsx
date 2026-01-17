import { useState, useRef, useCallback } from 'react';
import VideoCapture from './components/Camara.jsx';
import SentenceDisplay from './components/Pantalla.jsx';
import useWebSocket from './hooks/useWebSocket.jsx';
import Alfabeto from './components/Alfabeto.jsx'; 
import './App.css';

function App() {
  const [sentence, setSentence] = useState("");
  const [currentLetter, setCurrentLetter] = useState("-");
  const [cooldown, setCooldown] = useState(false);
  const lastLetterRef = useRef("-");
  const framesConsistent = useRef(0);

  const handleMessage = useCallback((data) => {
    if (data.letter) {
      setCurrentLetter(data.letter);
      handleSentenceBuilding(data.letter);
    }
  }, []);

  //const { sendMessage } = useWebSocket("ws://localhost:8000/ws", handleMessage);
  const { sendMessage } = useWebSocket("wss://raductor-josepinsuco5093-agakjebu.leapcell.dev/ws", handleMessage);
  const handleSentenceBuilding = (letter) => {

    if(cooldown) return;

    if (letter === lastLetterRef.current) {
      framesConsistent.current += 1;
    } else {
      lastLetterRef.current = letter;
      framesConsistent.current = 0;
    }

    if (framesConsistent.current === 10) {
      if (letter === "space") {
        setSentence(prev => prev + " ");
      } else if (letter === "del") {
        setSentence(prev => prev.slice(0, -1));
      } else if (letter !== "nothing") {
        setSentence(prev => prev + letter);
      }
      framesConsistent.current = 0;
      setCooldown(true);
      setTimeout(() => setCooldown(false), 1000);
    }
  };

  const speakSentence = () => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  const deleteLast = () => {
    setSentence(prev => prev.slice(0, -1));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Traductor de Señas ASL</h1>
      </header>
      
      <main className="app-main">
        <VideoCapture 
          onFrame={sendMessage} 
          currentLetter={currentLetter}
        />
        
        <SentenceDisplay 
          sentence={sentence}
          onSpeak={speakSentence}
          onClear={() => setSentence("")}
          onDeleteLast={deleteLast}
        />
        <Alfabeto />
      </main>
    </div>
  );
}

export default App;