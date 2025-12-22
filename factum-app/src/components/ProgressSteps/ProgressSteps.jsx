import React from 'react';
import { Check, Loader } from 'lucide-react';
import './ProgressSteps.css';

const ProgressSteps = ({ steps }) => {
    const getStepIcon = (status) => {
        switch (status) {
            case 'completed':
                return <Check className="step-icon" />;
            case 'loading':
                return <Loader className="step-icon animate-spin" />;
            default:
                return <div className="step-icon-pending"></div>;
        }
    };

    const getStepClass = (status) => {
        switch (status) {
            case 'completed':
                return 'step-completed';
            case 'loading':
                return 'step-loading';
            case 'error':
                return 'step-error';
            default:
                return 'step-pending';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#16a34a'; // green-600
            case 'loading':
                return '#2563eb'; // blue-600
            case 'error':
                return '#dc2626'; // red-600
            default:
                return '#9ca3af'; // gray-400
        }
    };

    return (
        <div className="progress-steps">
            {steps.map((step, index) => (
                <div key={step.id} className={`progress-step ${getStepClass(step.status)}`}>
                    <div className="step-icon-container" style={{ backgroundColor: getStatusColor(step.status) }}>
                        {getStepIcon(step.status)}
                    </div>
                    <div className="step-content">
                        <p className="step-title">{step.title}</p>
                        {step.message && (
                            <p className="step-message" style={{ color: getStatusColor(step.status) }}>
                                {step.message}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProgressSteps;
