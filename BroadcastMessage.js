/**
 * parameterized constructor
 * @param {[string]} message   the message
 * @param {Object} [data={}] the data for the message
 *                           - type the type of message
 *                           - timeout the timeout for the message
 *                           - func the function for the interval
 */
class BroadcastMessage {
  constructor(message, data = {}) {
    if (typeof content === "string")
      this.message = message;
    if (typeof data.type === "string")
      this.type = data.type;
    if (typeof data.timeout === "number" || typeof data.timeout === "string")
      // convert to minutes
      this.timeout = data.timeout * 1000 * 60;
    if (typeof data.func === "function")
      this.func = data.func;
  }

  /**
   * start an interval for the message
   * @return {number} the id of the intervals
   */
  startInterval() {
    this.interval = setInterval(function(){
      this.func();
    }, this.timeout, this.message)
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
}
