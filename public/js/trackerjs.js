$(document).ready(function() {
  var track = {
    currg: 0,
    expObj: {
      "iid": null,
      "currg": null,
      "groups": {},
      "main": {},
      "vals": {}
    },
    members: ["Ageudum", "Akrim Stenra",  "Andrew Jester", "Brutus King", "Cardavet", "Joe Poopy", "Lilum Biggum", "Melliflous Hyperion", "Nova Kairas", "Schaeffer Gaunt", "Silas Mieyli", "Simmons Hakoke", "Sinya Todako", "Tennigan Haldeye", "Yuri Lebbie","Zencron en Thelles", "807Y6DI897TU"], //People who run sites
    init: function() {
      var self = this;
      this.tbl();
      this.binding();
      $('#iid').text(self.keygen());
    },
    binding: function() {
      var self = this;
      $('#addm').bind('click', function() {
        self.currg += 1;
        self.extend();
      });
      $('.vReal').find('input').bind('keyup', function() {
        self.countUpdate('m'+self.currg);
      });
      $('#export').bind('click', function() {
        self.exp();
      });
      $('#import').bind('click', function() {
        self.imp();
      });
    },
    exp: function() {
      //groups, main, vals
      ($('#expCopy').length > 0) ? $('#expCopy').remove() : null;
      var self = this;
      this.expObj["iid"] = $('#iid').text();
      this.expObj["currg"] = parseInt(self.currg);
      $('#groups tbody tr').each(function() {
        self.expObj["groups"][$(this).attr('class')] = {
          "gnumber": $(this).find('td.gNum').text(),
          "estTotal": $(this).find('td.totalEst').text(),
          "people": $(this).find('td.numPeople').text(),
          "split": $(this).find('td.perTotal').text()
        };
      });
      $('#main tbody tr:not(#del)').each(function() {
        var arr = [];
        $(this).find('td:not(.mname, .payout)').each(function() {
          if($(this).find('button').hasClass('btn-success')) {
            arr.push($(this).attr('class').match(/\d+/)[0]);
          }
        });
        self.expObj["main"][$(this).find('td.mname').text()] = {
          "total": $(this).find('td.payout').text(),
          "site": arr
        };
      });
      self.expObj["vals"]["real"] = ($('#vals tbody tr td.vReal').find('input').val()) ? $('#vals tbody tr td.vReal').find('input').val() : 0;
      console.log(self.expObj);
      $.post('/trackerUp', self.expObj, function(data) {
        console.log(data);
        alert("Saved");
        $('#export').addClass('disabled').prop('disabled', true);
      });
    },
    imp: function() {
      var self = this;
      var x = $('#tatest').val();
      console.log(x.length)
      if(x.length < 5) {
        alert("Please enter full id");
      }
      else {
        $.get('/trackerDown', {'iid': x}, function(data) {
          console.log(data[0]);
          var y = data[0];
          console.log(y);
          self.currg = y.currg;
          self.expObj = y;
          tmpl();
        });
      }
      function tmpl() {
        console.log('tmpl called');
        //self.expObj = $.parseJSON($('#impArea').val());
        ($('#delEntry').length > 0) ? $('#delEntry').remove() : null;
        $('<button id="delEntry" class="btn btn-danger">Delete</button>').appendTo($('#mainnav'));
        $('#delEntry').bind('click', function() {
          self.dele();
        });
        self.currg = self.expObj.currg;
        $('#iid').text(self.expObj.iid);
        $('*[class^="g"]:not(.gTotal, .gc)').remove();
        $('*[class^="m"]:not(.mname)').remove();
        $('*[class^="i"]').remove();
        $('#del').remove();

        //Templating
        $('td.vPer').text('percent');
        (self.expObj.realVal) ? $('td.vReal input').val(self.expObj.realVal) : $('td.vReal input').val('');
        for(var i = 0; i <= self.currg; i++) {
          $('#main').find('thead tr').append('<td class="i'+i+'"><p></p></td>');
          $('#main').find('tbody tr:not(#del)').each(function() {
            $('<td class="m'+i+'"><button type="button" class="btn"></button</td>').appendTo($(this));
          });
        }
        //#groups template
        $.each(self.expObj.groups, function() {
          var h = $(this)[0];
          $('#groups').find('tbody').append('<tr class="g'+h.gnumber+'"><td class="gNum">'+h.gnumber+'</td><td class="totalEst">'+h.estTotal+'</td><td class="numPeople">'+h.people+'</td><td class="perTotal">'+h.split+'</td></tr>');
          $('#main').find('thead tr td.i'+h.gnumber).find('p').text(h.estTotal);
        });
        //#main template
        $.each(self.expObj.main, function(key, val) {
          $('#main tbody tr').each(function() {
            if($(this).find('td.mname').text() === key) {
              var x = $(this);
              if(val.site) {
                $.each(val.site, function(k, v) {
                  x.find('td.m'+v).find('button').addClass('btn-success');
                });
              }
            }
          });
        });
        $('button:not(#import, #delEntry)').addClass('disabled').prop('disabled', true);
        for(var y = 0; y < self.currg; y++) {
          var boo = false;
          $('#main tbody tr').each(function() {
            if($(this).find('td.m'+y).find('button').hasClass('btn-success')) {
              boo = true;
            }
          });
          if(!boo) {
            $('td.m'+y).remove();
            $('td.i'+y).remove();
          }
        }
        self.countUpdate('m'+self.currg);
        for(var z = 0; z <= self.currg; z++) {
          self.countUpdate('m'+z);
        }
        self.calcs();
        console.log($('td.vReal input').val());
      }
    },
    dele: function() {
      var self = this;
      var x = $('#iid').text();
      $.get('/trackerDelete', {'iid': x}, function(data) {
        alert("Entry deleted");
        location.reload(true);
      });
    },
    ib: function() {
      var self = this;
      var num = this.currg;
      $('.i'+num).find('input').bind('keyup', function() {
        $('.g'+num).find('.totalEst').text($(this).val());
        self.countUpdate('m'+num);
      });
    },
    tbl: function() {
      var self = this;
      var num = this.currg;
      $('#main').find('thead tr').append('<td class="i'+num+'"><input type="text" class="form-control" /></td>');
      for(var i = 0; i < self.members.length; i++) {
        var tmpl = '<tr id="'+i+'"><td class="mname">'+self.members[i]+'</td><td class="payout">0</td><td class="m'+num+'"><button type="button" class="btn"></button</td></tr>';
        $(tmpl).appendTo($('#main').find('tbody'));
        btnBind("#"+i);
      }
      $('#main').find('tbody').append('<tr id="del"><td></td><td></td><td class="d'+num+'"><button type="button" class="btn btn-danger"></button></td></tr>');
      this.ib();
      function btnBind(i) {
        $(i).find('td').find('button').bind('click', function() {
          ($(this).hasClass('btn-success')) ? $(this).removeClass('btn-success') : $(this).addClass('btn-success');
          self.countUpdate($(this).parent().attr('class'));
        });
      }
      $('#groups').find('tbody').append('<tr class="g'+num+'"><td class="gNum">'+num+'</td><td class="totalEst">0</td><td class="numPeople">0</td><td class="perTotal">0</td></tr>');
      $('tr#del').find('td').bind('click', function() {
        self.del($(this).attr('class').match(/\d+/)[0]);
      });
    },
    extend: function() {
      var self = this;
      var num = this.currg;
      $('#main').find('tbody tr:not(#del)').each(function() {
        $('<td class="m'+num+'"><button type="button" class="btn"></button</td>').appendTo($(this));
      });
      $('tr#del').append('<td class="d'+num+'"><button type="button" class="btn btn-danger"></button></td>');
      $('td.d'+num).bind('click', function() {
        self.del($(this).attr('class').match(/\d+/)[0]);
      });
      $('#main').find('thead tr').append('<td class="i'+num+'"><input type="text" class="form-control" /></td>');
      $('#groups').find('tbody').append('<tr class="g'+num+'"><td class="gNum">'+num+'</td><td class="totalEst">0</td><td class="numPeople">0</td><td class="perTotal">0</td></tr>');
      function btnBind() {
        $('td.m'+num).each(function() {
          $(this).find('button').bind('click', function() {
            ($(this).hasClass('btn-success')) ? $(this).removeClass('btn-success') : $(this).addClass('btn-success');
            self.countUpdate($(this).parent().attr('class'));
          });
        });
      }
      this.ib();
      btnBind();
    },
    countUpdate: function(c) {
      var count = 0;
      var n = ".g"+c.match(/\d+/)[0];
      $('.'+c).each(function() {
        if($(this).find('button').hasClass('btn-success')) {
          count += 1;
        }
      });
      $(n).find('.numPeople').text(count);
      var pt = Math.round((parseInt($(n).find('.totalEst').text())/count)/1.1);
      $(n).find('.perTotal').text(($('.btn-success').length > 0) ? pt : 0);
      
      var te = 0;
      $('.totalEst').each(function() {
        te += parseInt($(this).text());
      });
      $('td.gTotal, #vals td.vEst').text(te);

      $('.'+c).each(function() {
        if($(this).find('button').hasClass('btn-success')) {
          $(this).data('mnum', pt);
        }
      });
      this.calcs();
    },
    calcs: function() {
      var te = $('#vals td.vEst').text();
      var vrv = $('.vReal').find('input').val();
      if(vrv) {
        $('#vals tr td.vcTax').text(Math.round(parseInt(vrv)*0.1));
        $('#vals tr td.vTotal').text(Math.round(parseInt(vrv)/1.1));
        var per = parseInt(vrv)/parseInt($('#vals td.vEst').text());
        $('#vals tr td.vPer').text(Math.round(per*100));
        $('.perTotal').each(function() {
          $(this).text(Math.round(((parseInt($(this).siblings('td.totalEst').text())/parseInt($(this).siblings('td.numPeople').text()))/1.1)*per));
        });
        $('#main tbody tr td[class^="m"]').each(function() {
          if($(this).find('button').hasClass('btn-success')) {
            $(this).data('mnum', (parseInt($('tr.g'+$(this).attr('class').match(/\d+/)[0]).find('.perTotal').text())))
          }
        });
      }
      else {
        $('#vals tr td.vcTax').text(Math.round(te*0.1));
        $('#vals tr td.vTotal').text(Math.round(te/1.1));
      }
      $('#main tbody tr').each(function() {
        var h = 0;
        $(this).find('td[class^="m"]').each(function() {
          if($(this).find('button').hasClass('btn-success')) {
            h += $(this).data('mnum');
          }
        });
        $(this).find('.payout').text(h);
      });
    },
    del:function(num) {
      var self = this;
      $('*[class$="'+num+'"]').remove();
      this.countUpdate('m'+self.currg);
    },
    keygen: function() {
      var a = [
          ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
          ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
          ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
          ["!", "@", "#", "$", "%", "^", "&", "*", "~", "?"]
      ];
      var r = function(n){return 0|Math.random()*n};
      var str = "";
      for(var i = 0; i < 5; i++) {
          var h = r(4);
          str += a[h][r(a[h].length)];
      }
      return str;
    }
  };
  track.init();

  $('#tatest').typeahead({
    prefetch: '/iid',
    limit: 15,
    template: [
      '<p class="ta-iid">{{value}}</p>',
      '<p class="ta-date">{{date}}</p>'
    ].join(''),
    engine: Hogan
  });
  $('#tatest').keydown(function (e) {
    if(e.keyCode == 13) {
      $('#import').trigger('click');
    }
  });
});