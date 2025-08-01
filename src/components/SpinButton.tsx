import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export function SpinButton() {
  const [loading, setLoading] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);

  // Datos de prueba locales como fallback
  const localPrizes = ["🎁 Premio 1", "🏆 Premio 2", "🎉 Premio 3", "💎 Premio 4", "🌟 Premio 5"];

  const handleSpin = async () => {
    setLoading(true);
    setPrize(null);
    try {
      console.log("Intentando conectar a Firestore...");
      const snapshot = await getDocs(collection(db, "prizes"));
      console.log("Snapshot obtenido:", snapshot.size, "documentos");
      
      if (snapshot.empty) {
        console.log("No hay premios en Firestore, usando datos locales");
        const random = localPrizes[Math.floor(Math.random() * localPrizes.length)];
        setPrize(random);
        return;
      }
      
      const prizes = snapshot.docs.map(doc => {
        console.log("Documento:", doc.id, doc.data());
        return doc.data().name;
      });
      
      const random = prizes[Math.floor(Math.random() * prizes.length)];
      setPrize(random);
    } catch (error: any) {
      console.error("Error detallado:", error);
      console.error("Código de error:", error?.code);
      console.error("Mensaje:", error?.message);
      
      // Si hay error con Firebase, usar datos locales
      console.log("Error con Firebase, usando datos locales");
      const random = localPrizes[Math.floor(Math.random() * localPrizes.length)];
      setPrize(random);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        className="spin-button" 
        onClick={handleSpin} 
        disabled={loading}
      >
        {loading ? "🎲 Girando..." : "🎯 Girar Ruleta"}
      </button>
      {prize && (
        <div className="prize-result">
          🎉 ¡Felicidades! 🎉<br />
          <strong>{prize}</strong>
        </div>
      )}
    </div>
  );
}
