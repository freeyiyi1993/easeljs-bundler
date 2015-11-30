var _ = require('underscore')

try {
  var components = require('./components.json')
} catch (e) {
  var components = require('./components.js')
}

module.exports = function requires(componentNames) {
  return _.union.apply(_, _.map(componentNames, function (componentName) {
    return components[componentName]
  }))
}
