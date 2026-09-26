// ============================================================
// KERNEL RUN
// NIVEL 1 — INICIO DEL SISTEMA
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

    const esTeclaSalto =
        evento.code === "ArrowUp" ||
        evento.code === "KeyW" ||
        evento.code === "Space";

    if (
        esTeclaSalto &&
        jugador.enSuelo &&
        !saltoPresionado
    ) {
        jugador.velocidadY = -jugador.fuerzaSalto;
        jugador.enSuelo = false;
        saltoPresionado = true;
    }
});

window.addEventListener("keyup", evento => {

    teclas[evento.code] = false;

    const esTeclaSalto =
        evento.code === "ArrowUp" ||
        evento.code === "KeyW" ||
        evento.code === "Space";

    if (esTeclaSalto) {

        saltoPresionado = false;

        // Si soltamos rápidamente la tecla,
        // el salto se vuelve más corto.
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

    // Salto aumentado.
    // Las plataformas siguen siendo sólidas por los 4 lados.
    fuerzaSalto: 16,

    enSuelo: false,

    // 1 = derecha
    // -1 = izquierda
    mirando: 1
};

// ============================================================
// FÍSICA
// ============================================================

const gravedad = 0.7;
const friccion = 0.80;

// ============================================================
// MAPA
// ============================================================

const anchoMapa = 5000;

// ============================================================
// PLATAFORMAS
//
// IMPORTANTE:
// Todas estas plataformas tienen colisión completa.
// No se pueden atravesar desde abajo, arriba ni los lados.
// ============================================================

const plataformas = [

    // --------------------------------------------------------
    // ZONA 1 — INICIO DEL SISTEMA
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // DESCENSO HACIA ZONA 2
    // --------------------------------------------------------

    {
        x: 1470,
        y: 360,
        ancho: 240,
        alto: 30
    },

    // --------------------------------------------------------
    // ZONA 2
    // --------------------------------------------------------

    {
        x: 1780,
        y: 480,
        ancho: 650,
        alto: 60
    },

    // --------------------------------------------------------
    // ZONA 3 — PARKOUR
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // ZONA FINAL
    // --------------------------------------------------------

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
];

// ============================================================
// PINCHOS
// ============================================================

const obstaculos = [

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
];

// ============================================================
// CHECKPOINTS
// ============================================================

const checkpoints = [

    {
        x: 1830,
        y: 400,

        ancho: 35,
        alto: 80,

        activado: false,

        respawnX: 1880,
        respawnY: 430
    },

    {
        x: 3850,
        y: 400,

        ancho: 35,
        alto: 80,

        activado: false,

        respawnX: 3980,
        respawnY: 430
    }
];

// ============================================================
// ENEMIGOS
// ============================================================

const enemigos = [

    {
        xInicial: 170,
        x: 170,
        y: 440,

        ancho: 38,
        alto: 40,

        velocidad: 1.3,
        direccion: 1,

        limiteIzquierda: 100,
        limiteDerecha: 300,

        vivo: true
    },

    {
        xInicial: 1500,
        x: 1500,
        y: 320,

        ancho: 38,
        alto: 40,

        velocidad: 1.5,
        direccion: 1,

        limiteIzquierda: 1490,
        limiteDerecha: 1650,

        vivo: true
    },

    {
        xInicial: 2000,
        x: 2000,
        y: 440,

        ancho: 38,
        alto: 40,

        velocidad: 1.8,
        direccion: 1,

        limiteIzquierda: 1970,
        limiteDerecha: 2100,

        vivo: true
    },

    {
        xInicial: 2810,
        x: 2810,
        y: 260,

        ancho: 38,
        alto: 40,

        velocidad: 1.7,
        direccion: 1,

        limiteIzquierda: 2780,
        limiteDerecha: 2890,

        vivo: true
    },

    {
        xInicial: 4000,
        x: 4000,
        y: 440,

        ancho: 38,
        alto: 40,

        velocidad: 2,
        direccion: 1,

        limiteIzquierda: 3980,
        limiteDerecha: 4100,

        vivo: true
    },

    {
        xInicial: 4550,
        x: 4550,
        y: 440,

        ancho: 38,
        alto: 40,

        velocidad: 2.2,
        direccion: 1,

        limiteIzquierda: 4500,
        limiteDerecha: 4680,

        vivo: true
    }
];

// ============================================================
// LOS 4 CONCEPTOS DEL NIVEL
// ============================================================

const bloquesConceptos = [

    {
        conceptoId: 1,

        x: 590,
        y: 390,

        ancho: 44,
        alto: 44,

        recogido: false
    },

    {
        conceptoId: 2,

        x: 1270,
        y: 170,

        ancho: 44,
        alto: 44,

        recogido: false
    },

    {
        conceptoId: 3,

        x: 3075,
        y: 150,

        ancho: 44,
        alto: 44,

        recogido: false
    },

    {
        conceptoId: 4,

        x: 4310,
        y: 190,

        ancho: 44,
        alto: 44,

        recogido: false
    }
];

// ============================================================
// META
// ============================================================

const meta = {

    x: 4840,
    y: 370,

    ancho: 80,
    alto: 110
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

            x: x,
            y: y,

            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 1) * 5,

            vida: 40 + Math.random() * 25,

            tamano: 3 + Math.random() * 4,

            tipo: tipo
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

        const pantallaX = p.x - camaraX;

        if (p.tipo === "danio") {

            ctx.fillStyle = "#ff4057";

        } else if (p.tipo === "checkpoint") {

            ctx.fillStyle = "#ffcc44";

        } else {

            ctx.fillStyle = "#56b7ff";
        }

        ctx.globalAlpha =
            Math.max(0, p.vida / 60);

        ctx.fillRect(
            pantallaX,
            p.y,
            p.tamano,
            p.tamano
        );
    });

    ctx.globalAlpha = 1;
}

// ============================================================
// MENSAJES TEMPORALES
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

    const ancho = 470;
    const alto = 55;

    const x =
        (canvas.width - ancho) / 2;

    const y = 65;

    ctx.fillStyle =
        "rgba(9, 11, 22, 0.92)";

    ctx.fillRect(
        x,
        y,
        ancho,
        alto
    );

    ctx.strokeStyle = "#4cff88";
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
// COLISIÓN GENERAL
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
// INICIAR NIVEL
// ============================================================

function iniciarNivel(numero) {

    nivelActual = numero;

    if (numero !== 1) return;

    mostrarPantalla("juego");

    juegoActivo = false;
    juegoPausado = false;

    limpiarTeclas();

    vidas = 3;
    conceptosRecogidos = 0;
    metaAvisada = false;

    respawnX = 100;
    respawnY = 300;

    jugador.x = respawnX;
    jugador.y = respawnY;

    jugador.velocidadX = 0;
    jugador.velocidadY = 0;

    jugador.enSuelo = false;
    jugador.mirando = 1;

    invulnerable = false;
    tiempoInvulnerable = 0;

    camaraX = 0;
    frameJuego = 0;

    particulas.length = 0;

    bloquesConceptos.forEach(bloque => {
        bloque.recogido = false;
    });

    checkpoints.forEach(checkpoint => {
        checkpoint.activado = false;
    });

    reiniciarEnemigos();

    actualizarHUD();

    mostrarMensaje(
        "OBJETIVO: RECUPERA LOS 4 ARCHIVOS DEL SISTEMA",
        220
    );

    juegoActivo = true;
}

// ============================================================
// SALIR DEL JUEGO
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
        document.getElementById("hudVidas");

    const hudNivel =
        document.getElementById("hudNivel");

    const hudConceptos =
        document.getElementById("hudConceptos");

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
// FÍSICA DEL JUGADOR
//
// Aquí conservamos lo que querías:
//
// PLATAFORMAS SÓLIDAS EN LOS 4 LADOS.
//
// Primero resolvemos movimiento horizontal.
// Después resolvemos movimiento vertical.
// ============================================================

function actualizarJugador() {

    moverJugador();

    // ========================================================
    // MOVIMIENTO HORIZONTAL
    // ========================================================

    jugador.x +=
        jugador.velocidadX;

    plataformas.forEach(
        plataforma => {

            if (
                !hayColision(
                    jugador,
                    plataforma
                )
            ) {
                return;
            }

            // Chocamos con el lado
            // izquierdo de la plataforma.
            if (
                jugador.velocidadX > 0
            ) {

                jugador.x =
                    plataforma.x -
                    jugador.ancho;
            }

            // Chocamos con el lado
            // derecho de la plataforma.
            else if (
                jugador.velocidadX < 0
            ) {

                jugador.x =
                    plataforma.x +
                    plataforma.ancho;
            }

            jugador.velocidadX = 0;
        }
    );

    // No salir por izquierda.
    if (jugador.x < 0) {

        jugador.x = 0;
        jugador.velocidadX = 0;
    }

    // No salir por derecha.
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
    // MOVIMIENTO VERTICAL
    // ========================================================

    jugador.velocidadY +=
        gravedad;

    jugador.y +=
        jugador.velocidadY;

    jugador.enSuelo = false;

    plataformas.forEach(
        plataforma => {

            if (
                !hayColision(
                    jugador,
                    plataforma
                )
            ) {
                return;
            }

            // ------------------------------------------------
            // CAER ENCIMA
            // ------------------------------------------------

            if (
                jugador.velocidadY > 0
            ) {

                jugador.y =
                    plataforma.y -
                    jugador.alto;

                jugador.velocidadY = 0;

                jugador.enSuelo = true;
            }

            // ------------------------------------------------
            // GOLPEAR DESDE ABAJO
            // ------------------------------------------------

            else if (
                jugador.velocidadY < 0
            ) {

                jugador.y =
                    plataforma.y +
                    plataforma.alto;

                jugador.velocidadY = 0;
            }
        }
    );

    // ========================================================
    // CAÍDA AL VACÍO
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
// PINCHOS
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
// ACTUALIZAR ENEMIGOS
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

                enemigo.direccion = -1;
            }

            if (
                enemigo.x <=
                enemigo.limiteIzquierda
            ) {

                enemigo.x =
                    enemigo.limiteIzquierda;

                enemigo.direccion = 1;
            }
        }
    );
}

// ============================================================
// COLISIÓN CON ENEMIGOS
// ============================================================

function comprobarEnemigos() {

    enemigos.forEach(
        enemigo => {

            if (!enemigo.vivo) {
                return;
            }

            if (
                !hayColision(
                    jugador,
                    enemigo
                )
            ) {
                return;
            }

            const parteInferiorJugador =
                jugador.y +
                jugador.alto;

            const cayendo =
                jugador.velocidadY > 0;

            const golpeDesdeArriba =
                cayendo &&
                parteInferiorJugador <=
                enemigo.y + 22;

            // ------------------------------------------------
            // SALTAMOS ENCIMA DEL BUG
            // ------------------------------------------------

            if (golpeDesdeArriba) {

                enemigo.vivo = false;

                jugador.y =
                    enemigo.y -
                    jugador.alto;

                // Pequeño rebote.
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

            // ------------------------------------------------
            // NOS TOCA POR UN COSTADO
            // ------------------------------------------------

            recibirDanio();
        }
    );
}

// ============================================================
// REINICIAR ENEMIGOS
// ============================================================

function reiniciarEnemigos() {

    enemigos.forEach(
        enemigo => {

            enemigo.x =
                enemigo.xInicial;

            enemigo.direccion = 1;

            enemigo.vivo = true;
        }
    );
}

// ============================================================
// COMPROBAR CONCEPTOS
// ============================================================

function comprobarConceptos() {

    bloquesConceptos.forEach(
        bloque => {

            if (bloque.recogido) {
                return;
            }

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

// ============================================================
// RECOGER CONCEPTO
// ============================================================

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

    titulo.textContent =
        concepto.nombre;

    definicion.textContent =
        concepto.definicion;

    if (concepto.imagen) {

        imagen.src =
            concepto.imagen;

        imagen.style.display =
            "block";

        placeholder.style.display =
            "none";

    } else {

        imagen.style.display =
            "none";

        placeholder.style.display =
            "block";
    }

    modal.classList.remove(
        "oculto"
    );
}

// ============================================================
// CERRAR CONCEPTO
// ============================================================

function cerrarConcepto() {

    document
        .getElementById(
            "modalConcepto"
        )
        .classList
        .add("oculto");

    limpiarTeclas();

    juegoPausado = false;
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

    // Tenemos los cuatro conceptos.
    if (
        conceptosRecogidos >= 4
    ) {

        completarNivel();

        return;
    }

    // Nos faltan conceptos.
    if (!metaAvisada) {

        metaAvisada = true;

        mostrarMetaBloqueada();
    }
}

// ============================================================
// META BLOQUEADA
// ============================================================

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

    texto.textContent =
        `CONCEPTOS: ${conceptosRecogidos} / 4`;

    modal.classList.remove(
        "oculto"
    );
}

function cerrarMetaBloqueada() {

    document
        .getElementById(
            "modalMeta"
        )
        .classList
        .add("oculto");

    limpiarTeclas();

    // Alejamos un poco al jugador
    // para que no vuelva a abrir
    // inmediatamente el modal.
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

    // Desbloqueamos el Nivel 2.
    guardarNivelDesbloqueado(2);

    document
        .getElementById(
            "modalNivelCompletado"
        )
        .classList
        .remove("oculto");
}

// ============================================================
// CONTINUAR DESPUÉS DE TERMINAR
// ============================================================

function continuarDespuesDeNivel() {

    juegoActivo = false;
    juegoPausado = false;

    limpiarTeclas();

    document
        .getElementById(
            "modalNivelCompletado"
        )
        .classList
        .add("oculto");

    mostrarPantalla("niveles");
}

// ============================================================
// OCULTAR MODALES
// ============================================================

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
        jugador.x - centro;

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
// FONDO
// ============================================================

function dibujarFondo() {

    // Fondo principal
    ctx.fillStyle = "#0d1122";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // ========================================================
    // PANELES LEJANOS
    // ========================================================

    const offsetLejano =
        -(camaraX * 0.08) % 320;

    for (
        let x =
            offsetLejano - 320;

        x <
            canvas.width + 320;

        x += 320
    ) {

        ctx.fillStyle =
            "#111a31";

        ctx.fillRect(
            x + 35,
            70,
            210,
            105
        );

        ctx.strokeStyle =
            "#182b46";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            x + 35,
            70,
            210,
            105
        );

        ctx.fillStyle =
            "#17304a";

        ctx.fillRect(
            x + 60,
            95,
            90,
            8
        );

        ctx.fillRect(
            x + 60,
            115,
            140,
            6
        );

        ctx.fillRect(
            x + 60,
            135,
            110,
            6
        );
    }

    // ========================================================
    // CUADRÍCULA
    // ========================================================

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

    // ========================================================
    // CIRCUITOS DECORATIVOS
    // ========================================================

    ctx.strokeStyle =
        "rgba(76,255,136,0.12)";

    ctx.lineWidth = 3;

    const circuitoOffset =
        -(camaraX * 0.35) % 600;

    for (
        let x =
            circuitoOffset - 600;

        x <
            canvas.width + 600;

        x += 600
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            210
        );

        ctx.lineTo(
            x + 100,
            210
        );

        ctx.lineTo(
            x + 140,
            250
        );

        ctx.lineTo(
            x + 260,
            250
        );

        ctx.stroke();

        ctx.fillStyle =
            "rgba(76,255,136,0.20)";

        ctx.fillRect(
            x + 255,
            245,
            10,
            10
        );
    }

    // ========================================================
    // NOMBRES DE LAS ZONAS
    // ========================================================

    ctx.fillStyle =
        "rgba(76,255,136,0.16)";

    ctx.font =
        "bold 18px Courier New";

    const textos = [

        {
            x: 350,
            y: 50,
            texto:
                "BOOT_SEQUENCE"
        },

        {
            x: 1650,
            y: 55,
            texto:
                "PROCESS_MANAGER"
        },

        {
            x: 2800,
            y: 50,
            texto:
                "CPU_QUEUE"
        },

        {
            x: 4050,
            y: 55,
            texto:
                "SYSTEM_CORE"
        }
    ];

    textos.forEach(
        item => {

            ctx.fillText(

                item.texto,

                item.x -
                    camaraX,

                item.y
            );
        }
    );
}

// ============================================================
// CARTELES
// ============================================================

function dibujarCarteles() {

    const carteles = [

        {
            x: 70,
            y: 335,

            ancho: 240,

            titulo:
                "SYSTEM BOOT",

            linea1:
                "RECUPERA 4 ARCHIVOS",

            linea2:
                "PARA ABRIR EL NUCLEO"
        },

        {
            x: 1765,
            y: 340,

            ancho: 170,

            titulo:
                "CHECKPOINT",

            linea1:
                "SAVE STATE",

            linea2: ""
        },

        {
            x: 3750,
            y: 320,

            ancho: 180,

            titulo:
                "WARNING",

            linea1:
                "CORE SECURITY",

            linea2:
                "ACTIVE"
        }
    ];

    carteles.forEach(
        cartel => {

            const x =
                cartel.x -
                camaraX;

            if (
                x + cartel.ancho < 0 ||
                x > canvas.width
            ) {
                return;
            }

            ctx.fillStyle =
                "rgba(9,11,22,0.92)";

            ctx.fillRect(
                x,
                cartel.y,
                cartel.ancho,
                70
            );

            ctx.strokeStyle =
                "#56b7ff";

            ctx.lineWidth = 2;

            ctx.strokeRect(
                x,
                cartel.y,
                cartel.ancho,
                70
            );

            ctx.fillStyle =
                "#4cff88";

            ctx.font =
                "bold 13px Courier New";

            ctx.fillText(
                cartel.titulo,
                x + 10,
                cartel.y + 20
            );

            ctx.fillStyle =
                "#aeb8cc";

            ctx.font =
                "11px Courier New";

            ctx.fillText(
                cartel.linea1,
                x + 10,
                cartel.y + 40
            );

            if (
                cartel.linea2
            ) {

                ctx.fillText(
                    cartel.linea2,
                    x + 10,
                    cartel.y + 56
                );
            }
        }
    );
}

// ============================================================
// PLATAFORMAS
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

            // Cuerpo
            ctx.fillStyle =
                "#28324f";

            ctx.fillRect(
                x,
                plataforma.y,
                plataforma.ancho,
                plataforma.alto
            );

            // Línea superior
            ctx.fillStyle =
                "#4cff88";

            ctx.fillRect(
                x,
                plataforma.y,
                plataforma.ancho,
                6
            );

            // Línea inferior
            ctx.fillStyle =
                "#08752e";

            ctx.fillRect(
                x,
                plataforma.y +
                    plataforma.alto -
                    4,

                plataforma.ancho,

                4
            );

            // Detalles internos
            ctx.fillStyle =
                "#1b2238";

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

            // Remaches
            ctx.fillStyle =
                "#53617d";

            for (
                let remache = 12;

                remache <
                    plataforma.ancho;

                remache += 70
            ) {

                ctx.fillRect(
                    x + remache,
                    plataforma.y + 9,
                    4,
                    4
                );
            }
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

            if (
                x > canvas.width ||
                x +
                    obstaculo.ancho <
                    0
            ) {
                return;
            }

            ctx.fillStyle =
                "#ff4057";

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
                        anchoPincho /
                        2,

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

            // Base
            ctx.fillStyle =
                "#9e2438";

            ctx.fillRect(
                x,
                obstaculo.y +
                    obstaculo.alto -
                    4,

                obstaculo.ancho,

                4
            );
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

            // Poste
            ctx.fillStyle =
                "#cccccc";

            ctx.fillRect(
                x,
                checkpoint.y,
                6,
                checkpoint.alto
            );

            // Terminal
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

            // Pantalla
            ctx.fillStyle =
                "#11162a";

            ctx.fillRect(
                x + 12,
                checkpoint.y + 11,
                27,
                17
            );

            // Luz
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

            // Base
            ctx.fillStyle =
                "#596174";

            ctx.fillRect(
                x - 5,
                checkpoint.y +
                    checkpoint.alto -
                    5,
                20,
                5
            );
        }
    );
}

// ============================================================
// ENEMIGOS — BUGS DIGITALES
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

            const movimientoPatas =
                Math.sin(
                    frameJuego *
                        0.25 +
                    enemigo.x *
                        0.01
                ) * 3;

            // Patas
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
                    movimientoPatas
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
                    movimientoPatas
            );

            ctx.stroke();

            // Antenas
            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.moveTo(
                x + 12,
                enemigo.y + 5
            );

            ctx.lineTo(
                x + 7,
                enemigo.y - 5
            );

            ctx.stroke();

            ctx.beginPath();

            ctx.moveTo(
                x + 26,
                enemigo.y + 5
            );

            ctx.lineTo(
                x + 31,
                enemigo.y - 5
            );

            ctx.stroke();

            // Cuerpo
            ctx.fillStyle =
                "#ff4057";

            ctx.fillRect(
                x,
                enemigo.y + 10,
                enemigo.ancho,
                enemigo.alto - 10
            );

            // Cabeza
            ctx.fillStyle =
                "#ff6b7d";

            ctx.fillRect(
                x + 4,
                enemigo.y,
                enemigo.ancho - 8,
                18
            );

            // Pantalla
            ctx.fillStyle =
                "#1a1020";

            ctx.fillRect(
                x + 8,
                enemigo.y + 5,
                enemigo.ancho - 16,
                9
            );

            // Ojos
            ctx.fillStyle =
                "#ffcc44";

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
// CONCEPTOS
// ============================================================

function dibujarConceptos() {

    bloquesConceptos.forEach(
        bloque => {

            if (bloque.recogido) {
                return;
            }

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

            // Resplandor
            ctx.fillStyle =
                "rgba(86,183,255,0.16)";

            ctx.fillRect(
                x - 10,
                y - 10,
                bloque.ancho + 20,
                bloque.alto + 20
            );

            // Archivo
            ctx.fillStyle =
                "#56b7ff";

            ctx.fillRect(
                x,
                y,
                bloque.ancho,
                bloque.alto
            );

            // Esquina doblada
            ctx.fillStyle =
                "#9dd9ff";

            ctx.beginPath();

            ctx.moveTo(
                x +
                    bloque.ancho -
                    12,
                y
            );

            ctx.lineTo(
                x +
                    bloque.ancho,
                y + 12
            );

            ctx.lineTo(
                x +
                    bloque.ancho -
                    12,
                y + 12
            );

            ctx.closePath();

            ctx.fill();

            // Interior
            ctx.fillStyle =
                "#11162a";

            ctx.fillRect(
                x + 5,
                y + 14,
                bloque.ancho - 10,
                bloque.alto - 19
            );

            ctx.fillStyle =
                "#56b7ff";

            ctx.font =
                "bold 10px Courier New";

            ctx.textAlign =
                "center";

            ctx.fillText(
                "DATA",
                x +
                    bloque.ancho /
                    2,
                y + 31
            );

            ctx.textAlign =
                "left";
        }
    );
}

// ============================================================
// META — TERMINAL DEL SISTEMA
// ============================================================

function dibujarMeta() {

    const x =
        meta.x -
        camaraX;

    const desbloqueada =
        conceptosRecogidos >= 4;

    // Sombra
    ctx.fillStyle =
        "rgba(0,0,0,0.35)";

    ctx.fillRect(
        x - 8,
        meta.y + 8,
        meta.ancho + 16,
        meta.alto
    );

    // Cuerpo
    ctx.fillStyle =
        "#303950";

    ctx.fillRect(
        x,
        meta.y,
        meta.ancho,
        meta.alto
    );

    // Marco
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

    // Pantalla
    ctx.fillStyle =
        "#090b16";

    ctx.fillRect(
        x + 10,
        meta.y + 14,
        meta.ancho - 20,
        52
    );

    // Estado
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

    // Luces
    ctx.fillStyle =
        desbloqueada
            ? "#4cff88"
            : "#ff4057";

    ctx.fillRect(
        x + 15,
        meta.y + 82,
        10,
        10
    );

    ctx.fillStyle =
        "#56b7ff";

    ctx.fillRect(
        x + 35,
        meta.y + 82,
        10,
        10
    );

    ctx.fillStyle =
        "#ffcc44";

    ctx.fillRect(
        x + 55,
        meta.y + 82,
        10,
        10
    );
}

// ============================================================
// ROBOT
// ============================================================

function dibujarJugador() {

    const x =
        jugador.x -
        camaraX;

    // Parpadeo mientras es invulnerable.
    if (
        invulnerable &&
        Math.floor(
            tiempoInvulnerable / 8
        ) % 2 === 0
    ) {

        ctx.globalAlpha =
            0.3;

    } else {

        ctx.globalAlpha =
            1;
    }

    const caminando =
        jugador.enSuelo &&
        Math.abs(
            jugador.velocidadX
        ) > 0.2;

    const paso =
        caminando
            ? Math.sin(
                frameJuego *
                0.35
            ) * 3
            : 0;

    // ========================================================
    // ANTENA
    // ========================================================

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
        "#4cff88";

    ctx.fillRect(
        x + 16,
        jugador.y - 8,
        6,
        6
    );

    // ========================================================
    // CABEZA
    // ========================================================

    ctx.fillStyle =
        "#e6e6e6";

    ctx.fillRect(
        x + 3,
        jugador.y,
        jugador.ancho - 6,
        24
    );

    // Pantalla
    ctx.fillStyle =
        "#4cff88";

    ctx.fillRect(
        x + 7,
        jugador.y + 5,
        jugador.ancho - 14,
        14
    );

    // ========================================================
    // OJOS
    // ========================================================

    ctx.fillStyle =
        "#090b16";

    if (
        jugador.mirando === 1
    ) {

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

    // ========================================================
    // CUELLO
    // ========================================================

    ctx.fillStyle =
        "#9ba5b7";

    ctx.fillRect(
        x + 15,
        jugador.y + 24,
        8,
        4
    );

    // ========================================================
    // CUERPO
    // ========================================================

    ctx.fillStyle =
        "#cdd3dd";

    ctx.fillRect(
        x + 7,
        jugador.y + 28,
        jugador.ancho - 14,
        14
    );

    // Núcleo
    ctx.fillStyle =
        "#56b7ff";

    ctx.fillRect(
        x + 16,
        jugador.y + 31,
        6,
        6
    );

    // ========================================================
    // BRAZOS
    // ========================================================

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

    // ========================================================
    // PIERNAS
    // ========================================================

    ctx.fillStyle =
        "#e6e6e6";

    if (!jugador.enSuelo) {

        // Posición en el aire.
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

        // Animación al caminar.
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
// DIBUJAR TODO EL NIVEL
// ============================================================

function dibujar() {

    dibujarFondo();

    dibujarCarteles();

    dibujarPlataformas();

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
// BUCLE PRINCIPAL DEL JUEGO
// ============================================================

function gameLoop() {

    frameJuego++;

    if (juegoActivo) {

        if (!juegoPausado) {

            // Física
            actualizarJugador();

            // Sistemas
            actualizarInvulnerabilidad();

            actualizarEnemigos();

            actualizarParticulas();

            actualizarMensaje();

            // Colisiones
            comprobarObstaculos();

            comprobarCheckpoints();

            comprobarEnemigos();

            comprobarConceptos();

            comprobarMeta();

            // Cámara
            actualizarCamara();
        }

        // Incluso si abrimos un modal,
        // conservamos la última imagen
        // del escenario.
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