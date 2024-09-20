import { Usuario } from "../usuario/usuario";

export class Carrera {

    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    tipo: "CARRERA" | "PARTIDO";
    descripcion: string;
    abierta: boolean;
    usuario: number;
    posibles_resultados: Array<Competidor>;
    apuestas: Array<Apuesta>

  constructor(
    id: number,
    nombre: string,
    fecha_inicio: string,
    fecha_fin: string,
    tipo: "CARRERA" | "PARTIDO",
    descripcion: string,
    abierta: boolean,
    usuario: number,
    posibles_resultados: Array<Competidor>,
    apuestas: Array<Apuesta>
  ) {
      this.id = id,
      this.nombre = nombre,
      this.fecha_inicio = fecha_inicio,
      this.fecha_fin = fecha_fin,
      this.tipo = tipo,
      this.descripcion = descripcion,
      this.abierta = abierta,
      this.usuario = usuario,
      this.posibles_resultados = posibles_resultados,
      this.apuestas = apuestas
  }
}

export class Apuesta {
    id: number;
    valor_apostado: number;
    ganancia: number;
    apostador: Usuario;
  id_posible_resultado: number;
    id_evento: number;

    constructor(
        id: number,
        valor_apostado: number,
        ganancia: number,
        apostador: Usuario,
        id_posible_resultado: number,
        id_evento: number
    ) {
        this.id = id,
            this.valor_apostado = valor_apostado,
            this.ganancia = ganancia,
            this.apostador = apostador,
            this.id_posible_resultado = id_posible_resultado,
            this.id_evento = id_evento
    }
}

export class Competidor {
    id: number;
    posible_resultado: string;
    probabilidad: number;
    tipo: "COMPETIDOR" | "MARCADOR"

    constructor(
        id: number,
        tipo: "COMPETIDOR" | "MARCADOR",
        posible_resultado: string,
        probabilidad: number,
    ) {
        this.id = id;
        this.tipo = tipo;
        this.posible_resultado = posible_resultado;
        this.probabilidad = probabilidad;
    }
}


export class ApuestaApostador {
    id: number;
    valor_apostado: number;
    nombre_competidor: string;
    nombre_carrera: string;

    constructor(
        id: number,
        valor_apostado: number,
        nombre_competidor: string,
        nombre_carrera: string
    ) {
        this.id = id;
        this.valor_apostado = valor_apostado;
        this.nombre_competidor = nombre_competidor;
        this.nombre_carrera = nombre_carrera;
    }
}