import { URL_TEST7 } from '../../js/config/constants.js';
import { incrementCountAndRenderRetry,getStoredEmail } from '../../js/helpers/finalActions.js';

// ================== DATOS DEL TEST CHASIDE ==================

// 98 preguntas originales del Test CHASIDE con asignación de área
const questions = [
  { q: "¿Aceptarías trabajar escribiendo artículos en la sección económica de un diario?", area: "C" },
  { q: "¿Te ofrecerías para organizar la despedida de soltero de uno de tus amigos?", area: "C" },
  { q: "¿Te gustaría dirigir un proyecto de urbanización en tu provincia?", area: "A" },
  { q: "¿A una frustración siempre opones un pensamiento positivo?", area: "S" },
  { q: "¿Te dedicarías a socorrer a personas accidentadas o atacadas por asaltantes?", area: "D" },
  { q: "¿Cuando eras chico, te interesaba saber cómo estaban construidos tus juguetes?", area: "I" },
  { q: "¿Te interesan más los misterios de la naturaleza que los secretos de la tecnología?", area: "E" },
  { q: "¿Escuchas atentamente los problemas que te plantean tus amigos?", area: "S" },
  { q: "¿Te ofrecerías para explicar a tus compañeros un determinado tema que ellos no entendieron?", area: "H" },
  { q: "¿Eres exigente y crítico con tu equipo de trabajo?", area: "I" },
  { q: "¿Te atrae armar rompecabezas o puzzles?", area: "A" },
  { q: "¿Puedes establecer la diferencia conceptual entre macroeconomía y microeconomía?", area: "C" },
  { q: "¿Usar uniforme te hace sentir distinto, importante?", area: "D" },
  { q: "¿Participarías como profesional en un espectáculo de acrobacia aérea?", area: "D" },
  { q: "¿Organizas tu dinero de manera que te alcance hasta el próximo cobro?", area: "C" },
  { q: "¿Convences fácilmente a otras personas sobre la validez de tus argumentos?", area: "S" },
  { q: "¿Estás informado sobre los nuevos descubrimientos que se están realizando sobre la Teoría del Big-Bang?", area: "E" },
  { q: "¿Ante una situación de emergencia actúas rápidamente?", area: "D" },
  { q: "¿Cuando tienes que resolver un problema matemático, perseveras hasta encontrar la solución?", area: "I" },
  { q: "¿Si te convocara tu club preferido para planificar, organizar y dirigir un campo de deportes, aceptarías?", area: "C" },
  { q: "¿Eres el que pone un toque de alegría en las fiestas?", area: "A" },
  { q: "¿Crees que los detalles son tan importantes como el todo?", area: "A" },
  { q: "¿Te sentirías a gusto trabajando en un ámbito hospitalario?", area: "S" },
  { q: "¿Te gustaría participar para mantener el orden ante grandes desórdenes y cataclismos?", area: "D" },
  { q: "¿Pasarías varias horas leyendo algún libro de tu interés?", area: "H" },
  { q: "¿Planificas detalladamente tus trabajos antes de empezar?", area: "I" },
  { q: "¿Entablas una relación casi personal con tu computadora?", area: "I" },
  { q: "¿Disfrutas modelando con arcilla?", area: "A" },
  { q: "¿Ayudas habitualmente a los no videntes a cruzar la calle?", area: "S" },
  { q: "¿Consideras importante que desde la escuela primaria se fomente la actitud crítica y la participación activa?", area: "H" },
  { q: "¿Aceptarías que las mujeres formaran parte de las fuerzas armadas bajo las mismas normas que los hombres?", area: "D" },
  { q: "¿Te gustaría crear nuevas técnicas para descubrir las patologías de algunas enfermedades a través del microscopio?", area: "E" },
  { q: "¿Participarías en una campaña de prevención contra la enfermedad de Chagas?", area: "S" },
  { q: "¿Te interesan los temas relacionados al pasado y a la evolución del hombre?", area: "H" },
  { q: "¿Te incluirías en un proyecto de investigación de los movimientos sísmicos y sus consecuencias?", area: "E" },
  { q: "¿Fuera de los horarios escolares, dedicas algún día de la semana a la realización de actividades corporales?", area: "A" },
  { q: "¿Te interesan las actividades de mucha acción y de reacción rápida en situaciones imprevistas y de peligro?", area: "D" },
  { q: "¿Te ofrecerías para colaborar como voluntario en los gabinetes espaciales de la NASA?", area: "I" },
  { q: "¿Te gusta más el trabajo manual que el trabajo intelectual?", area: "A" },
  { q: "¿Estarías dispuesto a renunciar a un momento placentero para ofrecer tu servicio como profesional?", area: "S" },
  { q: "¿Participarías de una investigación sobre la violencia en el fútbol?", area: "H" },
  { q: "¿Te gustaría trabajar en un laboratorio mientras estudias?", area: "E" },
  { q: "¿Arriesgarías tu vida para salvar la vida de otro que no conoces?", area: "D" },
  { q: "¿Te agradaría hacer un curso de primeros auxilios?", area: "S" },
  { q: "¿Tolerarías empezar tantas veces como fuere necesario hasta obtener el logro deseado?", area: "A" },
  { q: "¿Distribuyes tus horarios del día adecuadamente para poder hacer todo lo planeado?", area: "C" },
  { q: "¿Harías un curso para aprender a fabricar los instrumentos y/o piezas de las máquinas o aparatos con que trabajas?", area: "I" },
  { q: "¿Elegirías una profesión en la que tuvieras que estar algunos meses alejado de tu familia, por ejemplo el marino?", area: "D" },
  { q: "¿Te radicarías en una zona agrícola-ganadera para desarrollar tus actividades como profesional?", area: "E" },
  { q: "¿Cuando estás en un grupo trabajando, te entusiasma producir ideas originales y que sean tenidas en cuenta?", area: "A" },
  { q: "¿Te resulta fácil coordinar un grupo de trabajo?", area: "C" },
  { q: "¿Te resultó interesante el estudio de las ciencias biológicas?", area: "S" },
  { q: "¿Si una gran empresa solicita un profesional como gerente de comercialización, te sentirías a gusto desempeñando ese rol?", area: "C" },
  { q: "¿Te incluirías en un proyecto nacional de desarrollo de la principal fuente de recursos de tu provincia?", area: "I" },
  { q: "¿Tienes interés por saber cuáles son las causas que determinan ciertos fenómenos, aunque saberlo no altere tu vida?", area: "E" },
  { q: "¿Descubriste algún filósofo o escritor que haya expresado tus mismas ideas con antelación?", area: "H" },
  { q: "¿Desearías que te regalen algún instrumento musical para tu cumpleaños?", area: "A" },
  { q: "¿Aceptarías colaborar con el cumplimiento de las normas en lugares públicos?", area: "D" },
  { q: "¿Crees que tus ideas son importantes, y haces todo lo posible para ponerlas en práctica?", area: "I" },
  { q: "¿Cuando se descompone un artefacto en tu casa, te dispones prontamente a repararlo?", area: "I" },
  { q: "¿Formarías parte de un equipo de trabajo orientado a la preservación de la flora y la fauna en extinción?", area: "E" },
  { q: "¿Acostumbras a leer revistas relacionadas con los últimos avances científicos y tecnológicos en el área de la salud?", area: "S" },
  { q: "¿Preservar las raíces culturales de nuestro país, te parece importante y necesario?", area: "H" },
  { q: "¿Te gustaría realizar una investigación que contribuyera a hacer más justa la distribución de la riqueza?", area: "C" },
  { q: "¿Te gustaría realizar tareas auxiliares en una nave, como por ejemplo izado y arriado de velas, pintura y conservación del casco, arreglo de averías, conservación de motores, etc?", area: "D" },
  { q: "¿Crees que un país debe poseer la más alta tecnología armamentista, a cualquier precio?", area: "D" },
  { q: "¿La libertad y la justicia son valores fundamentales en tu vida?", area: "H" },
  { q: "¿Aceptarías hacer una práctica rentada en una industria de productos alimenticios en el sector de control de calidad?", area: "E" },
  { q: "¿Consideras que la salud pública debe ser prioritaria, gratuita y eficiente para todos?", area: "S" },
  { q: "¿Te interesaría investigar sobre alguna nueva vacuna?", area: "S" },
  { q: "¿En un equipo de trabajo, prefieres el rol de coordinador?", area: "C" },
  { q: "¿En una discusión entre amigos, te ofreces como mediador?", area: "H" },
  { q: "¿Estás de acuerdo con la formación de un cuerpo de soldados profesionales?", area: "D" },
  { q: "¿Lucharías por una causa justa hasta las últimas consecuencias?", area: "H" },
  { q: "¿Te gustaría investigar científicamente sobre cultivos agrícolas?", area: "I" },
  { q: "¿Harías un nuevo diseño de una prenda pasada de moda, ante una reunión imprevista?", area: "A" },
  { q: "¿Visitarías un observatorio astronómico para conocer en acción el funcionamiento de los aparatos?", area: "E" },
  { q: "¿Dirigirías el área de importación y exportación de una empresa?", area: "C" },
  { q: "¿Te inhibes al entrar a un lugar nuevo con gente desconocida?", area: "E" },
  { q: "¿Te gratificaría el trabajar con niños?", area: "H" },
  { q: "¿Harías el diseño de un afiche para una campaña contra el sida?", area: "A" },
  { q: "¿Dirigirías un grupo de teatro independiente?", area: "A" },
  { q: "¿Enviarías tu curriculum a una empresa automotriz que solicita gerente para su área de producción?", area: "I" },
  { q: "¿Participarías en un grupo de defensa internacional dentro de alguna fuerza armada?", area: "D" },
  { q: "¿Te costearías tus estudios trabajando en una auditoría?", area: "C" },
  { q: "¿Eres de los que defienden causas perdidas?", area: "H" },
  { q: "¿Ante una emergencia epidémica participarías en una campaña brindando tu ayuda?", area: "S" },
  { q: "¿Sabrías responder qué significa ADN y ARN?", area: "E" },
  { q: "¿Elegirías una carrera cuyo instrumento de trabajo fuere la utilización de un idioma extranjero?", area: "H" },
  { q: "¿Trabajar con objetos te resulta más gratificante que trabajar con personas?", area: "I" },
  { q: "¿Te resultaría gratificante ser asesor contable en una empresa reconocida?", area: "C" },
  { q: "¿Ante un llamado solidario, te ofrecerías para cuidar a un enfermo?", area: "S" },
  { q: "¿Te atrae investigar sobre los misterios del universo, por ejemplo los agujeros negros?", area: "E" },
  { q: "¿El trabajo individual te resulta más rápido y efectivo que el trabajo grupal?", area: "E" },
  { q: "¿Dedicarías parte de tu tiempo a ayudar a personas de zonas carenciadas?", area: "H" },
  { q: "¿Cuando eliges tu ropa o decoras un ambiente, tienes en cuenta la combinación de los colores, las telas o el estilo de los muebles?", area: "A" },
  { q: "¿Te gustaría trabajar como profesional dirigiendo la construcción de una empresa hidroeléctrica?", area: "I" },
  { q: "¿Sabes qué es el PBI?", area: "C" },
];

// ================== ESTADO ==================
const CHUNK = 14; // preguntas por sección
let userName = "", userLastName = "", userEmail = "";
let currentSection = 0;
let answers = {}; // { questionIndex: 'SI' | 'NO' }

// ================== CONSTRUCCIÓN DE SECCIONES ==================
function buildSections() {
  const arr = [];
  for (let i = 0; i < questions.length; i += CHUNK) {
    arr.push({ start: i, end: Math.min(i + CHUNK, questions.length) });
  }
  return arr;
}
const sections = buildSections();

// ================== UI INICIO ==================
const nameInput = document.getElementById("userName");
const lastNameInput = document.getElementById("userLastName");
const emailInput = document.getElementById("userEmail");
const startBtn = document.getElementById("startBtn");

function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function updateStartState() {
  startBtn.disabled = !(nameInput.value.trim() && lastNameInput.value.trim() && emailOk(emailInput.value.trim()));
}
nameInput.addEventListener("input", updateStartState);
lastNameInput.addEventListener("input", updateStartState);
emailInput.addEventListener("input", updateStartState);

startBtn.addEventListener("click", startTest);
document.getElementById("prevBtn").addEventListener("click", previousSection);
document.getElementById("nextBtn").addEventListener("click", nextSection);


function startTest() {
  userName = nameInput.value.trim();
  userLastName = lastNameInput.value.trim();
  userEmail = emailInput.value.trim();
  document.getElementById("registrationScreen").classList.add("hidden");
  document.getElementById("testScreen").classList.remove("hidden");
  renderSection();
}

// ================== RENDER SECCIÓN ==================
function renderSection() {
  const s = sections[currentSection];
  const container = document.getElementById("sectionContainer");

  let html = `<div class="section-title">Preguntas ${s.start + 1} – ${s.end}</div>`;

  for (let i = s.start; i < s.end; i++) {
    const question = questions[i];
    const ans = answers[i];
    const isSi = ans === 'SI';
    const isNo = ans === 'NO';

    html += `
      <div class="question-item">
        <div class="question-number">${i + 1}</div>
        <div class="question-text">${question.q}</div>
        <div class="answer-buttons">
          <button class="answer-btn ${isSi ? 'active-si' : ''}" 
                  onclick="selectAnswer(${i}, 'SI')">
            SÍ
          </button>
          <button class="answer-btn ${isNo ? 'active-no' : ''}" 
                  onclick="selectAnswer(${i}, 'NO')">
            NO
          </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
  updateProgress();
  updateNavigationButtons();
}

function selectAnswer(questionIdx, value) {
  // Si ya está seleccionada la misma respuesta, deseleccionar
  if (answers[questionIdx] === value) {
    delete answers[questionIdx];
  } else {
    answers[questionIdx] = value;
  }
  renderSection();
}
window.selectAnswer = selectAnswer;

function isSectionComplete() {
  const s = sections[currentSection];
  for (let i = s.start; i < s.end; i++) {
    if (answers[i] === undefined) return false;
  }
  return true;
}

function updateNavigationButtons() {
  document.getElementById("prevBtn").disabled = currentSection === 0;
  const next = document.getElementById("nextBtn");
  next.disabled = !isSectionComplete();
  next.textContent = (currentSection === sections.length - 1) ? "Finalizar Test" : "Siguiente";
}

function updateProgress() {
  const total = sections.length;
  const p = ((currentSection + 1) / total) * 100;
  document.getElementById("progressFill").style.width = p + "%";
  document.getElementById("progressPercent").textContent = Math.round(p) + "%";
  document.getElementById("pageIndicator").textContent = `Sección ${currentSection + 1} de ${total}`;
}

function previousSection() {
  if (currentSection > 0) {
    currentSection--;
    renderSection();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function nextSection() {
  if (currentSection < sections.length - 1) {
    currentSection++;
    renderSection();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    finishTest();
  }
}

// ================== FINALIZAR TEST ==================
function finishTest() {
  // Verificar que todas las preguntas estén contestadas
  if (Object.keys(answers).length !== questions.length) {
    alert("Por favor responde todas las preguntas antes de finalizar.");
    return;
  }

  // Mostrar pantalla de carga
  document.getElementById("testScreen").classList.add("hidden");
  document.getElementById("loadingScreen").classList.remove("hidden");

  // Enviar datos y mostrar confirmación
  sendToGoogleSheets();

  setTimeout(() => {
    document.getElementById("loadingScreen").classList.add("hidden");
    document.getElementById("confirmationScreen").classList.remove("hidden");
    document.getElementById("confirmEmail").textContent = userEmail;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 2000);
}

// ================== ENVÍO DE DATOS (formato Kuder) ==================
const WEB_APP_URL = URL_TEST7;

async function sendToGoogleSheets() {
  const today = new Date();
  const fecha = today.toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });

  // Preparar respuestas: para cada pregunta, guardamos la respuesta
  const respuestas = [];
  for (let i = 0; i < questions.length; i++) {
    const ans = answers[i] || '';
    respuestas.push(`${ans}`);
  }

  const filaOrdenada = [
    fecha,
    userName,
    userLastName,
    getStoredEmail(),
    respuestas
  ];

  const payload = {
    nombreHoja: "Respuestas",
    fila: filaOrdenada
  };

  console.log("Enviando a la base de datos:", payload);

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    incrementCountAndRenderRetry();
    console.log("GAS Response:", await res.text());
  } catch (error) {
    console.error("Error enviando a Google Sheets:", error);
  }
}

// ================== REINICIAR ==================
function restartTest() {
  currentSection = 0;
  answers = {};
  userName = "";
  userLastName = "";
  userEmail = "";
  nameInput.value = "";
  lastNameInput.value = "";
  emailInput.value = "";
  updateStartState();
  document.getElementById("confirmationScreen").classList.add("hidden");
  document.getElementById("registrationScreen").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}