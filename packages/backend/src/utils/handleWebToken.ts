import { IAccountId } from "@stochastic-exchange/api";
import jsonwebtoken from "jsonwebtoken";

const stochasticExchangeSecret = "please-replace-this-secret-in-production";

interface IWebToken {
    id: IAccountId;
}

export function convertUserIdToWebToken(id: IAccountId) {
    return jsonwebtoken.sign({ id } as IWebToken, stochasticExchangeSecret, { expiresIn: "72h" });
}

export function checkIfValidWebToken(webtoken: string): IAccountId | null {
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
