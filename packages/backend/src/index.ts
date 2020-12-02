import { ORIGIN, PORT } from "@out-of-step/api";
import compression from "compression";
import express from "express";
import { createServer } from "http";
import { configureSecurity } from "./security/configureSecurity";

const app = express();
const server = createServer(app);

app.use(compression());

configureSecurity(app);

server.listen(PORT, ORIGIN, () => {
    // eslint-disable-next-line no-console
    console.log({ level: "info", message: `Server started, listening on http://${ORIGIN}:${PORT}` });
});
