import { GetUsuario } from "./Usuario"

export interface ResponseLogin {
    isSuccess: boolean,
    token: String,
    message: string
}

export interface ResponseSoli{
    isSuccess: boolean,
    message: string
}

export interface ResponseGetUsuarios{
    value: GetUsuario[];
}

export interface ResponseDelteUsuario{
    isSuccess: boolean,
    message: string
}