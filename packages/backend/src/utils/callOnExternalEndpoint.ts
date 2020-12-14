import fetch from "node-fetch";

export async function callOnExternalEndpoint(request: string): Promise<any | undefined> {
    try {
        const rawResponse = await fetch(request);
        return rawResponse.json();
    } catch (e) {
        return undefined;
    }
}
