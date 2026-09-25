//################################################################################
// El recepcionista introduce los cobros en metálico de la jornada en el TPV de ReservaYa.
// El programa pide importes en euros hasta que se introduce un 0.
// Al terminar, debe imprimir la recaudación total y el ticket medio por cobro.
//################################################################################
// Escribe tu código aquí

let entrada 
let cont = 0, recTotal = 0, precioMedio = 0

do{
    cont++
    entrada = parseInt(prompt(`COBRO JORNADA ${cont}: `))
    recTotal += entrada

}while (entrada != 0)

precioMedio = (recTotal / cont)

console.log(`Recaudación total: ${recTotal}
    Precio Medio: ${precioMedio}`)