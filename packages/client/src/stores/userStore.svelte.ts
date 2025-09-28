import { type UserInformations} from "$types/userTypes";
import {user} from "$stores/stores.svelte";

export function createUserSlice() {
    let information: UserInformations = $state({} as UserInformations);
    let accessToken: string = $state(localStorage.getItem("accessToken") ?? "");

    let isAdmin: boolean = $derived(user.information.role === "admin");

    function setAccessToken(token: string) {
        accessToken = token;
        localStorage.setItem("accessToken", token);
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
        get accessToken() {
            return accessToken;
        },

        set information(value: UserInformations) {
            information = value;
        },

        clearInformations,
        setAccessToken,
    }
}