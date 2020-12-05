import { IAccount, IAccountId } from "@stochastic-exchange/api";
import { postgresPool } from "../../utils/getPostgresPool";

export async function getUser(accountId: IAccountId) {
    const user = await postgresPool.query<IAccount>("SELECT * FROM account WHERE id = $1", [accountId]);

    return user.rows[0];
}
