import { IAccountId } from "@stochastic-exchange/api";
import { Database } from "../../types/databaseTypes";
import { postgresPool } from "../../utils/getPostgresPool";

export async function getUser(accountId: IAccountId) {
    const user = await postgresPool.query<Database.Account>("SELECT * FROM account WHERE id = $1", [accountId]);

    return user.rows[0];
}
