//################################################################################
// Dado un array de precios base de alquiler de pistas:
// const preciosBase = [20, 15, 30, 25];
// Utiliza un bucle para modificar el array original aplicando un 20% de descuento
// a cada tarifa por tratarse de la "Semana del Socio".
//################################################################################
// Escribe tu código aquí

const preciosBase = [20, 15, 30, 25]

console.log(`Precios base: ${preciosBase}`)
//for (let n of preciosBase){
//    console.log(`${n}`)
//}

for (let i = 0; i < preciosBase.length; i++){
    preciosBase[i] = preciosBase[i] * 0.8
}

console.log(`\nPrecios SEMANA del SOCIO: ${preciosBase}`)
//for (let n of preciosBase){
//    console.log(`${n}`)
//}
