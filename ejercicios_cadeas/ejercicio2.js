//################################################################################
// El sistema de filtrado de ReservaYa debe comprobar si un código de reserva
// introducido por el usuario comienza por el prefijo de la zona correspondiente
// (por ejemplo, comprobar si "PAD-1023" empieza por "PAD").
// Usa el método startsWith para verificarlo e imprimir el resultado.
//################################################################################
// Escribe tu código aquí

let codigoReserva = "PAD-1023"

if(codigoReserva.startsWith("PAD")){
    console.log("Actividad: Pádel")
}ifelse (codigoReserva.startsWith("FUT")) {
    console.log("Actividad: Fútbol")
} else {
    console.log("No existe ese código...")
}

