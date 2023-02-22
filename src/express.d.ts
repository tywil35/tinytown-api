declare namespace Express {
    export interface Request {
        usr?: { id: string, role: number, goa: boolean, email: string }
    }
}