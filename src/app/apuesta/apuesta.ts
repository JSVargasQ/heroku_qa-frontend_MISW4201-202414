import { Usuario } from "../usuario/usuario";

export class Apuesta {
    id: number;
    valor_apostado: number;
    apostador: Usuario;
    id_posible_resultado: number;
    id_evento: number;

    constructor(
        id: number,
        valor_apostado: number,
        apostador: Usuario,
        id_posible_resultado: number,
        id_evento: number
    ) {
            this.id = id,
            this.valor_apostado = valor_apostado,
            this.apostador = apostador,
            this.id_posible_resultado = id_posible_resultado,
            this.id_evento = id_evento
    }
}
