const {
  Schema,
  model
} = require("mongoose");
const def = {
  type: Number,
  default: 0
};
module.exports = model('currency', new Schema({
  userID: String,
  guildID: String,
  inventory: Array,
  wallet: def,
  bank: def,
  networth: def,
  lastUpdated: {
    type: Date,
    default: new Date()
  },
  lastGamble: def,
  lastHourly: def,
  lastQuaterly: def,
  lastHafly: def,
  lastRob: def,
  lastDaily: def,
  lastWeekly: def,
  lastMonthly: def,
  lastYearly: def,
  lastBegged: def,
  lastWork: def,
  bankSpace: def
}));