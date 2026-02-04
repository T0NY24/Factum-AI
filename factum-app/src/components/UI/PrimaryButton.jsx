import React from 'react';
import { motion } from 'framer-motion';
import './PrimaryButton.css';

const PrimaryButton = ({ children, onClick, disabled, className = '', type = 'button' }) => (
    <motion.button
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={`primary-btn ${className}`}
    >
        {children}
    </motion.button>
);

export default PrimaryButton;
