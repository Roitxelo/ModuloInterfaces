//################################################################################
// Dado un array con los deportes ofrecidos en ReservaYa:
// const deportes = ["Pádel", "Tenis", "Fútbol 7", "Baloncesto", "Squash"];
// Recórrelo utilizando la sintaxis for...of e imprime una frase por cada uno:
// "Instalación disponible para jugar a: [deporte]".
//################################################################################
// Escribe tu código aquí

const deportes = ["Pádel", "Tenis", "Fútbol 7", "Baloncesto", "Squash"]

for (let n of deportes){
    console.log(`Instalación disponible para jugar a: ${n}`)
}