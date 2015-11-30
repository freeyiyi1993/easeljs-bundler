var _ = require('underscore')
var UglifyJS = require('uglify-js')

module.exports = function parse(content, options) {
  options = _.defaults(options, {
    libraries: ['createjs'],
    filename: 'input:///',
    exports: false
  })

  if (!Array.isArray(options.libraries))
    options.libraries = [options.libraries.toString()]
  options.filename = options.filename.toString()
  options.exports = !!options.exports

  var ast = UglifyJS.parse(content, { filename: options.filename })

  var requires = []
  var exports = []

  function walker(node) {
    function prop(node) {
      if (node.expression instanceof UglifyJS.AST_SymbolRef
        && _.contains(options.libraries, node.expression.name)
        && typeof node.property === 'string') {
        return node.property
      }
      return null
    }

    if (options.exports
      && node instanceof UglifyJS.AST_Assign
      && node.left instanceof UglifyJS.AST_PropAccess) {
      exports.push(prop(node.left))
    }

    if (node instanceof UglifyJS.AST_PropAccess) {
      requires.push(prop(node))
    }
  }

  ast.walk(new UglifyJS.TreeWalker(walker))

  requires = _.uniq(_.compact(requires))
  requires = _.without(requires, 'createCanvas')

  if (!options.exports)
    return requires

  exports = _.uniq(_.compact(exports))
  requires = _.difference(requires, exports)

  return {
    exports: exports,
    requires: requires
  }
}
