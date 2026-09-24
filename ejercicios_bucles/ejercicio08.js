//################################################################################
// La tarifa de penalización por cancelación en ReservaYa se calcula con un
// multiplicador progresivo B (base real) elevado a E (exponente entero positivo) tramos.
// Pide por teclado la base B y el exponente E y calcula el resultado mediante un
// bucle (sin utilizar el operador ** ni Math.pow).
//################################################################################
// Escribe tu código aquí

let baseB = parseInt(prompt("Introduce una base: "))
let expE = parseInt(prompt("Introduce un exponente: "))
let resultado = baseB;

for(let i = 2; i <= expE; i++){
    resultado = resultado * baseB
}

console.log(`${baseB} elevado a ${expE} = ${resultado}`)