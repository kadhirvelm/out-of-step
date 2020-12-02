# Out of step decomp

## Goals
We want a fake stock market where we can come up with our own heuristic determination of stock value. We also want people to create their own portfolios, trade stocks and see how their portfolio is doing.

## User stories

View stocks
1. A user opens up the portal to wants to see all the available stocks and their current values
2. They click on one stock and want to see the historical price point
3. They want to see some more metadata about the stock, like its total valuation, total available volume, etc

View portfolio
1. A user wants to see their individual portfolio's total worth
2. They want to see the total cash they have on hand
3. and how much each stock in their portfolio is worth
4. They click on a stock in their portfolio and see the historical transactions they've had with said stock

Transact a new stock
1. A user wants to buy a new stock, so click on a stock
2. They enter the quantity they want and hit purchase
3. Then they want to sell off some of another stock, so they navigate over to it
4. Click on sell, enter the quantity and hit sell

Enter a limit order
1. A user wants to enter a limit order for a given stock
2. They go to the stock, click enter limit order
3. Specify a quantity, the numeric value, and type of order
4. And hit submit

View the current scoreboard
1. The user navigates to the scoreboard
2. and sees the top five portfolios
3. and how much they're worth
4. they can also see how much their portfolio is worth in relation to everyone else

## Data model

See dataModel.ts in packages/api.
