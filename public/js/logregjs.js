var logreg = {
  init: function() {
    this.binding();
  },
  binding: function() {
    $('button.log').click(function() {
      $(this).siblings().removeClass('btn-success').addClass('btn-default');
      $(this).removeClass('btn-default').addClass('btn-success');
      $('div.regcont').hide();
      $('div.logcont').show();
    });
    $('button.reg').click(function() {
      $(this).siblings().removeClass('btn-success').addClass('btn-default');
      $(this).removeClass('btn-default').addClass('btn-success');
      $('div.logcont').hide();
      $('div.regcont').show();
    })
  }
};
logreg.init();