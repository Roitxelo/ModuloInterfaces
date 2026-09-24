//################################################################################
// Diseña un panel de gestión para el recepcionista de ReservaYa.
// Muestra un menú por pantalla que se repita mientras el usuario no elija salir:
// 1. Ver estado de pistas
// 2. Crear nueva reserva
// 3. Cancelar reserva
// 4. Salir
//################################################################################
// Escribe tu código aquí

let entrada;

do {

    console.log("·········   MENÚ   ·········\n" +
        "· 1. Ver estado de pistas  ·\n" +
        "· 2. Crear nueva reserva   ·\n" +
        "· 3. Cancelar reserva      ·\n" +
        "· 4. Salir                 ·\n" +
        "····························")

    
    entrada = parseInt(prompt("A qué quieres acceder? (escribe 1-4): "))

    switch (entrada) {
        case 1:
            console.log("Proximamente...\n")
            break;

        case 2:
            console.log("Proximamente...\n")
            break;
        case 3:
            console.log("Proximamente...\n")
            break;
        case 4:
            console.log("Gracias por usar el menú\n")
            break;
        default:
            console.log("Escoge una opción correcta.\n")
            break;
    } 

}while (entrada != 4);