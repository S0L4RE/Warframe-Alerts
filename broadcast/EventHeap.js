/**
 * this is a class that will hold an array based heap of the events
 * sorted by their expiration time which will be stored as a unix
 * timestamp. Every time interval, i will peek at the top of the heap and
 * keep removing until the top of the heap's expiration is not expired.
 *
 * currently that means this is for events only it will probably be possible
 * to have a delete method in the generic event class which is overwritten in the
 * invasion and alert classes
 *
 * each item of the heap will have 2 things:
 * 1. an array of message ids that correspond to the messages that were sent
 * 2. a unix timestamp
 */

const EventHeapObj = require("./EventHeapObj.js");

class EventHeap {
  constructor() {
    this.data = [];
    this.length = 0;
  }

  insert(ehObj) {
    this.data[this.length] = ehObj; // stick it at the end
    let curr = this.length;
    let par = ((curr - 1) / 2) >> 0;
    while (curr >= 0 && this.data[curr].compareTo(this.data[par]) < 0) {
      let temp = this.data[curr];
      this.data[curr] = this.data[par];
      this.data[par] = temp;
      curr = par;
      par = ((curr - 1) / 2) >> 0;
    }
    this.length++;
  }

  remove() {
    const del = this.data[0];
    this.data[0] = this.data[--this.length];
    if (this.data[0] !== undefined) {
      let i = 0;
      while (i <= (this.length / 2 - 1) >> 0) {
        let c = 2 * i + 1;
        if (2 * i + 2 < this.length && this.data[c].compareTo(this.data[2 * i + 2]) > 0) c = 2 * i + 2;
        if (this.data[i].compareTo(this.data[c]) < 0) break;
        let temp = this.data[i];
        this.data[i] = this.data[c];
        this.data[c] = temp;
        i = c;
      }
    }
    return del;
  }

  peek() {
    return this.data[0];
  }
}

module.exports = EventHeap;
