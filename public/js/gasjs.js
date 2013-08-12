$(document).ready(function() {
  var gas = {
    c320: 2,
    c540: 1,
    t3val: 100,
    init: function() {
      this.calc();
      this.initbind();
      this.dybind();
    },
    initbind: function() {
      $('#gas').on('click', 'tbody tr:not(.addAmounts)', function() {
        ($(this).next('tr.addAmounts').length) ? $(this).next('tr.addAmounts').remove() : null;
        /* Template Classes
         * .c320inpcont
         * .c540inpcont
         * .otherinpcont
         * .submitNums
         * .cancelSub
         * .redeemIncont
        */
        var tmpl = '<tr class="addAmounts"><td>Add Amounts</td><td class="c320inpcont"><input type="number" class="form-control" /></td><td class="c540inpcont"><input type="number" class="form-control" /></td><td class="otherinpcont"><input type="number" class="form-control" /></td><td><button type="button" class="btn btn-success submitNums">Submit</button></td><td><button type="button" class="btn btn-danger cancelSub">Cancel</button></td><td class="redeemIncont"><button type="button" class="btn btn-info" data-rde="0">Redeem</button></td></tr>';
        $(tmpl).insertAfter($(this));
      });
    },
    dybind: function() {
      // .submitNums binding
      $('#gas').on('click', 'tbody tr.addAmounts button.submitNums', function() {
        /* Gas Schema
         * person: String,
         * c320: type: Number,
         * c540: type: Number,
         * other: type: Number,
         * redeemed: type: Number
        */
        var h = $(this);
        var prow = $(this).parent().parent().prev('tr');
        var x = {
          person: prow.find('td.person').text(),
          c320: (parseInt(($(this).parent().siblings('td.c320inpcont').find('input').val()) ? $(this).parent().siblings('td.c320inpcont').find('input').val() : 0) + parseInt(prow.find('td.c320').text())),
          c540: (parseInt(($(this).parent().siblings('td.c540inpcont').find('input').val()) ? $(this).parent().siblings('td.c540inpcont').find('input').val() : 0) + parseInt(prow.find('td.c540').text())),
          other: (parseInt(($(this).parent().siblings('td.otherinpcont').find('input').val()) ? $(this).parent().siblings('td.otherinpcont').find('input').val() : 0) + parseInt(prow.find('td.other').text())),
          redeemed: parseInt(prow.find('td.redeemed').text())
        };
        $.post('/gas', x, function(data) {
          console.log(data);
          prow.find('td.c320').text(x.c320);
          prow.find('td.c540').text(x.c540);
          prow.find('td.other').text(x.other);
          h.parent().parent().remove();
        });
      });
      // .cancelSub binding
      $('#gas').on('click', 'tbody tr.addAmounts button.cancelSub', function() {
        var trow = $(this).parent().parent();
        trow.prev('tr').find('td.redeemed').text(parseInt(trow.prev('tr').find('td.redeemed').text()) - parseInt($(this).parent().siblings('td.redeemIncont').find('button').data('rde')));
        trow.remove();
      });
      // .redeemIncont button binding
      $('#gas').on('click', 'tbody tr.addAmounts td.redeemIncont button', function() {
        var rh = parseInt($(this).data('rde'));
        $(this).data('rde', rh+=1);
        $(this).parent().parent().prev('tr').find('td.redeemed').text(parseInt($(this).parent().parent().prev('tr').find('td.redeemed').text()) + 1);
      });
    },
    calc: function() {
      var self = this;
      $('#gas tbody tr').each(function() {
        var total = (parseInt($(this).find('td.c320')) * self.c320) + (parseInt($(this).find('td.c540')) * self.c540) + parseInt($(this).find('td.other'));
        if((total/self.t3val) > 0) {
          $(this).find('td.redeem').text((total/self.t3val) - parseInt($(this).find('td.redeemed').text()));
        }
        else {
          $(this).find('td.redeem').text('nope');
        }
      });
    }
  };
  gas.init();
});