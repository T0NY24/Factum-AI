import React from 'react';
import { SCREEN_NAMES } from '../../utils/constants';
import './Navigation.css';

const Navigation = ({ currentScreen, onNavigate }) => {
    const navigableScreens = [1, 5, 6];
    const screens = navigableScreens.map(id => ({
        id,
        name: SCREEN_NAMES[id]
    }));

    return (
        <div className="navigation-container">
            <div className="navigation-content">
                <div className="navigation-header">
                    <h1 className="navigation-title">ÉTICA VISUAL EC - Contenido Moderado</h1>
                    <img 
                        src="https://www.uide.edu.ec/wp-content/uploads/2025/06/logo-uide.webp" 
                        alt="Logo UIDE" 
                        className="navigation-logo"
                    />
                </div>
                <div className="navigation-buttons">
                    {screens.map((screen, index) => (
                        <button
                            key={screen.id}
                            onClick={() => onNavigate(screen.id)}
                            className={`nav-button ${currentScreen === screen.id ? 'active' : ''}`}
                        >
                            {index + 1}. {screen.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navigation;