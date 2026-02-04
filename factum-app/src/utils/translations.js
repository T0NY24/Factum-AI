export const TRANSLATIONS = {
    // --- NIVEL 1: CONTENIDO INSEGURO (Bloqueo Automático) ---
    "Hate Symbols": "Símbolos de Odio",
    "Nazi Party": "Simbología Nazi",
    "White Supremacy": "Supremacía Blanca",
    "Explicit Nudity": "Desnudez Explícita",
    "Violence": "Violencia",
    "Visually Disturbing": "Contenido Perturbador / Gore",
    "Sexual Activity": "Actividad Sexual Explícita",
    "Graphic Male Nudity": "Desnudez Masc. Gráfica",
    "Graphic Female Nudity": "Desnudez Fem. Gráfica",
    "Illustrated Explicit Nudity": "Desnudez Ilustrada Explícita",
    "Adult Toys": "Juguetes para Adultos",
    "Weapon Violence": "Violencia con Armas",
    "Physical Violence": "Violencia Física",
    "Self Injury": "Autolesión",
    "Corpses": "Cadáveres",
    "Emaciated Bodies": "Cuerpos Emaciados",
    "Hanging": "Ahorcamiento",

    // --- NIVEL 2: CONTENIDO SUGESTIVO (Revisión Humana) ---
    "Suggestive": "Sugestivo",
    "Revealing Clothes": "Ropa Reveladora",
    "Swimwear or Underwear": "Traje de Baño / Ropa Interior",
    "Female Swimwear Or Underwear": "Lencería Femenina / Bikini", // Detectado en tu imagen
    "Male Swimwear Or Underwear": "Ropa Interior Masculina",
    "Non-Explicit Nudity": "Desnudez No Explícita",
    "Partial Nudity": "Desnudez Parcial",
    "Barechested": "Torso Desnudo",
    "Cleavage": "Escote Pronunciado",
    "Partially Exposed Female Breast": "Torso Fem. Parcialmente Expuesto", // Detectado en tu imagen
    "Implied Nudity": "Desnudez Implícita",
    "Non-Explicit Nudity Of Intimate Parts And Kissing": "Intimidad / Besos", // Detectado en tu imagen

    // --- SUSTANCIAS Y APUESTAS ---
    "Tobacco": "Tabaco",
    "Smoking": "Fumando",
    "Alcohol": "Alcohol",
    "Drinking": "Consumo de Alcohol",
    "Alcoholic Beverages": "Bebidas Alcohólicas",
    "Drugs": "Drogas",
    "Drug Products": "Productos de Drogas",
    "Drug Use": "Uso de Drogas",
    "Pills": "Pastillas",
    "Drug Paraphernalia": "Parafernalia de Drogas",
    "Gambling": "Apuestas",

    // --- OTROS ---
    "Rude Gestures": "Gestos Ofensivos",
    "Middle Finger": "Gesto Obsceno (Dedo Medio)",
    "Safe": "Seguro",
    "Unsafe": "Inseguro",

    // --- OBJETOS Y PERSONAS COMUNES ---
    "Person": "Persona",
    "Human": "Humano",
    "Female": "Mujer",
    "Male": "Hombre",
    "Face": "Rostro",
    "Mouth": "Boca",
    "Smile": "Sonrisa",
    "Portrait": "Retrato",
    "People": "Gente",
    "Clothing": "Ropa",
    "Apparel": "Vestimenta",
    "Accessories": "Accesorios",
    "Photography": "Fotografía",
    "Indoors": "Interior",
    "Outdoors": "Exterior"
};

// Función auxiliar para usar en tus componentes
export const translateLabel = (englishLabel) => {
    // 1. Busca la traducción exacta
    if (TRANSLATIONS[englishLabel]) {
        return TRANSLATIONS[englishLabel];
    }

    // 2. Si no la encuentra, intenta buscar si contiene partes conocidas (Fallback inteligente)
    // Esto ayuda si AWS saca una etiqueta nueva como "Female Swimwear" (sin el Or Underwear)
    const lowerLabel = englishLabel.toLowerCase();
    if (lowerLabel.includes('swimwear')) return "Traje de Baño";
    if (lowerLabel.includes('underwear')) return "Ropa Interior";
    if (lowerLabel.includes('nudity')) return "Desnudez";
    if (lowerLabel.includes('weapon')) return "Armas";

    // 3. Si todo falla, devuelve el original
    return englishLabel;
};
