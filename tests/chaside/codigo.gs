/**
 * ============================================================================
 * SISTEMA DE GENERACIÓN DE INFORMES PROFESIONALES - TEST CHASIDE
 * Test de Orientación Vocacional
 * ============================================================================
 * Versión: 1.0 - Sistema Automatizado de Análisis Psicométrico Vocacional
 * Basado en el método CHASIDE (7 áreas vocacionales)
 */

const CONFIG = {
  // --- CONFIGURACIÓN DE CONEXIÓN ---
  ID_PLANILLA: '173vc2lICvSi_pUKmG9Se0sKDpVw9SaGsXi9Ri2S4ruk',
  NOMBRE_HOJA: 'Respuestas',

  FILA_ENCABEZADOS: 1,
  COLUMNAS: {
    FECHA: 0,           // Columna A - Fecha
    NOMBRE: 1,          // Columna B - Nombre
    APELLIDO: 2,        // Columna C - Apellido
    EMAIL: 3,           // Columna D - Email
    RESPUESTAS: 4,      // Columna E - Respuestas (formato "SI,NO,SI,SI,NO,...")
    INFORME: 5,         // Columna F - Informe Final (solo conteo de caracteres)
    ESTADO: 6           // Columna G - Estado
  },
  EMAIL: {
    ASUNTO: '📊 Tu Informe Completo del Test CHASIDE - Orientación Vocacional',
    REMITENTE: 'Escencial Consultora',
    LOGO: 'https://imgur.com/rc6WhR2.png'
  }
};

// ============================================================================
// GRILLA DE PUNTUACIÓN CHASIDE
// Mapea cada número de pregunta (1-98) a su área correspondiente
// Extraído del manual original del Test CHASIDE
// ============================================================================
const GRILLA_CHASIDE = {
  'C': [1, 2, 12, 15, 20, 46, 51, 53, 64, 71, 78, 85, 91, 98],
  'H': [9, 25, 30, 34, 41, 56, 63, 67, 72, 74, 80, 86, 89, 95],
  'A': [3, 11, 21, 22, 28, 36, 39, 45, 50, 57, 76, 81, 82, 96],
  'S': [4, 8, 16, 23, 29, 33, 40, 44, 52, 62, 69, 70, 87, 92],
  'I': [6, 10, 19, 26, 27, 38, 47, 54, 59, 60, 75, 83, 90, 97],
  'D': [5, 13, 14, 18, 24, 31, 37, 43, 48, 58, 65, 66, 73, 84],
  'E': [7, 17, 32, 35, 42, 49, 55, 61, 68, 77, 79, 88, 93, 94]
};

// Mapa inverso: pregunta -> área (para cálculo rápido)
const PREGUNTA_A_AREA = {};
Object.keys(GRILLA_CHASIDE).forEach(area => {
  GRILLA_CHASIDE[area].forEach(numPregunta => {
    PREGUNTA_A_AREA[numPregunta] = area;
  });
});

// ============================================================================
// SUB-ESCALAS: INTERESES Y APTITUDES (según el manual)
// ============================================================================
const INTERESES = {
  'C': [98, 12], 'H': [9, 34], 'A': [21, 45], 'S': [33, 92],
  'I': [75, 6], 'D': [84, 31], 'E': [77, 42]
};

const APTITUDES = {
  'C': [64, 53, 85, 1], 'H': [80, 25, 95, 67], 'A': [96, 57, 28, 11],
  'S': [70, 8, 87, 62], 'I': [19, 38, 60, 27], 'D': [48, 73, 5, 65],
  'E': [88, 17, 93, 32]
};

// ============================================================================
// DEFINICIÓN DE LAS 7 ÁREAS VOCACIONALES CHASIDE
// ============================================================================
const AREAS = {
  'C': {
    nombre: "ADMINISTRATIVAS Y CONTABLES",
    letra: "C",
    descripcion: "Interés por actividades que implican organización, supervisión, orden, análisis, cálculo, precisión y responsabilidad en el manejo de datos y recursos.",
    aptitudes: ["Organizativo", "Supervisión", "Orden", "Análisis y síntesis", "Colaboración", "Cálculo", "Persuasivo", "Objetivo", "Práctico", "Tolerante", "Responsable", "Ambicioso", "Precisión", "Verbal", "Organización", "Relación de Hechos"],
    profesiones: [
      "Contador Público", "Administrador de Empresas", "Licenciado en Economía",
      "Licenciado en Comercio Exterior", "Analista de Sistemas Administrativos",
      "Técnico en Marketing", "Licenciado en Recursos Humanos",
      "Actuario", "Auditor", "Gerente Comercial", "Asesor Financiero"
    ],
    maxPD: 14
  },
  'H': {
    nombre: "HUMANÍSTICAS Y SOCIALES",
    letra: "H",
    descripcion: "Preferencia por actividades vinculadas a la justicia, la mediación, la expresión lingüística, el análisis social, la relación de hechos históricos y la comunicación.",
    aptitudes: ["Lingüística", "Orden", "Justicia", "Responsable", "Justo", "Conciliador", "Persuasivo", "Sagaz", "Imaginativo"],
    profesiones: [
      "Abogado", "Licenciado en Ciencias Políticas", "Sociólogo",
      "Psicólogo Social", "Periodista", "Licenciado en Relaciones Internacionales",
      "Filósofo", "Historiador", "Profesor de Letras/Historia",
      "Diplomático", "Trabajador Social", "Comunicador Social"
    ],
    maxPD: 14
  },
  'A': {
    nombre: "ARTÍSTICAS",
    letra: "A",
    descripcion: "Inclinación hacia actividades creativas, estéticas, manuales y de expresión artística. Sensibilidad para lo visual, auditivo y la innovación.",
    aptitudes: ["Estético", "Armónico", "Manual", "Visual", "Auditivo", "Sensible", "Imaginativo", "Creativo", "Detallista", "Innovador", "Intuitivo"],
    profesiones: [
      "Diseñador Gráfico", "Arquitecto", "Diseñador de Interiores",
      "Diseñador Industrial", "Músico", "Actor/Actriz",
      "Director de Cine/Teatro", "Fotógrafo", "Artista Plástico",
      "Diseñador de Moda", "Publicista Creativo", "Animador Digital"
    ],
    maxPD: 14
  },
  'S': {
    nombre: "MEDICINA Y CIENCIAS DE LA SALUD",
    letra: "S",
    descripcion: "Interés por actividades de asistencia, investigación médica, cuidado de personas, solidaridad y comprensión de las necesidades del otro.",
    aptitudes: ["Asistir", "Investigativo", "Precisión", "Senso-Perceptivo", "Analítico", "Ayudar", "Altruista", "Solidario", "Paciente", "Comprensivo", "Respetuoso", "Persuasivo"],
    profesiones: [
      "Médico", "Enfermero/a", "Odontólogo", "Farmacéutico",
      "Kinesiólogo", "Nutricionista", "Psicólogo Clínico",
      "Bioquímico", "Veterinario", "Fonoaudiólogo",
      "Terapeuta Ocupacional", "Instrumentador Quirúrgico"
    ],
    maxPD: 14
  },
  'I': {
    nombre: "INGENIERÍA Y COMPUTACIÓN",
    letra: "I",
    descripcion: "Preferencia por el cálculo, la planificación, la precisión técnica, el análisis crítico y el trabajo con tecnología y sistemas.",
    aptitudes: ["Cálculo", "Científico", "Manual", "Exacto", "Planificar", "Preciso", "Práctico", "Crítico", "Analítico"],
    profesiones: [
      "Ingeniero Civil", "Ingeniero en Sistemas", "Ingeniero Electrónico",
      "Ingeniero Industrial", "Ingeniero Mecánico", "Programador",
      "Analista de Sistemas", "Técnico en Redes", "Ingeniero Químico",
      "Desarrollador de Software", "Ingeniero en Telecomunicaciones"
    ],
    maxPD: 14
  },
  'D': {
    nombre: "DEFENSA Y SEGURIDAD",
    letra: "D",
    descripcion: "Inclinación por actividades que implican justicia, equidad, liderazgo, trabajo en equipo, valentía y acción en situaciones de riesgo.",
    aptitudes: ["Rígido", "Justicia", "Equidad", "Colaboración", "Espíritu de Equipo", "Liderazgo", "Arriesgado", "Solidario", "Valiente", "Agresivo", "Persuasivo"],
    profesiones: [
      "Oficial de las Fuerzas Armadas", "Oficial de Policía",
      "Licenciado en Seguridad", "Bombero Profesional",
      "Piloto Aviador", "Oficial de Marina", "Criminalista",
      "Perito Forense", "Guardavidas", "Defensa Civil",
      "Licenciado en Seguridad e Higiene"
    ],
    maxPD: 14
  },
  'E': {
    nombre: "CIENCIAS EXACTAS Y AGRARIAS",
    letra: "E",
    descripcion: "Interés por la investigación, la observación metódica, el análisis numérico, la clasificación y el contacto con la naturaleza y los fenómenos naturales.",
    aptitudes: ["Investigación", "Orden", "Organización", "Análisis y Síntesis", "Numérico", "Clasificar", "Metódico", "Analítico", "Observador", "Introvertido", "Paciente", "Seguro"],
    profesiones: [
      "Ingeniero Agrónomo", "Biólogo", "Químico", "Físico",
      "Matemático", "Geólogo", "Licenciado en Ciencias Ambientales",
      "Meteorólogo", "Astrónomo", "Oceanógrafo",
      "Ingeniero en Alimentos", "Técnico Agropecuario"
    ],
    maxPD: 14
  }
};

// ============================================================================
// COMBINACIONES DE CÓDIGOS Y PROFESIONES SUGERIDAS
// ============================================================================
const COMBINACIONES_PROFESIONES = {
  "C-H": ["Abogado Corporativo", "Licenciado en Relaciones Laborales", "Mediador", "Asesor de Política Económica", "Consultor en Gestión Pública"],
  "C-A": ["Diseñador de Moda con Gestión", "Director de Arte Publicitario", "Productor Audiovisual", "Gestor Cultural"],
  "C-S": ["Administrador Hospitalario", "Gerente de Servicios de Salud", "Director de ONG", "Gestor en Salud Pública"],
  "C-I": ["Ingeniero Industrial", "Analista de Sistemas de Gestión", "Project Manager de TI", "Consultor ERP"],
  "C-D": ["Oficial de Logística Militar", "Administrador de Seguridad", "Director de Protección Civil", "Gestor de Riesgos"],
  "C-E": ["Administrador Agropecuario", "Gerente de Empresa Alimenticia", "Economista Agrario", "Consultor Ambiental Corporativo"],
  "H-A": ["Director de Teatro/Cine", "Periodista Cultural", "Curador de Arte", "Comunicador Social", "Gestor Cultural"],
  "H-S": ["Psicólogo Clínico", "Trabajador Social", "Psicopedagogo", "Mediador Familiar", "Profesor de Educación Especial"],
  "H-I": ["Ingeniero en Sistemas Sociales", "Analista de Políticas Públicas con Tecnología", "Periodista de Tecnología"],
  "H-D": ["Abogado Penalista", "Juez", "Criminólogo", "Defensor Público", "Licenciado en Seguridad Ciudadana"],
  "H-E": ["Antropólogo", "Arqueólogo", "Historiador de la Ciencia", "Profesor de Ciencias Naturales", "Divulgador Científico"],
  "A-S": ["Musicoterapeuta", "Arteterapeuta", "Terapeuta Ocupacional Creativo", "Diseñador de Espacios Terapéuticos"],
  "A-I": ["Diseñador UX/UI", "Arquitecto de Software", "Animador 3D", "Diseñador Industrial", "Desarrollador de Videojuegos"],
  "A-D": ["Director de Producciones de Acción", "Diseñador de Equipamiento Táctico", "Fotógrafo de Guerra/Documental"],
  "A-E": ["Arquitecto Paisajista", "Fotógrafo de Naturaleza", "Diseñador de Parques y Reservas", "Ilustrador Científico"],
  "S-I": ["Ingeniero Biomédico", "Bioinformático", "Desarrollador de Software Médico", "Técnico en Imagenología"],
  "S-D": ["Médico de Emergencias", "Paramédico", "Médico Militar", "Enfermero de Terapia Intensiva", "Rescatista"],
  "S-E": ["Biólogo Médico", "Bioquímico", "Investigador en Salud", "Epidemiólogo", "Farmacólogo"],
  "I-D": ["Ingeniero en Armamento", "Piloto de Avión", "Ingeniero Naval", "Ingeniero en Telecomunicaciones Militares"],
  "I-E": ["Ingeniero Ambiental", "Ingeniero en Alimentos", "Ingeniero Agrónomo", "Desarrollador de Tecnología Agro", "Científico de Datos"],
  "D-E": ["Ingeniero Forestal con énfasis en Gestión", "Oficial de Guardaparques", "Bombero Forestal", "Defensa Civil Ambiental"]
};

// ============================================================================
// TEXTOS DE INTERPRETACIÓN POR NIVEL
// ============================================================================
const TEXTOS_INTERPRETACION = {
  "MUY_ALTO": {
    rango: "12-14",
    descripcion: "Interés muy marcado y definido. Esta área representa una fuerte inclinación vocacional que debería considerarse prioritaria en la orientación profesional."
  },
  "ALTO": {
    rango: "9-11",
    descripcion: "Interés significativo. Esta área debería explorarse como posible campo de desarrollo profesional."
  },
  "PROMEDIO": {
    rango: "5-8",
    descripcion: "Interés dentro del rango esperado. No representa una preferencia distintiva ni rechazo."
  },
  "BAJO": {
    rango: "2-4",
    descripcion: "Interés por debajo del promedio. Esta área probablemente no representa una vocación primaria."
  },
  "MUY_BAJO": {
    rango: "0-1",
    descripcion: "Escaso interés en esta área. Se recomienda evitar profesiones que dependan principalmente de estas actividades."
  }
};

// ============================================================================
// LÓGICA DE PROCESAMIENTO
// ============================================================================

function obtenerHoja() {
  if (!CONFIG.ID_PLANILLA || CONFIG.ID_PLANILLA.length < 20) {
    throw new Error("⚠️ ERROR CRÍTICO: Debes configurar el ID real de tu planilla en CONFIG.ID_PLANILLA");
  }

  try {
    const ss = SpreadsheetApp.openById(CONFIG.ID_PLANILLA);
    const sheet = ss.getSheetByName(CONFIG.NOMBRE_HOJA);
    if (!sheet) {
      throw new Error("⚠️ ERROR: No encontré la hoja llamada '" + CONFIG.NOMBRE_HOJA + "' en esa planilla.");
    }
    return sheet;
  } catch (e) {
    throw new Error("⚠️ ERROR DE CONEXIÓN: " + e.message);
  }
}

function procesarNuevasRespuestas() {
  try {
    const sheet = obtenerHoja();
    const ultimaFila = sheet.getLastRow();

    for (let i = CONFIG.FILA_ENCABEZADOS + 1; i <= ultimaFila; i++) {
      const fila = sheet.getRange(i, 1, 1, 7).getValues()[0];

      const estado = String(fila[CONFIG.COLUMNAS.ESTADO] || '').trim();
      const yaEnviado = /^Enviado\b/i.test(estado);

      if (!yaEnviado) {
        procesarYEnviarInforme(sheet, i, fila);
      }
    }
  } catch (e) {
    Logger.log('ERROR EN PROCESAMIENTO: ' + e);
  }
}

function procesarYEnviarInforme(sheet, numeroFila, fila) {
  try {
    Logger.log('=== PROCESANDO FILA ' + numeroFila + ' ===');

    const nombre = fila[CONFIG.COLUMNAS.NOMBRE];
    const apellido = String(fila[CONFIG.COLUMNAS.APELLIDO] || '').trim();
    const email = String(fila[CONFIG.COLUMNAS.EMAIL] || '').trim();
    const respuestasString = fila[CONFIG.COLUMNAS.RESPUESTAS];

    Logger.log('Nombre: ' + nombre);
    Logger.log('Apellido: ' + apellido);
    Logger.log('Email: ' + email);

    // Email es obligatorio
    if (!email) {
      Logger.log('❌ ERROR: Falta Email (obligatorio)');
      sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: Falta Email');
      return;
    }

    // Respuestas obligatorias
    if (!respuestasString) {
      Logger.log('❌ ERROR: Faltan respuestas');
      sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: Faltan respuestas');
      return;
    }

    // Parsear respuestas
    const respuestas = parsearRespuestas(respuestasString);
    if (!respuestas) {
      Logger.log('❌ ERROR: Formato de respuestas inválido');
      sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: Formato inválido');
      return;
    }

    // Calcular resultados
    const resultado = calcularResultados(respuestas);
    if (!resultado) {
      Logger.log('❌ ERROR: Fallo en cálculo de resultados');
      sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: Cálculo');
      return;
    }

    // Generar informe HTML
    const htmlInforme = generarInformeHTML(nombre, apellido, resultado);
    if (!htmlInforme || htmlInforme.length < 100) {
      Logger.log('❌ ERROR: HTML inválido');
      sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: HTML inválido');
      return;
    }

    // Guardar conteo de caracteres
    sheet.getRange(numeroFila, CONFIG.COLUMNAS.INFORME + 1).setValue(htmlInforme.length + ' caracteres HTML generados');

    // Generar PDF
    const htmlParaPdf = limpiarImagenesParaPdf(htmlInforme);
    const pdfBlob = Utilities
      .newBlob(htmlParaPdf, 'text/html', 'informe-chaside-' + nombre + '.html')
      .getAs(MimeType.PDF);

    pdfBlob.setName('Informe Test CHASIDE - ' + nombre + ' ' + apellido + '.pdf');

    // Enviar ÚNICAMENTE al email de la columna D (EMAIL)
    MailApp.sendEmail({
      to: email,
      subject: CONFIG.EMAIL.ASUNTO,
      htmlBody: htmlInforme,
      name: CONFIG.EMAIL.REMITENTE,
      attachments: [pdfBlob]
    });
    Logger.log('✓ Enviado a: ' + email);

    // Marcar estado
    sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Enviado');

    Logger.log('✅ Estado actualizado: Enviado');

  } catch (error) {
    Logger.log('❌ ERROR CRÍTICO en fila ' + numeroFila + ': ' + error);
    sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: ' + String(error.message || error).substring(0, 60));
  }
}

// ============================================================================
// PARSEO DE RESPUESTAS CHASIDE
// Formato de entrada: "SI,NO,SI,SI,NO,..." (98 respuestas separadas por coma)
// ============================================================================
function parsearRespuestas(respuestasString) {
  try {
    const partes = String(respuestasString).split(',');
    const respuestas = partes.map(r => r.trim().toUpperCase());

    // Validar que hay exactamente 98 respuestas
    if (respuestas.length !== 98) {
      Logger.log('Advertencia: Se esperaban 98 respuestas, se recibieron ' + respuestas.length);
      if (respuestas.length === 0) return null;
    }

    // Validar que todas son SI o NO
    const validas = respuestas.every(r => r === 'SI' || r === 'NO');
    if (!validas) {
      Logger.log('Advertencia: Algunas respuestas no son SI/NO');
    }

    return respuestas;
  } catch (e) {
    Logger.log('Error parseando respuestas: ' + e);
    return null;
  }
}

// ============================================================================
// CÁLCULO DE RESULTADOS CHASIDE
// ============================================================================
function calcularResultados(respuestas) {
  Logger.log('=== INICIANDO CÁLCULO DE RESULTADOS CHASIDE ===');

  // Inicializar puntajes por área
  const puntajes = { 'C': 0, 'H': 0, 'A': 0, 'S': 0, 'I': 0, 'D': 0, 'E': 0 };

  // Sub-puntajes de Intereses y Aptitudes
  const puntajesIntereses = { 'C': 0, 'H': 0, 'A': 0, 'S': 0, 'I': 0, 'D': 0, 'E': 0 };
  const puntajesAptitudes = { 'C': 0, 'H': 0, 'A': 0, 'S': 0, 'I': 0, 'D': 0, 'E': 0 };

  // Contar respuestas afirmativas por área
  respuestas.forEach((resp, idx) => {
    const numPregunta = idx + 1; // Preguntas numeradas 1-98
    const area = PREGUNTA_A_AREA[numPregunta];

    if (area && resp === 'SI') {
      puntajes[area]++;

      // Clasificar en sub-escalas
      if (INTERESES[area] && INTERESES[area].includes(numPregunta)) {
        puntajesIntereses[area]++;
      }
      if (APTITUDES[area] && APTITUDES[area].includes(numPregunta)) {
        puntajesAptitudes[area]++;
      }
    }
  });

  Logger.log('Puntajes: ' + JSON.stringify(puntajes));

  // Construir array de resultados por área
  const areasResultado = [];
  const letras = ['C', 'H', 'A', 'S', 'I', 'D', 'E'];

  letras.forEach(letra => {
    const pd = puntajes[letra];
    const percentil = calcularPercentil(pd, 14);
    const nivel = obtenerNivelInterpretacion(pd);

    areasResultado.push({
      letra: letra,
      nombre: AREAS[letra].nombre,
      descripcion: AREAS[letra].descripcion,
      aptitudes: AREAS[letra].aptitudes,
      profesiones: AREAS[letra].profesiones,
      puntajeDirecto: pd,
      puntajeIntereses: puntajesIntereses[letra],
      puntajeAptitudes: puntajesAptitudes[letra],
      maxPD: 14,
      maxIntereses: INTERESES[letra].length,
      maxAptitudes: APTITUDES[letra].length,
      percentil: percentil,
      nivel: nivel
    });
  });

  // Ordenar por puntaje
  const areasOrdenadas = [...areasResultado].sort((a, b) => b.puntajeDirecto - a.puntajeDirecto);

  // Top 2 áreas
  const top2 = areasOrdenadas.slice(0, 2);
  const codigoLetras = [top2[0].letra, top2[1].letra].sort().join('-');

  // Áreas altas y bajas
  const areasAltas = areasResultado.filter(a => a.puntajeDirecto >= 9);
  const areasBajas = areasResultado.filter(a => a.puntajeDirecto <= 4);

  // Profesiones combinadas
  const profesionesCombinadas = COMBINACIONES_PROFESIONES[codigoLetras] || [];

  // Estadísticas generales
  const totalSI = respuestas.filter(r => r === 'SI').length;
  const totalNO = respuestas.filter(r => r === 'NO').length;

  const resultado = {
    puntajes: puntajes,
    areasResultado: areasResultado,
    areasOrdenadas: areasOrdenadas,
    areasAltas: areasAltas,
    areasBajas: areasBajas,
    codigoPerfil: codigoLetras,
    top2: top2,
    profesionesCombinadas: profesionesCombinadas,
    totalPreguntas: respuestas.length,
    totalSI: totalSI,
    totalNO: totalNO,
    puntajesIntereses: puntajesIntereses,
    puntajesAptitudes: puntajesAptitudes
  };

  Logger.log('Código de Perfil: ' + codigoLetras);
  Logger.log('Top 2: ' + top2.map(a => a.nombre).join(' + '));
  Logger.log('=== RESULTADO FINAL GENERADO ===');

  return resultado;
}

/**
 * Calcula un percentil aproximado basado en puntaje directo y máximo posible.
 * Para CHASIDE: max = 14, se usa distribución proporcional.
 */
function calcularPercentil(pd, maxPD) {
  if (pd <= 0) return 5;
  if (pd >= maxPD) return 99;

  // Tabla de conversión para max 14
  const tabla = [
    { min: 13, max: 14, percentil: 99 },
    { min: 11, max: 12, percentil: 90 },
    { min: 9, max: 10, percentil: 75 },
    { min: 7, max: 8, percentil: 60 },
    { min: 5, max: 6, percentil: 45 },
    { min: 3, max: 4, percentil: 25 },
    { min: 1, max: 2, percentil: 10 },
    { min: 0, max: 0, percentil: 5 }
  ];

  for (const rango of tabla) {
    if (pd >= rango.min && pd <= rango.max) {
      return rango.percentil;
    }
  }

  return 50;
}

/**
 * Obtiene el nivel de interpretación basado en el puntaje directo (0-14).
 */
function obtenerNivelInterpretacion(pd) {
  if (pd >= 12) return "MUY_ALTO";
  if (pd >= 9) return "ALTO";
  if (pd >= 5) return "PROMEDIO";
  if (pd >= 2) return "BAJO";
  return "MUY_BAJO";
}

function limpiarImagenesParaPdf(html) {
  return html.replace(/<img[^>]*>/gi, '');
}

// ============================================================================
// GENERADOR HTML DEL INFORME
// ============================================================================

function generarInformeHTML(nombre, apellido, resultado) {
  try {
    Logger.log('=== GENERANDO HTML ===');

    const template = HtmlService.createTemplateFromFile('plantilla');

    // Inyectar datos
    template.nombre = nombre;
    template.apellido = apellido;
    template.resultado = resultado;
    template.logoUrl = CONFIG.EMAIL.LOGO;
    template.fechaActual = new Date().toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    template.AREAS = AREAS;
    template.TEXTOS_INTERPRETACION = TEXTOS_INTERPRETACION;

    // Generar gráfico de barras
    const labelsGrafico = resultado.areasOrdenadas.map(a => a.letra + ' - ' + a.nombre);
    const datosGrafico = resultado.areasOrdenadas.map(a => a.puntajeDirecto);

    const chartConfig = {
      type: 'horizontalBar',
      data: {
        labels: labelsGrafico,
        datasets: [{
          label: 'Puntaje',
          data: datosGrafico,
          backgroundColor: datosGrafico.map(p =>
            p >= 12 ? '#10b981' :
              p >= 9 ? '#0b4a6e' :
                p >= 5 ? '#f59e0b' : '#ef4444'
          ),
          borderWidth: 0
        }]
      },
      options: {
        legend: { display: false },
        scales: {
          xAxes: [{ ticks: { beginAtZero: true, max: 14, stepSize: 2 } }],
          yAxes: [{ ticks: { fontSize: 11 } }]
        }
      }
    };

    template.chartUrl = 'https://quickchart.io/chart?w=600&h=350&c=' + encodeURIComponent(JSON.stringify(chartConfig));

    Logger.log('✓ Datos inyectados en template');

    const html = template.evaluate().getContent();
    Logger.log('✓ HTML evaluado correctamente (longitud: ' + html.length + ')');

    return html;

  } catch (error) {
    Logger.log('❌ ERROR al generar HTML: ' + error);
    Logger.log('Stack: ' + error.stack);
    throw error;
  }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function instalarTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('procesarNuevasRespuestas').timeBased().everyMinutes(30).create();
  Logger.log('✅ Trigger instalado correctamente - Se ejecutará cada 30 minutos');
}

function procesarFilaManual() {
  const sheet = obtenerHoja();
  const fila = SpreadsheetApp.getActiveSpreadsheet() ?
    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveRange().getRow() : 2;

  if (!SpreadsheetApp.getActiveSpreadsheet()) {
    const ultimaFila = sheet.getLastRow();
    const datos = sheet.getRange(ultimaFila, 1, 1, 7).getValues()[0];
    procesarYEnviarInforme(sheet, ultimaFila, datos);
    Logger.log("✅ Procesada última fila en modo standalone");
  } else {
    const datos = sheet.getRange(fila, 1, 1, 7).getValues()[0];
    procesarYEnviarInforme(sheet, fila, datos);
    SpreadsheetApp.getUi().alert("✅ Informe procesado correctamente");
  }
}

function onOpen() {
  try {
    SpreadsheetApp.getUi().createMenu('📊 Test CHASIDE')
      .addItem('Instalar Automático', 'instalarTrigger')
      .addItem('Procesar Fila', 'procesarFilaManual')
      .addItem('🔍 Diagnóstico del Sistema', 'diagnosticoCompleto')
      .addToUi();
  } catch (e) {
    Logger.log('Menú no disponible en modo standalone');
  }
}

// ============================================================================
// FUNCIÓN DE DIAGNÓSTICO COMPLETO
// ============================================================================
function diagnosticoCompleto() {
  Logger.log('═══════════════════════════════════════');
  Logger.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO - TEST CHASIDE');
  Logger.log('═══════════════════════════════════════');

  try {
    Logger.log('\n1️⃣ Verificando conexión a Google Sheets...');
    const sheet = obtenerHoja();
    Logger.log('✓ Conexión exitosa a la hoja: ' + sheet.getName());

    Logger.log('\n2️⃣ Verificando estructura de columnas...');
    const encabezados = sheet.getRange(1, 1, 1, 7).getValues()[0];
    Logger.log('   Columnas encontradas:');
    encabezados.forEach((col, idx) => {
      Logger.log('   - Columna ' + String.fromCharCode(65 + idx) + ': ' + col);
    });

    Logger.log('\n3️⃣ Buscando filas con datos...');
    const ultimaFila = sheet.getLastRow();
    Logger.log('   Última fila con datos: ' + ultimaFila);

    if (ultimaFila > 1) {
      Logger.log('\n4️⃣ Analizando primera fila de datos (fila 2)...');
      const fila = sheet.getRange(2, 1, 1, 7).getValues()[0];
      Logger.log('   Fecha: ' + fila[0]);
      Logger.log('   Nombre: ' + fila[1]);
      Logger.log('   Apellido: ' + fila[2]);
      Logger.log('   Email: ' + fila[3]);
      Logger.log('   Respuestas (primeros 80 chars): ' + String(fila[4]).substring(0, 80) + '...');
      Logger.log('   Informe Final: ' + fila[5]);
      Logger.log('   Estado: ' + fila[6]);

      Logger.log('\n5️⃣ Probando parseo de respuestas...');
      const respuestas = parsearRespuestas(String(fila[4]));
      if (respuestas) {
        Logger.log('   ✓ Respuestas parseadas: ' + respuestas.length + ' preguntas');
        Logger.log('   Primeras 5: ' + respuestas.slice(0, 5).join(', '));

        Logger.log('\n6️⃣ Probando cálculo de resultados...');
        const resultado = calcularResultados(respuestas);
        if (resultado) {
          Logger.log('   ✓ Resultados calculados correctamente');
          Logger.log('   Código de Perfil: ' + resultado.codigoPerfil);
          Logger.log('   Top 2 áreas: ' + resultado.top2.map(a => a.nombre).join(' + '));
          Logger.log('   Puntajes: ' + JSON.stringify(resultado.puntajes));
          Logger.log('   Total SI: ' + resultado.totalSI + ' / Total NO: ' + resultado.totalNO);
        }
      }
    }

    Logger.log('\n═══════════════════════════════════════');
    Logger.log('✅ DIAGNÓSTICO COMPLETADO');
    Logger.log('═══════════════════════════════════════');

  } catch (e) {
    Logger.log('❌ ERROR EN DIAGNÓSTICO: ' + e);
  }
}

// ============================================================================
// FUNCIÓN doPost PARA RECIBIR DATOS DEL FORMULARIO WEB
// ============================================================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = obtenerHoja();

    // La fila viene como: [fecha, nombre, apellido, email, respuestas[]]
    const fila = data.fila;
    const respuestasFormateadas = Array.isArray(fila[4]) ? fila[4].join(',') : fila[4];

    // Agregar fila
    sheet.appendRow([
      fila[0],       // fecha
      fila[1],       // nombre
      fila[2],       // apellido
      fila[3],       // email
      respuestasFormateadas, // respuestas como "SI,NO,SI,..."
      '',            // informe final (se llena después)
      ''             // estado (se llena después)
    ]);

    // Procesar inmediatamente
    const ultimaFila = sheet.getLastRow();
    const filaData = sheet.getRange(ultimaFila, 1, 1, 7).getValues()[0];
    procesarYEnviarInforme(sheet, ultimaFila, filaData);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Datos recibidos y procesados correctamente'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error en doPost: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}