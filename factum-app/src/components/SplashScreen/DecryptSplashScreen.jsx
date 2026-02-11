import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useScramble } from 'use-scramble';
import './DecryptSplashScreen.css';

const DecryptSplashScreen = ({ onComplete }) => {
    const [isTextDone, setIsTextDone] = useState(false);

    const { ref, replay } = useScramble({
        text: 'ÉTICA VISUAL EC',
        speed: 0.5,
        tick: 1,
        step: 1,
        scramble: 12,
        seed: 4,
        chance: 0.7, // Un poco más "limpio" el efecto
        onAnimationEnd: () => {
            setIsTextDone(true);
            setTimeout(onComplete, 1200);
        },
    });

    return (
        <motion.div
            className="decrypt-wrapper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <div className="decrypt-content">
                {/* Título Principal */}
                <h1
                    ref={ref}
                    className="decrypt-title"
                    onMouseEnter={replay}
                />

                {/* Subtítulo y Barra */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isTextDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="decrypt-subtitle-container"
                >
                    <p className="decrypt-subtitle">
                        Contenido Limpio,Web Segura
                    </p>

                    {/* Pequeña barra de carga azul */}
                    <motion.div
                        className="decrypt-bar"
                        initial={{ width: 0 }}
                        animate={{ width: "40px" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    />
                </motion.div>
            </div>

            {/* Indicador inferior sutil */}
            {!isTextDone && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="decrypt-loading"
                >
                    INITIALIZING SECURE ENVIRONMENT...
                </motion.div>
            )}
        </motion.div>
    );
};

export default DecryptSplashScreen;
