// ============================================================
// KERNEL RUN
// MENÚ Y GLOSARIO
// ============================================================


// ============================================================
// CAMBIAR PANTALLA
// ============================================================

function mostrarPantalla(id) {

    const pantallas =
        document.querySelectorAll(".pantalla");


    pantallas.forEach(pantalla => {

        pantalla.classList.remove("activa");

    });


    const pantallaDestino =
        document.getElementById(id);


    if (pantallaDestino) {

        pantallaDestino
            .classList
            .add("activa");

    }


    // Cada vez que entramos a niveles,
    // comprobamos qué niveles están disponibles.

    if (id === "niveles") {

        actualizarSelectorNiveles();

    }

}


// ============================================================
// INFORMACIÓN DE LOS 16 CONCEPTOS
// ============================================================
//
// IMPORTANTE:
//
// Aquí podremos sustituir posteriormente:
//
// nombre
// definición
// imagen
//
// sin modificar el motor del videojuego.
//
// ============================================================

const conceptos = [

    {
        id: 1,
        nombre: "Concepto 1",

        definicion:
            "Aquí irá la definición del Concepto 1. La definición definitiva tendrá entre 30 y 50 palabras y explicará claramente su relación con la administración de procesos.",

        imagen: "",

        nivel: 1
    },


    {
        id: 2,
        nombre: "Concepto 2",

        definicion:
            "Aquí irá la definición del Concepto 2. Este espacio está preparado para colocar posteriormente el contenido académico definitivo correspondiente al glosario.",

        imagen: "",

        nivel: 1
    },


    {
        id: 3,
        nombre: "Concepto 3",

        definicion:
            "Aquí irá la definición del Concepto 3. Posteriormente se sustituirá este texto por una explicación clara, concreta y relacionada con Sistemas Operativos.",

        imagen: "",

        nivel: 1
    },


    {
        id: 4,
        nombre: "Concepto 4",

        definicion:
            "Aquí irá la definición del Concepto 4. Esta información podrá modificarse posteriormente sin necesidad de cambiar la programación del nivel.",

        imagen: "",

        nivel: 1
    },


    {
        id: 5,
        nombre: "Concepto 5",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 2
    },


    {
        id: 6,
        nombre: "Concepto 6",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 2
    },


    {
        id: 7,
        nombre: "Concepto 7",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 2
    },


    {
        id: 8,
        nombre: "Concepto 8",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 2
    },


    {
        id: 9,
        nombre: "Concepto 9",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 3
    },


    {
        id: 10,
        nombre: "Concepto 10",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 3
    },


    {
        id: 11,
        nombre: "Concepto 11",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 3
    },


    {
        id: 12,
        nombre: "Concepto 12",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 3
    },


    {
        id: 13,
        nombre: "Concepto 13",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 4
    },


    {
        id: 14,
        nombre: "Concepto 14",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 4
    },


    {
        id: 15,
        nombre: "Concepto 15",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 4
    },


    {
        id: 16,
        nombre: "Concepto 16",
        definicion: "Definición pendiente.",
        imagen: "",
        nivel: 4
    }

];


// ============================================================
// GENERAR GLOSARIO
// ============================================================

function generarGlosario() {

    const lista =
        document.getElementById(
            "listaConceptos"
        );


    if (!lista) {

        return;

    }


    lista.innerHTML = "";


    conceptos.forEach(concepto => {

        const elemento =
            document.createElement("div");


        elemento.classList.add(
            "concepto"
        );


        if (concepto.nivel === 1) {

            elemento.classList.add(
                "concepto-nivel1"
            );

        }


        elemento.innerHTML =

            `<strong>
                ${concepto.id}.
                ${concepto.nombre}
            </strong>`;


        lista.appendChild(elemento);

    });

}


// ============================================================
// PROGRESO
// ============================================================

function obtenerNivelDesbloqueado() {

    const progreso =
        localStorage.getItem(
            "kernelRunNivelDesbloqueado"
        );


    if (!progreso) {

        return 1;

    }


    const nivel =
        parseInt(progreso);


    if (isNaN(nivel)) {

        return 1;

    }


    return nivel;

}


// ============================================================
// GUARDAR PROGRESO
// ============================================================

function guardarNivelDesbloqueado(nivel) {

    const actual =
        obtenerNivelDesbloqueado();


    if (nivel > actual) {

        localStorage.setItem(

            "kernelRunNivelDesbloqueado",

            nivel

        );

    }


    actualizarSelectorNiveles();

}


// ============================================================
// SELECTOR DE NIVELES
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


        if (
            !boton ||
            !estado
        ) {

            continue;

        }


        // --------------------------------------------
        // NIVEL DISPONIBLE
        // --------------------------------------------

        if (
            numero <= desbloqueado
        ) {

            boton.disabled = false;

            boton.classList.remove(
                "bloqueado"
            );

            boton.classList.add(
                "disponible"
            );


            // Por ahora solo tenemos construido
            // completamente el Nivel 1.

            if (numero === 1) {

                boton.onclick = () => {

                    iniciarNivel(1);

                };

            }


            // Nivel 2 ya aparecerá desbloqueado,
            // pero todavía no iniciará hasta construirlo.

            else {

                boton.onclick = () => {

                    alert(
                        `Nivel ${numero} desbloqueado.\n\n` +
                        "Este nivel será construido en la siguiente fase."
                    );

                };

            }


            if (
                numero <
                desbloqueado
            ) {

                estado.textContent =
                    "✅ Completado";

                boton.classList.add(
                    "completado"
                );

            }

            else {

                estado.textContent =
                    "🔓 Disponible";

            }

        }


        // --------------------------------------------
        // NIVEL BLOQUEADO
        // --------------------------------------------

        else {

            boton.disabled = true;

            boton.onclick = null;

            boton.classList.add(
                "bloqueado"
            );

            boton.classList.remove(
                "disponible"
            );

            boton.classList.remove(
                "completado"
            );

            estado.textContent =
                "🔒 Bloqueado";

        }

    }

}


// ============================================================
// INICIALIZACIÓN
// ============================================================

generarGlosario();

actualizarSelectorNiveles();