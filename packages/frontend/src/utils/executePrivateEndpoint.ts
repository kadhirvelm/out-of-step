import { checkIfIsError } from "./checkIfIsError";
import { getTokenInCookie } from "./tokenInCookies";

/**
 * This is really only useful when we're trying to display information from the backend. When you're trying to make a call to update or transact, best to call on the
 * service directly instead of through this abstraction.
 */
export async function executePrivateEndpoint<Payload, Response>(
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
) {
    const endpointResponse = await service(payload, getTokenInCookie());
    const endpointChecked = checkIfIsError(endpointResponse);

    return endpointChecked;
}
