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

        let result = await cs.balance({
            user: user,
            guild: message.guild
        });
        message.channel.send(`${user.tag}, has $${(result.wallet).toLocaleString()} in there wallet and $${(result.bank).toLocaleString()} in there bank. There Max bank has been set to ${result.rawData.bankSpace}`);
    }

    exports.help = {
        name: "balance",
        description: "A way to know the amount  of money in your bank.",
        usage: "balance",
        example: "balance"
    }

    exports.conf = {
        aliases: ["bal"],
        cooldown: 5
    }