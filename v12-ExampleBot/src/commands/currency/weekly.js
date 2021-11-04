const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    let result = await cs.weekly({
        user: message.author,
        guild: message.guild,
        amount: 100,

    });
    if (result.error) return message.channel.send(`You have used weekly recently Try again in ${result.time}`);
    else message.channel.send(`You have earned $${result.amount}.`)
}

exports.help = {
    name: "weekly",
    description: "a way to earn money, weekly",
    example: "weekly",
    usage: "weekly"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}