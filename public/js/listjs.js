var list = {
  person: $('div.active').prev('h3').text(),
  init: function() {
    this.binding();
    console.log(this.person);
  },
  binding: function() {
    /*
     * #addItemInput
     * #addQuantInput
     * .addItemButton
    */
    var self = this;
    $('div.gc').on('click', 'h3', function() {
      if($(this).next('div').is('div:visible')) {
        $(this).next('div').slideUp();
      }
      else {
        $(this).next('div').slideDown();
      }
    });
    $('div.gc').on('click', 'button.addItemButton', function() {
      var item = $(this).siblings('#addItemInput').val();
      var quant = $(this).siblings('#addQuantInput').val();
      var h = $(this);
      if($('div.active').length) {
        $.post('/entry', {item: item, quantity: quant}, function(data) {
          h.siblings('input').val('');
          ($('ul li').length) ? null : $('div.person-tile.active p').remove();
          var tmpl = '<li><span class="item">'+item+'</span><span class="quant">'+quant+'</span><button type="button" class="btn btn-small btn-danger deleteItem">X</button></li>';
          $('div.person-tile.active ul').append(tmpl);
          console.log(data);
        });
      }
    });
    $('div.gc').on('click', 'button.boughtToggle', function() {
      ($(this).data('bought')) ? $(this).data('bought', false).removeClass('btn-success').addClass('btn-default') : $(this).data('bought', true).removeClass('btn-default').addClass('btn-success');
    });
    $('div.gc').on('click', 'button.deleteItem', function() {
      var h = $(this);
      var di = $(this).siblings('span.item').text();
      $.post('/entryremove', {item: di}, function(data) {
        console.log(data);
        h.parent().remove();
      });
    });
  }
};
list.init();