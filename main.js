// ============================================================
// KERNEL RUN
// MAIN.JS
// MENÚS, GLOSARIO Y PROGRESO
// ============================================================


// ============================================================
// CAMBIO DE PANTALLAS
// ============================================================

function mostrarPantalla(id) {

    // Quitar la clase "activa" de todas las pantallas.
    document
        .querySelectorAll(".pantalla")
        .forEach(pantalla => {

            pantalla.classList.remove("activa");
        });


    // Activar solamente la pantalla solicitada.
    const pantalla =
        document.getElementById(id);

    if (pantalla) {

        pantalla.classList.add("activa");
    }


    // Si entramos al selector de niveles,
    // actualizamos los botones.
    if (id === "niveles") {

        actualizarSelectorNiveles();
    }


    // Si entramos al glosario,
    // actualizamos los conceptos desbloqueados.
    if (id === "glosario") {

        generarGlosario();
    }
}


// ============================================================
// CONCEPTOS DEL GLOSARIO
//
// Por ahora dejamos los nombres y definiciones provisionales.
// Más adelante pondremos los 16 conceptos definitivos,
// sus definiciones de 30–50 palabras y sus imágenes.
// ============================================================

const conceptos = [

    // ========================================================
    // NIVEL 1
    // ========================================================

    {
        id: 1,
        nombre: "Tasklist",
        definicion:
            "It's a Windows command that lets you see information about the processes that are currently running. It shows data like the process name, its identifier (PID), memory usage, and other useful details to monitor and manage system applications and processes.",
        imagen: "img/tasklist.png",
        nivel: 1
    },

    {
        id: 2,
        nombre: "Taskkill",
        definicion:
            "Es un comando de Windows utilizado para finalizar procesos que se encuentran en ejecución. Permite cerrar procesos especificando su nombre o identificador (PID), siendo útil para administrar aplicaciones que no responden o detener procesos innecesarios del sistema.",
        imagen: "img/taskkill.png",
        nivel: 1
    },

    {
        id: 3,
        nombre: "PowerShell",
        definicion:
            "PowerShell es una herramienta de computadora creada por Microsoft que ayuda a las personas a escribir instrucciones para automatizar tareas repetitivas. Funciona mediante comandos avanzados para controlar y administrar programas o configuraciones del sistema con mayor rapidez.",
        imagen: "img/powershell.png",
        nivel: 1
    },

    {
        id: 4,
        nombre: "CMD",
        definicion:
            "CMD (Símbolo del sistema): Es el intérprete de comandos de Windows. Ofrece una interfaz basada en texto para interactuar con el sistema operativo, ejecutar scripts, administrar archivos y realizar diagnósticos avanzados.",
        imagen: "img/cmd.png",
        nivel: 1
    },


    // ========================================================
    // NIVEL 2
    // ========================================================

    {
        id: 5,
        nombre: "Archivo.bat",
        definicion:
            "Un archivo .bat es un archivo de procesamiento por lotes utilizado en Windows que contiene una serie de comandos que se ejecutan automáticamente mediante CMD. Permite automatizar tareas repetitivas, como abrir programas, administrar archivos, ejecutar procesos o realizar configuraciones del sistema.",
        imagen: "img/bat.png",
        nivel: 2
    },

    {
        id: 6,
        nombre: "Locks",
        definicion:
            "Los bloqueos son medidas de seguridad digitales que evitan que dos programas o usuarios intenten modificar el mismo archivo o base de datos al mismo tiempo. De esta forma, se protegen los datos y se previene que la información sufra errores o alteraciones incorrectas.",
        imagen: "img/locks.png",
        nivel: 2
    },

    {
        id: 7,
        nombre: "Semáforos",
        definicion:
            "Un semáforo es una variable entera de sincronización utilizada para controlar el acceso concurrente a recursos compartidos por múltiples procesos. Funciona mediante dos operaciones atómicas, comúnmente llamadas wait (esperar) y signal (señalizar), evitando condiciones de carrera al proteger de manera efectiva la sección crítica. ",
        imagen: "img/semaforo.png",
        nivel: 2
    },

    {
        id: 8,
        nombre: "Monitores",
        definicion:
            "Un monitor es una estructura de sincronización de alto nivel que encapsula variables compartidas y los métodos que operan sobre ellas. Garantiza la exclusión mutua de forma automática, permitiendo que solo un hilo ejecute código internamente a la vez, lo que simplifica enormemente la programación concurrente.",
        imagen: "img/monitor.png",
        nivel: 2
    },


    // ========================================================
    // NIVEL 3
    // ========================================================

    {
        id: 9,
        nombre: "Condicionales",
        definicion:
            "Las variables condicionales son mecanismos de sincronización que operan conjuntamente con los monitores o mutex. Permiten que los hilos se bloqueen de forma segura esperando que se cumpla una condición lógica específica. Una vez que el estado cambia, otro hilo emite una señal para despertarlo.",
        imagen: "img/variables.png",
        nivel: 3
    },

    {
        id: 10,
        nombre: "Schedule",
        definicion:
            "A schedule is an organized plan used by computers to decide the order in which different tasks are executed. It manages available resources efficiently so that all computer programs run smoothly, get fair processing time, and finish without unnecessary delays.",
        imagen: "img/schedule.png",
        nivel: 3
    },

    {
        id: 11,
        nombre: "Sistema E/S",
        definicion:
            "El sistema de entrada/salida se encarga de controlar la e/s de informacion de la computadora y dispositivos lo que les permite comunicarse entre ellos, ej: mouse, teclado, impresora, memorias, discos, etc. \nDefinición elabaorada por Héctor Gael Arias",
        imagen: "img/es.png",
        nivel: 3
    },

    {
        id: 12,
        nombre: "Concurrencia",
        definicion:
            "Es la capacidad de un sistema operativo para gestionar varios procesos o tareas durante un mismo periodo de tiempo. Permite compartir los recursos del sistema de manera organizada, mejorando el rendimiento y aprovechamiento del procesador.",
        imagen: "img/concurrencia.png",
        nivel: 3
    },


    // ========================================================
    // NIVEL 4
    // ========================================================

    {
        id: 13,
        nombre: "Inanicion",
        definicion:
            "Es un problema que ocurre cuando un proceso espera durante demasiado tiempo para obtener los recursos que necesita, debido a que otros procesos tienen mayor prioridad o acceden constantemente a dichos recursos",
        imagen: "img/inanicion.png",
        nivel: 4
    },

    {
        id: 14,
        nombre: "Thread",
        definicion:
            "Es la unidad más pequeña de ejecución dentro de un proceso. Un proceso puede contener varios threads que realizan diferentes tareas de forma concurrente, compartiendo recursos como memoria y archivos para mejorar la eficiencia.",
        imagen: "img/proceso.png",
        nivel: 4
    },

    {
        id: 15,
        nombre: "Exclusión",
        definicion:
            "Es un mecanismo utilizado en sistemas operativos para evitar que dos o más procesos o hilos accedan simultáneamente a un recurso compartido. Su objetivo es prevenir conflictos, errores o modificaciones incorrectas de los datos.",
        imagen: "img/exclusion.png",
        nivel: 4
    },

    {
        id: 16,
        nombre: "Bloque de control de procesos (PBC)",
        definicion:
            "Es una estructura de datos utilizada por el sistema operativo para almacenar información importante de cada proceso, como su estado, identificador, registros del procesador, prioridad y recursos asignados, permitiendo administrar y controlar su ejecución.",
        imagen: "img/pcb.png",
        nivel: 4
    }
];


// ============================================================
// PROGRESO DEL JUEGO
//
// nivel desbloqueado = 1
// Ningún nivel completado.
// 0 conceptos.
//
// nivel desbloqueado = 2
// Nivel 1 completado.
// 4 conceptos.
//
// nivel desbloqueado = 3
// Nivel 1 y Nivel 2 completados.
// 8 conceptos.
//
// nivel desbloqueado = 4
// Niveles 1, 2 y 3 completados.
// 12 conceptos.
// ============================================================

function obtenerNivelDesbloqueado() {

    const guardado =
        parseInt(
            localStorage.getItem(
                "kernelRunNivelDesbloqueado"
            )
        );


    if (
        isNaN(guardado) ||
        guardado < 1
    ) {

        return 1;
    }


    return Math.min(
        guardado,
        4
    );
}


// ============================================================
// GUARDAR PROGRESO
// ============================================================

function guardarNivelDesbloqueado(nivel) {

    const actual =
        obtenerNivelDesbloqueado();


    // Nunca reducimos el progreso.
    if (nivel > actual) {

        localStorage.setItem(
            "kernelRunNivelDesbloqueado",
            nivel
        );
    }


    actualizarSelectorNiveles();

    generarGlosario();
}


// ============================================================
// NIVEL 4 COMPLETADO
//
// Cuando construyamos el Nivel 4 utilizaremos esta función
// para desbloquear los últimos cuatro conceptos.
// ============================================================

function marcarNivel4Completado() {

    localStorage.setItem(
        "kernelRunNivel4Completado",
        "true"
    );


    actualizarSelectorNiveles();

    generarGlosario();
}


// ============================================================
// COMPROBAR NIVEL 4
// ============================================================

function nivel4EstaCompletado() {

    return (
        localStorage.getItem(
            "kernelRunNivel4Completado"
        ) === "true"
    );
}


// ============================================================
// NIVELES COMPLETADOS
// ============================================================

function obtenerNivelesCompletados() {

    const nivelDesbloqueado =
        obtenerNivelDesbloqueado();


    // Si ya terminamos el último nivel,
    // los cuatro niveles están completados.
    if (nivel4EstaCompletado()) {

        return 4;
    }


    // Ejemplos:
    //
    // Nivel desbloqueado 1 -> 0 completados
    // Nivel desbloqueado 2 -> 1 completado
    // Nivel desbloqueado 3 -> 2 completados
    // Nivel desbloqueado 4 -> 3 completados

    return Math.max(
        0,
        nivelDesbloqueado - 1
    );
}


// ============================================================
// CONCEPTOS DESBLOQUEADOS
// ============================================================

function obtenerConceptosDesbloqueados() {

    const nivelesCompletados =
        obtenerNivelesCompletados();


    return Math.min(
        nivelesCompletados * 4,
        16
    );
}


// ============================================================
// GENERAR GLOSARIO
// ============================================================

function generarGlosario() {

    const contenedor =
        document.getElementById(
            "listaConceptos"
        );


    if (!contenedor) {

        return;
    }


    contenedor.innerHTML = "";


    const nivelesCompletados =
        obtenerNivelesCompletados();


    const cantidadDesbloqueada =
        obtenerConceptosDesbloqueados();


    // ========================================================
    // INDICADOR DE PROGRESO
    // ========================================================

    const progreso =
        document.createElement("article");


    progreso.className =
        "tarjeta-concepto";


    progreso.style.gridColumn =
        "1 / -1";


    progreso.style.textAlign =
        "center";


    progreso.style.border =
        "2px solid #4cff88";


    progreso.style.marginBottom =
        "10px";


    const tituloProgreso =
        document.createElement("h3");


    tituloProgreso.textContent =
        `ARCHIVOS RECUPERADOS: ${cantidadDesbloqueada} / 16`;


    const textoProgreso =
        document.createElement("p");


    if (cantidadDesbloqueada === 0) {

        textoProgreso.textContent =
            "Aún no has recuperado conceptos. Completa el Nivel 1 para desbloquear los primeros cuatro.";

    } else if (
        cantidadDesbloqueada === 4
    ) {

        textoProgreso.textContent =
            "Nivel 1 completado. Has recuperado 4 de los 16 conceptos.";

    } else if (
        cantidadDesbloqueada === 8
    ) {

        textoProgreso.textContent =
            "Niveles 1 y 2 completados. Has recuperado 8 de los 16 conceptos.";

    } else if (
        cantidadDesbloqueada === 12
    ) {

        textoProgreso.textContent =
            "Tres niveles completados. Solo faltan los conceptos del Kernel.";

    } else {

        textoProgreso.textContent =
            "¡GLOSARIO COMPLETADO! Has recuperado los 16 conceptos.";
    }


    progreso.appendChild(
        tituloProgreso
    );


    progreso.appendChild(
        textoProgreso
    );


    contenedor.appendChild(
        progreso
    );


    // ========================================================
    // GENERAR LAS 16 TARJETAS
    // ========================================================

    conceptos.forEach(
        concepto => {

            const desbloqueado =
                concepto.nivel <=
                nivelesCompletados;


            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "tarjeta-concepto";


            // =================================================
            // DESBLOQUEADO
            // =================================================

            if (desbloqueado) {

                tarjeta.classList.add(
                    "concepto-desbloqueado"
                );


                // ---------------------------------------------
                // TÍTULO
                // ---------------------------------------------

                const titulo =
                    document.createElement(
                        "h3"
                    );


                titulo.textContent =
                    concepto.nombre;


                // ---------------------------------------------
                // NIVEL
                // ---------------------------------------------

                const nivel =
                    document.createElement(
                        "p"
                    );


                nivel.className =
                    "etiqueta-nivel";


                nivel.textContent =
                    `NIVEL ${concepto.nivel} — RECUPERADO`;


                // ---------------------------------------------
                // IMAGEN
                // ---------------------------------------------

                if (concepto.imagen) {

                    const imagen =
                        document.createElement(
                            "img"
                        );


                    imagen.src =
                        concepto.imagen;


                    imagen.alt =
                        concepto.nombre;


                    imagen.style.maxWidth =
                        "100%";


                    imagen.style.height =
                        "auto";


                    imagen.style.marginBottom =
                        "15px";


                    tarjeta.appendChild(
                        imagen
                    );
                }


                // ---------------------------------------------
                // DEFINICIÓN
                // ---------------------------------------------

                const definicion =
                    document.createElement(
                        "p"
                    );


                definicion.textContent =
                    concepto.definicion;


                tarjeta.appendChild(
                    titulo
                );


                tarjeta.appendChild(
                    nivel
                );


                tarjeta.appendChild(
                    definicion
                );


            // =================================================
            // BLOQUEADO
            // =================================================

            } else {

                tarjeta.classList.add(
                    "concepto-bloqueado"
                );


                tarjeta.style.opacity =
                    "0.5";


                tarjeta.style.filter =
                    "grayscale(1)";


                // ---------------------------------------------
                // CANDADO
                // ---------------------------------------------

                const candado =
                    document.createElement(
                        "div"
                    );


                candado.textContent =
                    "🔒";


                candado.style.fontSize =
                    "38px";


                candado.style.textAlign =
                    "center";


                candado.style.marginBottom =
                    "10px";


                // ---------------------------------------------
                // NOMBRE OCULTO
                // ---------------------------------------------

                const titulo =
                    document.createElement(
                        "h3"
                    );


                titulo.textContent =
                    "???";


                // ---------------------------------------------
                // ESTADO
                // ---------------------------------------------

                const estado =
                    document.createElement(
                        "p"
                    );


                estado.className =
                    "etiqueta-nivel";


                estado.textContent =
                    "ARCHIVO BLOQUEADO";


                // ---------------------------------------------
                // MENSAJE
                // ---------------------------------------------

                const mensaje =
                    document.createElement(
                        "p"
                    );


                mensaje.textContent =
                    `Completa el Nivel ${concepto.nivel} para recuperar este concepto.`;


                tarjeta.appendChild(
                    candado
                );


                tarjeta.appendChild(
                    titulo
                );


                tarjeta.appendChild(
                    estado
                );


                tarjeta.appendChild(
                    mensaje
                );
            }


            contenedor.appendChild(
                tarjeta
            );
        }
    );
}


// ============================================================
// SELECCIONAR NIVEL
// ============================================================

function seleccionarNivel(numero) {

    const desbloqueado =
        obtenerNivelDesbloqueado();


    // ========================================================
    // NIVEL BLOQUEADO
    // ========================================================

    if (numero > desbloqueado) {

        alert(
            "NIVEL BLOQUEADO\n\n" +
            "Completa el nivel anterior para desbloquearlo."
        );


        return;
    }


    // ========================================================
    // NIVEL 1
    // ========================================================

    if (numero === 1) {

        if (
            typeof iniciarNivel ===
            "function"
        ) {

            iniciarNivel(1);
        }


        return;
    }


    // ========================================================
    // NIVEL 2
    // ========================================================

    if (numero === 2) {

        if (
            typeof iniciarNivel ===
            "function"
        ) {

            iniciarNivel(2);
        }


        return;
    }


    // ========================================================
    // NIVEL 3
    // ========================================================

    if (numero === 3) {

        alert(
            "NIVEL 3 — PROCESAMIENTO\n\n" +
            "Nivel desbloqueado.\n" +
            "Todavía estamos construyéndolo."
        );


        return;
    }


    // ========================================================
    // NIVEL 4
    // ========================================================

    if (numero === 4) {

        alert(
            "NIVEL 4 — KERNEL\n\n" +
            "Nivel desbloqueado.\n" +
            "Todavía estamos construyéndolo."
        );
    }
}


// ============================================================
// ACTUALIZAR SELECTOR DE NIVELES
//
// IMPORTANTE:
// Esta versión utiliza los IDs que YA EXISTEN en tu HTML:
// botonNivel1
// botonNivel2
// botonNivel3
// botonNivel4
//
// No necesita data-nivel.
// ============================================================

function actualizarSelectorNiveles() {

    const desbloqueado =
        obtenerNivelDesbloqueado();


    for (
        let numero = 1;
        numero <= 4;
        numero++
    ) {

        const boton =
            document.getElementById(
                `botonNivel${numero}`
            );


        const estado =
            document.getElementById(
                `estadoNivel${numero}`
            );


        if (!boton) {

            continue;
        }


        // Limpiar clases anteriores.
        boton.classList.remove(
            "bloqueado",
            "disponible",
            "completado"
        );


        // Asegurar que tenga la función correcta.
        boton.onclick =
            function () {

                seleccionarNivel(
                    numero
                );
            };


        // ====================================================
        // NIVEL BLOQUEADO
        // ====================================================

        if (numero > desbloqueado) {

            boton.disabled = true;


            boton.classList.add(
                "bloqueado"
            );


            if (estado) {

                estado.textContent =
                    "🔒 Bloqueado";
            }


            continue;
        }


        // ====================================================
        // NIVEL 4 COMPLETADO
        // ====================================================

        if (
            numero === 4 &&
            nivel4EstaCompletado()
        ) {

            boton.disabled = false;


            boton.classList.add(
                "completado"
            );


            if (estado) {

                estado.textContent =
                    "✓ Completado";
            }


            continue;
        }


        // ====================================================
        // NIVEL YA COMPLETADO
        // ====================================================

        if (numero < desbloqueado) {

            boton.disabled = false;


            boton.classList.add(
                "completado"
            );


            if (estado) {

                estado.textContent =
                    "✓ Completado";
            }


            continue;
        }


        // ====================================================
        // NIVEL ACTUAL DISPONIBLE
        // ====================================================

        boton.disabled = false;


        boton.classList.add(
            "disponible"
        );


        if (estado) {

            estado.textContent =
                "🔓 Disponible";
        }
    }
}


// ============================================================
// REINICIAR PROGRESO
//
// SOLO PARA PRUEBAS.
//
// Abre la consola y escribe:
//
// reiniciarProgreso();
//
// Resultado:
// Nivel 1 disponible.
// Niveles 2–4 bloqueados.
// Glosario 0/16.
// ============================================================

function reiniciarProgreso() {

    localStorage.removeItem(
        "kernelRunNivelDesbloqueado"
    );


    localStorage.removeItem(
        "kernelRunNivel4Completado"
    );


    actualizarSelectorNiveles();


    generarGlosario();


    console.log(
        "Progreso de Kernel Run reiniciado."
    );
}


// ============================================================
// INICIALIZACIÓN
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        actualizarSelectorNiveles();

        generarGlosario();
    }
);
