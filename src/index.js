/**
 * @author Silent-Coder
 * @license Apache-2.0
 * @copyright Silent-Coder
 * @file index.js
 */

'use strict';
const db = require("mongoose");
const ms = require("parse-ms");
const cs = require("./models/currency");
/**
 * @class CurrencySystem
 */
class CurrencySystem {
    constructor() {
        this.wallet = 0;
        this.bank = 0;
    }

    setDefaultWalletAmount(amount) {
        if (parseInt(amount)) this.wallet = amount || 0;
    }
    setDefaultBankAmount(amount) {
        if (parseInt(amount)) this.bank = amount || 0;
    }
    setMongoURL(password) {
        if (!password.startsWith("mongodb+srv")) throw new TypeError("Invalid MongoURL");
        let connected = true;
        db.connect(password, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(e => {
            connected = false;
            throw new TypeError(`${e}`);
        }).then(() => {
            if (connected === true) console.info("Connected to DB successfully.")
        });
    };

    async gamble(settings) {

        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        const money = settings.amount;
        const result = Math.floor(Math.random() * 10);
        const balance = data.wallet;
        let lastGamble = data.lastGamble;
        let cooldown = settings.cooldown || 5;
        cooldown = cooldown * 1000;
        if (!parseInt(money)) return {
            error: true,
            type: 'amount'
        };
        if (isNaN(parseInt(money))) return {
            error: true,
            type: 'nan'
        };
        if (parseInt(money) > balance || !balance || balance === 0) return {
            error: true,
            type: 'low-money',
            neededMoney: balance - parseInt(money)
        };
        if (parseInt(money) < settings.minAmount || 0) return {
            error: true,
            type: 'gamble-limit',
            minAmount: settings.minAmount || 0
        };
        let pad_zero = num => (num < 10 ? '0' : '') + num;
        if (lastGamble !== null && cooldown - (Date.now() - lastGamble) > 0) return {
            error: true,
            type: 'time',
            second: pad_zero(ms(cooldown - (Date.now() - lastGamble)).seconds).padStart(2, "0")
        };

        if (result < 5) {
            data.lastGamble = Date.now();
            data.wallet = data.wallet - parseInt(money);
            return {
                error: false,
                type: 'lost',
                amount: parseInt(money),
                wallet: data.wallet
            };
        } else if (result > 5) {
            data.lastGamble = Date.now();
            data.wallet = (data.wallet + parseInt(money));
            return {
                error: false,
                type: 'won',
                amount: parseInt(money),
                wallet: data.wallet
            };
        };
        saveUser(data);
    };


    async withdraw(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        const money = settings.amount;
        const bank = data.bank;

        if (!money) return {
            error: true,
            type: 'money'
        };
        if (money.includes('-')) return {
            error: true,
            type: 'negative-money'
        };
        if (bank < parseInt(money)) return {
            error: true,
            type: 'low-money'
        };

        if (money === 'all') {
            if (bank === 0) return {
                error: true,
                type: 'no-money'
            }
            data.wallet = data.wallet + data.bank;
            data.bank = 0;
            await saveUser(data);
            return {
                error: false,
                type: 'all-success'
            }

        } else {

            data.wallet = data.wallet + parseInt(money);
            data.bank = data.bank - parseInt(money);
            await saveUser(data);
            return {
                error: false,
                type: 'success',
                amount: parseInt(money)
            };
        }
    };

    /**
     * 
     * @param {object} settings  
     */


    async deposite(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        const money = settings.amount;
        const wallet = data.wallet;

        if (!money) return "Specify an amount to deposite";
        if (money.includes('-')) return "You can't deposite negative money";
        if (parseInt(money) > wallet) return "You don't have that much money in wallet.";

        if (!money) return {
            error: true,
            type: 'money'
        };
        if (money.includes('-')) return {
            error: true,
            type: 'negative-money'
        };
        if (parseInt(money) > wallet) return {
            error: true,
            type: 'low-money'
        };


        if (money === 'all') {

            if (wallet === 0) return {
                error: true,
                type: 'no-money'
            }

            data.bank = data.wallet + data.bank;
            data.wallet = 0;
            await saveUser(data);
            return {
                error: false,
                type: 'all-success'
            }


        } else {

            data.wallet = data.wallet - parseInt(money);
            data.bank = data.bank + parseInt(money);
            await saveUser(data);
            return {
                error: false,
                type: 'success',
                amount: parseInt(money)
            };

        }
    };

    /**
     * 
     * @param {object} settings  
     */


    async balance(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        return {
            bank: data.bank,
            wallet: data.wallet
        }
    };

    /**
     * 
     * @param {object} settings  
     */


    async leaderboard(guildid, sortBy = 'bank') {
        let data = await cs.find({
            guildID: guildid
        }).sort([
            [sortBy, 'descending']
        ]).exec();
        return data;
    };
    async globalLeaderboard(sortBy = 'bank') {
        let data = await cs.find().sort([
            [sortBy, 'descending']
        ]).exec();
        return data;
    };

    /**
     * 
     * @param {object} settings  
     */


    async work(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        let lastWork = data.lastWork;
        let timeout = settings.cooldown;

        if (lastWork !== null && timeout - (Date.now() - lastWork) > 0) return {
            error: true,
            type: 'time',
            time: ms(timeout - (Date.now() - lastWork))
        };
        else {

            let amountt = Math.floor(Math.random() * settings.maxAmount || 100) + 1;
            data.lastWork = Date.now();
            data.wallet = data.wallet + amountt;
            await saveUser(data);
            let result = Math.floor((Math.random() * settings.replies.length));
            return {
                error: false,
                type: 'success',
                workType: settings.replies[result],
                amount: amountt
            };

        };
    };

    /**
     * 
     * @param {object} settings  
     */


    async rob(settings) {
        let user1 = await findUser(settings)
        if (!user1) user1 = await makeUser(this, settings);

        let user2 = await cs.findOne({
            userID: settings.user2.id,
            guildID: settings.guild.id || false
        });
        if (!user2) user2 = await makeUser(this, settings, true)

        let lastRob = user1.lastRob;
        let timeout = settings.cooldown;

        if (lastRob !== null && timeout - (Date.now() - lastRob) > 0) return {
            error: true,
            type: 'time',
            time: ms(timeout - (Date.now() - lastRob))
        };

        if (user1.wallet < settings.minAmount) return {
            error: true,
            type: 'low-money',
            minAmount: settings.minAmount
        };
        if (user2.wallet < settings.minAmount) return {
            error: true,
            type: 'low-wallet',
            user2: settings.user2,
            minAmount: settings.minAmount
        };

        let random = Math.floor(Math.random() * 1000) + 1; // random number 200-1, you can change 200 to whatever you'd like
        if (random > user2.wallet) random = user2.wallet;

        // 5 here is percentage of success.
        if (testChance(settings.successPercentage || 5)) {
            // Success!

            user2.wallet = user2.wallet - random;
            user1.wallet = user1.wallet + random;
            await saveUser(user1);
            await saveUser(user2);
            return {
                error: false,
                type: 'success',
                user2: settings.user2,
                minAmount: settings.minAmount,
                amount: random
            };

        } else {
            // Fail :(

            user2.wallet = user2.wallet + random;
            user1.wallet = user1.wallet - random;
            await saveUser(user1);
            await saveUser(user2);
            return {
                error: true,
                type: 'caught',
                user2: settings.user2,
                minAmount: settings.minAmount,
                amount: random
            };
        };

    };

    /**
     * 
     * @param {object} settings  
     */


    async addMoney(settings) {
        let data = await findUser(settings);
        if (!data) data = await makeUser(this, settings);
        if (String(settings.amount).includes("-")) return {
            error: true,
            type: 'negative-money'
        };
        let amount = parseInt(settings.amount) || 0;
        let wheretoPutMoney = data.wallet;
        if (settings.wheretoPutMoney === "bank") wheretoPutMoney = data.bank;
        else if (settings.wheretoPutMoney === "wallet") wheretoPutMoney = data.wallet;
        if (wheretoPutMoney === data.wallet) data.wallet += amount;
        if (wheretoPutMoney === data.bank) data.bank += amount;
        await saveUser(data);
        return {
            error: false,
            type: 'success'
        };
    };

    /**
     * 
     * @param {object} settings  
     */


    async removeMoney(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);
        if (String(settings.amount).includes("-")) return {
            error: true,
            type: 'negative-money'
        };
        let amount = parseInt(settings.amount) || 0;
        let wheretoPutMoney = data.wallet;
        if (settings.wheretoPutMoney === "bank") wheretoPutMoney = data.bank;
        else if (settings.wheretoPutMoney === "wallet") wheretoPutMoney = data.wallet;

        if (wheretoPutMoney === data.wallet) data.wallet -= amount;
        if (wheretoPutMoney === data.bank) data.bank -= amount;
        await saveUser(data);
        return {
            error: false,
            type: 'success'
        };
    };

    /**
     * 
     * @param {object} settings  
     */

    async transferMoney(settings) {
        let user1 = await findUser(settings)
        if (!user1) user1 = await makeUser(this, settings);

        let user2 = await cs.findOne({
            userID: settings.user2.id,
            guildID: settings.guild.id || false
        });
        if (!user2) user2 = await makeUser(this, settings, true)
        let money = parseInt(settings.amount)
        if (user1.wallet < money) return {
            error: true,
            type: 'low-money'
        };

        user1.wallet = user1.wallet - money;
        user2.wallet = user2.wallet + money;
        saveUser(user1);
        saveUser(user2);
        return {
            error: false,
            type: 'success',
            money: money,
            user2: settings.user2
        };
    }

    /* async addItem(settings) {
        let user1 = await findUser(settings)
        if (!user1) user1 = await makeUser(this, settings);

        let user2 = await cs.findOne({
            userID: settings.user2.id,
            guildID: settings.guild.id
        });
        if (!user2) user2 = await makeUser(this, settings, true)
        
    }; */
};


module.exports = CurrencySystem;
async function findUser(settings) {
    let find = await cs.findOne({
        userID: settings.user.id,
        guildID: settings.guild.id || false
    });
    return find;
};

async function makeUser(that, settings, user2 = false) {
    let user = settings.user.id
    if (user2) user = settings.user2.id;
    const newUser = new cs({
        userID: user,
        guildID: settings.guild.id || false,
        wallet: that.wallet || 0,
        bank: that.bank || 0,
        inventory: "nothing",
        lastUpdated: new Date(),
        lastGamble: 0,
        lastWork: 0,
        lastRob: 0
    });
    await newUser.save().catch(console.error);
    return newUser;
};
async function saveUser(data) {
    await data.save().catch(e => {
        throw new TypeError(`${e}`);
    });
};
// This is for Rob Command
function testChance(successPercentage) {
    let random2 = Math.random() * 10;
    return ((random2 -= successPercentage) < 0);
}