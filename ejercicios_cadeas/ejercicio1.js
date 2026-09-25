//################################################################################
// El terminal de control del marcador electrónico de una pista necesita procesar
// el código identificador de una reserva escribiendo en consola cada carácter
// en una línea independiente mediante un bucle for.
//################################################################################
// Escribe tu código aquí

console.log("Introduce un código de 5 dígitos..." + "\n")
let codigo = ""

for (let i = 0; i < 5; i++){
    codigo += prompt(`${i+1}º Dígito: `)
}

console.log(`El código es: ${codigo}`)

