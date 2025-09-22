import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string | undefined | null) => {
    if (!token) return true;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const exp = decodedToken.exp;

        return exp ? exp < currentTime : true;
    } catch (error) {
        console.error("error decoding token: ", error);
        return true;
    }
}