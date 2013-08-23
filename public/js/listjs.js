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
          var tmpl = '<li><p class="item">'+item+'</p><p class="quant">'+quant+'</p><button type="button" class="btn btn-small btn-danger deleteItem">X</button></li>';
          $('div.person-tile.active ul').append(tmpl);
          console.log(data);
        });
      }
    });
    $('div.gc').on('click', 'button.boughtToggle', function() {
      var tmpl = $('<input type="number" class="form-control purchaseItem" placeholder="Item cost" />');
      ($(this).data('bought')) ? $(this).data('bought', false).removeClass('btn-success').addClass('btn-default') : $(this).data('bought', true).removeClass('btn-default').addClass('btn-success');
      if($(this).data('bought')) {
        $(this).text('buy');
        $(this).siblings('p.quant').css('padding-right', '121px');
        tmpl.insertBefore($(this));
      }
      else {
        var h = $(this);
        var uvals = {
          person: $(this).parent().parent().parent().prev('h3').text(),
          item: $(this).siblings('p.item').text(),
          cost: $(this).siblings('input').val()
        }
        if(uvals.cost) {
          $.post('/entryupdate', uvals, function(data) {
            console.log(data);
            h.prop('disabled', true)[0].innerHTML = '&#x2713;';
            h.siblings('p.quant').attr('style', '').siblings('input').remove();
          }); 
        }
      }
    });
    $('div.gc').on('click', 'button.deleteItem', function() {
      var h = $(this);
      var di = $(this).siblings('span.item').text();
      var p = $(this).parent().parent().parent().prev('h3').text();
      $.post('/entryremove', {item: di, person: p}, function(data) {
        h.parent().remove();
      });
    });
    $('div.gc').on('click', 'button.paidItem', function() {
      var h = $(this);
      var di = $(this).siblings('p.pitem').text();
      var p = $(this).parent().parent().parent().prev('h3').text();
      $.post('/entrypaid', {item: di, person: p}, function(data) {
        h.parent().remove();
        if(!h.parent().parent('ul li').length) {
          h.parent().parent('ul').prev('h4').remove();
          h.parent().parent('ul').remove();
        }
      });
    });
  }
};
list.init();