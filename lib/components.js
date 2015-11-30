var fs = require('fs')
var path = require('path')

var _ = require('underscore')
var glob = require('glob')

var parse = require('./parse')

var sourceDirectory = path.join(__dirname, '../src/')
var files = glob.sync('**/*.js', {
  cwd: sourceDirectory
})


var fileParsed = {}
_.each(files, function (file) {
  var pathname = path.join(sourceDirectory, file)
  var content = fs.readFileSync(pathname, 'utf8')
  fileParsed[file] = parse(content, {
    filename: file,
    exports: true
  })
})


var objectFiles = {}
_.each(fileParsed, function (parsed, file) {
  _.each(parsed.exports, function (object) {
    if (!(object in objectFiles))
      objectFiles[object] = [file]
    else if (!_.contains(objectFiles[object], file))
      objectFiles[object].push(file)
  })
})


for (var cont = true; cont; cont = false) {
  _.each(objectFiles, function (files, object) {
    var requireObjects = _.union.apply(_, _.map(files, function (file) {
      return fileParsed[file].requires
    }))

    var requireFiles = _.union.apply(_, _.map(requireObjects, function (requireObject) {
      return objectFiles[requireObject]
    }).concat([files]))

    if (files.length < requireFiles.length) {
      objectFiles[object] = requireFiles
      cont = true
    }
  })
}

fs.writeFileSync(
  path.join(__dirname, 'objectFiles.json'),
  JSON.stringify(objectFiles, null, 2), 'utf8')

module.exports = objectFiles
