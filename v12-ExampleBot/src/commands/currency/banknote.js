const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {
    const arr = await cs.getUserItems({
        user: message.author,
        guild: message.guild
    });
    if (!arr.inventory.length) return message.channel.send("You don't have any banknotes!");
    for (i in arr.inventory) {
        if (arr.inventory[i].name.toLowerCase().includes('banknote')) {
            i++
            const removeItem = await cs.removeUserItem({
                user: message.author,
                item: i,
                guild: message.guild
            });
            if (removeItem.error) {
                console.log('Bot tried to remove item number ' + i)
                return message.channel.send("Unknown error occured see console.")
            };
            const ToincreasedAmount = 5000 + removeItem.rawData.bankSpace;
            const result = await cs.setBankSpace(message.author.id, message.guild.id, ToincreasedAmount);
            if (!result.error) return message.channel.send(`Successfully set Bank Limit to ${result.amount}`);
            else return message.channel.send(`Error: occured: ${result.error}`);

        } else return message.channel.send("Please buy the item first!")
    };
}

exports.help = {
    name: "banknote",
    description: "A way to increase bank money limit!",
    example: "banknote",
    usage: "banknote"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}