const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    let result = await cs.hafly({
        user: message.author,
        guild: message.guild,
        amount: 100,

    });
    if (result.error) return message.channel.send(`You have used hafly recently Try again in ${result.time}`);
    else message.channel.send(`You have earned $${result.amount}.`)
}

exports.help = {
    name: "hafly",
    description: "a way to earn money, hafly",
    example: "hafly",
    usage: "hafly"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}