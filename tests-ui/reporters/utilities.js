

function extendWithLocal(Klass, path) {
  try {
    const Subclass = require(path);
    Object.setPrototypeOf(Subclass.prototype, Klass.prototype);
    Object.setPrototypeOf(Subclass, Klass);
    return Subclass;
  } catch (e) {
    console.log(`[Not an error] Failed to extendWithLocal: ${ path }`, e);
    return Klass;
  }
}

function makeBroadcaster(...broadcasters) {
  return function broadcastMessage(msg) {
    return Promise.all(broadcasters.map(b => b(msg)));
  };
}

module.exports.extendWithLocal = extendWithLocal;
module.exports.makeBroadcaster = makeBroadcaster;
