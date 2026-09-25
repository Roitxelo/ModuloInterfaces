//################################################################################
// El sistema de megafonía clasifica las pistas por la letra de su sector.
// Si la letra es una vocal (A, E, I, O, U) imprime 'PABELLÓN CUBIERTO',
// en caso contrario imprime 'PISTAS EXTERIORES'. El programa termina al introducir un espacio.
//################################################################################
// Escribe tu código aquí

const VOCALES = ["A","E","I","O","U"]
let pista
let exterior = false

do{
    exterior = false
    pista = prompt("Dime la letra del selector: ")
    for (const n of VOCALES) {
        if (pista.toUpperCase() == n) {
            exterior = true
        }
    }
    if (exterior) {
        console.log("PABELLÓN CUBIERTO")
    }else{
        console.log("PISTAS EXTERIORES")
    }
}while(pista !== " ")
    console.log("FIN")