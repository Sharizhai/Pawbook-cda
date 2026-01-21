import { type UserInformations} from "$types/userTypes";
import {user} from "$stores/stores.svelte";
import {isTokenExpired} from "$utils/tokenUtils";

export function createUserSlice() {
    let information: UserInformations = $state({} as UserInformations);
    let accessToken: string = $state(localStorage.getItem("accessToken") ?? "");
    let refreshToken: string = $state(localStorage.getItem("refreshToken") ?? "");

    let isAccessTokenExpired: boolean = $derived(isTokenExpired(accessToken));
    let isRefreshTokenExpired: boolean = $derived(isTokenExpired(refreshToken));

    let isAdmin: boolean = $derived(user.information.role === "ADMIN");
    let isModerator: boolean = $derived(user.information.role === "MODERATOR");

    function setAccessToken(token: string) {
        accessToken = token;
        localStorage.setItem("accessToken", token);
    }

    function setRefreshToken(token: string) {
        refreshToken = token;
        localStorage.setItem("refreshToken", token);
    }

    function clearInformations() {
        information = {} as UserInformations;
        localStorage.removeItem("accessToken");
    }

    return {
        get information() {
            return information;
        },
        get isAdmin() {
            return isAdmin;
        },
        get isModerator() {
            return isModerator;
        },
        get accessToken() {
            return accessToken;
        },
        get refreshToken() {
            return refreshToken;
        },
        get isAccessTokenExpired() {
            return isAccessTokenExpired;
        },
        get isRefreshTokenExpired() {
            return isRefreshTokenExpired;
        },

        set information(value: UserInformations) {
            information = value;
        },

        clearInformations,
        setAccessToken,
        setRefreshToken
    }
}