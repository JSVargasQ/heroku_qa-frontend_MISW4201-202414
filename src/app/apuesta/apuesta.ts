import { Usuario } from "../usuario/usuario";

export class Apuesta {
    id: number;
    valor_apostado: number;
    apostador: Usuario;
    id_competidor: number;
    id_carrera: number;

    constructor(
        id: number,
        valor_apostado: number,
        apostador: Usuario,
        id_competidor: number,
        id_carrera: number
    ) {
        this.id = id,
            this.valor_apostado = valor_apostado,
            this.apostador = apostador,
            this.id_competidor = id_competidor,
            this.id_carrera = id_carrera
    }
}