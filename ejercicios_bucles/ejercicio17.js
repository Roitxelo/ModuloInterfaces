//################################################################################
// El equipo de mantenimiento debe pasar la máquina cepilladora solo por las pistas
// con número par ubicadas entre dos delimitadores introducidos por el usuario.
// Pide los dos números de pista e imprime todos los números pares del intervalo.
//################################################################################
// Escribe tu código aquí

let pistaMin, pistaMax

do {
    pistaMin = prompt("Introduce a primeira pista")
    pistaMax = prompt("Introduce a última pista")
} while (pistaMax < pistaMin);

for (let i = pistaMin; i <= pistaMax; i++) {
    if(i % 2 == 0){
        console.log(`Pista ${i}`)
    }
    
}