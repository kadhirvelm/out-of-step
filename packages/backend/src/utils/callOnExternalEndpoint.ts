import fetch from "node-fetch";

export async function callOnExternalEndpoint(request: string): Promise<any | undefined> {
    try {
        const rawResponse = await fetch(request, { headers: { "Content-Type": "application/json" } });
        try {
            const jsonResponse = await rawResponse.json();
            return jsonResponse;
        } catch {
            const rawText = await rawResponse.text();
            return JSON.parse(rawText);
        }
    } catch (e) {
        return undefined;
    }
}
