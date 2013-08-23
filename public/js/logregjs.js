var logreg = {
  init: function() {
    this.binding();
  },
  binding: function() {
    function lrhs(t, ch, cs) {
      t.parent().addClass('active').siblings().removeClass('active');
      $('div.'+ch).hide();
      $('div.'+cs).show();
    }
    $('li.log a').click(function() {
      lrhs($(this), 'regcont', 'logcont');
      return false;
    });
    $('li.reg a').click(function() {
      lrhs($(this), 'logcont', 'regcont');
      return false;
    })
  }
};
logreg.init();