//################################################################################
// En ReservaYa se quiere mostrar la asignación de pistas de forma gráfica.
// Pide al usuario el número total de pistas N (entre 1 y 20).
// Muestra en consola las pistas desde la 1 hasta la N, imprimiendo el número de 
// pista repetido tantas veces como su propio valor (ej: Pista 1 una vez, Pista 2 dos veces...).
//################################################################################
// Escribe tu código aquí

let numeroPistas = 0

do{
    numeroPistas = prompt("Introduce un número total de pistas (entre 1 y 20):")
}while(numeroPistas > 20 || numeroPistas < 1)

    
for(let i = 0; i <= numeroPistas; i++){
    for(let j = 0; j < i; j++)
    console.log(`Pista ${i}`)
}