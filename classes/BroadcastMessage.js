class BroadcastMessage {
  constructor(type, guid, timeout, interval, func) {
    this.type = type;
    this.guid = guid;
    this.interval = setTimeout(function(){func()}, timeout);
  }
}
