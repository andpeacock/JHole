$(document).ready(function() {
  var gas = {
    c320: 2,
    c540: 1,
    t3val: 100,
    init: function() {
      this.calc();
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