import {createUserSlice} from "./userStore.svelte";
import { createAppSlice } from "./appStore.svelte";
import {createPostSlice} from "$stores/postStore.svelte";

export const app = createAppSlice();

export const user = createUserSlice();

export const post = createPostSlice();