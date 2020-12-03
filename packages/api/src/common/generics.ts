import Express from "express";
import { PORT, ORIGIN } from "../constants";

type IMethods = "get" | "post" | "put" | "delete";

export interface IEndpoint<Payload, Response> {
    payload: Payload;
    response: Response;
}

export interface IService {
    [serviceName: string]: IEndpoint<any, any>;
}

type IImplementEndpoint<Service extends IService> = {
    [Key in keyof Service]: {
        method: IMethods;
        slug: string;
    };
};

type IBackendEndpoint<Service extends IService> = {
    [Key in keyof Service]: (
        payload: Service[Key]["payload"],
        response: Express.Response,
    ) => Promise<Service[Key]["response"] | undefined>;
};

type IFrontendEndpoint<Service extends IService> = {
    [Key in keyof Service]: (payload: Service[Key]["payload"]) => Promise<Service[Key]["response"] | { error: string }>;
};

function implementBackend<Service extends IService>(endpoints: IImplementEndpoint<Service>) {
    return (app: Express.Express, backendImplementedEndpoints: IBackendEndpoint<Service>) => {
        Object.entries(endpoints).forEach(endpoint => {
            const [key, { method, slug }] = endpoint;
            app[method](`${slug}`, async (request, response) => {
                try {
                    const payload = method === "get" ? Object.values(request.params)[0] : request.body;
                    const responseData = await backendImplementedEndpoints[key](payload, response);
                    if (responseData === undefined) {
                        return;
                    }

                    response.status(200).send(JSON.stringify(responseData));
                } catch (e) {
                    response.status(500).send({ error: JSON.stringify(e) });
                }
            });
        });
    };
}

function maybeRemoveVariableFromSlug(slug: string) {
    const allParts = slug.split("/");
    if (!allParts.slice(-1)[0].startsWith(":")) {
        return slug;
    }

    return allParts.slice(0, -1).join("/");
}

function implementFrontend<Service extends IService>(
    endpoints: IImplementEndpoint<Service>,
): IFrontendEndpoint<Service> {
    const endpointsWithRestRequest: IFrontendEndpoint<Service> = {} as any;

    Object.keys(endpoints).forEach((endpointKey: keyof Service) => {
        const { method, slug } = endpoints[endpointKey];
        endpointsWithRestRequest[endpointKey] = async (payload: any) => {
            let rawResponse: globalThis.Response;

            if (method === "get") {
                const stringPayload: string = typeof payload === "string" ? `/${payload}` : "";

                rawResponse = await fetch(
                    `http://${ORIGIN}:${PORT}${maybeRemoveVariableFromSlug(slug)}${stringPayload}`,
                    {
                        method,
                    },
                );
            } else {
                rawResponse = await fetch(`http://${ORIGIN}:${PORT}${slug}`, {
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    method: method.toUpperCase(),
                });
            }

            return (await rawResponse.json()) as Response;
        };
    });

    return endpointsWithRestRequest;
}

export function implementEndpoints<Service extends IService>(
    endpoints: IImplementEndpoint<Service>,
): {
    backend: (app: Express.Express, backendImplementedEndpoints: IBackendEndpoint<Service>) => void;
    frontend: IFrontendEndpoint<Service>;
} {
    return {
        backend: implementBackend<Service>(endpoints),
        frontend: implementFrontend<Service>(endpoints),
    };
}
