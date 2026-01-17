function SentenceDisplay({ sentence, onSpeak, onClear, onDeleteLast }) {
  return (
    <div className="sentence-container">
      <h2>Oración:</h2>
      <div className="sentence-text">
        {sentence || "Empieza a hacer señas..."}
      </div>
      <div className="button-group">
        <button 
          onClick={onSpeak} 
          className="btn btn-speak"
          disabled={!sentence}
        >
          Escuchar
        </button>
        <button 
          onClick={onDeleteLast} 
          className="btn btn-delete"
          disabled={!sentence}
        >
          Borrar letra
        </button>
        <button 
          onClick={onClear} 
          className="btn btn-clear"
          disabled={!sentence}
        >
          Borrar todo
        </button>
      </div>
    </div>
  );
}

export default SentenceDisplay;