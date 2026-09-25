//################################################################################
// Un usuario introduce su nombre y dos apellidos para el registro de ReservaYa.
// Crea un programa que extraiga e imprima las iniciales en mayúsculas para generar
// su avatar de perfil.
//################################################################################
// Escribe tu código aquí
let nombre = prompt("Introduce tu nombre: ")
let apellidos = prompt("Introduce tus apellidos")
let apellidoArr = apellidos.split(" ")

console.log(`${nombre[0].toUpperCase()}${apellidoArr[0][0].toUpperCase()}${apellidoArr[1][0].toUpperCase()}`)