// ################################################################################
// El departamento de seguridad exige validar los límites de aforo autorizados.
// Pide el límite inferior y superior del aforo (si el inferior es mayor, vuelve a pedirlo).
// A continuación introduce el número de espectadores de cada partido hasta pulsar 0.
// El programa informará de:
//  * La suma total de espectadores dentro del intervalo abierto.
//  * Cuántos partidos quedaron fuera del rango.
//  * Si algún partido registró exactamente el aforo de los límites.
//################################################################################
// Escribe tu código aquí
let aforoMin, aforoMax, entrada, sumaTotal = 0, partidoFuera = 0, registroIgual = 0, cont = 1

do{
    aforoMin = parseInt(prompt("Introduce el aforo mínimo autorizado: "))
    aforoMax = parseInt(prompt("Introduce el afoto máximo autorizado: "))
    
    if(aforoMax < aforoMin){
        console.log("El aforo máximo debe ser mayor que el mínimo")
    }
} while (aforoMax < aforoMin)

do{

    entrada = parseInt(prompt(`AFORO PARTIDO ${cont}: `))
    if ((entrada < aforoMax) && (entrada > aforoMin)) {
        sumaTotal += entrada
    }if ((entrada == aforoMax) || (entrada == aforoMin)) {
        sumaTotal += entrada
        registroIgual = true
    } else {
        partidoFuera++
    }
    cont++
}while (entrada != 0)

console.log(`Numero espectadores totales válidos: ${sumaTotal}`)
console.log(`Partidos fuera del rango: ${partidoFuera}`)
console.log(`Partidos con el afoto límite exacto: ${registroIgual}`)