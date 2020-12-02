import { ORIGIN, PORT } from "@stochastic-exchange/api";
import compression from "compression";
import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import { configureAllRoutes } from "./routes/configureAllRoutes";
import { configureSecurity } from "./security/configureSecurity";

const app = express();
const server = createServer(app);

app.use(compression());
app.use(bodyParser.json());

configureSecurity(app);
configureAllRoutes(app);

server.listen(PORT, ORIGIN, () => {
    // eslint-disable-next-line no-console
    console.log({ level: "info", message: `Server started, listening on http://${ORIGIN}:${PORT}` });
});
