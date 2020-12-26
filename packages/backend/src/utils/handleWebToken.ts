import { IAccountId } from "@stochastic-exchange/api";
import jsonwebtoken from "jsonwebtoken";

const stochasticExchangeSecret =
    process.env.STOCHASTIC_JWT_SECRET ?? "some-random-static-string-that-should-never-be-used";

interface IWebToken {
    id: IAccountId;
}

export function convertUserIdToWebToken(id: IAccountId) {
    return jsonwebtoken.sign({ id } as IWebToken, stochasticExchangeSecret, { expiresIn: "14d" });
}

export function checkIfValidWebToken(webtoken: string | undefined | null): IAccountId | null {
    if (webtoken == null) {
        return null;
    }

    try {
        const decoded = jsonwebtoken.verify(webtoken, stochasticExchangeSecret);
        if (typeof decoded === "string") {
            return null;
        }

        return (decoded as IWebToken).id;
    } catch {
        return null;
    }
}
