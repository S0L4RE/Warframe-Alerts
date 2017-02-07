const channels = require("./channels.json");

class BroadcastMessage {
  constructor(data = {}) {
    if (typeof data.type === "string")
      this.type = data.type;
    if (typeof data.timeout === "number" || typeof data.timeout === "string")
      // convert to minutes
      this.timeout_delay = data.timeout * 1000 * 60;
    if (typeof data.interval === "number" || typeof data.interval === "string")
      this.interval_delay = data.interval * 1000 * 60;
    if (typeof data.func === "function")
      this.func = data.func;
      this.event = data.event;
  }

  /**
   * start an interval for the message
   * @return {number} the id of the interval
   */
  startInterval() {
    if (!this.interval_delay || !this.event) return false;
    let obj = this;
    this.interval = setInterval(function(){
      obj.event.update(obj, obj.event);
    }, this.interval_delay);
    return this.interval;
  }

  /**
   * stop the interval for the message
   * @return {undefined} undefined return type
   */
  stopInterval() {
    clearInterval(this.interval);
    return undefined;
  }

  /**
   * start a timeout
   * @return {number} the id of the timeout
   */
  startTimeout() {
    if (!this.timeout_delay || !this.func) return false;
    let obj = this;
    if (this.func === "delete") {
      this.timeout = setTimeout(function(){
        obj.message.delete()
      }, obj.timeout_delay);
    } else {
      obj.timeout = setTimeout(function(){
        obj.func(this);
      }, obj.timeout_delay);
    }
    return this.timeout;
  }

  /**
   * actually send out a message
   * @param {string} content the content of the message
   */
  broadcast(content) {
    let bm = this;
    for (let guild in channels) {
      if (!bot.guilds.get(guild)) continue;
      let channel = bot.guilds.get(guild).channels.get(channels[guild].Channel);
      channel.sendMessage(content)
        .then((msg) => {
          console.log(`${bm.event.guid} recieved ${bm.timeout_delay} ${bm.interval_delay}`);
          bm.message = msg;
          bm.startTimeout();
          bm.startInterval();
        })
    }
  }
}

module.exports = BroadcastMessage;
