var admin = {
  init: function() {
    this.historyFunctions();
    this.adminFunctions();
  },
  historyFunctions: function() {
    $('div.gc').on('click', '#delEntry', function() {
      var x = $('#iid').text();
      var h = $(this);
      $.get('/trackerDelete', {'iid': x}, function(data) {
        $.get('/historyTable', function(data) {
          $('#payouts tbody').empty().append(data);
          history.ivals();
          h.parent().slideUp(function() {
            h.remove();
          });
        });
      });
    });
    $('div.gc').on('click', '#tiSave', function() {
      var th = $(this);
      var x = {
        'iid': th.siblings('h1#iid').text(),
        'paid': true,
        'realVal': th.siblings('#vals').find('tbody tr td.vReal input').val(),
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
  },
  adminFunctions: function() {
    $('div.gc').on('submit', '.phraseForm', function() {
      alert("Phrase updated to: "+$(this).find('input').val());
    });
    $('div.gc').on('click', '.adminUserDel', function() {
      console.log($(this).parent().siblings('td.user').text());
      var hold = $(this).parent().siblings('td.user').text();
      $.post('/removeUser', {username: hold}, function(data) {
        alert("Success");
      });
    });
    $('div.gc').on('click', '.adminUserEdit', function() {
      console.log("clicked");
      var tp = $(this).parent();
      tp.parent().find('td:not(.delCont, .editCont, .status)').each(function() {
        $(this).data('hold', $(this).text());
        $(this).html('<input type="text" class="form-control" placeholder="'+$(this).text()+'" />');
      });
      $('<div class="btn-group"><button type="button" class="btn btn-success adminUserEditSubmit">Submit</button><button type="button" class="btn btn-default adminUserEditCancel">Cancel</button></div>').insertAfter($(this));
      $(this).remove();
    });
    $('div.gc').on('click', '.adminUserEditSubmit', function() {
      var tp = $(this).parent().parent();
      function dataa(sel) {
        var h = tp.siblings('td.'+sel);
        return (h.find('input').val()) ? h.find('input').val() : h.data('hold');
      }
      console.log(tp.siblings('td.user').data('hold'));
      var dhold = {
        inituser: tp.siblings('td.user').data('hold'),
        username: dataa('user'),
        email: dataa('email'),
        evename: dataa('evename')
      };
      $.post('/editUser', dhold, function(data) {
        tp.siblings('td.user').text(dhold.username).siblings('td.email').text(dhold.email).siblings('td.evename').text(dhold.evename);
        tp.empty().append('<button type="button" class="btn btn-warning adminUserEdit">Edit</button>');
      });
    });
    $('div.gc').on('click', '.adminUserEditCancel', function() {
      var tp = $(this).parent().parent();
      tp.parent().find('td:not(.delCont, .editCont, .status)').each(function() {
        $(this).text($(this).data('hold'));
      });
      tp.empty().append('<button type="button" class="btn btn-warning adminUserEdit">Edit</button>');
    });
  }
};
admin.init();