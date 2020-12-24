import * as React from "react";
import LRU from "lru-cache";
import { checkIfIsError } from "./checkIfIsError";
import { getTokenInCookie } from "./tokenInCookies";

const localInMemoryCache = new LRU<string, string>({ max: 20, maxAge: 1000 * 60 * 5 });

/**
 * This is really only useful when we're trying to display information from the backend. When you're trying to make a call to update or transact, best to call on the
 * service directly instead of through this abstraction.
 */
export function callOnPrivateEndpoint<Payload, Response>(
    service: (
        payload: Payload,
        cookie?: string | undefined,
    ) => Promise<
        | {
              error: string;
          }
        | Response
    >,
    payload: Payload,
    recalculateEffectOnChange?: any[],
    cacheResultKey?: string,
) {
    const [response, setResponse] = React.useState<Response | undefined>(undefined);

    const maybeReturnResultFromCache = (): Response | undefined => {
        if (cacheResultKey === undefined) {
            return undefined;
        }

        const maybeResult = localInMemoryCache.get(cacheResultKey);
        if (maybeResult === undefined) {
            return undefined;
        }

        return JSON.parse(maybeResult) as Response;
    };

    const maybeSetResponseInCache = (recentlyFetchedResponse: Response | undefined) => {
        if (cacheResultKey === undefined || recentlyFetchedResponse === undefined) {
            return;
        }

        localInMemoryCache.set(cacheResultKey, JSON.stringify(recentlyFetchedResponse));
    };

    const callOnEndpoint = async () => {
        const maybeResultFromCache = maybeReturnResultFromCache();
        if (maybeResultFromCache !== undefined) {
            setResponse(maybeResultFromCache);
        } else {
            const endpointResponse = await service(payload, getTokenInCookie());
            const endpointChecked = checkIfIsError(endpointResponse);

            setResponse(endpointChecked);
            maybeSetResponseInCache(endpointChecked);
        }
    };

    React.useEffect(() => {
        callOnEndpoint();
    }, recalculateEffectOnChange ?? []);

    return response;
}
