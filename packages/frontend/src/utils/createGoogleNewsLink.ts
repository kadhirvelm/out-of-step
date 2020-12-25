export const createGoogleNewsLink = (searchTerms: string) =>
    `https://www.google.com/search?q=${searchTerms.split(" ").join("+")}&tbm=nws`;
