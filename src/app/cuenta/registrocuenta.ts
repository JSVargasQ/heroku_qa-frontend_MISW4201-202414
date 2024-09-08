export class RegistroCuenta {
    id: number;
    fecha: string;
    descripcion: string;
    valor: number;

    constructor(
        id: number,
        fecha: string,
        descripcion: string,
        valor: number
    ) {
        this.id = id,
            this.fecha = fecha,
            this.descripcion = descripcion,
            this.valor = valor
    }
}