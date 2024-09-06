export class Usuario {
    id: number;
    nombre: string
    albumes: Array<any>

    constructor(
        id: number,
        nombre: string,
        albumes: Array<any>,
    ) {
        this.id = id;
        this.nombre = nombre;
        this.albumes = albumes
    }
}

export class Transaccion {
    id: number;
    tipo: string;
    fecha_creacion: string;
    valor: number;

    constructor(
        id: number,
        tipo: string,
        fecha_creacion: string,
        valor: number
    ) {
        this.id = id;
        this.tipo = tipo;
        this.fecha_creacion = fecha_creacion;
        this.valor = valor;
    }
}