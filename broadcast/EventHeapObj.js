class EventHeapObj {
    constructor(messages = [], expiration = 0, guid) {
        this.messages = messages;
        this.expiration = expiration;
        this.guid = guid;
    }

    compareTo(another) {
        // if negative number, then this expires before what we're comparing with
        // if positive number, this expires after
        // if 0, this expires at the exact same time somehow
        return this.expiration - another.expiration;
    }
}

module.exports = EventHeapObj;
