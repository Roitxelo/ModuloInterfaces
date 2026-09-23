//################################################################################
// Simula el proceso de verificación de pago de una reserva. Mediante un bucle while,
// simula una petición en la que se comprueba el estado de la reserva.
// El bucle debe continuar pidiendo confirmación hasta que el estado cambie a "confirmada".
//################################################################################
// Escribe tu código aquí

let confirmado = false

while (confirmado == false){
    let confirma = prompt("Pago verificado? S/N")
    if (confirma === 'S'){
        confirmado = true
    }else{
        console.log("No hemos podido confirmar su reserva.  ")
    }
}   