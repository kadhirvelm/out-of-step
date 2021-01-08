export interface IAllStocks {
    "Agri Cola Inc": any;
    "Bit & Gamble": any;
    "Dental Damage and Company": any;
    "Forty Eight Utilities": any;
    "League of Influencers": any;
    "No Dawn Trading Company": any;
    "Stability Enterprises": any;
    "Viruz Me Not": any;
}

export type IObjectForAllStocks<T> = {
    [Key in keyof IAllStocks]: T;
};
