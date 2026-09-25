//################################################################################
// Se solicita el código de seguridad de una taquilla y un carácter alfabético
// (debes validar que sea una única letra). El programa debe contar y mostrar
// cuántas veces aparece dicha letra dentro del código sin diferenciar mayúsculas de minúsculas.
//################################################################################
// Escribe tu código aquí

let contador
let codigo = prompt("Introduce un código de seguridad: ")

do{
    let caracter = prompt("Introduce un caracter alfabético: ")
}while (caracter.length > 1) 

for (let i = 0; i < codigo.length; i++) {
    if(codigo[i].equals(caracter)){
        contador++
    }
}

console.log(`La letra ${caracter} aparece ${contador} número de veces.`)
