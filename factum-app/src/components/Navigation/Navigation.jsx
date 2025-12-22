import React from 'react';
import { SCREEN_NAMES } from '../../utils/constants';
import './Navigation.css';

const Navigation = ({ currentScreen, onNavigate }) => {
    const screens = Object.entries(SCREEN_NAMES).map(([id, name]) => ({
        id: parseInt(id),
        name
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
