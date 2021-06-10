# Templates
This will go through all functions with example's
See https://github.com/BIntelligent/currency-system/tree/main/ExampleBot for a Example bot.
# NEW!
ADDED inventory system. Please see example bot for its code.
Added: setItems, sell, buy, additems, removeItems, shop, inventory 
# Bug reports
Dm me on discord: `Be Intelligent#7330`.
# Docs
📚 https://currency-system.js.org
# For Global Economy
To make it global, remove following line from every command 
```js
guild: message.guild,
```
# Avialable Functions
## Initilize
Set’s MongoDB URL so It can Connect to MongoDB. `setMongoURL`
( optional ) Set’s Default Wallet Amount when creating new User Document `setDefaultWalletAmount`
( optional ) Set’s Default Bank Amount when creating new User Document `setDefaultBankAmount`
## Economy Methods
Add’s Money to a User. `addMoney`
Remove’s Money from a User. removeMoney
Gamble’s the money for a user with some success of winning double money than you Gambled for. `gamble`
Add’s money from wallet to bank. `deposite`
Take’s money from bank to wallet. `withdraw`
Get’s current balance of user. ( Bank and wallet ) `balance`
Moves money from one user to another. `transferMoney`
## Leaderboard
Get’s Guild’s leaderboard. `leaderboard`
Get’s Global leaderboard. `globalLeaderboard`
## Money Earning Methods
User can use it once per hour. `hourly`
User can use it once every 6 hours. `quaterly`
User can use it once every 24 hours. `daily`
User can use it once every 7 days. `weekly`
User can use it once every month. `monthly`
User can use it every x time. Which Bot Developor can set. `work`
Rob’s a user and have 50-50 chance of getting his money. `rob`
User can use it every x time. Which Bot Developor can set `beg`
## New!!
## Inventory System
Get User’s Inventory. `getUserItems`
Get Shop’s Inventory. `getShopItems`
Add Item’s to Shop! `addItem`
Removes Item’s to Shop! `removeItem`
Set’s Item’s on Shop at once without doing it one by one. `setItems`
Buy Command for User’s to buy items from Shop. `buy`
Sell Command for User’s to Sell items. `removeUserItem`