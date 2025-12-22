import React, { useState } from 'react';
import { Upload, Cloud, Shield, AlertTriangle, Check, X, Eye, EyeOff, ChevronRight, Loader } from 'lucide-react';

const MockupApp = () => {
    const [currentScreen, setCurrentScreen] = useState(1);

    const screens = [
        { id: 1, name: 'Zona de Aterrizaje' },
        { id: 2, name: 'Procesando' },
        { id: 3, name: 'Contenido Seguro' },
        { id: 4, name: 'Contenido Inapropiado' },
        { id: 5, name: 'Historial' },
        { id: 6, name: 'Configuración' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">AWS Rekognition - Content Moderation</h1>
                    <div className="flex gap-2 flex-wrap">
                        {screens.map(screen => (
                            <button
                                key={screen.id}
                                onClick={() => setCurrentScreen(screen.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentScreen === screen.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {screen.id}. {screen.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Screen Content */}
            <div className="max-w-7xl mx-auto p-6">
                {currentScreen === 1 && <Screen1 />}
                {currentScreen === 2 && <Screen2 />}
                {currentScreen === 3 && <Screen3 />}
                {currentScreen === 4 && <Screen4 />}
                {currentScreen === 5 && <Screen5 />}
                {currentScreen === 6 && <Screen6 />}
            </div>
        </div>
    );
};

// Screen 1: Zona de Aterrizaje
const Screen1 = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-12 max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Análisis de Contenido</h2>
                <p className="text-gray-600">Sube una imagen para verificar su contenido con IA</p>
            </div>

            <div className="border-4 border-dashed border-gray-300 rounded-xl p-16 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
                <Cloud className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                <p className="text-xl text-gray-700 font-medium mb-2">
                    Arrastra tu imagen aquí o haz clic para buscar
                </p>
                <p className="text-sm text-gray-500">Formatos soportados: JPG, PNG, GIF (Máx. 10MB)</p>
            </div>

            <div className="mt-8 text-center">
                <button className="bg-gray-300 text-gray-500 px-8 py-4 rounded-lg text-lg font-semibold cursor-not-allowed">
                    Analizar Contenido
                </button>
                <p className="text-xs text-gray-400 mt-2">Primero selecciona una imagen</p>
            </div>
        </div>
    );
};

// Screen 2: Estado de Carga
const Screen2 = () => {
    return (
        <div className="relative">
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
            <div className="relative bg-white rounded-xl shadow-sm p-12 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Analizando Imagen</h2>
                </div>

                {/* Skeleton Loader */}
                <div className="bg-gray-200 rounded-lg h-80 mb-8 animate-pulse"></div>

                {/* Progress Steps */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">1. Subiendo a S3...</p>
                            <p className="text-sm text-green-600">Completado</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">2. Invocando AWS Lambda...</p>
                            <p className="text-sm text-green-600">Completado</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <Loader className="w-5 h-5 text-white animate-spin" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">3. Consultando Amazon Rekognition...</p>
                            <p className="text-sm text-blue-600">Procesando...</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 font-medium">Procesando de forma segura con IA</p>
                    <div className="flex justify-center gap-1 mt-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Screen 3: Contenido Seguro
const Screen3 = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="grid grid-cols-2 gap-8">
                {/* Left: Image */}
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%2387CEEB'/%3E%3Cstop offset='100%25' style='stop-color:%234682B4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='600' height='400'/%3E%3Cpath d='M0,300 Q150,250 300,280 T600,300 L600,400 L0,400 Z' fill='%232F4F4F'/%3E%3Cpath d='M50,320 L100,280 L150,320 Z' fill='%23228B22'/%3E%3Cpath d='M450,310 L520,260 L590,310 Z' fill='%23228B22'/%3E%3Ccircle cx='150' cy='100' r='40' fill='%23FFD700'/%3E%3C/svg%3E"
                        alt="Paisaje de montaña"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right: Results */}
                <div className="flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <Shield className="w-24 h-24 text-green-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-green-600 mb-2">CONTENIDO SEGURO</h2>
                        <p className="text-gray-600">Esta imagen es apropiada para mostrar</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Paisaje</span>
                                <span className="text-sm font-bold text-green-600">99%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-green-500 h-3 rounded-full" style={{ width: '99%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Naturaleza</span>
                                <span className="text-sm font-bold text-green-600">97%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-green-500 h-3 rounded-full" style={{ width: '97%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Desnudez</span>
                                <span className="text-sm font-bold text-gray-500">0.01%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-gray-400 h-3 rounded-full" style={{ width: '1%' }}></div>
                            </div>
                        </div>
                    </div>

                    <button className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        Aprobar y Publicar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Screen 4: Contenido Inapropiado
const Screen4 = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="grid grid-cols-2 gap-8">
                {/* Left: Blurred Image */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden h-96">
                    <div className="absolute inset-0 backdrop-blur-3xl bg-gray-400 bg-opacity-50"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                        <AlertTriangle className="w-20 h-20 text-red-500 mb-4" />
                        <EyeOff className="w-16 h-16 mb-4" />
                        <p className="text-xl font-bold mb-4">Contenido Sensible Detectado</p>
                        <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition-colors">
                            Revelar (Solo Admin)
                        </button>
                    </div>
                </div>

                {/* Right: Warning Results */}
                <div className="flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-16 h-16 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-red-600 mb-2">CONTENIDO INAPROPIADO</h2>
                        <p className="text-gray-600">Esta imagen ha sido bloqueada automáticamente</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Desnudez Explícita</span>
                                <span className="text-sm font-bold text-red-600">98%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-red-500 h-3 rounded-full" style={{ width: '98%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Sugestivo</span>
                                <span className="text-sm font-bold text-red-600">95%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-red-500 h-3 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Violencia</span>
                                <span className="text-sm font-bold text-orange-600">12%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-orange-500 h-3 rounded-full" style={{ width: '12%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <button className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                            Rechazar y Bloquear
                        </button>
                        <button className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                            Revisar Manualmente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Screen 5: Historial
const Screen5 = () => {
    const images = [
        { id: 1, status: 'safe', date: '2025-12-13' },
        { id: 2, status: 'unsafe', date: '2025-12-13' },
        { id: 3, status: 'safe', date: '2025-12-12' },
        { id: 4, status: 'safe', date: '2025-12-12' },
        { id: 5, status: 'unsafe', date: '2025-12-11' },
        { id: 6, status: 'safe', date: '2025-12-11' },
        { id: 7, status: 'safe', date: '2025-12-10' },
        { id: 8, status: 'unsafe', date: '2025-12-10' },
        { id: 9, status: 'safe', date: '2025-12-09' },
        { id: 10, status: 'safe', date: '2025-12-09' },
        { id: 11, status: 'safe', date: '2025-12-08' },
        { id: 12, status: 'unsafe', date: '2025-12-08' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Historial de Análisis</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                        Todos
                    </button>
                    <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Seguros
                    </button>
                    <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inapropiados
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {images.map(img => (
                    <div key={img.id} className={`rounded-lg overflow-hidden border-4 ${img.status === 'safe' ? 'border-green-500' : 'border-red-500'
                        }`}>
                        <div className={`h-48 ${img.status === 'safe' ? 'bg-gradient-to-br from-blue-100 to-green-100' : 'bg-gradient-to-br from-red-100 to-orange-100'
                            } flex items-center justify-center`}>
                            {img.status === 'safe' ? (
                                <Shield className="w-16 h-16 text-green-600" />
                            ) : (
                                <AlertTriangle className="w-16 h-16 text-red-600" />
                            )}
                        </div>
                        <div className="p-3 bg-white">
                            <p className="text-xs text-gray-600">{img.date}</p>
                            <p className={`text-sm font-semibold ${img.status === 'safe' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {img.status === 'safe' ? 'Seguro' : 'Bloqueado'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Screen 6: Configuración
const Screen6 = () => {
    const [threshold, setThreshold] = useState(85);
    const [explicitNudity, setExplicitNudity] = useState(true);
    const [suggestive, setSuggestive] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuración de Amazon Rekognition</h2>
            <p className="text-gray-600 mb-8">Ajusta los parámetros de detección de contenido sensible</p>

            <div className="space-y-8">
                {/* Threshold Slider */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Umbral de Confianza para Desnudez (Threshold)
                    </label>
                    <div className="relative">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={threshold}
                            onChange={(e) => setThreshold(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${threshold}%, #E5E7EB ${threshold}%, #E5E7EB 100%)`
                            }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <span className="text-3xl font-bold text-blue-600">{threshold}%</span>
                        <p className="text-sm text-gray-600 mt-1">
                            Imágenes con confianza mayor a {threshold}% serán bloqueadas
                        </p>
                    </div>
                </div>

                {/* Toggle Switches */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-900">Detectar Desnudez Explícita</p>
                            <p className="text-sm text-gray-600">Bloquea contenido con desnudez visible</p>
                        </div>
                        <button
                            onClick={() => setExplicitNudity(!explicitNudity)}
                            className={`relative w-14 h-8 rounded-full transition-colors ${explicitNudity ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${explicitNudity ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            ></span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-900">Detectar Contenido Sugestivo</p>
                            <p className="text-sm text-gray-600">Bloquea contenido provocativo o insinuante</p>
                        </div>
                        <button
                            onClick={() => setSuggestive(!suggestive)}
                            className={`relative w-14 h-8 rounded-full transition-colors ${suggestive ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${suggestive ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            ></span>
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-6">
                    <button className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        Guardar Configuración
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Los cambios se aplicarán inmediatamente a nuevos análisis
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MockupApp;