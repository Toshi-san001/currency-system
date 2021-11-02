const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {
    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else if (args[0]) {
        user = message.guild.members.cache.get(args[0]);
        if (user) user = user.user;
    } else if (!args[0]) {
        user = message.author;
    }
    let result = await cs.setBankSpace(user.id, message.guild.id, args[1]);
    if (result.error) return message.channel.send('Please provide number to setBank Limit to.');
    else return message.channel.send(`Successfully set Bank Limit of ${user.tag} to ${result.amount}`)

}

exports.help = {
    name: "setbankspace",
    description: "A way to know the amount  of money in your bank.",
    usage: "balance",
    example: "balance"
}

exports.conf = {
    aliases: ["sets"],
    cooldown: 5
}