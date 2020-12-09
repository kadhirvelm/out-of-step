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
app.use(bodyParser.urlencoded({ extended: true }));

configureSecurity(app);
configureAllRoutes(app);

if (ORIGIN !== undefined) {
    server.listen(ORIGIN, PORT as any, () => {
        // eslint-disable-next-line no-console
        console.log({ level: "info", message: `Server started, listening on http://${ORIGIN}:${PORT}` });
    });
} else {
    server.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log({ level: "info", message: `Server started, listening on ${PORT}` });
    });
}
