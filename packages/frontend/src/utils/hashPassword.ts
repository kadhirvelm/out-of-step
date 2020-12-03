import { MD5 } from "crypto-js";

export const hashPassword = (rawTextPassword: string) => MD5(rawTextPassword).toString();
