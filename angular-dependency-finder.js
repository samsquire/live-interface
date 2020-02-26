function controllerDeps(controller) {
  var ast = ast = esprima.parse(controller.toString());
  function scan(prog) {
    if (prog.body && !prog.body.length) {
      return scan(prog.body);
    } else if (prog.body && prog.body.length) {
      var types = prog.body;
      return types.concat(prog.body.map(scan));
    }
    return [];
  }

  for (var ll = _.flatten(scan(ast)), i =0; i < ll.length; i++) {
    if (ll[i].type === "ExpressionStatement") {
      if (ll[i].expression.type === "AssignmentExpression") {
        console.log(ll[i].expression.left.object.name, ll[i].expression.left.property.name);
      }
    }
  }
}
