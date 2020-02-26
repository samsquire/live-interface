var maskFocus = $(".define");
maskFocus.each(function (index, question) { question.shouldToggle = ["highlight", "on"]; });

var toggleClasses = [[".page", ".recursive-mask"]];
toggleClasses.push.apply(toggleClasses, maskFocus);


toggleClasses.push([".define-panel", ".recursive-mask", ".versions"]);
toggleClasses.push([".page"]);

var $previous = $("<div>");

$(document).on("keypress", function (event) {
console.log(event.which);
  if (event.which === 61) {
    var next = toggleClasses.shift();
    console.log(next);
    if (next.shouldToggle) {
      $next = $(next);
      $previous.toggleClass(next.shouldToggle);
      next.shouldToggle.forEach(function (clazz) {
        $next.toggleClass(clazz);  
      });
      
      $previous = $next;
    } else {
      $(next.join(",")).toggleClass("open");
    }
    toggleClasses.push(next);
    console.log(toggleClasses);
  }
}
)
