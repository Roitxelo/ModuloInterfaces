//################################################################################
// ReservaYa necesita calcular cuántas combinaciones únicas de partidos se pueden
// formar en la fase final de un torneo con N equipos participantes (factorial de N).
// Crea un programa que pida el número de equipos (entero positivo) y calcule el total
// de combinaciones posibles.
//################################################################################
// Escribe tu código aquí
let numEquipos 

do {
    numEquipos = parseInt(prompt("Número de equipos que participan en el torneo: "))
    if(numEquipos < 1){
        console.log("Introduce un número entero positivo...")
    }
} while (numEquipos < 0)


let resultado = 1;
for (let i = 1; i <= numEquipos; i++) {
    resultado *= i;
}
console.log(`El total de combinaciones es: ${resultado}`)