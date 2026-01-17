import alfabetoImg from '../assets/alfabeto.png';

function Alfabeto() {
    return (
        <div className="alfabeto-container">
            <h3>Alfabeto de Señas ASL</h3>
            <div className="alfabeto-grid">
                <img 
                    title="Alfabeto ASL" 
                    src={alfabetoImg} 
                    alt="Alfabeto de Señas ASL"
                />
            </div>
        </div>
    );
}

export default Alfabeto;