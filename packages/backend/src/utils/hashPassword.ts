import { createHash } from "crypto";

export const doubleHashPassword = (hashedPassword: string) =>
    createHash("sha256")
        .update(hashedPassword)
        .digest("hex")
        .toString();
