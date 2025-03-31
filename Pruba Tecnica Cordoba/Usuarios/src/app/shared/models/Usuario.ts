export interface Usuario {
    nombre: string;
    apellido: string;
    cedula: string;
    correoElectronico: string;
    contrasena: string;
    puntaje: number;
}

export interface Login {
    correoElectronico: string;
    Contrasena: string;
}

export interface GetUsuario{
    idUsuario: number;
    nombre: string;
    apellido: string;
    cedula: string;
    correoElectronico: string;
    fechaHoraUIngreso: string;
    contrasena: string;
    puntaje: number;
    idClasificacionUsuario: number;
    nombreClasificacion: string;
    fechaCreacion: string;
}

export interface UpdateUsuario{
    nombre: string;
    apellido: string;
    cedula: string;
    correoElectronico: string;
    contrasena: string;
    puntaje: number;
    idUsuario: number;
}