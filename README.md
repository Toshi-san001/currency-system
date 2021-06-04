# Templates
This will go through all functions with example's
See https://github.com/BIntelligent/currency-system/tree/main/ExampleBot for a Example bot.
## Connect
### Example
```js
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
//sets mongo url
cs.setMongoURL("MONGO URL");
//sets default wallet amount when ever new user is created.
cs.setDefaultWalletAmount('100');
//sets default bank amount when ever new user is created.
cs.setDefaultBankAmount('1000');
```
## AddMoney 
# Example
```js
    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else if (args[0]) {
        user = message.guild.members.cache.get(args[0]);
        if (user) user = user.user;;
    } else if (!args[0]) {
        return message.channel.send("Specify a user!");
    }
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("You do not have requied permissions.")
    let wheretoPutMoney = args[2] || "wallet"; //or bank
    let amount = args[1];
    if (!amount) return message.channel.send("Enter amount of money to add.");
    let money = parseInt(amount);
    let result = await cs.addMoney({
        user: user,
        guild: message.guild,
        amount: money,
        wheretoPutMoney: wheretoPutMoney
    });
    if (result.error) return message.channel.send("You cant add negitive money");
    else message.channel.send(`Successfully added $${money} to ${user.username}, ( in ${wheretoPutMoney} )`)
```
## RemoveMoney 
# Example
```js
    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else if (args[0]) {
        user = message.guild.members.cache.get(args[0]);
        if (user) user = user.user;;
    } else if (!args[0]) {
        return message.channel.send("Specify a user!");
    }
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("You do not have requied permissions.")
    let wheretoPutMoney = args[2] || "wallet"; //or bank
    let amount = args[1];
    if (!amount) return message.channel.send("Enter amount of money to Remove.");
    let money = parseInt(amount);
    let result = await cs.removeMoney({
        user: user,
        guild: message.guild,
        amount: money,
        wheretoPutMoney: wheretoPutMoney
    });
    if (result.error) return message.channel.send("You cant Remove negitive money");
    else message.channel.send(`Successfully Removed $${money} to ${user.username}, ( in ${wheretoPutMoney} )`);
```
## Balance 
# Example
```js
    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else if (args[0]) {
        user = message.guild.members.cache.get(args[0]);
        if (user) user = user.user;
    } else if (!args[0]) {
        user = message.author;
    }

    let result = await cs.balance({
        user: user,
        guild: message.guild
    });
    message.channel.send(`${user.tag}, \n have $${result.wallet} in you wallet and $${result.bank} in there bank.`);
```
## Deposit 
# Example
```js
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
let money = args.join(" ");
if (!money) return message.channel.send("Enter the amount you want to deposite.");

let result = await cs.deposite({
    user: message.author,
    guild: message.guild,
    amount: money
});
if (result.error) {
    if (result.type === 'money') return message.channel.send("Specify an amount to deposite");
    if (result.type === 'negative-money') return message.channel.send("You can't deposite negative money");
    if (result.type === 'low-money') return message.channel.send("You don't have that much money in wallet.");
    if (result.type === 'no-money') return message.channel.send("You don't have any money to deposite");
} else {
    if (result.type === 'all-success') return message.channel.send("You have deposited all your money to your bank");
    if (result.type === 'success') return message.channel.send(`You have deposited $${result.amount} money to your bank.`);
};
```
## Withdraw 
# Example
```js
    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    let money = args.join(" ");
    if (!money) return message.channel.send("Enter the amount you want to withdraw.");

    let result = await cs.withdraw({
        user: message.author,
        guild: message.guild,
        amount: money
    });
    if (result.error) {
        if (result.type === 'money') return message.channel.send("Specify an amount to withdraw")
        if (result.type === 'negative-money') return message.channel.send("You can't withdraw negative money, please use deposit command")
        if (result.type === 'low-money') return message.channel.send("You don't have that much money in bank.")
        if (result.type === 'no-money') return message.channel.send("You don't have any money to withdraw")
    } else {
        if (result.type === 'all-success') return message.channel.send("You have withdraw'd all your money from your bank")
        if (result.type === 'success') return message.channel.send(`You have withdraw $${result.amount} money from your bank.`)

    }
```
## Transfer Money 
# Example
```js
    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else if (args[0]) {
        user = message.guild.members.cache.get(args[0]);
        if (user) user = user.user;;
    } else {
        user.id = "1"
    }

    if (user.bot || user === client.user) return message.channel.send("This user is a bot.");
    if (!client.users.cache.get(user.id) || !user) return message.channel.send('Sorry, you forgot to mention somebody.');

    let amount = args[1];
    if (!amount) return message.channel.send("Enter amount of money to add.");
    if (amount.includes("-")) return message.channel.send("You can't send negitive money.")
    let money = parseInt(amount);

    let result = await cs.transferMoney({
        user: message.author,
        user2: user,
        guild: message.guild,
        amount: money
    });
    if (result.error) return message.channel.send(`You don't have enough money in your wallet.`);
    else message.channel.send(`**${message.author.username}**, Successfully transfered **${result.money}** to **${result.user2.username}**`);
```
## Work 
# Example
```js
    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    let result = await cs.work({
        user: message.author,
        guild: message.guild,
        maxAmount: 100,
        replies: ['Programmer', 'Builder', 'Waiter', 'Busboy', 'Chief', 'Mechanic'],
        cooldown: 25 //25 seconds,

    });
    if (result.error) return message.channel.send(`You have already worked recently Try again in ${result.time.minutes}m ${result.time.seconds}s`);
    else message.channel.send(`You worked as a ${result.workType} and earned $${result.amount}.`)
```
## Gamble 
# Example
```js
    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    let money = args.join(" ");
    if (isNaN(money)) return message.channel.send("Amount is not a number.");

    let result = await cs.gamble({
        user: message.author,
        guild: message.guild,
        amount: money,
        minAmount: 1,
        cooldown: 25 //25 seconds
    });
    if (result.error) {
        if (result.type == 'amount') return message.channel.send("Please insert an amount first.");
        if (result.type == 'nan') return message.channel.send("The amount was not a number.");
        if (result.type == 'low-money') return message.channel.send(`You don't have enough money. You need ${result.neededMoney}$ more to perform the action. `);
        if (result.type == 'gamble-limit') return message.channel.send(`You don't have enough money for gambling. The minimum was $${result.minAmount}.`);
        if (result.type == 'time') return message.channel.send(`Wooo that is too fast. You need to wait **${result.second}** second(s) before you can gamble again.`);
    } else {
        if (result.type == 'lost') return message.channel.send(`Ahh, no. You lose $${result.amount}. You've $${result.wallet} left. Good luck next time.`);
        if (result.type == 'won') return message.channel.send(`Woohoo! You won $${result.amount}! You've $${result.wallet}. Good luck, have fun!`);
    }
```
## LeaderBoard 
# Example
```js
const CurrencySystem = require("currency-system");
const Discord = require("discord.js");
const cs = new CurrencySystem;
let data = await cs.leaderboard(message.guild.id);
if (data.length < 1) return message.channel.send("Nobody's in leaderboard yet.");
const msg = new Discord.MessageEmbed();
let pos = 0;
// This is to get First 10 Users )
data.slice(0, 10).map(e => {
    pos++
    if (!client.users.cache.get(e.userID)) return;
    msg.addField(`${pos} - **${client.users.cache.get(e.userID).username}**`, `Wallet: **${e.wallet}** - Bank: **${e.bank}**`, true);
});

message.channel.send(msg).catch();
```
## Global Leaderboard 
# Example
```js
    let data = await cs.globalLeaderboard();
    if (data.length < 1) return message.channel.send("Nobody's in Global leaderboard yet.");
    const msg = new Discord.MessageEmbed();
    let pos = 0;
    // This is to get First 10 Users )
    data.slice(0, 10).map(e => {
        pos++
        if (!client.users.cache.get(e.userID)) return;
        msg.addField(`${pos} - **${client.users.cache.get(e.userID).username}**`, `Wallet: **${e.wallet}** - Bank: **${e.bank}**`, true);
    });

    message.channel.send(msg).catch();
```

# Todo list
1. Add inventory system idk how but i will 
