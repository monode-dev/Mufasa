import { initializeMosa } from "@monode/mosa";
import { getMosaConfigForSolid } from "@monode/mosa/solid-js";
import { createEffect, createMemo, createRoot, createSignal, on, onCleanup, } from "solid-js";
export const solidSessionInterface = initializeMosa(getMosaConfigForSolid({
    createRoot,
    createSignal,
    createMemo,
    createEffect,
    on: on,
    onCleanup,
}));
