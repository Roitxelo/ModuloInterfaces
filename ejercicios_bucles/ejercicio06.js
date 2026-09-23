//################################################################################
// Un usuario adquiere el abono "Socio VIP" de ReservaYa a pagar en 20 meses.
// El primer mes paga 10€, el segundo 20€, el tercero 30€ y así sucesivamente.
// Realizar un algoritmo para determinar cuánto debe pagar mensualmente y el total
// acumulado tras los 20 meses.
//################################################################################
// Escribe tu código aquí

let mensual = 0
let total = 0

for (let i = 1; i <= 20; i++){
    mensual = (10 * i)
    console.log(`Pago en el MES ${i}: ${mensual}`)
    total += mensual
}

console.log(`Total acumulado: ${total}`)