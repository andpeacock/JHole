var admin = {
  init: function() {
    this.historyFunctions();
  },
  historyFunctions: function() {
    $('div.gc').on('click', '#delEntry', function() {
      var x = $('#iid').text();
      var h = $(this);
      $.get('/trackerDelete', {'iid': x}, function(data) {
        $.get('/historyTable', function(data) {
          $('#payouts tbody').empty().append(data);
          history.ivals();
          $(this).parent().slideUp(function() {
            $(this).remove();
          });
        });
      });
    });
    $('div.gc').on('click', '#tiSave', function() {
      var th = $(this);
      var x = {
        'iid': th.siblings('h1#iid').text(),
        'paid': true,
        'realVal': th.siblings('div.loadVals').find('td.vReal input').val(),
        'excl': false
      };
      $.post('/historyUpdate', x, function(data) {
        var par;
        $('#payouts tbody tr').each(function() {
          if($(this).find('td.iid').text() == x.iid) {
            par = $(this).find('td.iid');
          }
        });
        // This line subtracts value of updated row from total real value
        (par.siblings('td.paid').data('paid')) ? ($('#totalRVal').val()) ? $('#totalRVal').val(parseInt((parseInt($('#totalRVal').val()) - parseInt(par.siblings('td.ftotal').text())))) : null : null;
        // Gets new table and renders it to body, then triggers recalculation
        $.get('/historyTable', function(data) {
          th.parent().slideUp(function() {
            $(this).remove();
          });
          $('#payouts tbody').empty().append(data);
          history.ivals();
        });
      });
    });
  }
};
admin.init();