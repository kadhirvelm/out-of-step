export interface IAllStocks {
    "Agri Cola Inc": any;
    "Bit & Gamble": any;
    "Dental Damage and Company": any;
    "First Night Trading Company": any;
    "League of Influencers": any;
    "Stability Enterprises": any;
    "Viruz Me Not": any;
}

export type IObjectForAllStocks<T> = {
    [Key in keyof IAllStocks]: T;
};
