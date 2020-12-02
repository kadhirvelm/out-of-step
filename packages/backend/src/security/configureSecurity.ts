import cors from "cors";
import { Express } from "express";

const CORS_OPTIONS: cors.CorsOptions = {
    origin: [...(process.env.NODE_ENV === "production" ? [] : [])],
    methods: ["GET"],
};

export function configureSecurity(app: Express) {
    app.use(process.env.NODE_ENV === "production" ? cors(CORS_OPTIONS) : cors());
}
