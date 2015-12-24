var _ = require('underscore')

//*/
try {
  var components = require('./components.json')
} catch (e) {
  var requirements = require('./requirements.json')
}
/*/
var requirements = require('./requirements.js')
//*/

module.exports = function requires(components) {
  var files = _.union.apply(_, _.map(components, function (component) {
    return requirements.components[component]
  }))
  return _.intersection(requirements.files, files)
}