//################################################################################
// Tienes un array con los importes recaudados por cada reserva durante una jornada:
// const ingresos = [15, 20, 15, 30, 25, 15, 40];
// Utiliza un bucle para calcular la recaudación total del día y la media de ingresos.
//################################################################################
// Escribe tu código aquí

const ingresos = [15, 20, 15, 30, 25, 15, 40]

let recaudacion = 0

for (let n of ingresos){
    recaudacion += n;
}

let media = recaudacion / ingresos.length

console.log(`Recaudación total del día: ${recaudacion}. \nMedia de ingresos: ${media}`)