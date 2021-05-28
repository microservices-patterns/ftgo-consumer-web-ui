const { extendWithLocal } = require('./utilities');

class DefaultNotifier {
  notify() {}
}

const Notifier = extendWithLocal(DefaultNotifier, './localizedNotifier.local.js');

module.exports = new Notifier();
