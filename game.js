// ============================================================
// KERNEL RUN
// GAME.JS
// NIVEL 1: INICIO DEL SISTEMA
// NIVEL 2: TERMINAL
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
let obstaculos = [];
let checkpoints = [];
let enemigos = [];
let bloquesConceptos = [];

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
        jugador.velocidadY = -jugador.fuerzaSalto;
        jugador.enSuelo = false;
        jugador.plataformaActual = null;
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

window.addEventListener("blur", limpiarTeclas);

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {
        limpiarTeclas();
    }
});

function limpiarTeclas() {

    for (const tecla in teclas) {
        teclas[tecla] = false;
    }

    if (typeof jugador !== "undefined") {
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

// ============================================================
// NIVELES
// ============================================================

const niveles = {

    // ========================================================
    // NIVEL 1
    // ========================================================

    1: {

        nombre: "INICIO DEL SISTEMA",

        ancho: 5000,

        inicioX: 100,
        inicioY: 300,

        plataformas: [

            { x: 0, y: 480, ancho: 650, alto: 60 },

            { x: 720, y: 390, ancho: 180, alto: 30 },

            { x: 960, y: 310, ancho: 180, alto: 30 },

            { x: 1200, y: 230, ancho: 200, alto: 30 },

            { x: 1470, y: 360, ancho: 240, alto: 30 },

            { x: 1780, y: 480, ancho: 650, alto: 60 },

            { x: 2510, y: 390, ancho: 180, alto: 30 },

            { x: 2760, y: 300, ancho: 180, alto: 30 },

            { x: 3020, y: 210, ancho: 180, alto: 30 },

            { x: 3280, y: 300, ancho: 180, alto: 30 },

            { x: 3540, y: 390, ancho: 180, alto: 30 },

            { x: 3800, y: 480, ancho: 1200, alto: 60 },

            { x: 3970, y: 340, ancho: 180, alto: 30 },

            { x: 4230, y: 250, ancho: 180, alto: 30 },

            { x: 4480, y: 340, ancho: 180, alto: 30 }
        ],

        plataformasMoviles: [],

        obstaculos: [

            { x: 350, y: 450, ancho: 50, alto: 30 },

            { x: 500, y: 450, ancho: 60, alto: 30 },

            { x: 1900, y: 450, ancho: 60, alto: 30 },

            { x: 2150, y: 450, ancho: 70, alto: 30 },

            { x: 3900, y: 450, ancho: 60, alto: 30 },

            { x: 4140, y: 450, ancho: 70, alto: 30 },

            { x: 4400, y: 450, ancho: 70, alto: 30 }
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

        nombre: "TERMINAL",

        ancho: 5900,

        inicioX: 100,
        inicioY: 300,

        // ====================================================
        // PLATAFORMAS FIJAS
        // ====================================================

        plataformas: [

            { x: 0, y: 480, ancho: 500, alto: 60 },

            // Primera móvil sustituye la plataforma anterior.

            { x: 860, y: 300, ancho: 170, alto: 30 },

            { x: 1110, y: 220, ancho: 180, alto: 30 },

            { x: 1380, y: 330, ancho: 170, alto: 30 },

            { x: 1650, y: 480, ancho: 580, alto: 60 },

            // Zona móvil central.

            { x: 3160, y: 210, ancho: 170, alto: 30 },

            { x: 3420, y: 310, ancho: 170, alto: 30 },

            { x: 3670, y: 400, ancho: 170, alto: 30 },

            { x: 3930, y: 480, ancho: 480, alto: 60 },

            // Zona final.

            { x: 4660, y: 390, ancho: 150, alto: 30 },

            { x: 4910, y: 290, ancho: 160, alto: 30 },

            { x: 5160, y: 200, ancho: 170, alto: 30 },

            // IMPORTANTE:
            // Ya NO existe la plataforma fija de x = 5500.
            // La móvil será necesaria para llegar al final.

            { x: 5700, y: 480, ancho: 200, alto: 60 }
        ],

        // ====================================================
        // PLATAFORMAS MÓVILES
        // ====================================================

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
                maximo: 2480,

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

        // ====================================================
        // OBSTÁCULOS
        // ====================================================

        obstaculos: [

            { x: 270, y: 450, ancho: 60, alto: 30 },

            { x: 400, y: 450, ancho: 55, alto: 30 },

            { x: 1780, y: 450, ancho: 65, alto: 30 },

            { x: 1950, y: 450, ancho: 80, alto: 30 },

            { x: 2100, y: 450, ancho: 60, alto: 30 },

            { x: 3990, y: 450, ancho: 70, alto: 30 },

            { x: 4140, y: 450, ancho: 70, alto: 30 },

            { x: 4270, y: 450, ancho: 70, alto: 30 },

            { x: 5760, y: 450, ancho: 60, alto: 30 }
        ],

        // ====================================================
        // CHECKPOINTS
        // ====================================================

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

        // ====================================================
        // ENEMIGOS
        // ====================================================

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

            // Se eliminó el enemigo de x = 5530 porque
            // estaba sobre la plataforma fija que quitamos.
        ],

        // ====================================================
        // CONCEPTOS
        // ====================================================

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

    for (let i = 0; i < cantidad; i++) {

        particulas.push({

            x,
            y,

            vx:
                (Math.random() - 0.5) * 5,

            vy:
                (Math.random() - 1) * 5,

            vida:
                40 + Math.random() * 25,

            tamano:
                3 + Math.random() * 4,

            tipo
        });
    }
}

function actualizarParticulas() {

    for (
        let i = particulas.length - 1;
        i >= 0;
        i--
    ) {

        const p = particulas[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vy += 0.12;

        p.vida--;

        if (p.vida <= 0) {
            particulas.splice(i, 1);
        }
    }
}

function dibujarParticulas() {

    particulas.forEach(p => {

        const x =
            p.x - camaraX;

        if (p.tipo === "danio") {

            ctx.fillStyle =
                "#ff4057";

        } else if (
            p.tipo === "checkpoint"
        ) {

            ctx.fillStyle =
                "#ffcc44";

        } else {

            ctx.fillStyle =
                nivelActual === 2
                    ? "#00ff66"
                    : "#56b7ff";
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
    tiempoMensaje = duracion;
}

function actualizarMensaje() {

    if (tiempoMensaje > 0) {

        tiempoMensaje--;

        if (tiempoMensaje <= 0) {
            mensajeTemporal = "";
        }
    }
}

function dibujarMensaje() {

    if (!mensajeTemporal) return;

    const ancho = 500;
    const alto = 55;

    const x =
        (canvas.width - ancho) / 2;

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
        nivelActual === 2
            ? "#00ff66"
            : "#4cff88";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        x,
        y,
        ancho,
        alto
    );

    ctx.fillStyle = "#ffffff";

    ctx.font =
        "bold 16px Courier New";

    ctx.textAlign = "center";

    ctx.fillText(
        mensajeTemporal,
        canvas.width / 2,
        y + 33
    );

    ctx.textAlign = "left";
}

// ============================================================
// COLISIÓN
// ============================================================

function hayColision(a, b) {

    return (
        a.x < b.x + b.ancho &&
        a.x + a.ancho > b.x &&
        a.y < b.y + b.alto &&
        a.y + a.alto > b.y
    );
}

// ============================================================
// CLONAR OBJETOS
// ============================================================

function copiarObjetos(datos) {

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

    anchoMapa = datos.ancho;

    plataformas =
        copiarObjetos(
            datos.plataformas
        );

    plataformasMoviles =
        copiarObjetos(
            datos.plataformasMoviles
        );

    obstaculos =
        copiarObjetos(
            datos.obstaculos
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

    // Preparar plataformas móviles.

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

    // Checkpoints.

    checkpoints.forEach(
        checkpoint => {

            checkpoint.activado =
                false;
        }
    );

    // Enemigos.

    enemigos.forEach(
        enemigo => {

            enemigo.xInicial =
                enemigo.x;

            enemigo.direccion = 1;

            enemigo.vivo = true;
        }
    );

    // Conceptos.

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

    if (!niveles[numero]) return;

    nivelActual = numero;

    if (!cargarDatosNivel(numero)) {
        return;
    }

    mostrarPantalla("juego");

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

    jugador.enSuelo = false;
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

    } else if (numero === 2) {

        mostrarMensaje(
            "TERMINAL: RECUPERA LOS 4 ARCHIVOS DE PROCESO",
            220
        );
    }

    juegoActivo = true;
}

// ============================================================
// SALIR
// ============================================================

function salirDelJuego() {

    juegoActivo = false;
    juegoPausado = false;

    limpiarTeclas();

    ocultarTodosLosModales();

    mostrarPantalla("niveles");
}

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
                Math.max(vidas, 0)
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

    if (juegoPausado) return;

    if (
        teclas["ArrowLeft"] ||
        teclas["KeyA"]
    ) {

        jugador.velocidadX =
            -jugador.velocidad;

        jugador.mirando = -1;

    } else if (
        teclas["ArrowRight"] ||
        teclas["KeyD"]
    ) {

        jugador.velocidadX =
            jugador.velocidad;

        jugador.mirando = 1;

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
// TRANSPORTE SOBRE PLATAFORMAS MÓVILES
// ============================================================

function transportarJugadorConPlataforma() {

    const plataforma =
        jugador.plataformaActual;

    if (!plataforma) return;

    const pies =
        jugador.y +
        jugador.alto;

    const sobrePlataforma =
        Math.abs(
            pies -
            plataforma.yAnterior
        ) <= 6;

    const dentroHorizontalmente =
        jugador.x +
            jugador.ancho >
            plataforma.xAnterior &&
        jugador.x <
            plataforma.xAnterior +
            plataforma.ancho;

    if (
        !sobrePlataforma ||
        !dentroHorizontalmente
    ) {

        jugador.plataformaActual =
            null;

        return;
    }

    // El personaje recibe exactamente el mismo
    // desplazamiento que la plataforma.

    jugador.x +=
        plataforma.deltaX;

    jugador.y +=
        plataforma.deltaY;
}

// ============================================================
// TODAS LAS PLATAFORMAS
// ============================================================

function obtenerTodasLasPlataformas() {

    return [
        ...plataformas,
        ...plataformasMoviles
    ];
}

// ============================================================
// FÍSICA DEL JUGADOR
//
// Las plataformas siguen siendo sólidas por los cuatro lados.
//
// Esta versión utiliza posiciones anteriores para evitar
// reposicionamientos incorrectos sobre plataformas móviles.
// ============================================================

function actualizarJugador() {

    // ========================================================
    // TRANSPORTE
    // ========================================================

    transportarJugadorConPlataforma();

    moverJugador();

    const todas =
        obtenerTodasLasPlataformas();

    // ========================================================
    // EJE X
    // ========================================================

    const xAnterior =
        jugador.x;

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

            const derechaAnterior =
                xAnterior +
                jugador.ancho;

            const izquierdaAnterior =
                xAnterior;

            // Entró desde la izquierda.

            if (
                derechaAnterior <=
                plataforma.x + 5
            ) {

                jugador.x =
                    plataforma.x -
                    jugador.ancho;

                jugador.velocidadX = 0;

                return;
            }

            // Entró desde la derecha.

            if (
                izquierdaAnterior >=
                plataforma.x +
                plataforma.ancho -
                5
            ) {

                jugador.x =
                    plataforma.x +
                    plataforma.ancho;

                jugador.velocidadX = 0;
            }
        }
    );

    // Límites.

    if (jugador.x < 0) {

        jugador.x = 0;
        jugador.velocidadX = 0;
    }

    if (
        jugador.x +
        jugador.ancho >
        anchoMapa
    ) {

        jugador.x =
            anchoMapa -
            jugador.ancho;

        jugador.velocidadX = 0;
    }

    // ========================================================
    // EJE Y
    // ========================================================

    jugador.velocidadY +=
        gravedad;

    const yAnterior =
        jugador.y;

    const piesAnteriores =
        yAnterior +
        jugador.alto;

    jugador.y +=
        jugador.velocidadY;

    jugador.enSuelo = false;
    jugador.plataformaActual = null;

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

            const parteSuperior =
                plataforma.y;

            const parteInferior =
                plataforma.y +
                plataforma.alto;

            // =================================================
            // ATERRIZAR DESDE ARRIBA
            // =================================================

            if (
                jugador.velocidadY >= 0 &&
                piesAnteriores <=
                    parteSuperior + 8
            ) {

                jugador.y =
                    parteSuperior -
                    jugador.alto;

                jugador.velocidadY = 0;

                jugador.enSuelo = true;

                if (
                    plataformasMoviles.includes(
                        plataforma
                    )
                ) {

                    jugador.plataformaActual =
                        plataforma;
                }

                return;
            }

            // =================================================
            // GOLPEAR DESDE ABAJO
            // =================================================

            if (
                jugador.velocidadY < 0 &&
                yAnterior >=
                    parteInferior - 8
            ) {

                jugador.y =
                    parteInferior;

                jugador.velocidadY = 0;
            }
        }
    );

    // ========================================================
    // TOLERANCIA DE APOYO
    //
    // Corrige pequeñas diferencias de pocos píxeles cuando
    // una plataforma vertical cambia de posición.
    // ========================================================

    if (
        !jugador.enSuelo &&
        jugador.velocidadY >= 0
    ) {

        for (
            const plataforma
            of todas
        ) {

            const pies =
                jugador.y +
                jugador.alto;

            const distancia =
                plataforma.y -
                pies;

            const dentroX =
                jugador.x +
                    jugador.ancho >
                    plataforma.x + 3 &&
                jugador.x <
                    plataforma.x +
                    plataforma.ancho - 3;

            if (
                dentroX &&
                distancia >= -4 &&
                distancia <= 7
            ) {

                jugador.y =
                    plataforma.y -
                    jugador.alto;

                jugador.velocidadY = 0;

                jugador.enSuelo = true;

                if (
                    plataformasMoviles.includes(
                        plataforma
                    )
                ) {

                    jugador.plataformaActual =
                        plataforma;
                }

                break;
            }
        }
    }

    // ========================================================
    // CAÍDA
    // ========================================================

    if (
        jugador.y >
        canvas.height + 200
    ) {

        recibirDanio();
    }
}

// ============================================================
// DAÑO
// ============================================================

function recibirDanio() {

    if (
        invulnerable ||
        !juegoActivo ||
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

        16,
        "danio"
    );

    if (vidas <= 0) {

        gameOver();

        return;
    }

    respawn();
}

// ============================================================
// RESPAWN
// ============================================================

function respawn() {

    limpiarTeclas();

    jugador.x = respawnX;
    jugador.y = respawnY;

    jugador.velocidadX = 0;
    jugador.velocidadY = 0;

    jugador.enSuelo = false;

    jugador.plataformaActual =
        null;

    invulnerable = true;

    tiempoInvulnerable = 120;
}

// ============================================================
// GAME OVER
// ============================================================

function gameOver() {

    juegoActivo = false;

    limpiarTeclas();

    alert(
        "GAME OVER\n\n" +
        "El proceso ha terminado inesperadamente.\n\n" +
        "El nivel se reiniciará."
    );

    iniciarNivel(nivelActual);
}

// ============================================================
// INVULNERABILIDAD
// ============================================================

function actualizarInvulnerabilidad() {

    if (!invulnerable) return;

    tiempoInvulnerable--;

    if (
        tiempoInvulnerable <= 0
    ) {

        tiempoInvulnerable = 0;

        invulnerable = false;
    }
}

// ============================================================
// OBSTÁCULOS
// ============================================================

function comprobarObstaculos() {

    if (invulnerable) return;

    for (
        const obstaculo
        of obstaculos
    ) {

        if (
            hayColision(
                jugador,
                obstaculo
            )
        ) {

            recibirDanio();

            break;
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
                hayColision(
                    jugador,
                    checkpoint
                ) &&
                !checkpoint.activado
            ) {

                checkpoint.activado =
                    true;

                respawnX =
                    checkpoint.respawnX;

                respawnY =
                    checkpoint.respawnY;

                crearParticulas(
                    checkpoint.x + 20,
                    checkpoint.y + 20,
                    22,
                    "checkpoint"
                );

                mostrarMensaje(
                    "CHECKPOINT ACTIVADO — ESTADO GUARDADO",
                    160
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

            if (!enemigo.vivo) return;

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

function comprobarEnemigos() {

    enemigos.forEach(
        enemigo => {

            if (!enemigo.vivo) return;

            if (
                !hayColision(
                    jugador,
                    enemigo
                )
            ) {
                return;
            }

            const parteInferior =
                jugador.y +
                jugador.alto;

            const golpeDesdeArriba =
                jugador.velocidadY > 0 &&
                parteInferior <=
                    enemigo.y + 22;

            if (golpeDesdeArriba) {

                enemigo.vivo = false;

                jugador.y =
                    enemigo.y -
                    jugador.alto;

                jugador.velocidadY =
                    -8.5;

                crearParticulas(
                    enemigo.x +
                        enemigo.ancho / 2,

                    enemigo.y +
                        enemigo.alto / 2,

                    18,
                    "danio"
                );

                return;
            }

            recibirDanio();
        }
    );
}

// ============================================================
// CONCEPTOS
// ============================================================

function comprobarConceptos() {

    bloquesConceptos.forEach(
        bloque => {

            if (bloque.recogido) return;

            if (
                hayColision(
                    jugador,
                    bloque
                )
            ) {

                recogerConcepto(
                    bloque
                );
            }
        }
    );
}

function recogerConcepto(bloque) {

    bloque.recogido = true;

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

    const concepto =
        conceptos.find(
            elemento =>
                elemento.id ===
                bloque.conceptoId
        );

    if (!concepto) return;

    juegoPausado = true;

    limpiarTeclas();

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

    if (titulo) {
        titulo.textContent =
            concepto.nombre;
    }

    if (definicion) {
        definicion.textContent =
            concepto.definicion;
    }

    if (
        imagen &&
        placeholder
    ) {

        if (concepto.imagen) {

            imagen.src =
                concepto.imagen;

            imagen.style.display =
                "block";

            placeholder.style.display =
                "none";

        } else {

            imagen.removeAttribute(
                "src"
            );

            imagen.style.display =
                "none";

            placeholder.style.display =
                "block";
        }
    }

    if (modal) {
        modal.classList.remove(
            "oculto"
        );
    }
}

function cerrarConcepto() {

    const modal =
        document.getElementById(
            "modalConcepto"
        );

    if (modal) {

        modal.classList.add(
            "oculto"
        );
    }

    limpiarTeclas();

    if (juegoActivo) {
        juegoPausado = false;
    }
}

// ============================================================
// META
// ============================================================

function comprobarMeta() {

    if (
        !hayColision(
            jugador,
            meta
        )
    ) {

        metaAvisada = false;

        return;
    }

    if (
        conceptosRecogidos >= 4
    ) {

        completarNivel();

        return;
    }

    if (!metaAvisada) {

        metaAvisada = true;

        mostrarMetaBloqueada();
    }
}

function mostrarMetaBloqueada() {

    juegoPausado = true;

    limpiarTeclas();

    const modal =
        document.getElementById(
            "modalMeta"
        );

    const texto =
        document.getElementById(
            "textoMetaConceptos"
        );

    if (texto) {

        texto.textContent =
            `CONCEPTOS: ${conceptosRecogidos} / 4`;
    }

    if (modal) {

        modal.classList.remove(
            "oculto"
        );
    }
}

function cerrarMetaBloqueada() {

    const modal =
        document.getElementById(
            "modalMeta"
        );

    if (modal) {

        modal.classList.add(
            "oculto"
        );
    }

    limpiarTeclas();

    jugador.x =
        meta.x - 80;

    juegoPausado = false;
}

// ============================================================
// COMPLETAR NIVEL
// ============================================================

function completarNivel() {

    if (juegoPausado) return;

    juegoPausado = true;

    limpiarTeclas();

    crearParticulas(
        meta.x +
            meta.ancho / 2,

        meta.y +
            meta.alto / 2,

        40,
        "checkpoint"
    );

    if (nivelActual === 1) {
        guardarNivelDesbloqueado(2);
    }

    if (nivelActual === 2) {
        guardarNivelDesbloqueado(3);
    }

    const modal =
        document.getElementById(
            "modalNivelCompletado"
        );

    if (modal) {

        modal.classList.remove(
            "oculto"
        );
    }
}

function continuarDespuesDeNivel() {

    juegoActivo = false;
    juegoPausado = false;

    limpiarTeclas();

    const modal =
        document.getElementById(
            "modalNivelCompletado"
        );

    if (modal) {

        modal.classList.add(
            "oculto"
        );
    }

    mostrarPantalla("niveles");
}

function ocultarTodosLosModales() {

    document
        .querySelectorAll(".modal")
        .forEach(
            modal => {

                modal.classList.add(
                    "oculto"
                );
            }
        );
}

// ============================================================
// CÁMARA
// ============================================================

function actualizarCamara() {

    const centro =
        canvas.width / 2;

    camaraX =
        jugador.x -
        centro;

    if (camaraX < 0) {
        camaraX = 0;
    }

    const limite =
        Math.max(
            0,
            anchoMapa -
                canvas.width
        );

    if (camaraX > limite) {
        camaraX = limite;
    }
}

// ============================================================
// FONDO NIVEL 1
// ============================================================

function dibujarFondoNivel1() {

    ctx.fillStyle =
        "#0d1122";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.strokeStyle =
        "#182346";

    ctx.lineWidth = 2;

    const desplazamiento =
        -(camaraX * 0.2) % 80;

    for (
        let x = desplazamiento;
        x < canvas.width;
        x += 80
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }

    for (
        let y = 0;
        y < canvas.height;
        y += 80
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }

    ctx.fillStyle =
        "rgba(76,255,136,0.16)";

    ctx.font =
        "bold 18px Courier New";

    const textos = [

        {
            x: 350,
            texto:
                "BOOT_SEQUENCE"
        },

        {
            x: 1650,
            texto:
                "PROCESS_MANAGER"
        },

        {
            x: 2800,
            texto:
                "CPU_QUEUE"
        },

        {
            x: 4050,
            texto:
                "SYSTEM_CORE"
        }
    ];

    textos.forEach(
        item => {

            ctx.fillText(
                item.texto,
                item.x - camaraX,
                50
            );
        }
    );
}

// ============================================================
// FONDO NIVEL 2
// ============================================================

function dibujarFondoNivel2() {

    ctx.fillStyle =
        "#050b08";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.strokeStyle =
        "rgba(0,255,102,0.08)";

    ctx.lineWidth = 1;

    const offset =
        -(camaraX * 0.15) % 60;

    for (
        let x = offset;
        x < canvas.width;
        x += 60
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }

    for (
        let y = 0;
        y < canvas.height;
        y += 60
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }

    const desplazamiento =
        -(camaraX * 0.08) % 420;

    for (
        let x =
            desplazamiento - 420;

        x <
            canvas.width + 420;

        x += 420
    ) {

        ctx.fillStyle =
            "rgba(0,20,10,0.65)";

        ctx.fillRect(
            x + 30,
            70,
            300,
            145
        );

        ctx.strokeStyle =
            "rgba(0,255,102,0.18)";

        ctx.strokeRect(
            x + 30,
            70,
            300,
            145
        );

        ctx.fillStyle =
            "rgba(0,255,102,0.25)";

        ctx.font =
            "12px Courier New";

        ctx.fillText(
            "C:\\SYSTEM> process --status",
            x + 45,
            100
        );

        ctx.fillText(
            "PROCESS RUNNING...",
            x + 45,
            125
        );

        ctx.fillText(
            "THREAD ACTIVE",
            x + 45,
            150
        );

        ctx.fillText(
            "SCHEDULER: READY",
            x + 45,
            175
        );

        ctx.fillText(
            "> _",
            x + 45,
            200
        );
    }

    ctx.fillStyle =
        "rgba(0,255,102,0.18)";

    ctx.font =
        "bold 20px Courier New";

    const zonas = [

        {
            x: 200,
            texto:
                "TERMINAL_SESSION"
        },

        {
            x: 1800,
            texto:
                "PROCESS_TABLE"
        },

        {
            x: 3000,
            texto:
                "EXEC_QUEUE"
        },

        {
            x: 4700,
            texto:
                "ROOT_ACCESS"
        }
    ];

    zonas.forEach(
        zona => {

            ctx.fillText(
                zona.texto,
                zona.x -
                    camaraX,
                45
            );
        }
    );
}

function dibujarFondo() {

    if (nivelActual === 2) {

        dibujarFondoNivel2();

    } else {

        dibujarFondoNivel1();
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
                x > canvas.width ||
                x +
                    plataforma.ancho <
                    0
            ) {
                return;
            }

            ctx.fillStyle =
                nivelActual === 2
                    ? "#15281d"
                    : "#28324f";

            ctx.fillRect(
                x,
                plataforma.y,
                plataforma.ancho,
                plataforma.alto
            );

            ctx.fillStyle =
                nivelActual === 2
                    ? "#00ff66"
                    : "#4cff88";

            ctx.fillRect(
                x,
                plataforma.y,
                plataforma.ancho,
                6
            );

            ctx.fillStyle =
                nivelActual === 2
                    ? "#07491f"
                    : "#08752e";

            ctx.fillRect(
                x,
                plataforma.y +
                    plataforma.alto -
                    4,
                plataforma.ancho,
                4
            );

            ctx.fillStyle =
                nivelActual === 2
                    ? "#0b1710"
                    : "#1b2238";

            for (
                let detalle = 15;
                detalle <
                    plataforma.ancho;
                detalle += 45
            ) {

                ctx.fillRect(
                    x + detalle,
                    plataforma.y + 15,
                    20,
                    5
                );
            }
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

            ctx.fillStyle =
                "rgba(0,255,102,0.13)";

            ctx.fillRect(
                x - 5,
                plataforma.y - 5,
                plataforma.ancho + 10,
                plataforma.alto + 10
            );

            ctx.fillStyle =
                "#174329";

            ctx.fillRect(
                x,
                plataforma.y,
                plataforma.ancho,
                plataforma.alto
            );

            ctx.strokeStyle =
                "#00ff66";

            ctx.lineWidth = 2;

            ctx.strokeRect(
                x,
                plataforma.y,
                plataforma.ancho,
                plataforma.alto
            );

            ctx.fillStyle =
                "#00ff66";

            ctx.font =
                "bold 15px Courier New";

            ctx.textAlign =
                "center";

            ctx.fillText(
                plataforma.eje === "x"
                    ? "← MOVE →"
                    : "↑ MOVE ↓",

                x +
                    plataforma.ancho / 2,

                plataforma.y + 17
            );

            ctx.textAlign =
                "left";
        }
    );
}

// ============================================================
// PINCHOS
// ============================================================

function dibujarObstaculos() {

    obstaculos.forEach(
        obstaculo => {

            const x =
                obstaculo.x -
                camaraX;

            ctx.fillStyle =
                nivelActual === 2
                    ? "#ff315c"
                    : "#ff4057";

            const cantidad = 4;

            const anchoPincho =
                obstaculo.ancho /
                cantidad;

            for (
                let i = 0;
                i < cantidad;
                i++
            ) {

                ctx.beginPath();

                ctx.moveTo(
                    x +
                        i *
                        anchoPincho,

                    obstaculo.y +
                        obstaculo.alto
                );

                ctx.lineTo(
                    x +
                        i *
                        anchoPincho +
                        anchoPincho / 2,

                    obstaculo.y
                );

                ctx.lineTo(
                    x +
                        (i + 1) *
                        anchoPincho,

                    obstaculo.y +
                        obstaculo.alto
                );

                ctx.closePath();

                ctx.fill();
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

            ctx.fillStyle =
                "#cccccc";

            ctx.fillRect(
                x,
                checkpoint.y,
                6,
                checkpoint.alto
            );

            ctx.fillStyle =
                checkpoint.activado
                    ? "#4cff88"
                    : "#ffcc44";

            ctx.fillRect(
                x + 6,
                checkpoint.y + 5,
                40,
                30
            );

            ctx.fillStyle =
                "#07110c";

            ctx.fillRect(
                x + 12,
                checkpoint.y + 11,
                27,
                17
            );

            const pulso =
                Math.sin(
                    frameJuego *
                        0.08
                ) > 0;

            if (
                pulso ||
                checkpoint.activado
            ) {

                ctx.fillStyle =
                    checkpoint.activado
                        ? "#4cff88"
                        : "#ffcc44";

                ctx.fillRect(
                    x + 21,
                    checkpoint.y + 16,
                    9,
                    7
                );
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

            if (!enemigo.vivo) return;

            const x =
                enemigo.x -
                camaraX;

            const patas =
                Math.sin(
                    frameJuego *
                        0.25 +
                    enemigo.x *
                        0.01
                ) * 3;

            ctx.strokeStyle =
                "#ff4057";

            ctx.lineWidth = 4;

            ctx.beginPath();

            ctx.moveTo(
                x + 8,
                enemigo.y + 28
            );

            ctx.lineTo(
                x + 2,
                enemigo.y +
                    36 +
                    patas
            );

            ctx.stroke();

            ctx.beginPath();

            ctx.moveTo(
                x + 30,
                enemigo.y + 28
            );

            ctx.lineTo(
                x + 36,
                enemigo.y +
                    36 -
                    patas
            );

            ctx.stroke();

            ctx.fillStyle =
                "#ff4057";

            ctx.fillRect(
                x,
                enemigo.y + 10,
                enemigo.ancho,
                enemigo.alto - 10
            );

            ctx.fillStyle =
                "#ff6b7d";

            ctx.fillRect(
                x + 4,
                enemigo.y,
                enemigo.ancho - 8,
                18
            );

            ctx.fillStyle =
                "#101414";

            ctx.fillRect(
                x + 8,
                enemigo.y + 5,
                enemigo.ancho - 16,
                9
            );

            ctx.fillStyle =
                nivelActual === 2
                    ? "#00ff66"
                    : "#ffcc44";

            ctx.fillRect(
                x + 12,
                enemigo.y + 8,
                4,
                4
            );

            ctx.fillRect(
                x + 22,
                enemigo.y + 8,
                4,
                4
            );
        }
    );
}

// ============================================================
// DIBUJAR CONCEPTOS
// ============================================================

function dibujarConceptos() {

    bloquesConceptos.forEach(
        bloque => {

            if (bloque.recogido) return;

            const flotacion =
                Math.sin(
                    frameJuego *
                        0.06 +
                    bloque.x *
                        0.01
                ) * 6;

            const y =
                bloque.y +
                flotacion;

            const x =
                bloque.x -
                camaraX;

            const color =
                nivelActual === 2
                    ? "#00ff88"
                    : "#56b7ff";

            ctx.fillStyle =
                nivelActual === 2
                    ? "rgba(0,255,136,0.15)"
                    : "rgba(86,183,255,0.16)";

            ctx.fillRect(
                x - 10,
                y - 10,
                bloque.ancho + 20,
                bloque.alto + 20
            );

            ctx.fillStyle =
                color;

            ctx.fillRect(
                x,
                y,
                bloque.ancho,
                bloque.alto
            );

            ctx.fillStyle =
                "#08110c";

            ctx.fillRect(
                x + 5,
                y + 14,
                bloque.ancho - 10,
                bloque.alto - 19
            );

            ctx.fillStyle =
                color;

            ctx.font =
                "bold 10px Courier New";

            ctx.textAlign =
                "center";

            ctx.fillText(
                "DATA",
                x +
                    bloque.ancho / 2,
                y + 31
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

    const desbloqueada =
        conceptosRecogidos >= 4;

    ctx.fillStyle =
        nivelActual === 2
            ? "#13271b"
            : "#303950";

    ctx.fillRect(
        x,
        meta.y,
        meta.ancho,
        meta.alto
    );

    ctx.strokeStyle =
        desbloqueada
            ? "#4cff88"
            : "#ff4057";

    ctx.lineWidth = 4;

    ctx.strokeRect(
        x,
        meta.y,
        meta.ancho,
        meta.alto
    );

    ctx.fillStyle =
        "#050b08";

    ctx.fillRect(
        x + 10,
        meta.y + 14,
        meta.ancho - 20,
        52
    );

    ctx.fillStyle =
        desbloqueada
            ? "#4cff88"
            : "#ff4057";

    ctx.font =
        "bold 12px Courier New";

    ctx.textAlign =
        "center";

    ctx.fillText(
        desbloqueada
            ? "ACCESS"
            : "LOCKED",

        x +
            meta.ancho / 2,

        meta.y + 36
    );

    ctx.font =
        "10px Courier New";

    ctx.fillText(
        `${conceptosRecogidos}/4 DATA`,

        x +
            meta.ancho / 2,

        meta.y + 53
    );

    ctx.textAlign =
        "left";
}

// ============================================================
// ROBOT
// ============================================================

function dibujarJugador() {

    const x =
        jugador.x -
        camaraX;

    if (
        invulnerable &&
        Math.floor(
            tiempoInvulnerable / 8
        ) % 2 === 0
    ) {

        ctx.globalAlpha = 0.3;

    } else {

        ctx.globalAlpha = 1;
    }

    const caminando =
        jugador.enSuelo &&
        Math.abs(
            jugador.velocidadX
        ) > 0.2;

    const paso =
        caminando
            ? Math.sin(
                frameJuego * 0.35
            ) * 3
            : 0;

    // Antena.

    ctx.strokeStyle =
        "#e6e6e6";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        x + 19,
        jugador.y + 3
    );

    ctx.lineTo(
        x + 19,
        jugador.y - 5
    );

    ctx.stroke();

    ctx.fillStyle =
        nivelActual === 2
            ? "#00ff66"
            : "#4cff88";

    ctx.fillRect(
        x + 16,
        jugador.y - 8,
        6,
        6
    );

    // Cabeza.

    ctx.fillStyle =
        "#e6e6e6";

    ctx.fillRect(
        x + 3,
        jugador.y,
        jugador.ancho - 6,
        24
    );

    // Pantalla.

    ctx.fillStyle =
        nivelActual === 2
            ? "#00ff66"
            : "#4cff88";

    ctx.fillRect(
        x + 7,
        jugador.y + 5,
        jugador.ancho - 14,
        14
    );

    // Ojos.

    ctx.fillStyle =
        "#090b16";

    if (jugador.mirando === 1) {

        ctx.fillRect(
            x + 15,
            jugador.y + 9,
            4,
            4
        );

        ctx.fillRect(
            x + 24,
            jugador.y + 9,
            4,
            4
        );

    } else {

        ctx.fillRect(
            x + 10,
            jugador.y + 9,
            4,
            4
        );

        ctx.fillRect(
            x + 19,
            jugador.y + 9,
            4,
            4
        );
    }

    // Cuello.

    ctx.fillStyle =
        "#9ba5b7";

    ctx.fillRect(
        x + 15,
        jugador.y + 24,
        8,
        4
    );

    // Cuerpo.

    ctx.fillStyle =
        "#cdd3dd";

    ctx.fillRect(
        x + 7,
        jugador.y + 28,
        jugador.ancho - 14,
        14
    );

    // Núcleo.

    ctx.fillStyle =
        nivelActual === 2
            ? "#00ff88"
            : "#56b7ff";

    ctx.fillRect(
        x + 16,
        jugador.y + 31,
        6,
        6
    );

    // Brazos.

    ctx.fillStyle =
        "#9ba5b7";

    ctx.fillRect(
        x + 2,
        jugador.y + 29,
        5,
        12
    );

    ctx.fillRect(
        x +
            jugador.ancho -
            7,
        jugador.y + 29,
        5,
        12
    );

    // Piernas.

    ctx.fillStyle =
        "#e6e6e6";

    if (!jugador.enSuelo) {

        ctx.fillRect(
            x + 9,
            jugador.y + 41,
            7,
            9
        );

        ctx.fillRect(
            x + 23,
            jugador.y + 41,
            7,
            9
        );

    } else {

        ctx.fillRect(
            x + 9,
            jugador.y + 41,
            7,
            9 + paso
        );

        ctx.fillRect(
            x + 23,
            jugador.y + 41,
            7,
            9 - paso
        );
    }

    ctx.globalAlpha = 1;
}

// ============================================================
// DIBUJAR TODO
// ============================================================

function dibujar() {

    dibujarFondo();

    dibujarPlataformas();

    dibujarPlataformasMoviles();

    dibujarObstaculos();

    dibujarCheckpoints();

    dibujarEnemigos();

    dibujarConceptos();

    dibujarMeta();

    dibujarParticulas();

    dibujarJugador();

    dibujarMensaje();
}

// ============================================================
// BUCLE PRINCIPAL
// ============================================================

function gameLoop() {

    frameJuego++;

    if (juegoActivo) {

        if (!juegoPausado) {

            // Primero se mueven las plataformas.
            actualizarPlataformasMoviles();

            // Después se calcula el jugador.
            actualizarJugador();

            actualizarInvulnerabilidad();

            actualizarEnemigos();

            actualizarParticulas();

            actualizarMensaje();

            comprobarObstaculos();

            comprobarCheckpoints();

            comprobarEnemigos();

            comprobarConceptos();

            comprobarMeta();

            actualizarCamara();
        }

        dibujar();
    }

    requestAnimationFrame(
        gameLoop
    );
}

// ============================================================
// ARRANCAR MOTOR
// ============================================================

gameLoop();
