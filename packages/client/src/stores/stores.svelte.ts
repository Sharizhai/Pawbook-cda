import {createUserSlice} from "./userStore.svelte";
import { createAppSlice } from "./appStore.svelte";
import {createPostSlice} from "$stores/postStore.svelte";
import {createAnimalSlice} from "$stores/animalStore.svelte";
import {createFollowSlice} from "$stores/followStore.svelte";
import {createPostReportsSlice} from "$stores/postReportsStore.svelte";

export const app = createAppSlice();

export const user = createUserSlice();

export const post = createPostSlice();

export const animal = createAnimalSlice();

export const follow = createFollowSlice();

export const postReport = createPostReportsSlice();