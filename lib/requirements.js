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


var componentRequireFiles = {}
_.each(fileParsed, function (parsed, file) {
  _.each(parsed.exports, function (component) {
    if (!(component in componentRequireFiles))
      componentRequireFiles[component] = [file]
    else if (!_.contains(componentRequireFiles[component], file))
      componentRequireFiles[component].push(file)
  })
})

var fileRequiresFiles = {}
_.each(fileParsed, function (parsed, file) {
  fileRequiresFiles[file] = _.union.apply(_, _.map(parsed.requires, function (component) {
    return componentRequireFiles[component]
  }))
})

for (var cont = true; cont; cont = false) {
  _.each(componentRequireFiles, function (files, component) {
    var requireComponents = _.union.apply(_, _.map(files, function (file) {
      return fileParsed[file].requires
    }))

    var requireFiles = _.union.apply(_, _.map(requireComponents, function (component) {
      return componentRequireFiles[component]
    }).concat([files]))

    if (files.length < requireFiles.length) {
      componentRequireFiles[component] = requireFiles
      cont = true
    }
  })
}


var filesOrder = []
while (_.keys(fileRequiresFiles).length > 0) {
  var noRequireFiles = []

  fileRequiresFiles = _.pick(fileRequiresFiles, function (files, file) {
    if (files.length === 0)
      noRequireFiles.push(file)
    return files.length === 0
  })

  _.each(fileRequiresFiles, function (files, file) {
    fileRequiresFiles[file] = _.difference(files, noRequireFiles)
  })

  filesOrder = _.union(filesOrder, noRequireFiles)
}


module.exports = {
  components: componentRequireFiles,
  files: filesOrder
}

fs.writeFileSync(__filename + 'on', JSON.stringify(module.exports, null, 2), 'utf8')
