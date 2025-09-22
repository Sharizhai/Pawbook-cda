import {createUserSlice} from "./userStore.svelte";
import { createAppSlice } from "./appStore.svelte";

export const app = createAppSlice();

export const user = createUserSlice();