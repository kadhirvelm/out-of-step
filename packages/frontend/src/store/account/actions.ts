import { defineAction } from "redoodle";

export const SetToken = defineAction("SetToken")<{
    token: string | undefined;
}>();
