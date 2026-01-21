export interface ITokenPayload {
    id: string;
    email: string;
    firstName: string;
    name: string;
    role: string;
}

export interface IRefreshTokenPayload {
    id: string;
}