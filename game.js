// ============================================================
// KERNEL RUN
// GAME.JS
//
// NIVEL 1: INICIO DEL SISTEMA
// NIVEL 2: TERMINAL
// NIVEL 3: PROCESAMIENTO
// NIVEL 4: KERNEL
// ============================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// ============================================================
// ESTADO GENERAL
// ============================================================

let juegoActivo = false;
let juegoPausado = false;

let nivelActual = 1;

let vidas = 3;
let conceptosRecogidos = 0;

let metaAvisada = false;

let respawnX = 100;
let respawnY = 300;

let invulnerable = false;
let tiempoInvulnerable = 0;

let camaraX = 0;
let frameJuego = 0;

let mensajeTemporal = "";
let tiempoMensaje = 0;

let anchoMapa = 5000;


// ============================================================
// OBJETOS ACTIVOS
// ============================================================

let plataformas = [];
let plataformasMoviles = [];
let plataformasIntermitentes = [];

let obstaculos = [];
let obstaculosMoviles = [];
let checkpoints = [];
let enemigos = [];
let bloquesConceptos = [];

let jefeKernel = null;
let jefeKernelDerrotado = false;

let meta = {
    x: 0,
    y: 0,
    ancho: 80,
    alto: 110
};


// ============================================================
// TECLADO
// ============================================================

const teclas = {};

let saltoPresionado = false;


window.addEventListener("keydown", evento => {

    if (!juegoActivo || juegoPausado) return;

    const controles = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Space",
        "KeyW",
        "KeyA",
        "KeyD"
    ];

    if (controles.includes(evento.code)) {
        evento.preventDefault();
    }

    teclas[evento.code] = true;


    if (evento.code === "Escape") {

        salirDelJuego();

        return;
    }


    const esSalto =
        evento.code === "ArrowUp" ||
        evento.code === "KeyW" ||
        evento.code === "Space";


    if (
        esSalto &&
        jugador.enSuelo &&
        !saltoPresionado
    ) {

        jugador.velocidadY =
            -jugador.fuerzaSalto;

        jugador.enSuelo = false;

        jugador.plataformaActual =
            null;

        saltoPresionado = true;
    }
});


window.addEventListener("keyup", evento => {

    teclas[evento.code] = false;

    const esSalto =
        evento.code === "ArrowUp" ||
        evento.code === "KeyW" ||
        evento.code === "Space";


    if (esSalto) {

        saltoPresionado = false;

        if (jugador.velocidadY < -5) {

            jugador.velocidadY *= 0.48;
        }
    }
});


window.addEventListener(
    "blur",
    limpiarTeclas
);


document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            limpiarTeclas();
        }
    }
);


function limpiarTeclas() {

    for (const tecla in teclas) {

        teclas[tecla] = false;
    }

    if (
        typeof jugador !==
        "undefined"
    ) {

        jugador.velocidadX = 0;
    }

    saltoPresionado = false;
}


// ============================================================
// JUGADOR
// ============================================================

const jugador = {

    x: 100,
    y: 300,

    ancho: 38,
    alto: 50,

    velocidadX: 0,
    velocidadY: 0,

    velocidad: 5,
    fuerzaSalto: 16,

    enSuelo: false,

    mirando: 1,

    plataformaActual: null
};


// ============================================================
// FÍSICA
// ============================================================

const gravedad = 0.7;
const friccion = 0.80;

const TOLERANCIA_PLATAFORMA = 5;


// ============================================================
// DATOS DE LOS NIVELES
// ============================================================

const niveles = {

    // ========================================================
    // NIVEL 1 — INICIO DEL SISTEMA
    // ========================================================

    1: {

        nombre:
            "INICIO DEL SISTEMA",

        ancho: 5000,

        inicioX: 100,
        inicioY: 300,


        plataformas: [

            {
                x: 0,
                y: 480,
                ancho: 650,
                alto: 60
            },

            {
                x: 720,
                y: 390,
                ancho: 180,
                alto: 30
            },

            {
                x: 960,
                y: 310,
                ancho: 180,
                alto: 30
            },

            {
                x: 1200,
                y: 230,
                ancho: 200,
                alto: 30
            },

            {
                x: 1470,
                y: 360,
                ancho: 240,
                alto: 30
            },

            {
                x: 1780,
                y: 480,
                ancho: 650,
                alto: 60
            },

            {
                x: 2510,
                y: 390,
                ancho: 180,
                alto: 30
            },

            {
                x: 2760,
                y: 300,
                ancho: 180,
                alto: 30
            },

            {
                x: 3020,
                y: 210,
                ancho: 180,
                alto: 30
            },

            {
                x: 3280,
                y: 300,
                ancho: 180,
                alto: 30
            },

            {
                x: 3540,
                y: 390,
                ancho: 180,
                alto: 30
            },

            {
                x: 3800,
                y: 480,
                ancho: 1200,
                alto: 60
            },

            {
                x: 3970,
                y: 340,
                ancho: 180,
                alto: 30
            },

            {
                x: 4230,
                y: 250,
                ancho: 180,
                alto: 30
            },

            {
                x: 4480,
                y: 340,
                ancho: 180,
                alto: 30
            }
        ],


        plataformasMoviles: [],

        plataformasIntermitentes: [],


        obstaculos: [

            {
                x: 350,
                y: 450,
                ancho: 50,
                alto: 30
            },

            {
                x: 500,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 1900,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 2150,
                y: 450,
                ancho: 70,
                alto: 30
            },

            {
                x: 3900,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 4140,
                y: 450,
                ancho: 70,
                alto: 30
            },

            {
                x: 4400,
                y: 450,
                ancho: 70,
                alto: 30
            }
        ],


        checkpoints: [

            {
                x: 1830,
                y: 400,

                ancho: 35,
                alto: 80,

                respawnX: 1880,
                respawnY: 430
            },

            {
                x: 3850,
                y: 400,

                ancho: 35,
                alto: 80,

                respawnX: 3980,
                respawnY: 430
            }
        ],


        enemigos: [

            {
                x: 170,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 1.3,

                limiteIzquierda: 100,
                limiteDerecha: 300
            },

            {
                x: 1500,
                y: 320,

                ancho: 38,
                alto: 40,

                velocidad: 1.5,

                limiteIzquierda: 1490,
                limiteDerecha: 1650
            },

            {
                x: 2000,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 1.8,

                limiteIzquierda: 1970,
                limiteDerecha: 2100
            },

            {
                x: 2810,
                y: 260,

                ancho: 38,
                alto: 40,

                velocidad: 1.7,

                limiteIzquierda: 2780,
                limiteDerecha: 2890
            },

            {
                x: 4000,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2,

                limiteIzquierda: 3980,
                limiteDerecha: 4100
            },

            {
                x: 4550,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2.2,

                limiteIzquierda: 4500,
                limiteDerecha: 4680
            }
        ],


        conceptos: [

            {
                conceptoId: 1,
                x: 590,
                y: 390,
                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 2,
                x: 1270,
                y: 170,
                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 3,
                x: 3075,
                y: 150,
                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 4,
                x: 4310,
                y: 190,
                ancho: 44,
                alto: 44
            }
        ],


        meta: {

            x: 4840,
            y: 370,

            ancho: 80,
            alto: 110
        }
    },


    // ========================================================
    // NIVEL 2 — TERMINAL
    // ========================================================

    2: {

        nombre:
            "TERMINAL",

        ancho: 5900,

        inicioX: 100,
        inicioY: 300,


        plataformas: [

            {
                x: 0,
                y: 480,
                ancho: 500,
                alto: 60
            },

            {
                x: 860,
                y: 300,
                ancho: 170,
                alto: 30
            },

            {
                x: 1110,
                y: 220,
                ancho: 180,
                alto: 30
            },

            {
                x: 1380,
                y: 330,
                ancho: 170,
                alto: 30
            },

            {
                x: 1650,
                y: 480,
                ancho: 580,
                alto: 60
            },

            {
                x: 3160,
                y: 210,
                ancho: 170,
                alto: 30
            },

            {
                x: 3420,
                y: 310,
                ancho: 170,
                alto: 30
            },

            {
                x: 3670,
                y: 400,
                ancho: 170,
                alto: 30
            },

            {
                x: 3930,
                y: 480,
                ancho: 480,
                alto: 60
            },

            {
                x: 4660,
                y: 390,
                ancho: 150,
                alto: 30
            },

            {
                x: 4910,
                y: 290,
                ancho: 160,
                alto: 30
            },

            {
                x: 5160,
                y: 200,
                ancho: 170,
                alto: 30
            },

            {
                x: 5700,
                y: 480,
                ancho: 200,
                alto: 60
            }
        ],


        plataformasMoviles: [

            {
                x: 530,
                y: 390,

                ancho: 150,
                alto: 24,

                eje: "x",

                minimo: 520,
                maximo: 700,

                velocidad: 1.3
            },

            {
                x: 2250,
                y: 390,

                ancho: 150,
                alto: 24,

                eje: "x",

                minimo: 2240,
                maximo: 2430,

                velocidad: 1.8
            },

            {
                x: 2580,
                y: 400,

                ancho: 140,
                alto: 24,

                eje: "y",

                minimo: 245,
                maximo: 410,

                velocidad: 1.5
            },

            {
                x: 2780,
                y: 260,

                ancho: 145,
                alto: 24,

                eje: "x",

                minimo: 2740,
                maximo: 2990,

                velocidad: 1.7
            },

            {
                x: 4440,
                y: 410,

                ancho: 140,
                alto: 24,

                eje: "y",

                minimo: 270,
                maximo: 420,

                velocidad: 1.8
            },

            {
                x: 5320,
                y: 370,

                ancho: 140,
                alto: 24,

                eje: "x",

                minimo: 5290,
                maximo: 5510,

                velocidad: 2
            }
        ],


        plataformasIntermitentes: [],


        obstaculos: [

            {
                x: 270,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 400,
                y: 450,
                ancho: 55,
                alto: 30
            },

            {
                x: 1780,
                y: 450,
                ancho: 65,
                alto: 30
            },

            {
                x: 1950,
                y: 450,
                ancho: 80,
                alto: 30
            },

            {
                x: 2100,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 3990,
                y: 450,
                ancho: 70,
                alto: 30
            },

            {
                x: 4140,
                y: 450,
                ancho: 70,
                alto: 30
            },

            {
                x: 4270,
                y: 450,
                ancho: 70,
                alto: 30
            },

            {
                x: 5760,
                y: 450,
                ancho: 60,
                alto: 30
            }
        ],


        checkpoints: [

            {
                x: 1685,
                y: 400,

                ancho: 35,
                alto: 80,

                respawnX: 1730,
                respawnY: 430
            },

            {
                x: 3960,
                y: 400,

                ancho: 35,
                alto: 80,

                respawnX: 4020,
                respawnY: 430
            }
        ],


        enemigos: [

            {
                x: 120,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 1.7,

                limiteIzquierda: 80,
                limiteDerecha: 230
            },

            {
                x: 1410,
                y: 290,

                ancho: 38,
                alto: 40,

                velocidad: 1.8,

                limiteIzquierda: 1390,
                limiteDerecha: 1500
            },

            {
                x: 1870,
                                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2,

                limiteIzquierda: 1850,
                limiteDerecha: 1930
            },

            {
                x: 3190,
                y: 170,

                ancho: 38,
                alto: 40,

                velocidad: 2,

                limiteIzquierda: 3180,
                limiteDerecha: 3270
            },

            {
                x: 4040,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2.2,

                limiteIzquierda: 4010,
                limiteDerecha: 4120
            },

            {
                x: 4950,
                y: 250,

                ancho: 38,
                alto: 40,

                velocidad: 2.2,

                limiteIzquierda: 4930,
                limiteDerecha: 5010
            }
        ],


        conceptos: [

            {
                conceptoId: 5,
                x: 910,
                y: 240,
                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 6,
                x: 2050,
                y: 380,
                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 7,
                x: 3215,
                y: 150,
                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 8,
                x: 5215,
                y: 140,
                ancho: 44,
                alto: 44
            }
        ],


        meta: {

            x: 5800,
            y: 370,

            ancho: 80,
            alto: 110
        }
    },


    // ========================================================
    // NIVEL 3 — PROCESAMIENTO
    // ========================================================

    3: {

        nombre:
            "PROCESAMIENTO",

        ancho: 6500,

        inicioX: 100,
        inicioY: 300,


        // ====================================================
        // PLATAFORMAS FIJAS
        // ====================================================

        plataformas: [

            // Inicio seguro
            {
                x: 0,
                y: 480,
                ancho: 620,
                alto: 60
            },


            // Primera subida
            {
                x: 820,
                y: 380,
                ancho: 180,
                alto: 30
            },

            {
                x: 1080,
                y: 290,
                ancho: 180,
                alto: 30
            },


            // Primera zona segura
            {
                x: 1510,
                y: 480,
                ancho: 650,
                alto: 60
            },


            // Zona después de intermitentes
            {
                x: 2630,
                y: 310,
                ancho: 170,
                alto: 30
            },

            {
                x: 2890,
                y: 220,
                ancho: 180,
                alto: 30
            },

            {
                x: 3160,
                y: 320,
                ancho: 180,
                alto: 30
            },


            // Segundo checkpoint
            {
                x: 3420,
                y: 480,
                ancho: 600,
                alto: 60
            },


            // Sección de precisión
            {
                x: 4250,
                y: 380,
                ancho: 160,
                alto: 30
            },

            {
                x: 4510,
                y: 280,
                ancho: 160,
                alto: 30
            },


            // Zona antes del final
            {
                x: 5200,
                y: 480,
                ancho: 500,
                alto: 60
            },


            // Ascenso final
            {
                x: 5790,
                y: 380,
                ancho: 160,
                alto: 30
            },

            {
                x: 6040,
                y: 290,
                ancho: 160,
                alto: 30
            },


            // Meta
            {
                x: 6250,
                y: 480,
                ancho: 250,
                alto: 60
            }
        ],


        // ====================================================
        // PLATAFORMAS MÓVILES
        // ====================================================

        plataformasMoviles: [

            // Conecta inicio con primera subida
            {
                x: 640,
                y: 410,

                ancho: 140,
                alto: 24,

                eje: "x",

                minimo: 630,
                maximo: 700,

                velocidad: 1.5
            },


            // Elevador hacia primer concepto
            {
                x: 1300,
                y: 390,

                ancho: 140,
                alto: 24,

                eje: "y",

                minimo: 230,
                maximo: 410,

                velocidad: 1.6
            },


            // Puente central
            {
                x: 2190,
                y: 390,

                ancho: 140,
                alto: 24,

                eje: "x",

                minimo: 2180,
                maximo: 2320,

                velocidad: 1.8
            },


            // Elevador zona media
            {
                x: 4050,
                y: 400,

                ancho: 140,
                alto: 24,

                eje: "y",

                minimo: 260,
                maximo: 410,

                velocidad: 1.8
            },


            // Plataforma móvil antes del segundo grupo
            {
                x: 4760,
                y: 360,

                ancho: 145,
                alto: 24,

                eje: "x",

                minimo: 4740,
                maximo: 4900,

                velocidad: 2
            },


            // Último puente
            {
                x: 5680,
                y: 400,

                ancho: 100,
                alto: 24,

                eje: "y",

                minimo: 300,
                maximo: 410,

                velocidad: 1.8
            }
        ],


        // ====================================================
        // PLATAFORMAS INTERMITENTES
        // ====================================================

        plataformasIntermitentes: [

            {
                x: 1280,
                y: 220,

                ancho: 150,
                alto: 24,

                tiempoActiva: 190,
                tiempoAdvertencia: 70,
                tiempoApagada: 100,

                desfase: 0
            },


            // Primera secuencia
            {
                x: 2360,
                y: 350,

                ancho: 150,
                alto: 24,

                tiempoActiva: 180,
                tiempoAdvertencia: 70,
                tiempoApagada: 100,

                desfase: 0
            },

            {
                x: 2500,
                y: 270,

                ancho: 150,
                alto: 24,

                tiempoActiva: 180,
                tiempoAdvertencia: 70,
                tiempoApagada: 100,

                desfase: 90
            },


            // Segunda secuencia
            {
                x: 4940,
                y: 300,

                ancho: 150,
                alto: 24,

                tiempoActiva: 170,
                tiempoAdvertencia: 70,
                tiempoApagada: 110,

                desfase: 0
            },

            {
                x: 5070,
                y: 390,

                ancho: 150,
                alto: 24,

                tiempoActiva: 170,
                tiempoAdvertencia: 70,
                tiempoApagada: 110,

                desfase: 100
            },


            // Secuencia final
            {
                x: 5720,
                y: 260,

                ancho: 150,
                alto: 24,

                tiempoActiva: 160,
                tiempoAdvertencia: 70,
                tiempoApagada: 110,

                desfase: 40
            },

            {
                x: 5950,
                y: 380,

                ancho: 150,
                alto: 24,

                tiempoActiva: 160,
                tiempoAdvertencia: 70,
                tiempoApagada: 110,

                desfase: 120
            }
        ],


        // ====================================================
        // OBSTÁCULOS
        // ====================================================

        obstaculos: [

            {
                x: 300,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 450,
                y: 450,
                ancho: 70,
                alto: 30
            },


            // Primera zona segura
            {
                x: 1660,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 1830,
                y: 450,
                ancho: 80,
                alto: 30
            },

            {
                x: 1990,
                y: 450,
                ancho: 70,
                alto: 30
            },


            // Segundo checkpoint
            {
                x: 3550,
                y: 450,
                ancho: 70,
                alto: 30
            },

            {
                x: 3740,
                y: 450,
                ancho: 80,
                alto: 30
            },


            // Zona final segura
            {
                x: 5320,
                y: 450,
                ancho: 70,
                alto: 30
            },

            {
                x: 5500,
                y: 450,
                ancho: 70,
                alto: 30
            }
        ],


        // ====================================================
        // CHECKPOINTS
        // ====================================================

        checkpoints: [

            {
                x: 1540,
                y: 400,

                ancho: 35,
                alto: 80,

                respawnX: 1600,
                respawnY: 430
            },

            {
                x: 3450,
                y: 400,

                ancho: 35,
                alto: 80,

                respawnX: 3500,
                respawnY: 430
            }
        ],


        // ====================================================
        // ENEMIGOS
        // ====================================================

        enemigos: [

            {
                x: 130,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 1.8,

                limiteIzquierda: 80,
                limiteDerecha: 250
            },

            {
                x: 860,
                y: 340,

                ancho: 38,
                alto: 40,

                velocidad: 2,

                limiteIzquierda: 840,
                limiteDerecha: 950
            },

            {
                x: 1730,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2.1,

                limiteIzquierda: 1720,
                limiteDerecha: 1810
            },

            {
                x: 2660,
                y: 270,

                ancho: 38,
                alto: 40,

                velocidad: 2.2,

                limiteIzquierda: 2650,
                limiteDerecha: 2740
            },

            {
                x: 3500,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2.3,

                limiteIzquierda: 3490,
                limiteDerecha: 3530
            },

            {
                x: 4540,
                y: 240,

                ancho: 38,
                alto: 40,

                velocidad: 2.3,

                limiteIzquierda: 4530,
                limiteDerecha: 4620
            },

            {
                x: 5410,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2.5,

                limiteIzquierda: 5400,
                limiteDerecha: 5480
            },

            {
                x: 6070,
                y: 250,

                ancho: 38,
                alto: 40,

                velocidad: 2.5,

                limiteIzquierda: 6060,
                limiteDerecha: 6140
            }
        ],


        // ====================================================
        // CONCEPTOS 9–12
        // ====================================================

        conceptos: [

            {
                conceptoId: 9,

                x: 1135,
                y: 225,

                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 10,

                x: 2945,
                y: 155,

                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 11,

                x: 4565,
                y: 210,

                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 12,

                x: 6095,
                y: 225,

                ancho: 44,
                alto: 44
            }
        ],


        meta: {

            x: 6380,
            y: 370,

            ancho: 80,
            alto: 110
        }
    },


    // ========================================================
    // NIVEL 4 — KERNEL
    // ========================================================

    4: {

        nombre:
            "KERNEL",

        // Más largo que el Nivel 3.
        ancho: 8000,

        inicioX: 100,
        inicioY: 300,


        // ====================================================
        // PLATAFORMAS FIJAS
        // ====================================================

        plataformas: [

            // ------------------------------------------------
            // ZONA 1 — ENTRADA AL KERNEL
            // ------------------------------------------------

            {
                x: 0,
                y: 480,
                ancho: 620,
                alto: 60
            },

            {
                x: 820,
                y: 380,
                ancho: 180,
                alto: 30
            },

            {
                x: 1080,
                y: 280,
                ancho: 180,
                alto: 30
            },

            {
                x: 1450,
                y: 480,
                ancho: 650,
                alto: 60
            },


            // ------------------------------------------------
            // ZONA 2 — SYSTEM CALL
            // ------------------------------------------------

            {
                x: 2400,
                y: 370,
                ancho: 170,
                alto: 30
            },

            {
                x: 2670,
                y: 270,
                ancho: 170,
                alto: 30
            },

            {
                x: 2950,
                y: 370,
                ancho: 170,
                alto: 30
            },

            {
                x: 3260,
                y: 480,
                ancho: 650,
                alto: 60
            },


            // ------------------------------------------------
            // ZONA 3 — INTERRUPT
            // ------------------------------------------------

            {
                x: 4170,
                y: 380,
                ancho: 170,
                alto: 30
            },

            {
                x: 4440,
                y: 280,
                ancho: 170,
                alto: 30
            },

            {
                x: 5000,
                y: 480,
                ancho: 600,
                alto: 60
            },


            // ------------------------------------------------
            // ZONA 4 — MEMORY CORE
            // ------------------------------------------------

            {
                x: 5820,
                y: 370,
                ancho: 170,
                alto: 30
            },

            {
                x: 6080,
                y: 270,
                ancho: 170,
                alto: 30
            },


            // ------------------------------------------------
            // ARENA DEL JEFE
            // ------------------------------------------------

            {
                x: 6350,
                y: 480,
                ancho: 1080,
                alto: 60
            },


            // ------------------------------------------------
            // SALIDA FINAL
            // ------------------------------------------------

            {
                x: 7500,
                y: 480,
                ancho: 500,
                alto: 60
            }
        ],


        // ====================================================
        // PLATAFORMAS MÓVILES
        // ====================================================

        plataformasMoviles: [
                        {
                x: 640,
                y: 410,

                ancho: 140,
                alto: 24,

                eje: "x",

                minimo: 630,
                maximo: 700,

                velocidad: 1.7
            },

            {
                x: 1290,
                y: 390,

                ancho: 140,
                alto: 24,

                eje: "y",

                minimo: 235,
                maximo: 410,

                velocidad: 1.8
            },

            {
                x: 2140,
                y: 400,

                ancho: 150,
                alto: 24,

                eje: "x",

                minimo: 2120,
                maximo: 2260,

                velocidad: 2
            },

            {
                x: 3940,
                y: 400,

                ancho: 145,
                alto: 24,

                eje: "y",

                minimo: 250,
                maximo: 410,

                velocidad: 2
            },

            {
                x: 4680,
                y: 350,

                ancho: 150,
                alto: 24,

                eje: "x",

                minimo: 4660,
                maximo: 4830,

                velocidad: 2.2
            },

            {
                x: 5630,
                y: 400,

                ancho: 150,
                alto: 24,

                eje: "y",

                minimo: 255,
                maximo: 410,

                velocidad: 2
            }
        ],


        // ====================================================
        // PLATAFORMAS INTERMITENTES
        // ====================================================

        plataformasIntermitentes: [

            {
                x: 1280,
                y: 220,

                ancho: 150,
                alto: 24,

                tiempoActiva: 160,
                tiempoAdvertencia: 65,
                tiempoApagada: 110,

                desfase: 20
            },

            {
                x: 2290,
                y: 320,

                ancho: 145,
                alto: 24,

                tiempoActiva: 155,
                tiempoAdvertencia: 65,
                tiempoApagada: 115,

                desfase: 0
            },

            {
                x: 3130,
                y: 410,

                ancho: 120,
                alto: 24,

                tiempoActiva: 150,
                tiempoAdvertencia: 60,
                tiempoApagada: 120,

                desfase: 70
            },

            {
                x: 4620,
                y: 360,

                ancho: 145,
                alto: 24,

                tiempoActiva: 145,
                tiempoAdvertencia: 60,
                tiempoApagada: 120,

                desfase: 30
            },

            {
                x: 4840,
                y: 270,

                ancho: 145,
                alto: 24,

                tiempoActiva: 145,
                tiempoAdvertencia: 60,
                tiempoApagada: 120,

                desfase: 100
            },

            {
                x: 6200,
                y: 360,

                ancho: 140,
                alto: 24,

                tiempoActiva: 140,
                tiempoAdvertencia: 60,
                tiempoApagada: 125,

                desfase: 50
            }
        ],


        // ====================================================
        // OBSTÁCULOS
        // ====================================================

        obstaculos: [

            {
                x: 300,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 470,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 1600,
                y: 450,
                ancho: 70,
                alto: 30
            },

            {
                x: 1800,
                y: 450,
                ancho: 80,
                alto: 30
            },

            {
                x: 1980,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 3400,
                y: 450,
                ancho: 70,
                alto: 30
            },

            {
                x: 3600,
                y: 450,
                ancho: 80,
                alto: 30
            },

            {
                x: 3800,
                y: 450,
                ancho: 60,
                alto: 30
            },

            {
                x: 5150,
                y: 450,
                ancho: 70,
                alto: 30
            },

            {
                x: 5350,
                y: 450,
                ancho: 70,
                alto: 30
            }
        ],


        // ====================================================
        // CHECKPOINTS
        // ====================================================

        checkpoints: [

            {
                x: 1500,
                y: 400,

                ancho: 35,
                alto: 80,

                respawnX: 1550,
                respawnY: 430
            },

            {
                x: 6380,
                y: 400,

                ancho: 35,
                alto: 80,

                respawnX: 6430,
                respawnY: 430
            }
        ],


        // ====================================================
        // ENEMIGOS
        // ====================================================

        enemigos: [

            {
                x: 120,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2,

                limiteIzquierda: 80,
                limiteDerecha: 250
            },

            {
                x: 860,
                y: 340,

                ancho: 38,
                alto: 40,

                velocidad: 2.2,

                limiteIzquierda: 840,
                limiteDerecha: 950
            },

            {
                x: 1700,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2.3,

                limiteIzquierda: 1680,
                limiteDerecha: 1770
            },

            {
                x: 2700,
                y: 230,

                ancho: 38,
                alto: 40,

                velocidad: 2.4,

                limiteIzquierda: 2690,
                limiteDerecha: 2790
            },

            {
                x: 3480,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2.5,

                limiteIzquierda: 3470,
                limiteDerecha: 3560
            },

            {
                x: 4470,
                y: 240,

                ancho: 38,
                alto: 40,

                velocidad: 2.6,

                limiteIzquierda: 4460,
                limiteDerecha: 4550
            },

            {
                x: 5200,
                y: 440,

                ancho: 38,
                alto: 40,

                velocidad: 2.7,

                limiteIzquierda: 5190,
                limiteDerecha: 5300
            },

            {
                x: 5850,
                y: 330,

                ancho: 38,
                alto: 40,

                velocidad: 2.8,

                limiteIzquierda: 5840,
                limiteDerecha: 5940
            }
        ],


        // ====================================================
        // CONCEPTOS 13–16
        // ====================================================

        conceptos: [

            {
                conceptoId: 13,

                x: 1135,
                y: 215,

                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 14,

                x: 2725,
                y: 205,

                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 15,

                x: 4495,
                y: 215,

                ancho: 44,
                alto: 44
            },

            {
                conceptoId: 16,

                x: 6135,
                y: 205,

                ancho: 44,
                alto: 44
            }
        ],


        // ====================================================
        // JEFE FINAL — KERNEL ERROR
        // ====================================================

        jefe: {

            x: 6800,
            y: 410,

            ancho: 100,
            alto: 70,

            limiteIzquierda: 6550,
            limiteDerecha: 7260,

            velocidad: 2.2,

            vidas: 4
        },


        // ====================================================
        // BARRERA DE LA ARENA
        // Desaparece al derrotar al jefe.
        // ====================================================

        barrera: {

            x: 7420,
            y: 250,

            ancho: 30,
            alto: 230
        },


        // ====================================================
        // META FINAL
        // ====================================================

        meta: {

            x: 7800,
            y: 370,

            ancho: 80,
            alto: 110
        }
    }
};


// ============================================================
// PARTÍCULAS
// ============================================================

const particulas = [];


function crearParticulas(
    x,
    y,
    cantidad = 12,
    tipo = "normal"
) {

    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        particulas.push({

            x,
            y,

            vx:
                (Math.random() - 0.5) *
                5,

            vy:
                (Math.random() - 1) *
                5,

            vida:
                40 +
                Math.random() * 25,

            tamano:
                3 +
                Math.random() * 4,

            tipo
        });
    }
}


function actualizarParticulas() {

    for (
        let i =
            particulas.length - 1;

        i >= 0;

        i--
    ) {

        const p =
            particulas[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vy += 0.12;

        p.vida--;


        if (p.vida <= 0) {

            particulas.splice(
                i,
                1
            );
        }
    }
}


function actualizarParticulasColor() {

    if (nivelActual === 4) {

        return "#ff6b35";
    }

    if (nivelActual === 3) {

        return "#38d9ff";
    }

    if (nivelActual === 2) {

        return "#00ff66";
    }

    return "#56b7ff";
}


function dibujarParticulas() {

    particulas.forEach(p => {

        const x =
            p.x - camaraX;


        if (p.tipo === "danio") {

            ctx.fillStyle =
                "#ff4057";

        } else if (
            p.tipo ===
            "checkpoint"
        ) {

            ctx.fillStyle =
                "#ffcc44";

        } else if (
            p.tipo ===
            "jefe"
        ) {

            ctx.fillStyle =
                "#ff6b35";

        } else {

            ctx.fillStyle =
                actualizarParticulasColor();
        }


        ctx.globalAlpha =
            Math.max(
                0,
                p.vida / 60
            );


        ctx.fillRect(
            x,
            p.y,
            p.tamano,
            p.tamano
        );
    });


    ctx.globalAlpha = 1;
}


// ============================================================
// MENSAJES
// ============================================================

function mostrarMensaje(
    texto,
    duracion = 150
) {

    mensajeTemporal = texto;

    tiempoMensaje =
        duracion;
}


function actualizarMensaje() {

    if (
        tiempoMensaje > 0
    ) {

        tiempoMensaje--;


        if (
            tiempoMensaje <= 0
        ) {

            mensajeTemporal = "";
        }
    }
}


function obtenerColorNivel() {

    if (nivelActual === 4) {

        return "#ff6b35";
    }

    if (nivelActual === 3) {

        return "#38d9ff";
    }

    if (nivelActual === 2) {

        return "#00ff66";
    }

    return "#4cff88";
}


function dibujarMensaje() {

    if (!mensajeTemporal) {

        return;
    }


    const ancho = 520;
    const alto = 55;

    const x =
        (canvas.width - ancho) /
        2;

    const y = 65;


    ctx.fillStyle =
        "rgba(9,11,22,0.94)";


    ctx.fillRect(
        x,
        y,
        ancho,
        alto
    );


    ctx.strokeStyle =
        obtenerColorNivel();


    ctx.lineWidth = 2;


    ctx.strokeRect(
        x,
        y,
        ancho,
        alto
    );


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 16px Courier New";


    ctx.textAlign =
        "center";


    ctx.fillText(
        mensajeTemporal,
        canvas.width / 2,
        y + 33
    );


    ctx.textAlign =
        "left";
}


// ============================================================
// COLISIÓN
// ============================================================

function hayColision(a, b) {

    return (

        a.x <
            b.x +
            b.ancho &&

        a.x +
            a.ancho >
            b.x &&

        a.y <
            b.y +
            b.alto &&

        a.y +
            a.alto >
            b.y
    );
}


// ============================================================
// CLONAR OBJETOS
// ============================================================

function copiarObjetos(datos) {

    if (!datos) {

        return [];
    }

    return datos.map(
        objeto => ({
            ...objeto
        })
    );
}


// ============================================================
// CARGAR NIVEL
// ============================================================

function cargarDatosNivel(numero) {

    const datos =
        niveles[numero];


    if (!datos) {

        console.error(
            `El nivel ${numero} no existe.`
        );

        return false;
    }


    anchoMapa =
        datos.ancho;


    plataformas =
        copiarObjetos(
            datos.plataformas
        );


    plataformasMoviles =
        copiarObjetos(
            datos.plataformasMoviles
        );


    plataformasIntermitentes =
        copiarObjetos(
            datos.plataformasIntermitentes
        );


    obstaculos =
        copiarObjetos(
            datos.obstaculos
        );


    obstaculosMoviles =
        copiarObjetos(
            datos.obstaculosMoviles
        );


    checkpoints =
        copiarObjetos(
            datos.checkpoints
        );


    enemigos =
        copiarObjetos(
            datos.enemigos
        );


    bloquesConceptos =
        copiarObjetos(
                        datos.conceptos
        );


    meta = {
        ...datos.meta
    };


    // ========================================================
    // PREPARAR JEFE DEL NIVEL 4
    // ========================================================

    if (
        numero === 4 &&
        datos.jefe
    ) {

        jefeKernel = {
            ...datos.jefe,

            direccion: 1,

            vidasMaximas:
                datos.jefe.vidas,

            activo: false,

            derrotado: false,

            invulnerable: false,

            tiempoInvulnerable: 0
        };

        jefeKernelDerrotado = false;

    } else {

        jefeKernel = null;

        jefeKernelDerrotado = false;
    }


    // ========================================================
    // PREPARAR PLATAFORMAS MÓVILES
    // ========================================================

    plataformasMoviles.forEach(
        plataforma => {

            plataforma.direccion = 1;

            plataforma.xAnterior =
                plataforma.x;

            plataforma.yAnterior =
                plataforma.y;

            plataforma.deltaX = 0;
            plataforma.deltaY = 0;
        }
    );


    // ========================================================
    // PREPARAR INTERMITENTES
    // ========================================================

    plataformasIntermitentes.forEach(
        plataforma => {

            plataforma.estado =
                "activa";

            plataforma.visible =
                true;

            plataforma.solida =
                true;

            plataforma.temporizador =
                plataforma.desfase || 0;
        }
    );


    // ========================================================
    // CHECKPOINTS
    // ========================================================

    checkpoints.forEach(
        checkpoint => {

            checkpoint.activado =
                false;
        }
    );


    // ========================================================
    // ENEMIGOS
    // ========================================================

    enemigos.forEach(
        enemigo => {

            enemigo.direccion = 1;

            enemigo.vivo = true;
        }
    );


    // ========================================================
    // CONCEPTOS
    // ========================================================

    bloquesConceptos.forEach(
        bloque => {

            bloque.recogido =
                false;
        }
    );


    return true;
}


// ============================================================
// INICIAR NIVEL
// ============================================================

function iniciarNivel(numero) {

    if (!niveles[numero]) {

        return;
    }


    nivelActual =
        numero;


    if (
        !cargarDatosNivel(
            numero
        )
    ) {

        return;
    }


    mostrarPantalla(
        "juego"
    );


    juegoActivo = false;

    juegoPausado = false;


    limpiarTeclas();


    vidas = 3;

    conceptosRecogidos = 0;

    metaAvisada = false;


    const datos =
        niveles[numero];


    respawnX =
        datos.inicioX;

    respawnY =
        datos.inicioY;


    jugador.x =
        respawnX;

    jugador.y =
        respawnY;


    jugador.velocidadX = 0;

    jugador.velocidadY = 0;


    jugador.enSuelo =
        false;


    jugador.mirando = 1;


    jugador.plataformaActual =
        null;


    invulnerable = false;

    tiempoInvulnerable = 0;


    camaraX = 0;

    frameJuego = 0;


    particulas.length = 0;


    actualizarHUD();


    if (numero === 1) {

        mostrarMensaje(
            "OBJETIVO: RECUPERA LOS 4 ARCHIVOS DEL SISTEMA",
            220
        );
    }


    if (numero === 2) {

        mostrarMensaje(
            "TERMINAL: RECUPERA LOS 4 ARCHIVOS DE PROCESO",
            220
        );
    }


    if (numero === 3) {

        mostrarMensaje(
            "PROCESAMIENTO: RECUPERA LOS 4 ARCHIVOS DE CPU",
            220
        );
    }


    if (numero === 4) {

        mostrarMensaje(
            "KERNEL MODE: RECUPERA LOS 4 DATA Y LLEGA AL NÚCLEO",
            240
        );
    }


    juegoActivo = true;
}


// ============================================================
// CONEXIÓN CON EL MENÚ
// ============================================================

window.seleccionarNivel =
function(numero) {

    const desbloqueado =
        typeof obtenerNivelDesbloqueado ===
        "function"
            ? obtenerNivelDesbloqueado()
            : 1;


    if (
        numero >
        desbloqueado
    ) {

        alert(
            "NIVEL BLOQUEADO\n\n" +
            "Completa el nivel anterior para desbloquearlo."
        );

        return;
    }


    if (
        numero === 1 ||
        numero === 2 ||
        numero === 3 ||
        numero === 4
    ) {

        iniciarNivel(numero);

        return;
    }
};


// ============================================================
// SALIR
// ============================================================

// ============================================================
// SALIR DEL NIVEL
// ============================================================

function salirDelJuego() {

    // Detener completamente la ejecución del nivel.
    juegoActivo = false;

    juegoPausado = false;


    // Limpiar cualquier tecla que haya quedado presionada.
    limpiarTeclas();


    // Detener movimiento del jugador.
    jugador.velocidadX = 0;

    jugador.velocidadY = 0;

    jugador.enSuelo = false;

    jugador.plataformaActual = null;


    // ========================================================
    // CERRAR MODAL DE CONCEPTO SI ESTÁ ABIERTO
    // ========================================================

    const modalConcepto =
        document.getElementById(
            "modalConcepto"
        );


    if (modalConcepto) {

        modalConcepto.classList.add(
            "oculto"
        );

        modalConcepto.style.removeProperty(
            "display"
        );
    }


    // ========================================================
    // CERRAR MODAL DE META SI ESTÁ ABIERTO
    // ========================================================

    const modalMeta =
        document.getElementById(
            "modalMeta"
        );


    if (modalMeta) {

        modalMeta.classList.add(
            "oculto"
        );

        modalMeta.style.removeProperty(
            "display"
        );
    }


    // ========================================================
    // ACTUALIZAR SELECTOR DE NIVELES
    // ========================================================

    if (
        typeof actualizarSelectorNiveles ===
        "function"
    ) {

        actualizarSelectorNiveles();
    }


    // ========================================================
    // REGRESAR A SELECCIÓN DE NIVELES
    // ========================================================

    mostrarPantalla(
        "niveles"
    );
}


// Hacer accesible la función al botón del HTML.
window.salirDelJuego =
    salirDelJuego;


// ============================================================
// HUD
// ============================================================

function actualizarHUD() {

    const hudVidas =
        document.getElementById(
            "hudVidas"
        );


    const hudNivel =
        document.getElementById(
            "hudNivel"
        );


    const hudConceptos =
        document.getElementById(
            "hudConceptos"
        );


    if (hudVidas) {

        hudVidas.textContent =
            "❤️ ".repeat(
                Math.max(
                    vidas,
                    0
                )
            );
    }


    if (hudNivel) {

        hudNivel.textContent =
            `NIVEL ${nivelActual}`;
    }


    if (hudConceptos) {

        hudConceptos.textContent =
            `CONCEPTOS: ${conceptosRecogidos} / 4`;
    }
}


// ============================================================
// MOVIMIENTO
// ============================================================

function moverJugador() {

    if (juegoPausado) {

        return;
    }


    if (
        teclas["ArrowLeft"] ||
        teclas["KeyA"]
    ) {

        jugador.velocidadX =
            -jugador.velocidad;

        jugador.mirando =
            -1;

    } else if (
        teclas["ArrowRight"] ||
        teclas["KeyD"]
    ) {

        jugador.velocidadX =
            jugador.velocidad;

        jugador.mirando =
            1;

    } else {

        jugador.velocidadX *=
            friccion;


        if (
            Math.abs(
                jugador.velocidadX
            ) < 0.05
        ) {

            jugador.velocidadX = 0;
        }
    }
}


// ============================================================
// PLATAFORMAS MÓVILES
// ============================================================

function actualizarPlataformasMoviles() {

    plataformasMoviles.forEach(
        plataforma => {

            plataforma.xAnterior =
                plataforma.x;

            plataforma.yAnterior =
                plataforma.y;


            if (
                plataforma.eje === "x"
            ) {

                plataforma.x +=
                    plataforma.velocidad *
                    plataforma.direccion;


                if (
                    plataforma.x >=
                    plataforma.maximo
                ) {

                    plataforma.x =
                        plataforma.maximo;

                    plataforma.direccion =
                        -1;
                }


                if (
                    plataforma.x <=
                    plataforma.minimo
                ) {

                    plataforma.x =
                        plataforma.minimo;

                    plataforma.direccion =
                        1;
                }
            }


            if (
                plataforma.eje === "y"
            ) {

                plataforma.y +=
                    plataforma.velocidad *
                    plataforma.direccion;


                if (
                    plataforma.y >=
                    plataforma.maximo
                ) {

                    plataforma.y =
                        plataforma.maximo;

                    plataforma.direccion =
                        -1;
                }


                if (
                    plataforma.y <=
                    plataforma.minimo
                ) {

                    plataforma.y =
                        plataforma.minimo;

                    plataforma.direccion =
                        1;
                }
            }


            plataforma.deltaX =
                plataforma.x -
                plataforma.xAnterior;


            plataforma.deltaY =
                plataforma.y -
                plataforma.yAnterior;
        }
    );
}


// ============================================================
// PLATAFORMAS INTERMITENTES
// ============================================================

function jugadorOcupaPlataforma(
    plataforma
) {

    const zona = {

        x:
            plataforma.x - 4,

        y:
            plataforma.y - 8,

        ancho:
            plataforma.ancho + 8,

        alto:
            plataforma.alto + 16
    };


    return hayColision(
        jugador,
        zona
    );
}


function actualizarPlataformasIntermitentes() {

    // Los niveles 3 y 4 utilizan
    // plataformas intermitentes.
    if (
        nivelActual !== 3 &&
        nivelActual !== 4
    ) {

        return;
    }


    plataformasIntermitentes.forEach(
        plataforma => {

            plataforma.temporizador++;


            const activa =
                plataforma.tiempoActiva;


            const advertencia =
                plataforma
                    .tiempoAdvertencia;


            const apagada =
                plataforma
                    .tiempoApagada;


            const ciclo =
                activa +
                advertencia +
                apagada;


            let tiempo =
                plataforma.temporizador %
                ciclo;


            // =================================================
            // ACTIVA
            // =================================================

            if (
                tiempo < activa
            ) {

                // Evita que una plataforma reaparezca
                // dentro del jugador.
                if (
                    !plataforma.solida &&
                    jugadorOcupaPlataforma(
                        plataforma
                    )
                ) {

                    plataforma.estado =
                        "apagada";

                    plataforma.visible =
                        false;

                    plataforma.solida =
                        false;

                    plataforma.temporizador =
                        activa +
                        advertencia;

                    return;
                }


                plataforma.estado =
                    "activa";

                plataforma.visible =
                    true;

                plataforma.solida =
                    true;

                return;
            }


            // =================================================
            // ADVERTENCIA
            // =================================================

            if (
                tiempo <
                activa +
                advertencia
            ) {

                plataforma.estado =
                    "advertencia";

                plataforma.visible =
                    true;

                plataforma.solida =
                    true;

                return;
            }


            // =================================================
            // APAGADA
            // =================================================

            plataforma.estado =
                "apagada";

            plataforma.visible =
                false;

            plataforma.solida =
                false;


            if (
                jugador.plataformaActual ===
                plataforma
            ) {

                jugador.plataformaActual =
                    null;

                jugador.enSuelo =
                    false;
            }
        }
    );
}


// ============================================================
// TRANSPORTAR JUGADOR CON PLATAFORMA
// ============================================================

function transportarJugadorConPlataforma() {

    const plataforma =
        jugador.plataformaActual;


    if (!plataforma) {

        return;
    }


    // Si es intermitente y desapareció,
    // deja de transportar al jugador.

    if (
        plataformasIntermitentes.includes(
            plataforma
        ) &&
        !plataforma.solida
    ) {

        jugador.plataformaActual =
            null;

        jugador.enSuelo =
            false;

        return;
    }


    jugador.x +=
        plataforma.deltaX || 0;


    jugador.y +=
        plataforma.deltaY || 0;
}


// ============================================================
// TODAS LAS PLATAFORMAS SÓLIDAS
// ============================================================

function obtenerTodasLasPlataformas() {

    const intermitentesActivas =
        plataformasIntermitentes.filter(
            plataforma =>
                plataforma.solida
        );


    const todas = [

        ...plataformas,

        ...plataformasMoviles,

        ...intermitentesActivas
    ];


    // ========================================================
    // BARRERA DEL JEFE
    // ========================================================
    //
    // Mientras KERNEL ERROR siga vivo,
    // la salida de la arena permanece cerrada.
    // ========================================================

    if (
        nivelActual === 4 &&
        jefeKernel &&
        !jefeKernel.derrotado &&
        niveles[4].barrera
    ) {

        todas.push(
            niveles[4].barrera
        );
    }


    return todas;
}


// ============================================================
// SABER SI ES PLATAFORMA MÓVIL
// ============================================================

function esPlataformaMovil(
    plataforma
) {

    return plataformasMoviles.includes(
        plataforma
    );
}


// ============================================================
// FÍSICA DEL JUGADOR
//
// TODAS LAS PLATAFORMAS SON SÓLIDAS POR LOS 4 LADOS.
// ============================================================

function actualizarJugador() {

    // ========================================================
    // TRANSPORTE
    // ========================================================

    transportarJugadorConPlataforma();


    moverJugador();


    const anteriorX =
        jugador.x;

    const anteriorY =
        jugador.y;


    const todas =
        obtenerTodasLasPlataformas();


    jugador.plataformaActual =
        null;


    // ========================================================
    // MOVIMIENTO X
    // ========================================================

    jugador.x +=
        jugador.velocidadX;


    todas.forEach(
        plataforma => {

            if (
                !hayColision(
                    jugador,
                    plataforma
                )
            ) {

                return;
            }


            const plataformaAnteriorX =
                plataforma.xAnterior ??
                plataforma.x;


            const jugadorDerechaAnterior =
                anteriorX +
                jugador.ancho;


            const jugadorIzquierdaAnterior =
                anteriorX;


            const plataformaDerechaAnterior =
                plataformaAnteriorX +
                plataforma.ancho;


            const veniaIzquierda =
                jugadorDerechaAnterior <=
                plataformaAnteriorX +
                TOLERANCIA_PLATAFORMA;


            const veniaDerecha =
                jugadorIzquierdaAnterior >=
                                plataformaDerechaAnterior -
                TOLERANCIA_PLATAFORMA;


            if (veniaIzquierda) {

                jugador.x =
                    plataforma.x -
                    jugador.ancho;

                jugador.velocidadX =
                    0;

            } else if (
                veniaDerecha
            ) {

                jugador.x =
                    plataforma.x +
                    plataforma.ancho;

                jugador.velocidadX =
                    0;
            }
        }
    );


    // ========================================================
    // LÍMITES HORIZONTALES
    // ========================================================

    if (jugador.x < 0) {

        jugador.x = 0;

        jugador.velocidadX =
            0;
    }


    if (
        jugador.x +
        jugador.ancho >
        anchoMapa
    ) {

        jugador.x =
            anchoMapa -
            jugador.ancho;

        jugador.velocidadX =
            0;
    }


    // ========================================================
    // MOVIMIENTO Y
    // ========================================================

    const yAntesMovimiento =
        jugador.y;


    jugador.velocidadY +=
        gravedad;


    jugador.y +=
        jugador.velocidadY;


    jugador.enSuelo =
        false;


    todas.forEach(
        plataforma => {

            if (
                !hayColision(
                    jugador,
                    plataforma
                )
            ) {

                return;
            }


            const plataformaAnteriorY =
                plataforma.yAnterior ??
                plataforma.y;


            const jugadorAbajoAnterior =
                yAntesMovimiento +
                jugador.alto;


            const jugadorArribaAnterior =
                yAntesMovimiento;


            const plataformaAbajoAnterior =
                plataformaAnteriorY +
                plataforma.alto;


            const veniaDesdeArriba =
                jugadorAbajoAnterior <=
                plataformaAnteriorY +
                TOLERANCIA_PLATAFORMA;


            const veniaDesdeAbajo =
                jugadorArribaAnterior >=
                plataformaAbajoAnterior -
                TOLERANCIA_PLATAFORMA;


            // =================================================
            // ATERRIZAJE
            // =================================================

            if (
                veniaDesdeArriba &&
                jugador.velocidadY >= -1
            ) {

                jugador.y =
                    plataforma.y -
                    jugador.alto;


                jugador.velocidadY =
                    0;


                jugador.enSuelo =
                    true;


                if (
                    esPlataformaMovil(
                        plataforma
                    )
                ) {

                    jugador.plataformaActual =
                        plataforma;
                }


                return;
            }


            // =================================================
            // GOLPE DESDE ABAJO
            // =================================================

            if (
                veniaDesdeAbajo &&
                jugador.velocidadY < 0
            ) {

                jugador.y =
                    plataforma.y +
                    plataforma.alto;


                jugador.velocidadY =
                    0;
            }
        }
    );


    // ========================================================
    // RECUPERAR CONTACTO CON PLATAFORMA MÓVIL
    // ========================================================

    if (!jugador.enSuelo) {

        const tolerancia = 4;


        plataformasMoviles.forEach(
            plataforma => {

                const jugadorAbajo =
                    jugador.y +
                    jugador.alto;


                const dentroHorizontal =
                    jugador.x +
                    jugador.ancho >
                    plataforma.x + 4 &&
                    jugador.x <
                    plataforma.x +
                    plataforma.ancho - 4;


                const cercaArriba =
                    Math.abs(
                        jugadorAbajo -
                        plataforma.y
                    ) <= tolerancia;


                if (
                    dentroHorizontal &&
                    cercaArriba &&
                    jugador.velocidadY >= 0
                ) {

                    jugador.y =
                        plataforma.y -
                        jugador.alto;


                    jugador.velocidadY = 0;

                    jugador.enSuelo =
                        true;


                    jugador.plataformaActual =
                        plataforma;
                }
            }
        );
    }


    // ========================================================
    // CAÍDA DEL MAPA
    // ========================================================

    if (
        jugador.y >
        canvas.height + 220
    ) {

        recibirDanio();
    }
}


// ============================================================
// INVULNERABILIDAD
// ============================================================

function actualizarInvulnerabilidad() {

    if (!invulnerable) {

        return;
    }


    tiempoInvulnerable--;


    if (
        tiempoInvulnerable <= 0
    ) {

        invulnerable = false;

        tiempoInvulnerable = 0;
    }
}


// ============================================================
// DAÑO AL JUGADOR
// ============================================================

function recibirDanio() {

    if (
        invulnerable ||
        juegoPausado
    ) {

        return;
    }


    vidas--;


    actualizarHUD();


    crearParticulas(
        jugador.x +
        jugador.ancho / 2,

        jugador.y +
        jugador.alto / 2,

        18,

        "danio"
    );


    if (vidas <= 0) {

        juegoPausado = true;

        limpiarTeclas();


        setTimeout(
            () => {

                alert(
                    "SYSTEM FAILURE\n\n" +
                    "Te has quedado sin vidas."
                );


                iniciarNivel(
                    nivelActual
                );
            },
            120
        );


        return;
    }


    invulnerable = true;

    tiempoInvulnerable = 120;


    jugador.x =
        respawnX;

    jugador.y =
        respawnY;


    jugador.velocidadX = 0;

    jugador.velocidadY = 0;


    jugador.plataformaActual =
        null;


    jugador.enSuelo =
        false;


    mostrarMensaje(
        "PROCESO RESTAURADO DESDE CHECKPOINT",
        120
    );
}


// ============================================================
// OBSTÁCULOS
// ============================================================

function comprobarObstaculos() {

    if (
        juegoPausado ||
        invulnerable
    ) {

        return;
    }


    for (
        const obstaculo of obstaculos
    ) {

        if (
            hayColision(
                jugador,
                obstaculo
            )
        ) {

            recibirDanio();

            return;
        }
    }
}


// ============================================================
// CHECKPOINTS
// ============================================================

function comprobarCheckpoints() {

    checkpoints.forEach(
        checkpoint => {

            if (
                checkpoint.activado
            ) {

                return;
            }


            if (
                hayColision(
                    jugador,
                    checkpoint
                )
            ) {

                checkpoint.activado =
                    true;


                respawnX =
                    checkpoint.respawnX;


                respawnY =
                    checkpoint.respawnY;


                crearParticulas(
                    checkpoint.x +
                    checkpoint.ancho / 2,

                    checkpoint.y + 20,

                    22,

                    "checkpoint"
                );


                mostrarMensaje(
                    "CHECKPOINT GUARDADO",
                    130
                );
            }
        }
    );
}


// ============================================================
// ENEMIGOS
// ============================================================

function actualizarEnemigos() {

    enemigos.forEach(
        enemigo => {

            if (!enemigo.vivo) {

                return;
            }


            enemigo.x +=
                enemigo.velocidad *
                enemigo.direccion;


            if (
                enemigo.x >=
                enemigo.limiteDerecha
            ) {

                enemigo.x =
                    enemigo.limiteDerecha;

                enemigo.direccion =
                    -1;
            }


            if (
                enemigo.x <=
                enemigo.limiteIzquierda
            ) {

                enemigo.x =
                    enemigo.limiteIzquierda;

                enemigo.direccion =
                    1;
            }
        }
    );
}


// ============================================================
// COLISIÓN CON ENEMIGOS
// ============================================================

function comprobarEnemigos() {

    if (juegoPausado) {

        return;
    }


    for (
        const enemigo of enemigos
    ) {

        if (!enemigo.vivo) {

            continue;
        }


        if (
            !hayColision(
                jugador,
                enemigo
            )
        ) {

            continue;
        }


        const piesAntes =
            jugador.y +
            jugador.alto -
            jugador.velocidadY;


        const golpeDesdeArriba =
            jugador.velocidadY > 0 &&
            piesAntes <=
            enemigo.y + 14;


        // =====================================================
        // SALTAR SOBRE ENEMIGO
        // =====================================================

        if (golpeDesdeArriba) {

            enemigo.vivo = false;


            jugador.y =
                enemigo.y -
                jugador.alto;


            jugador.velocidadY =
                -9;


            crearParticulas(
                enemigo.x +
                enemigo.ancho / 2,

                enemigo.y +
                enemigo.alto / 2,

                15,

                "normal"
            );


            mostrarMensaje(
                "PROCESO HOSTIL TERMINADO",
                80
            );


            continue;
        }


        // =====================================================
        // ENEMIGO GOLPEA AL JUGADOR
        // =====================================================

        recibirDanio();

        return;
    }
}


// ============================================================
// JEFE FINAL — KERNEL ERROR
// ============================================================

function actualizarJefeKernel() {

    if (
        nivelActual !== 4 ||
        !jefeKernel ||
        jefeKernel.derrotado
    ) {

        return;
    }


    // ========================================================
    // ACTIVAR ARENA
    // ========================================================

    if (
        !jefeKernel.activo &&
        jugador.x >= 6480
    ) {

        jefeKernel.activo =
            true;


        mostrarMensaje(
            "ALERTA: KERNEL ERROR DETECTADO",
            200
        );


        crearParticulas(
            jefeKernel.x +
            jefeKernel.ancho / 2,

            jefeKernel.y +
            jefeKernel.alto / 2,

            30,

            "jefe"
        );
    }


    if (!jefeKernel.activo) {

        return;
    }


    // ========================================================
    // INVULNERABILIDAD DEL JEFE
    // ========================================================

    if (
        jefeKernel.invulnerable
    ) {

        jefeKernel
            .tiempoInvulnerable--;


        if (
            jefeKernel
                .tiempoInvulnerable <= 0
        ) {

            jefeKernel.invulnerable =
                false;


            jefeKernel
                .tiempoInvulnerable = 0;
        }
    }


    // ========================================================
    // MOVIMIENTO DEL JEFE
    // ========================================================

    jefeKernel.x +=
        jefeKernel.velocidad *
        jefeKernel.direccion;


    if (
        jefeKernel.x >=
        jefeKernel.limiteDerecha
    ) {

        jefeKernel.x =
            jefeKernel.limiteDerecha;


        jefeKernel.direccion =
            -1;
    }


    if (
        jefeKernel.x <=
        jefeKernel.limiteIzquierda
    ) {

        jefeKernel.x =
            jefeKernel.limiteIzquierda;


        jefeKernel.direccion =
            1;
    }
}


// ============================================================
// COLISIÓN CONTRA KERNEL ERROR
// ============================================================

function comprobarJefeKernel() {

    if (
        nivelActual !== 4 ||
        !jefeKernel ||
        !jefeKernel.activo ||
        jefeKernel.derrotado ||
        juegoPausado
    ) {

        return;
    }


    if (
        !hayColision(
            jugador,
            jefeKernel
        )
    ) {

        return;
    }


    // Posición de los pies antes de completar
    // el movimiento vertical del frame.

    const piesAnteriores =
        jugador.y +
        jugador.alto -
        jugador.velocidadY;


    const golpeDesdeArriba =
        jugador.velocidadY > 0 &&
        piesAnteriores <=
        jefeKernel.y + 18;


    // ========================================================
    // GOLPE AL JEFE
    // ========================================================

    if (
        golpeDesdeArriba &&
        !jefeKernel.invulnerable
    ) {

        jefeKernel.vidas--;


        jefeKernel.invulnerable =
            true;


        jefeKernel
            .tiempoInvulnerable = 55;


        jugador.y =
            jefeKernel.y -
            jugador.alto;


        jugador.velocidadY =
            -11;


        crearParticulas(
            jefeKernel.x +
            jefeKernel.ancho / 2,

            jefeKernel.y +
            jefeKernel.alto / 2,

            28,

            "jefe"
        );


        // =====================================================
        // JEFE DERROTADO
        // =====================================================

        if (
            jefeKernel.vidas <= 0
        ) {

            jefeKernel.vidas = 0;

            jefeKernel.derrotado =
                true;

            jefeKernel.activo =
                false;

            jefeKernelDerrotado =
                true;


            crearParticulas(
                jefeKernel.x +
                jefeKernel.ancho / 2,

                jefeKernel.y +
                jefeKernel.alto / 2,

                55,

                "jefe"
            );


            mostrarMensaje(
                "KERNEL ERROR ELIMINADO — FINAL ACCESS GRANTED",
                280
            );


            return;
        }


        // =====================================================
        // AUMENTAR DIFICULTAD
        // =====================================================

        jefeKernel.velocidad +=
            0.55;


        mostrarMensaje(
            `KERNEL ERROR — INTEGRIDAD ${jefeKernel.vidas} / ${jefeKernel.vidasMaximas}`,
            130
        );


        return;
    }


    // ========================================================
    // CONTACTO LATERAL CON EL JEFE
    // ========================================================

    if (!jefeKernel.invulnerable) {

        recibirDanio();
    }
}


// ============================================================
// CONCEPTOS
// ============================================================

function comprobarConceptos() {

    if (juegoPausado) {

        return;
    }


    for (        const bloque of
        bloquesConceptos
    ) {

        if (bloque.recogido) {

            continue;
        }


        if (
            hayColision(
                jugador,
                bloque
            )
        ) {

            bloque.recogido =
                true;


            conceptosRecogidos++;


            actualizarHUD();


            crearParticulas(
                bloque.x +
                bloque.ancho / 2,

                bloque.y +
                bloque.alto / 2,

                25,

                "normal"
            );


            abrirConcepto(
                bloque.conceptoId
            );


            return;
        }
    }
}


// ============================================================
// BUSCAR INFORMACIÓN DE CONCEPTO
// ============================================================

function obtenerConceptoPorId(id) {

    if (
        typeof conceptos ===
        "undefined"
    ) {

        return null;
    }


    if (
        Array.isArray(
            conceptos
        )
    ) {

        return (
            conceptos.find(
                concepto =>
                    concepto.id === id ||
                    concepto.id === String(id)
            ) ||
            conceptos[id - 1] ||
            null
        );
    }


    return (
        conceptos[id] ||
        conceptos[String(id)] ||
        null
    );
}


// ============================================================
// ABRIR VENTANA DEL CONCEPTO
// CORREGIDO PARA EL INDEX.HTML ACTUAL
// ============================================================

function abrirConcepto(id) {

    juegoPausado = true;

    limpiarTeclas();


    const concepto =
        obtenerConceptoPorId(id);


    // ========================================================
    // ELEMENTOS REALES DEL INDEX.HTML
    // ========================================================

    const modal =
        document.getElementById(
            "modalConcepto"
        );


    const titulo =
        document.getElementById(
            "modalTitulo"
        );


    const definicion =
        document.getElementById(
            "modalDefinicion"
        );


    const imagen =
        document.getElementById(
            "modalImagen"
        );


    const placeholder =
        document.getElementById(
            "placeholderImagen"
        );


    // ========================================================
    // TÍTULO
    // ========================================================

    if (titulo) {

        titulo.textContent =
            concepto?.termino ||
            concepto?.nombre ||
            concepto?.concepto ||
            `CONCEPTO ${id}`;
    }


    // ========================================================
    // DEFINICIÓN
    // ========================================================

    if (definicion) {

        definicion.textContent =
            concepto?.definicion ||
            concepto?.descripcion ||
            "Definición pendiente de agregar.";
    }


    // ========================================================
    // IMAGEN
    // ========================================================

    if (imagen) {

        const ruta =
            concepto?.imagen ||
            concepto?.img ||
            "";


        if (ruta) {

            imagen.src =
                ruta;


            imagen.style.display =
                "block";


            if (placeholder) {

                placeholder.style.display =
                    "none";
            }

        } else {

            imagen.removeAttribute(
                "src"
            );


            imagen.style.display =
                "none";


            if (placeholder) {

                placeholder.style.display =
                    "block";
            }
        }
    }


    // ========================================================
    // MOSTRAR MODAL
    // ========================================================

    if (modal) {

        // El index.html utiliza la clase "oculto"
        // para esconder las ventanas.

        modal.classList.remove(
            "oculto"
        );


        // Quitamos cualquier display:none que pudiera
        // haber quedado de una versión anterior.

        modal.style.removeProperty(
            "display"
        );

    } else {

        console.error(
            "ERROR: No se encontró #modalConcepto"
        );


        juegoPausado = false;
    }
}


// ============================================================
// CERRAR VENTANA DEL CONCEPTO
// ============================================================
//
// IMPORTANTE:
// El botón CONTINUAR del index.html ejecuta:
//
//     onclick="cerrarConcepto()"
//
// Por eso esta función debe llamarse exactamente
// cerrarConcepto().
// ============================================================

function cerrarConcepto() {

    const modal =
        document.getElementById(
            "modalConcepto"
        );


    if (modal) {

        modal.classList.add(
            "oculto"
        );


        // Eliminamos estilos agregados por versiones
        // anteriores del game.js.

        modal.style.removeProperty(
            "display"
        );
    }


    // ========================================================
    // REANUDAR JUEGO
    // ========================================================

    juegoPausado = false;


    limpiarTeclas();
}


// ============================================================
// HACER DISPONIBLE LA FUNCIÓN PARA EL HTML
// ============================================================

window.cerrarConcepto =
    cerrarConcepto;


// También mantenemos este nombre como compatibilidad
// por si alguna parte anterior del proyecto todavía
// intenta llamar cerrarModalConcepto().

window.cerrarModalConcepto =
    cerrarConcepto;


// ============================================================
// META
// ============================================================

function comprobarMeta() {

    if (
        juegoPausado ||
        !hayColision(
            jugador,
            meta
        )
    ) {

        metaAvisada = false;

        return;
    }


    // ========================================================
    // NIVEL 4 REQUIERE DERROTAR AL JEFE
    // ========================================================

    const faltaJefe =
        nivelActual === 4 &&
        (
            !jefeKernel ||
            !jefeKernel.derrotado
        );


    if (
        conceptosRecogidos >= 4 &&
        !faltaJefe
    ) {

        completarNivel();

        return;
    }


    if (!metaAvisada) {

        metaAvisada = true;


        mostrarMetaBloqueada();
    }
}


// ============================================================
// META BLOQUEADA
// ============================================================

function mostrarMetaBloqueada() {

    let mensaje =
        "ACCESO BLOQUEADO\n\n";


    if (
        conceptosRecogidos < 4
    ) {

        mensaje +=
            `DATA RECUPERADA: ${conceptosRecogidos} / 4\n\n` +
            "Recupera los 4 archivos antes de continuar.";
    }


    if (
        nivelActual === 4 &&
        jefeKernel &&
        !jefeKernel.derrotado
    ) {

        if (
            conceptosRecogidos < 4
        ) {

            mensaje +=
                "\n\n";
        }


        mensaje +=
            "KERNEL ERROR SIGUE ACTIVO.\n\n" +
            "Derrota al jefe para liberar el acceso final.";
    }


    alert(mensaje);
}


// ============================================================
// COMPLETAR NIVEL
// ============================================================

function completarNivel() {

    if (juegoPausado) {

        return;
    }


    juegoPausado = true;


    limpiarTeclas();


    // ========================================================
    // DESBLOQUEAR SIGUIENTE NIVEL
    // ========================================================

    if (
        nivelActual === 1 &&
        typeof guardarNivelDesbloqueado ===
            "function"
    ) {

        guardarNivelDesbloqueado(
            2
        );
    }


    if (
        nivelActual === 2 &&
        typeof guardarNivelDesbloqueado ===
            "function"
    ) {

        guardarNivelDesbloqueado(
            3
        );
    }


    if (
        nivelActual === 3 &&
        typeof guardarNivelDesbloqueado ===
            "function"
    ) {

        guardarNivelDesbloqueado(
            4
        );
    }


    // ========================================================
    // NIVEL 4 COMPLETADO
    // ========================================================

    if (nivelActual === 4) {

        if (
            typeof marcarNivel4Completado ===
            "function"
        ) {

            marcarNivel4Completado();

        } else {

            localStorage.setItem(
                "kernelRunNivel4Completado",
                "true"
            );
        }
    }


    setTimeout(
        () => {

            if (
                nivelActual === 4
            ) {

                alert(
                    "KERNEL RUN COMPLETADO\n\n" +
                    "SYSTEM STABILITY RESTORED\n\n" +
                    "16 / 16 CONCEPTOS RECUPERADOS"
                );

            } else {

                alert(
                    `NIVEL ${nivelActual} COMPLETADO\n\n` +
                    "4 / 4 CONCEPTOS RECUPERADOS"
                );
            }


            continuarDespuesDeNivel();

        },
        100
    );
}


// ============================================================
// CONTINUAR DESPUÉS DE COMPLETAR NIVEL
// ============================================================

function continuarDespuesDeNivel() {

    juegoActivo = false;

    juegoPausado = false;


    limpiarTeclas();


    if (
        typeof actualizarSelectorNiveles ===
        "function"
    ) {

        actualizarSelectorNiveles();
    }


    mostrarPantalla(
        "niveles"
    );
}


// ============================================================
// CÁMARA
// ============================================================

function actualizarCamara() {

    const objetivo =
        jugador.x -
        canvas.width * 0.38;


    camaraX +=
        (objetivo - camaraX) *
        0.10;


    const maximo =
        Math.max(
            0,
            anchoMapa -
            canvas.width
        );


    if (camaraX < 0) {

        camaraX = 0;
    }


    if (camaraX > maximo) {

        camaraX =
            maximo;
    }
}



// ============================================================
// FONDO
// ============================================================

function dibujarFondo() {

    if (nivelActual === 4) {

        dibujarFondoNivel4();

        return;
    }


    if (nivelActual === 3) {

        dibujarFondoNivel3();

        return;
    }


    if (nivelActual === 2) {

        ctx.fillStyle =
            "#06120d";

    } else {

        ctx.fillStyle =
            "#08101c";
    }


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ========================================================
    // CUADRÍCULA
    // ========================================================

    ctx.strokeStyle =
        nivelActual === 2
            ? "rgba(0,255,102,0.07)"
            : "rgba(86,183,255,0.07)";


    ctx.lineWidth = 1;


    const separacion = 50;


    const desplazamientoX =
        -(camaraX * 0.18) %
        separacion;


    for (
        let x =
            desplazamientoX;

        x <
        canvas.width;

        x +=
            separacion
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;

        y <
        canvas.height;

        y +=
            separacion
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }


    // ========================================================
    // DECORACIÓN DE FONDO
    // ========================================================

    ctx.globalAlpha = 0.18;


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const x =
            (
                i * 270 -
                camaraX * 0.12
            ) %
            (
                canvas.width +
                300
            );


        ctx.fillStyle =
            nivelActual === 2
                ? "#00ff66"
                : "#56b7ff";


        ctx.fillRect(
            x,
            90 +
            (i % 3) * 100,
            100,
            4
        );


        ctx.fillRect(
            x + 20,
            105 +
            (i % 3) * 100,
            60,
            2
        );
    }


    ctx.globalAlpha = 1;
}


// ============================================================
// FONDO NIVEL 3
// ============================================================

function dibujarFondoNivel3() {

    ctx.fillStyle =
        "#06131a";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ========================================================
    // CUADRÍCULA DIGITAL
    // ========================================================

    ctx.strokeStyle =
        "rgba(56,217,255,0.07)";


    ctx.lineWidth = 1;


    const separacion = 48;


    const desplazamientoX =
        -(camaraX * 0.16) %
        separacion;


    for (
        let x =
            desplazamientoX;

        x <
        canvas.width;

        x +=
            separacion
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;

        y <
        canvas.height;

        y +=
            separacion
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }


    // ========================================================
    // LÍNEAS DE PROCESAMIENTO
    // ========================================================

    ctx.globalAlpha = 0.15;


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const x =
            (
                i * 260 -
                camaraX * 0.11
            ) %
            (
                canvas.width +
                300
            );


        ctx.fillStyle =
            "#38d9ff";


        ctx.fillRect(
            x,
            80 +
            (i % 4) * 90,
            120,
            3
        );


        ctx.fillStyle =
            "#8d5cff";


        ctx.fillRect(
            x + 25,
            94 +
            (i % 4) * 90,
            65,
            2
        );
    }


    ctx.globalAlpha = 1;


    // ========================================================
    // TEXTOS AMBIENTALES
    // ========================================================

    ctx.font =
        "bold 14px Courier New";


    ctx.fillStyle =
        "rgba(56,217,255,0.18)";


    const textos = [
        "CPU LOAD",
        "THREAD",
        "SCHEDULER",
        "EXECUTE",
        "PROCESS"
    ];

        textos.forEach(
        (texto, indice) => {

            let x =
                indice * 1550 +
                300 -
                camaraX;


            if (
                x > -200 &&
                x <
                canvas.width + 200
            ) {

                ctx.fillText(
                    texto,
                    x,
                    120 +
                    (indice % 2) * 80
                );
            }
        }
    );
}


// ============================================================
// FONDO NIVEL 4 — KERNEL
// ============================================================

function dibujarFondoNivel4() {

    // Fondo principal oscuro.
    ctx.fillStyle =
        "#12070d";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ========================================================
    // RESPLANDOR SUPERIOR
    // ========================================================

    const gradiente =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );


    gradiente.addColorStop(
        0,
        "rgba(143,44,255,0.12)"
    );


    gradiente.addColorStop(
        0.55,
        "rgba(255,92,53,0.04)"
    );


    gradiente.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        gradiente;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ========================================================
    // CUADRÍCULA DEL KERNEL
    // ========================================================

    const separacion = 45;


    const desplazamientoX =
        -(camaraX * 0.15) %
        separacion;


    ctx.strokeStyle =
        "rgba(255,107,53,0.075)";


    ctx.lineWidth = 1;


    for (
        let x =
            desplazamientoX;

        x <
        canvas.width;

        x +=
            separacion
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    ctx.strokeStyle =
        "rgba(143,44,255,0.065)";


    for (
        let y = 0;

        y <
        canvas.height;

        y +=
            separacion
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }


    // ========================================================
    // COLUMNAS DIGITALES DEL FONDO
    // ========================================================

    ctx.globalAlpha = 0.12;


    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const x =
            (
                i * 230 -
                camaraX * 0.10
            ) %
            (
                canvas.width +
                260
            );


        const altura =
            70 +
            (i % 4) * 35;


        ctx.fillStyle =
            i % 2 === 0
                ? "#ff6b35"
                : "#8f2cff";


        ctx.fillRect(
            x,
            130 +
            (i % 3) * 55,
            5,
            altura
        );


        ctx.fillRect(
            x - 18,
            130 +
            (i % 3) * 55,
            40,
            3
        );


        ctx.fillRect(
            x - 8,
            150 +
            (i % 3) * 55,
            20,
            2
        );
    }


    ctx.globalAlpha = 1;


    // ========================================================
    // TEXTOS AMBIENTALES
    // ========================================================

    const textosKernel = [

        {
            texto: "KERNEL MODE",
            x: 250,
            y: 120
        },

        {
            texto: "SYSTEM CALL",
            x: 1900,
            y: 105
        },

        {
            texto: "INTERRUPT",
            x: 3400,
            y: 140
        },

        {
            texto: "MEMORY CORE",
            x: 5050,
            y: 110
        },

        {
            texto: "RING 0",
            x: 6100,
            y: 145
        },

        {
            texto: "PANIC WATCH",
            x: 6750,
            y: 105
        },

        {
            texto: "CORE ACCESS",
            x: 7600,
            y: 130
        }
    ];


    ctx.font =
        "bold 15px Courier New";


    textosKernel.forEach(
        elemento => {

            const x =
                elemento.x -
                camaraX;


            if (
                x > -250 &&
                x <
                canvas.width + 250
            ) {

                ctx.fillStyle =
                    "rgba(255,107,53,0.24)";


                ctx.fillText(
                    elemento.texto,
                    x,
                    elemento.y
                );


                ctx.fillStyle =
                    "rgba(143,44,255,0.14)";


                ctx.fillRect(
                    x,
                    elemento.y + 8,
                    elemento.texto.length * 8,
                    2
                );
            }
        }
    );


    // ========================================================
    // EFECTO ESPECIAL CERCA DE LA ARENA
    // ========================================================

    if (
        camaraX >
        5900
    ) {

        const pulso =
            0.05 +
            Math.abs(
                Math.sin(
                    frameJuego * 0.04
                )
            ) * 0.05;


        ctx.fillStyle =
            `rgba(255,40,60,${pulso})`;


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}


// ============================================================
// PLATAFORMAS FIJAS
// ============================================================

function dibujarPlataformas() {

    plataformas.forEach(
        plataforma => {

            const x =
                plataforma.x -
                camaraX;


            if (
                x +
                plataforma.ancho <
                -50 ||
                x >
                canvas.width + 50
            ) {

                return;
            }


            if (
                nivelActual === 4
            ) {

                ctx.fillStyle =
                    "#3a1722";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    plataforma.alto
                );


                ctx.fillStyle =
                    "#ff6b35";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    5
                );


                ctx.fillStyle =
                    "#8f2cff";


                ctx.fillRect(
                    x,
                    plataforma.y +
                    plataforma.alto - 4,
                    plataforma.ancho,
                    4
                );


                ctx.fillStyle =
                    "rgba(255,255,255,0.07)";


                for (
                    let detalle = 12;
                    detalle <
                    plataforma.ancho - 8;
                    detalle += 48
                ) {

                    ctx.fillRect(
                        x + detalle,
                        plataforma.y + 12,
                        22,
                        3
                    );
                }


                return;
            }


            if (
                nivelActual === 3
            ) {

                ctx.fillStyle =
                    "#14313b";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    plataforma.alto
                );


                ctx.fillStyle =
                    "#38d9ff";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    5
                );


                ctx.fillStyle =
                    "#8d5cff";


                ctx.fillRect(
                    x,
                    plataforma.y +
                    plataforma.alto - 4,
                    plataforma.ancho,
                    4
                );


                return;
            }


            if (
                nivelActual === 2
            ) {

                ctx.fillStyle =
                    "#123524";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    plataforma.alto
                );


                ctx.fillStyle =
                    "#00ff66";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    5
                );


                return;
            }


            // Nivel 1.
            ctx.fillStyle =
                "#17334c";


            ctx.fillRect(
                x,
                plataforma.y,
                plataforma.ancho,
                plataforma.alto
            );


            ctx.fillStyle =
                "#56b7ff";


            ctx.fillRect(
                x,
                plataforma.y,
                plataforma.ancho,
                5
            );
        }
    );
}


// ============================================================
// PLATAFORMAS MÓVILES
// ============================================================

function dibujarPlataformasMoviles() {

    plataformasMoviles.forEach(
        plataforma => {

            const x =
                plataforma.x -
                camaraX;


            if (
                x +
                plataforma.ancho <
                -50 ||
                x >
                canvas.width + 50
            ) {

                return;
            }


            if (
                nivelActual === 4
            ) {

                ctx.fillStyle =
                    "#542334";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    plataforma.alto
                );


                ctx.fillStyle =
                    "#ff9a48";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    5
                );


                ctx.fillStyle =
                    "#8f2cff";


                ctx.fillRect(
                    x + 8,
                    plataforma.y + 10,
                    plataforma.ancho - 16,
                    3
                );

            } else if (
                nivelActual === 3
            ) {

                ctx.fillStyle =
                    "#174453";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    plataforma.alto
                );


                ctx.fillStyle =
                    "#63e6ff";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    5
                );


                ctx.fillStyle =
                    "#8d5cff";


                ctx.fillRect(
                    x + 8,
                    plataforma.y + 10,
                    plataforma.ancho - 16,
                    3
                );

            } else {

                ctx.fillStyle =
                    "#16462d";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    plataforma.alto
                );


                ctx.fillStyle =
                    "#00ff66";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    5
                );
            }


            // Indicadores laterales.
            ctx.fillStyle =
                "#ffffff";


            ctx.globalAlpha =
                0.45;


            ctx.fillRect(
                x + 7,
                plataforma.y + 8,
                5,
                5
            );


            ctx.fillRect(
                x +
                plataforma.ancho -
                12,
                plataforma.y + 8,
                5,
                5
            );


            ctx.globalAlpha = 1;
        }
    );
}


// ============================================================
// PLATAFORMAS INTERMITENTES
// ============================================================

function dibujarPlataformasIntermitentes() {

    if (
        nivelActual !== 3 &&
        nivelActual !== 4
    ) {

        return;
    }


    plataformasIntermitentes.forEach(
        plataforma => {

            if (
                !plataforma.visible
            ) {

                return;
            }


            const x =
                plataforma.x -
                camaraX;


            if (
                x +
                plataforma.ancho <
                -50 ||
                x >
                canvas.width + 50
            ) {

                return;
            }


            // =================================================
            // PARPADEO DE ADVERTENCIA
            // =================================================

            let alpha = 1;


            if (
                plataforma.estado ===
                "advertencia"
            ) {

                alpha =
                    frameJuego %
                    18 < 9
                        ? 1
                        : 0.25;
            }


            ctx.globalAlpha =
                alpha;


            if (
                nivelActual === 4
            ) {

                ctx.fillStyle =
                    plataforma.estado ===
                    "advertencia"
                        ? "#ff334f"
                        : "#6b2444";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    plataforma.alto
                );


                ctx.fillStyle =
                    plataforma.estado ===
                    "advertencia"
                        ? "#ffffff"
                        : "#ff6b35";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    5
                );


                ctx.fillStyle =
                    "#8f2cff";


                ctx.fillRect(
                    x + 10,
                    plataforma.y + 11,
                    plataforma.ancho - 20,
                    3
                );

            } else {

                ctx.fillStyle =
                    plataforma.estado ===
                    "advertencia"
                        ? "#ff4778"
                        : "#163e4a";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    plataforma.alto
                );


                ctx.fillStyle =
                    plataforma.estado ===
                    "advertencia"
                        ? "#ffffff"
                        : "#38d9ff";


                ctx.fillRect(
                    x,
                    plataforma.y,
                    plataforma.ancho,
                    5
                );


                ctx.fillStyle =
                    "#8d5cff";


                ctx.fillRect(
                    x + 10,
                    plataforma.y + 11,
                    plataforma.ancho - 20,
                    3
                );
            }


            ctx.globalAlpha = 1;
        }
    );
}


// ============================================================
// BARRERA DE KERNEL ERROR
// ============================================================

function dibujarBarreraKernel() {

    if (
        nivelActual !== 4 ||
        !jefeKernel ||
        jefeKernel.derrotado ||
        !niveles[4].barrera
    ) {

        return;
    }


    const barrera =
        niveles[4].barrera;
            const x =
        barrera.x -
        camaraX;


    if (
        x <
        -100 ||
        x >
        canvas.width + 100
    ) {

        return;
    }


    const pulso =
        0.65 +
        Math.abs(
            Math.sin(
                frameJuego * 0.08
            )
        ) * 0.35;


    ctx.globalAlpha =
        pulso;


    ctx.fillStyle =
        "#ff334f";


    ctx.fillRect(
        x,
        barrera.y,
        barrera.ancho,
        barrera.alto
    );


    ctx.fillStyle =
        "#ff9a48";


    for (
        let y =
            barrera.y + 8;

        y <
        barrera.y +
        barrera.alto;

        y += 24
    ) {

        ctx.fillRect(
            x - 8,
            y,
            barrera.ancho + 16,
            4
        );
    }


    ctx.strokeStyle =
        "#ffffff";


    ctx.lineWidth = 2;


    ctx.strokeRect(
        x,
        barrera.y,
        barrera.ancho,
        barrera.alto
    );


    ctx.globalAlpha = 1;


    ctx.fillStyle =
        "#ffb09a";


    ctx.font =
        "bold 11px Courier New";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "LOCK",
        x +
        barrera.ancho / 2,
        barrera.y - 10
    );


    ctx.textAlign =
        "left";
}


// ============================================================
// OBSTÁCULOS
// ============================================================

function dibujarObstaculos() {

    obstaculos.forEach(
        obstaculo => {

            const x =
                obstaculo.x -
                camaraX;


            if (
                x +
                obstaculo.ancho <
                -50 ||
                x >
                canvas.width + 50
            ) {

                return;
            }


            const cantidad =
                Math.max(
                    1,
                    Math.floor(
                        obstaculo.ancho /
                        20
                    )
                );


            const anchoPico =
                obstaculo.ancho /
                cantidad;


            for (
                let i = 0;
                i < cantidad;
                i++
            ) {

                const inicioX =
                    x +
                    i *
                    anchoPico;


                ctx.beginPath();


                ctx.moveTo(
                    inicioX,
                    obstaculo.y +
                    obstaculo.alto
                );


                ctx.lineTo(
                    inicioX +
                    anchoPico / 2,
                    obstaculo.y
                );


                ctx.lineTo(
                    inicioX +
                    anchoPico,
                    obstaculo.y +
                    obstaculo.alto
                );


                ctx.closePath();


                if (
                    nivelActual === 4
                ) {

                    ctx.fillStyle =
                        "#ff334f";

                    ctx.strokeStyle =
                        "#ff9a48";

                } else if (
                    nivelActual === 3
                ) {

                    ctx.fillStyle =
                        "#ff4778";

                    ctx.strokeStyle =
                        "#8d5cff";

                } else {

                    ctx.fillStyle =
                        "#ff4057";

                    ctx.strokeStyle =
                        "#ffffff";
                }


                ctx.fill();


                ctx.lineWidth = 1;


                ctx.stroke();
            }
        }
    );
}


// ============================================================
// CHECKPOINTS
// ============================================================

function dibujarCheckpoints() {

    checkpoints.forEach(
        checkpoint => {

            const x =
                checkpoint.x -
                camaraX;


            if (
                x <
                -100 ||
                x >
                canvas.width + 100
            ) {

                return;
            }


            // Poste.
            ctx.fillStyle =
                "#78808d";


            ctx.fillRect(
                x + 14,
                checkpoint.y,
                7,
                checkpoint.alto
            );


            // Base.
            ctx.fillStyle =
                "#363b45";


            ctx.fillRect(
                x + 5,
                checkpoint.y +
                checkpoint.alto - 8,
                25,
                8
            );


            // Bandera / panel.
            if (
                checkpoint.activado
            ) {

                ctx.fillStyle =
                    "#ffcc44";

            } else {

                ctx.fillStyle =
                    nivelActual === 4
                        ? "#ff6b35"
                        : obtenerColorNivel();
            }


            ctx.fillRect(
                x + 20,
                checkpoint.y + 8,
                30,
                18
            );


            ctx.strokeStyle =
                checkpoint.activado
                    ? "#ffffff"
                    : "rgba(255,255,255,0.5)";


            ctx.strokeRect(
                x + 20,
                checkpoint.y + 8,
                30,
                18
            );


            if (
                checkpoint.activado
            ) {

                const pulso =
                    0.4 +
                    Math.abs(
                        Math.sin(
                            frameJuego *
                            0.06
                        )
                    ) * 0.4;


                ctx.globalAlpha =
                    pulso;


                ctx.fillStyle =
                    "#ffcc44";


                ctx.fillRect(
                    x + 8,
                    checkpoint.y - 6,
                    40,
                    3
                );


                ctx.globalAlpha = 1;
            }
        }
    );
}


// ============================================================
// ENEMIGOS
// ============================================================

function dibujarEnemigos() {

    enemigos.forEach(
        enemigo => {

            if (!enemigo.vivo) {

                return;
            }


            const x =
                enemigo.x -
                camaraX;


            if (
                x +
                enemigo.ancho <
                -50 ||
                x >
                canvas.width + 50
            ) {

                return;
            }


            // =================================================
            // CUERPO
            // =================================================

            if (
                nivelActual === 4
            ) {

                ctx.fillStyle =
                    "#54192d";

                ctx.strokeStyle =
                    "#ff6b35";

            } else if (
                nivelActual === 3
            ) {

                ctx.fillStyle =
                    "#163d49";

                ctx.strokeStyle =
                    "#38d9ff";

            } else if (
                nivelActual === 2
            ) {

                ctx.fillStyle =
                    "#123c25";

                ctx.strokeStyle =
                    "#00ff66";

            } else {

                ctx.fillStyle =
                    "#193750";

                ctx.strokeStyle =
                    "#56b7ff";
            }


            ctx.lineWidth = 2;


            ctx.fillRect(
                x,
                enemigo.y,
                enemigo.ancho,
                enemigo.alto
            );


            ctx.strokeRect(
                x,
                enemigo.y,
                enemigo.ancho,
                enemigo.alto
            );


            // =================================================
            // CABEZA
            // =================================================

            ctx.fillStyle =
                "#0b0d13";


            ctx.fillRect(
                x + 6,
                enemigo.y + 6,
                enemigo.ancho - 12,
                14
            );


            // =================================================
            // OJOS
            // =================================================

            ctx.fillStyle =
                "#ff4057";


            ctx.fillRect(
                x + 10,
                enemigo.y + 10,
                5,
                4
            );


            ctx.fillRect(
                x +
                enemigo.ancho -
                15,
                enemigo.y + 10,
                5,
                4
            );


            // =================================================
            // PATAS
            // =================================================

            ctx.fillStyle =
                "#777f8c";


            ctx.fillRect(
                x + 5,
                enemigo.y +
                enemigo.alto - 5,
                9,
                8
            );


            ctx.fillRect(
                x +
                enemigo.ancho -
                14,
                enemigo.y +
                enemigo.alto - 5,
                9,
                8
            );
        }
    );
}


// ============================================================
// BLOQUES DE CONCEPTOS
// ============================================================

function dibujarConceptos() {

    bloquesConceptos.forEach(
        bloque => {

            if (bloque.recogido) {

                return;
            }


            const x =
                bloque.x -
                camaraX;


            if (
                x +
                bloque.ancho <
                -50 ||
                x >
                canvas.width + 50
            ) {

                return;
            }


            const flotacion =
                Math.sin(
                    frameJuego *
                    0.06 +
                    bloque.conceptoId
                ) * 4;


            const y =
                bloque.y +
                flotacion;


            // =================================================
            // RESPLANDOR
            // =================================================

            ctx.globalAlpha = 0.16;


            ctx.fillStyle =
                nivelActual === 4
                    ? "#ff6b35"
                    : obtenerColorNivel();


            ctx.fillRect(
                x - 8,
                y - 8,
                bloque.ancho + 16,
                bloque.alto + 16
            );


            ctx.globalAlpha = 1;


            // =================================================
            // BLOQUE
            // =================================================

            if (
                nivelActual === 4
            ) {

                ctx.fillStyle =
                    "#4a1d2c";

                ctx.strokeStyle =
                    "#ff9a48";

            } else if (
                nivelActual === 3
            ) {

                ctx.fillStyle =
                    "#143944";

                ctx.strokeStyle =
                    "#38d9ff";

            } else if (
                nivelActual === 2
            ) {

                ctx.fillStyle =
                    "#123823";

                ctx.strokeStyle =
                    "#00ff66";

            } else {

                ctx.fillStyle =
                    "#18364d";

                ctx.strokeStyle =
                    "#56b7ff";
            }


            ctx.lineWidth = 2;


            ctx.fillRect(
                x,
                y,
                bloque.ancho,
                bloque.alto
            );


            ctx.strokeRect(
                x,
                y,
                bloque.ancho,
                bloque.alto
            );


            // =================================================
            // DATA
            // =================================================

            ctx.fillStyle =
                "#ffffff";


            ctx.font =
                "bold 10px Courier New";


            ctx.textAlign =
                "center";


            ctx.fillText(
                "DATA",
                x +
                bloque.ancho / 2,
                y + 17
            );


            ctx.font =
                "bold 12px Courier New";


            ctx.fillStyle =
                nivelActual === 4
                    ? "#ffb07c"
                    : obtenerColorNivel();


            ctx.fillText(
                String(
                    bloque.conceptoId
                ).padStart(
                    2,
                    "0"
                ),
                x +
                bloque.ancho / 2,
                y + 33
            );


            ctx.textAlign =
                "left";
        }
    );
}


// ============================================================
// META
// ============================================================

function dibujarMeta() {

    const x =
        meta.x -
        camaraX;


    if (
        x +
        meta.ancho <
        -100 ||
        x >
        canvas.width + 100
    ) {

        return;
    }


    const bloqueadaPorConceptos =
        conceptosRecogidos < 4;


    const bloqueadaPorJefe =
        nivelActual === 4 &&
        (
            !jefeKernel ||
            !jefeKernel.derrotado
        );


    const bloqueada =
        bloqueadaPorConceptos ||
        bloqueadaPorJefe;


    // ========================================================
    // BASE
    // ========================================================

    ctx.fillStyle =
        "#171a22";


    ctx.fillRect(
        x,
        meta.y,
        meta.ancho,
        meta.alto
    );


    ctx.strokeStyle =
        bloqueada
            ? "#ff4057"
            : obtenerColorNivel();


    ctx.lineWidth = 3;


    ctx.strokeRect(
        x,
        meta.y,
        meta.ancho,
        meta.alto
    );


    // ========================================================
    // PANTALLA
    // ========================================================

    ctx.fillStyle =
        bloqueada
            ? "#3b1018"
            : (
                nivelActual === 4
                    ? "#421b23"
                    : "#102c25"
            );


    ctx.fillRect(
        x + 12,
        meta.y + 14,
        meta.ancho - 24,
        44
    );


    ctx.strokeStyle =
        bloqueada
            ? "#ff4057"
            : (
                nivelActual === 4
                    ? "#ff6b35"
                    : obtenerColorNivel()
            );


    ctx.strokeRect(
        x + 12,
        meta.y + 14,
        meta.ancho - 24,
        44
    );


    ctx.textAlign =
        "center";


    ctx.font =
        "bold 11px Courier New";


    ctx.fillStyle =
        bloqueada
            ? "#ff8a98"
            : "#ffffff";


    ctx.fillText(
        bloqueada
            ? "LOCKED"
            : "ACCESS",
        x +
        meta.ancho / 2,
        meta.y + 33
    );


    ctx.fillText(
        bloqueada
            ? `${conceptosRecogidos}/4`
            : "READY",
        x +
        meta.ancho / 2,
        meta.y + 49
    );


    // ========================================================
    // INDICADOR INFERIOR
    // ========================================================

    ctx.fillStyle =
        bloqueada
            ? "#ff4057"
            : (
                nivelActual === 4
                    ? "#ff6b35"
                    : obtenerColorNivel()
            );


    const pulso =
        0.5 +
        Math.abs(
            Math.sin(
                frameJuego * 0.06
            )
        ) * 0.5;


    ctx.globalAlpha =
        pulso;


    ctx.fillRect(
        x + 15,
        meta.y + 75,
        meta.ancho - 30,
        8
    );


    ctx.globalAlpha = 1;
        ctx.textAlign =
        "left";
}


// ============================================================
// JEFE FINAL — DIBUJO
// ============================================================

function dibujarJefeKernel() {

    if (
        nivelActual !== 4 ||
        !jefeKernel ||
        jefeKernel.derrotado
    ) {

        return;
    }


    const x =
        jefeKernel.x -
        camaraX;


    if (
        x +
        jefeKernel.ancho <
        -150 ||
        x >
        canvas.width + 150
    ) {

        return;
    }


    // Si todavía no está activo,
    // aparece con menor intensidad.
    if (!jefeKernel.activo) {

        ctx.globalAlpha = 0.45;
    }


    // Parpadeo después de recibir daño.
    if (
        jefeKernel.invulnerable &&
        frameJuego % 10 < 5
    ) {

        ctx.globalAlpha = 0.28;
    }


    // ========================================================
    // RESPLANDOR EXTERIOR
    // ========================================================

    ctx.fillStyle =
        "rgba(255,51,79,0.18)";


    ctx.fillRect(
        x - 12,
        jefeKernel.y - 12,
        jefeKernel.ancho + 24,
        jefeKernel.alto + 24
    );


    // ========================================================
    // CUERPO
    // ========================================================

    ctx.fillStyle =
        "#4b101d";


    ctx.fillRect(
        x,
        jefeKernel.y,
        jefeKernel.ancho,
        jefeKernel.alto
    );


    ctx.strokeStyle =
        "#ff334f";


    ctx.lineWidth = 4;


    ctx.strokeRect(
        x,
        jefeKernel.y,
        jefeKernel.ancho,
        jefeKernel.alto
    );


    // ========================================================
    // PANEL SUPERIOR
    // ========================================================

    ctx.fillStyle =
        "#1a080e";


    ctx.fillRect(
        x + 10,
        jefeKernel.y + 10,
        jefeKernel.ancho - 20,
        25
    );


    ctx.strokeStyle =
        "#ff6b35";


    ctx.lineWidth = 2;


    ctx.strokeRect(
        x + 10,
        jefeKernel.y + 10,
        jefeKernel.ancho - 20,
        25
    );


    // ========================================================
    // OJOS
    // ========================================================

    const parpadeo =
        frameJuego % 50 < 40;


    if (parpadeo) {

        ctx.fillStyle =
            "#ff334f";


        ctx.fillRect(
            x + 22,
            jefeKernel.y + 17,
            12,
            7
        );


        ctx.fillRect(
            x +
            jefeKernel.ancho -
            34,
            jefeKernel.y + 17,
            12,
            7
        );
    }


    // ========================================================
    // TEXTO ERROR
    // ========================================================

    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 12px Courier New";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "ERROR",
        x +
        jefeKernel.ancho / 2,
        jefeKernel.y + 52
    );


    // ========================================================
    // NÚCLEO
    // ========================================================

    const pulso =
        0.55 +
        Math.abs(
            Math.sin(
                frameJuego * 0.10
            )
        ) * 0.45;


    ctx.globalAlpha *=
        pulso;


    ctx.fillStyle =
        "#8f2cff";


    ctx.fillRect(
        x +
        jefeKernel.ancho / 2 -
        12,
        jefeKernel.y +
        jefeKernel.alto - 13,
        24,
        7
    );


    ctx.globalAlpha = 1;


    ctx.textAlign =
        "left";
}


// ============================================================
// HUD DEL JEFE
// ============================================================

function dibujarHUDJefe() {

    if (
        nivelActual !== 4 ||
        !jefeKernel ||
        !jefeKernel.activo ||
        jefeKernel.derrotado
    ) {

        return;
    }


    const anchoBarra = 330;
    const altoBarra = 20;


    const x =
        (
            canvas.width -
            anchoBarra
        ) / 2;


    const y = 130;


    // ========================================================
    // TÍTULO
    // ========================================================

    ctx.textAlign =
        "center";


    ctx.font =
        "bold 15px Courier New";


    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        "KERNEL ERROR",
        canvas.width / 2,
        y - 12
    );


    // ========================================================
    // FONDO DE BARRA
    // ========================================================

    ctx.fillStyle =
        "rgba(0,0,0,0.75)";


    ctx.fillRect(
        x,
        y,
        anchoBarra,
        altoBarra
    );


    ctx.strokeStyle =
        "#ff6b35";


    ctx.lineWidth = 2;


    ctx.strokeRect(
        x,
        y,
        anchoBarra,
        altoBarra
    );


    // ========================================================
    // VIDA
    // ========================================================

    const porcentaje =
        Math.max(
            0,
            jefeKernel.vidas /
            jefeKernel.vidasMaximas
        );


    ctx.fillStyle =
        "#ff334f";


    ctx.fillRect(
        x + 3,
        y + 3,
        (
            anchoBarra - 6
        ) * porcentaje,
        altoBarra - 6
    );


    // ========================================================
    // TEXTO DE VIDA
    // ========================================================

    ctx.font =
        "bold 11px Courier New";


    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        `${jefeKernel.vidas} / ${jefeKernel.vidasMaximas}`,
        canvas.width / 2,
        y + 15
    );


    ctx.textAlign =
        "left";
}


// ============================================================
// ROBOT / JUGADOR
// ============================================================

function dibujarJugador() {

    // Efecto de parpadeo cuando el jugador
    // está temporalmente invulnerable.
    if (
        invulnerable &&
        frameJuego % 10 < 5
    ) {

        return;
    }


    const x =
        jugador.x -
        camaraX;


    const y =
        jugador.y;


    const colorPrincipal =
        nivelActual === 4
            ? "#ff6b35"
            : nivelActual === 3
                ? "#38d9ff"
                : nivelActual === 2
                    ? "#00ff66"
                    : "#56b7ff";


    const colorSecundario =
        nivelActual === 4
            ? "#8f2cff"
            : nivelActual === 3
                ? "#8d5cff"
                : "#4cff88";


    // ========================================================
    // SOMBRA
    // ========================================================

    ctx.globalAlpha = 0.22;


    ctx.fillStyle =
        colorPrincipal;


    ctx.fillRect(
        x - 5,
        y + 5,
        jugador.ancho + 10,
        jugador.alto + 5
    );


    ctx.globalAlpha = 1;


    // ========================================================
    // CUERPO
    // ========================================================

    ctx.fillStyle =
        "#202632";


    ctx.fillRect(
        x + 4,
        y + 18,
        jugador.ancho - 8,
        25
    );


    ctx.strokeStyle =
        colorPrincipal;


    ctx.lineWidth = 2;


    ctx.strokeRect(
        x + 4,
        y + 18,
        jugador.ancho - 8,
        25
    );


    // ========================================================
    // CABEZA
    // ========================================================

    ctx.fillStyle =
        "#2c3442";


    ctx.fillRect(
        x + 2,
        y + 2,
        jugador.ancho - 4,
        19
    );


    ctx.strokeStyle =
        colorPrincipal;


    ctx.strokeRect(
        x + 2,
        y + 2,
        jugador.ancho - 4,
        19
    );


    // ========================================================
    // VISOR
    // ========================================================

    ctx.fillStyle =
        "#080b10";


    ctx.fillRect(
        x + 8,
        y + 7,
        jugador.ancho - 16,
        8
    );


    ctx.fillStyle =
        colorPrincipal;


    if (
        jugador.mirando >= 0
    ) {

        ctx.fillRect(
            x +
            jugador.ancho -
            16,
            y + 9,
            6,
            4
        );

    } else {

        ctx.fillRect(
            x + 10,
            y + 9,
            6,
            4
        );
    }


    // ========================================================
    // NÚCLEO DEL ROBOT
    // ========================================================

    const pulso =
        0.55 +
        Math.abs(
            Math.sin(
                frameJuego * 0.08
            )
        ) * 0.45;


    ctx.globalAlpha =
        pulso;


    ctx.fillStyle =
        colorSecundario;


    ctx.fillRect(
        x +
        jugador.ancho / 2 -
        5,
        y + 26,
        10,
        10
    );


    ctx.globalAlpha = 1;


    // ========================================================
    // PIERNAS
    // ========================================================

    ctx.fillStyle =
        "#6d7480";


    ctx.fillRect(
        x + 7,
        y + 42,
        8,
        8
    );


    ctx.fillRect(
        x +
        jugador.ancho -
        15,
        y + 42,
        8,
        8
    );
}


// ============================================================
// INFORMACIÓN SUPERIOR DEL NIVEL
// ============================================================

function dibujarInformacionNivel() {

    const datos =
        niveles[nivelActual];


    if (!datos) {

        return;
    }


    // ========================================================
    // PANEL IZQUIERDO
    // ========================================================

    ctx.fillStyle =
        "rgba(7,9,15,0.80)";


    ctx.fillRect(
        18,
        18,
        290,
        34
    );


    ctx.strokeStyle =
        obtenerColorNivel();


    ctx.lineWidth = 1;


    ctx.strokeRect(
        18,
        18,
        290,
        34
    );


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 13px Courier New";


    ctx.fillText(
        `NIVEL ${nivelActual} — ${datos.nombre}`,
        30,
        40
    );


    // ========================================================
    // DIFICULTAD DEL NIVEL 4
    // ========================================================

    if (
        nivelActual === 4
    ) {

        ctx.fillStyle =
            "rgba(7,9,15,0.80)";


        ctx.fillRect(
            canvas.width - 185,
            18,
            165,
            34
        );


        ctx.strokeStyle =
            "#ff6b35";


        ctx.strokeRect(
            canvas.width - 185,
            18,
            165,
            34
        );


        ctx.fillStyle =
            "#ffb07c";


        ctx.font =
            "bold 12px Courier New";


        ctx.fillText(
            "DIFICULTAD: ★★★★",
            canvas.width - 170,
            40
        );
    }
}


// ============================================================
// DIBUJAR TODO
// ============================================================

function dibujarJuego() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    dibujarFondo();


    dibujarPlataformas();


    dibujarPlataformasMoviles();


    dibujarPlataformasIntermitentes();


    dibujarBarreraKernel();


    dibujarObstaculos();


    dibujarCheckpoints();


    dibujarEnemigos();


    dibujarConceptos();


    dibujarMeta();


    dibujarJefeKernel();


    dibujarParticulas();


    dibujarJugador();


    dibujarInformacionNivel();


    dibujarHUDJefe();


    dibujarMensaje();
}


// ============================================================
// LOOP PRINCIPAL
// ============================================================

function gameLoop() {

    requestAnimationFrame(
        gameLoop
    );


    if (!juegoActivo) {

        return;
    }


    frameJuego++;


    if (!juegoPausado) {

        // ====================================================
        // ACTUALIZAR OBJETOS DEL ESCENARIO
        // ====================================================

        actualizarPlataformasMoviles();


        actualizarPlataformasIntermitentes();


        // ====================================================
        // JUGADOR
        // ====================================================

        actualizarJugador();


        actualizarInvulnerabilidad();


        // ====================================================
        // ENEMIGOS
        // ====================================================

        actualizarEnemigos();


        comprobarObstaculos();


        comprobarCheckpoints();


        comprobarEnemigos();


        // ====================================================
        // JEFE FINAL
        // ====================================================

        actualizarJefeKernel();


        comprobarJefeKernel();


        // ====================================================
        // CONCEPTOS Y META
        // ====================================================

        comprobarConceptos();


        comprobarMeta();


        // ====================================================
        // EFECTOS
        // ====================================================

        actualizarParticulas();


        actualizarMensaje();


        actualizarCamara();
    }


    // El dibujo continúa incluso cuando el juego
    // está pausado por el modal de un concepto.
    dibujarJuego();
}


// ============================================================
// AJUSTE DEL CANVAS
// ============================================================

function ajustarCanvas() {

    const contenedor =
        canvas.parentElement;


    if (!contenedor) {

        return;
    }


    // Conservamos el tamaño interno del canvas.
    // El CSS puede encargarse del escalado visual.
    if (!canvas.width) {

        canvas.width = 960;
    }


    if (!canvas.height) {

        canvas.height = 540;
    }
}


// ============================================================
// REDIMENSIONAR
// ============================================================

window.addEventListener(
    "resize",
    ajustarCanvas
);


// ============================================================
// INICIO DEL MOTOR
// ============================================================

ajustarCanvas();


gameLoop();
