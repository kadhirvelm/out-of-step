export const ORIGIN = process.env.NODE_ENV === "development" ? "127.0.0.1" : undefined;
export const PORT = process.env.NODE_ENV === "development" ? 3000 : process.env.PORT;
