import pg from "pg";

export const postgresPool = new pg.Pool({
    user: "admin",
    host: "localhost",
    database: "stochastic_exchange",
    password: "admin",
    port: 5432,
});
