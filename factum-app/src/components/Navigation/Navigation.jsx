import React from 'react';
import { SCREEN_NAMES } from '../../utils/constants';
import './Navigation.css';

const Navigation = ({ currentScreen, onNavigate }) => {
    // Solo mostrar pantallas navegables manualmente: Upload (1), Historial (5), Config (6)
    // Las pantallas 2, 3, 4 son transicionales y el flujo las controla automáticamente
    const navigableScreens = [1, 5, 6];
    const screens = navigableScreens.map(id => ({
        id,
        name: SCREEN_NAMES[id]
    }));

    return (
        <div className="navigation-container">
            <div className="navigation-content">
                <h1 className="navigation-title">AWS Rekognition - Content Moderation</h1>
                <div className="navigation-buttons">
                    {screens.map(screen => (
                        <button
                            key={screen.id}
                            onClick={() => onNavigate(screen.id)}
                            className={`nav-button ${currentScreen === screen.id ? 'active' : ''}`}
                        >
                            {screen.id}. {screen.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navigation;
