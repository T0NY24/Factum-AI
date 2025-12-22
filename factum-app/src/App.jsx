import { useState } from 'react';
import Navigation from './components/Navigation/Navigation';
import Screen1 from './screens/Screen1/Screen1';
import Screen2 from './screens/Screen2/Screen2';
import Screen3 from './screens/Screen3/Screen3';
import Screen4 from './screens/Screen4/Screen4';
import Screen5 from './screens/Screen5/Screen5';
import Screen6 from './screens/Screen6/Screen6';
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

  const handleAnalysisComplete = (result) => {
    setModerationResult(result);

    // Guardar en historial automáticamente
    if (imageData && result) {
      saveToHistory(imageData, result);
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
      </main>
    </div>
  );
}

export default App;
