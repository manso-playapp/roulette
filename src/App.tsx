import "./App.css";
import { SpinButton } from "./components/SpinButton";

function App() {
  const handleSetupFirestore = () => {
    if ((window as any).setupFirestore) {
      (window as any).setupFirestore();
    } else {
      console.error("setupFirestore no está disponible");
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">🎯 Roulette MVP</h1>
      <div className="spin-container">
        <SpinButton />
        
        <div className="setup-instructions">
          <p>💡 <strong>Configuración inicial:</strong></p>
          <p>Si es la primera vez que usas la app, haz clic en el botón de abajo para poblar la base de datos con premios de ejemplo.</p>
          <button className="setup-button" onClick={handleSetupFirestore}>
            🚀 Configurar Base de Datos
          </button>
          <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.8 }}>
            También puedes abrir la consola del navegador y ejecutar: <code>setupFirestore()</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
