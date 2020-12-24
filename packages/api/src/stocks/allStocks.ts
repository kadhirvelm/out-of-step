export interface IAllStocks {
    "Agri Cola Inc": any;
    "Stability Enterprises": any;
    "Viruz Me Not": any;
    "Bit & Gamble": any;
    "Dental Damage and Company": any;
}

export type IObjectForAllStocks<T> = {
    [Key in keyof IAllStocks]: T;
};
