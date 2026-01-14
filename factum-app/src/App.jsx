import { useState } from 'react';
import Navigation from './components/Navigation/Navigation';
import Screen1 from './screens/Screen1/Screen1';
import Screen2 from './screens/Screen2/Screen2';
import Screen3 from './screens/Screen3/Screen3';
import Screen4 from './screens/Screen4/Screen4';
import Screen5 from './screens/Screen5/Screen5';
import Screen6 from './screens/Screen6/Screen6';
import ScreenSuggestive from './screens/ScreenSuggestive/ScreenSuggestive';
import { saveToHistory } from './services/historyService';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [imageData, setImageData] = useState(null);
  const [moderationResult, setModerationResult] = useState(null);

  const handleNavigate = (screenNumber) => {
    setCurrentScreen(screenNumber);
  };

  const handleImageSelected = (data) => {
    setImageData(data);
  };

  /**
   * Detecta el nivel de contenido basándose en los labels de Rekognition
   * Taxonomía Oficial basada en AWS Rekognition Developer Guide
   * @param {Object} result - Resultado del análisis de Rekognition
   * @returns {string} - 'safe', 'suggestive', o 'unsafe'
   */
  const detectContentStatus = (result) => {
    // Si el backend ya nos dice el status, usarlo directamente
    if (result.status) {
      return result.status;
    }

    const labels = result.labels || [];

    // --- TAXONOMÍA OFICIAL AWS (Fuente: Rekognition Developer Guide) ---

    // GRUPO 1: INSEGURO (ROJO) - Bloqueo automático
    const UNSAFE_PARENTS = [
      'Explicit Nudity',
      'Violence',
      'Visually Disturbing',
      'Hate Symbols'
    ];

    // GRUPO 2: SUGESTIVO (AMARILLO) - Categorías padre
    const SUGGESTIVE_PARENTS = [
      'Suggestive',
      'Tobacco',
      'Alcohol',
      'Drugs'
    ];

    // GRUPO 2B: SUGESTIVO (AMARILLO) - Etiquetas específicas
    const SUGGESTIVE_LABELS = [
      'Revealing Clothes',
      'Swimwear or Underwear',
      'Partial Nudity',
      'Barechested'
    ];

    // --- CLASIFICACIÓN (El orden importa: primero buscamos lo peor) ---

    // Si isInappropriate viene del backend, es unsafe
    if (result.isInappropriate) {
      console.log('🔴 Backend marcó como inapropiado');
      return 'unsafe';
    }

    // Primero buscamos lo peor (Inseguro)
    const isUnsafe = labels.some(l =>
      UNSAFE_PARENTS.includes(l.ParentName) || UNSAFE_PARENTS.includes(l.Name)
    );
    if (isUnsafe) {
      console.log('🔴 DETECTADO: Inseguro');
      return 'unsafe';
    }

    // Luego buscamos lo sugestivo (Amarillo)
    const isSuggestive = labels.some(l =>
      SUGGESTIVE_PARENTS.includes(l.ParentName) ||
      SUGGESTIVE_LABELS.includes(l.Name) // Aquí cae bikini, ropa reveladora, etc.
    );
    if (isSuggestive) {
      console.log('🟡 DETECTADO: Sugestivo');
      return 'suggestive';
    }

    // Si no es nada de lo anterior
    console.log('🟢 DETECTADO: Seguro');
    return 'safe';
  };

  const handleAnalysisComplete = (result) => {
    console.log('📊 handleAnalysisComplete called');
    console.log('📷 imageData:', imageData);
    console.log('📋 result:', result);

    // Detectar el status basándose en los labels
    const detectedStatus = detectContentStatus(result);
    console.log('🎯 Detected status:', detectedStatus);

    // Añadir el status al resultado para guardarlo en historial
    const enrichedResult = {
      ...result,
      status: detectedStatus
    };

    setModerationResult(enrichedResult);

    // Guardar en historial automáticamente
    if (imageData && enrichedResult) {
      console.log('💾 Saving to history...');
      saveToHistory(imageData, enrichedResult);
    } else {
      console.warn('⚠️ Cannot save to history: imageData or result is null');
    }

    // REDIRECCIÓN TRIPLE basada en el status detectado
    if (detectedStatus === 'unsafe') {
      setCurrentScreen(4); // Rojo - Inseguro
    } else if (detectedStatus === 'suggestive') {
      setCurrentScreen(7); // Amarillo - Sugestivo
    } else {
      setCurrentScreen(3); // Verde - Seguro
    }
  };

  const handleReset = () => {
    setImageData(null);
    setModerationResult(null);
    setCurrentScreen(1);
  };

  return (
    <div className="app">
      {/* Navigation */}
      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main className="app-content">
        {currentScreen === 1 && (
          <Screen1
            onNavigate={handleNavigate}
            onImageSelected={handleImageSelected}
          />
        )}

        {currentScreen === 2 && (
          <Screen2
            imageData={imageData}
            onAnalysisComplete={handleAnalysisComplete}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 3 && (
          <Screen3
            moderationResult={moderationResult}
            imageUrl={imageData?.url}
            onReset={handleReset}
          />
        )}

        {currentScreen === 4 && (
          <Screen4
            moderationResult={moderationResult}
            imageUrl={imageData?.url}
            onReset={handleReset}
          />
        )}

        {currentScreen === 5 && <Screen5 />}

        {currentScreen === 6 && <Screen6 />}

        {currentScreen === 7 && (
          <ScreenSuggestive
            moderationResult={moderationResult}
            imageUrl={imageData?.url}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

export default App;
