$(document).ready(function() {
  var history = {
    currg: 0,
    expObj: {},
    init: function() {
      this.binding();
      this.ivals();
    },
    ivals: function() {
      var te = 0;
      $('#payouts tbody tr').each(function(i) {
        //Calculates total estimated total
        if($(this).find('td.paid').data('paid') !== true && $(this).find('td.paid').data('excl') !== true) {
          te += parseInt($(this).find('td.estTotal').text());
        }
      });
      this.perc();
      $('#inpControl td.globalTotal').text(te);
    },
    binding: function() {
      var self = this;
      $('div.gc').on('click', 'button.updt', self.updt);
      $('div.gc').on('click', 'button.loot-paid', function() {
        $(this).removeClass('btn-default').addClass('btn-success').siblings('button').removeClass('btn-danger btn-warning').addClass('btn-default');
        $(this).parent().data('paid', true).data('excl', false);
        $(this).parent().parent().attr('class', 'success');
        self.ivals();
      });
      $('div.gc').on('click', 'button.not-paid', function() {
        $(this).removeClass('btn-default').addClass('btn-danger').siblings('button').removeClass('btn-success btn-warning').addClass('btn-default');
        $(this).parent().data('paid', false).data('excl', false);
        $(this).parent().parent().attr('class', '');
        self.ivals();
      });
      $('div.gc').on('click', 'button.loot-excl', function() {
        $(this).removeClass('btn-default').addClass('btn-warning').siblings('button').removeClass('btn-danger btn-success').addClass('btn-default');
        $(this).parent().data('paid', false).data('excl', true);
        $(this).parent().parent().attr('class', 'warning');
        self.ivals();
      });
      $('input#totalRVal').on('keyup', self.totalPer);
      // $('td.imp').find('button.import').bind('click', function() {
      //   self.imp($(this));
      // });
      $('div.gc').on('click', 'td.imp button.import', function() {
        self.imp($(this));
      });
      $('#trackerStart').on('click', function() {
        self.iniTmpl();
        return false;
      });
    },
    totalPer: function() {
      var per = parseInt($(this).val()) / parseInt($(this).parent().siblings('.globalTotal').text());
      $(this).parent().siblings('.globalPer').text(Math.round(per*100));
      console.log(per);
      //realVal / estVal
      $('#payouts tbody tr').each(function(i) {
        if($(this).find('td.paid').data('paid') !== true && $(this).find('td.paid').data('excl') !== true) {
          $(this).find('td.ftotal').text(Math.round((parseInt($(this).find('td.estTotal').text()) * per)));
          $(this).find('td.perc').text(Math.round((parseInt($(this).find('td.ftotal').text()) / parseInt($(this).find('td.estTotal').text()))*100));
        }
        else {

        }
      });
    },
    perc: function() {
      var ft = 0;
      //Calculates percent if a final value exists
      $('#payouts tbody tr').each(function(i) {
        ft = parseInt($(this).find('td.ftotal').text());
        if(ft) {
          $(this).find('td.perc').text(Math.round((ft/parseInt($(this).find('td.estTotal').text()))*100));
        }
      });
    },
    updt: function() {
      //Send:
      // - iid
      // - paid
      // - realVal
      // - excl
      var self = this;
      var par = $(this).parent();
      var x = {
        'iid': par.siblings('td.iid').text(),
        'paid': par.siblings('td.paid').data('paid'),
        'realVal': par.siblings('td.ftotal').text(),
        'excl': par.siblings('td.paid').data('excl')
      };
      $.post('/historyUpdate', x, function(data) {
        // This line subtracts value of updated row from total real value
        (par.siblings('td.paid').data('paid')) ? ($('#totalRVal').val()) ? $('#totalRVal').val(parseInt((parseInt($('#totalRVal').val()) - parseInt(par.siblings('td.ftotal').text())))) : null : null;
        // Gets new table and renders it to body, then triggers recalculation
        $.get('/historyTable', function(data) {
          $('#payouts tbody').empty().append(data);
          $('input#totalRVal').trigger('keyup');
        });
      });
    },
    iniTmpl: function() {
      var self = this;
      var num = this.currg;
      ($('#hload').length) ? $('#hload').remove() : null;
      function mtbl() {
        $('#main tbody tr:not(#del)').each(function() {
          btnBind("#"+$(this).attr('id'));
        })
      }
      function btnBind(i) {
        $(i).find('td').find('button').bind('click', function() {
          ($(this).hasClass('btn-success')) ? $(this).removeClass('btn-success') : $(this).addClass('btn-success');
          self.countUpdate($(this).parent().attr('class'));
        });
      }
      function ib() {
        var num = self.currg;
        $('.i'+num).find('input').bind('keyup', function() {
          $('.g'+num).find('.totalEst').text($(this).val());
          self.countUpdate('m'+num);
        });
      }
      function del(num, self) {
        $('*[class$="'+num+'"]').remove();
        self.countUpdate('m'+self.currg);
      }
      function keygen() {
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
      function ext (self) {
        var num = self.currg;
        $('#main').find('tbody tr:not(#del)').each(function() {
          $('<td class="m'+num+'"><button type="button" class="btn"></button</td>').appendTo($(this));
        });
        $('tr#del').append('<td class="d'+num+'"><button type="button" class="btn btn-danger"></button></td>');
        $('td.d'+num).bind('click', function() {
          del($(this).attr('class').match(/\d+/)[0], self);
        });
        $('#main').find('thead tr').append('<td class="i'+num+'"><input type="text" class="form-control" /></td>');
        $('#groups').find('tbody').append('<tr class="g'+num+'"><td class="gNum">'+num+'</td><td class="totalEst">0</td><td class="numPeople">0</td><td class="perTotal">0</td></tr>');
        function extbtnBind() {
          $('td.m'+num).each(function() {
            $(this).find('button').bind('click', function() {
              ($(this).hasClass('btn-success')) ? $(this).removeClass('btn-success') : $(this).addClass('btn-success');
              self.countUpdate($(this).parent().attr('class'));
            });
          });
        }
        ib();
        extbtnBind();
      }
      function bindings () {
        $('tr#del').find('td').bind('click', function() {
          console.log(self);
          del(($(this).attr('class').match(/\d+/)[0]), self);
        });
        $('.vReal').find('input').bind('keyup', function() {
          self.countUpdate('m'+self.currg);
        });
        $('#chl').bind('click', function() {
          $(this).parent().parent().slideUp(function() {
            $(this).remove();
          });
        });
        $('#addm').bind('click', function() {
          self.currg += 1;
          ext(self);
        });
        $('#export').bind('click', function() {
          var expObj = {
            "iid": null,
            "currg": null,
            "groups": {},
            "main": {},
            "vals": {}
          };
          var h = $(this);
          expObj["iid"] = $('#iid').text();
          expObj["currg"] = parseInt(self.currg);
          $('#groups tbody tr').each(function() {
            expObj["groups"][$(this).attr('class')] = {
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
            expObj["main"][$(this).find('td.mname').text()] = {
              "total": $(this).find('td.payout').text(),
              "site": arr
            };
          });
          expObj["vals"]["real"] = ($('#vals tbody tr td.vReal').find('input').val()) ? $('#vals tbody tr td.vReal').find('input').val() : 0;
          $.post('/trackerUp', expObj, function(data) {
            h.prop('disabled', true);
            $.get('/historyTable', function(data) {
              $('#payouts tbody').empty().append(data);
              self.countUpdate('m'+expObj.currg);
              for(var z = 0; z <= expObj.currg; z++) {
                self.countUpdate('m'+z);
              }
              self.calcs();
              h.parent().parent().slideUp(function() {
                h.remove();
              });
            });
          });
        });
      }
      $.get('/trackerTable', function(data) {
        $(data).appendTo($('.container'));
        $('#hload').slideDown();
        mtbl();
        ib();
        $('#iid').text(keygen());
        bindings();
      });
    },
    imp: function(t) {
      console.log("imp called");
      var self = this;
      var x = t.parent().siblings('td.iid').text();
      console.log(x.length)
      if(x.length < 5) {
        alert("Please enter full id");
      }
      else {
        $.get('/trackerDown', {'iid': x}, function(data) {
          var y = data[0];
          //self.currg = y.currg;
          console.log(y);
          self.expObj = y;
          tmpl();
        });
      }
      function tmpl() {
        //START INITMPL
        ($('#hload').length) ? $('#hload').remove() : null;
        var par = t.parent(); //td
        var ptr = par.parent(); //tr
        var rr = '<div id="hload"><h1 id="iid">'+x+'</h1><button id="chl" class="btn btn-danger">Close</button><button id="delEntry" class="btn btn-danger">Delete Entry</button><div class="loadGroups"></div><div class="loadVals"></div><div class="loadMain"></div></div>';

        $(rr).appendTo($('.container'));
        //$('tr.loadCont').text("testing");
        var gtmpl = '<table id="groups" class="table table-condensed"><thead><tr><td>Group Number</td><td>Total Estimate</td><td>Number of People</td><td>Split Per</td></tr></thead><tbody></tbody></table>';
        var mtmpl = '<table id="main" class="table table-striped table-hover table-bordered table-condensed"><thead><tr><td>Name</td><td class="gTotal">0</td></tr></thead><tbody></tbody></table>';
        function mtbl() {
          var members = ["Ageudum", "Akrim Stenra",  "Andrew Jester", "Brutus King", "Cardavet", "Joe Poopy", "Lilum Biggum", "Melliflous Hyperion", "Nova Kairas", "Schaeffer Gaunt", "Silas Mieyli", "Simmons Hakoke", "Sinya Todako", "Tennigan Haldeye", "Yuri Lebbie","Zencron en Thelles", "807Y6DI897TU"];
          for(var i = 0; i < members.length; i++) {
            var tmpl = '<tr id="'+i+'"><td class="mname">'+members[i]+'</td><td class="payout">0</td></tr>';
            $(tmpl).appendTo($('#main').find('tbody'));
          }
        }
        var vtmpl = '<table id="vals" class="table table-condensed"><thead><tr><td>Real Value of Loot</td><td>Estimated Value</td><td>% of Estimated</td><td>Total Cut</td><td>Total After Cut</td></tr></thead><tbody><tr><td class="vReal"><input type="text" class="form-control" /></td><td class="vEst">0</td><td class="vPer">percent</td><td class="vcTax">0</td><td class="vTotal">0</td></tr></tbody></table>';
        $('.loadGroups').append(gtmpl);
        $('.loadMain').append(mtmpl);
        $('.loadVals').append(vtmpl);
        //END INITMPL

        $('.vReal').find('input').bind('keyup', function() {
          self.countUpdate('m'+self.currg);
        });

        $('#hload').slideDown();
        mtbl();
        
        $('#chl').bind('click', function() {
          $(this).parent().slideUp(function() {
            $(this).remove();
          });
        });
        $('#delEntry').bind('click', function() {
          var x = $('#iid').text();
          var h = $(this);
          $.get('/trackerDelete', {'iid': x}, function(data) {
            $.get('/historyTable', function(data) {
              console.log(data);
              $('#payouts tbody').empty().append(data);
              h.parent().slideUp(function() {
                h.remove();
              });
            });
          });
        });

        var pft = parseInt(par.siblings('td.ftotal').text());
        if(pft) {
          $('.vReal').html(pft);
        }
        
        for(var i = 0; i <= self.expObj.currg; i++) {
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
        for(var y = 0; y < self.expObj.currg; y++) {
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
        self.countUpdate('m'+self.expObj.currg);
        for(var z = 0; z <= self.expObj.currg; z++) {
          self.countUpdate('m'+z);
        }
        self.calcs();
        $('#main tbody tr').each(function() {
          if(!parseInt($(this).find('td.payout').text())) {
            $(this).remove();
          }
        });
      }
    },
    countUpdate: function(c) {
      var self = this;
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
      self.calcs();
    },
    calcs: function() {
      var te = $('#vals td.vEst').text();
      var vrv = 0;
      if($('.vReal input').length > 0) {
        vrv = $('.vReal').find('input').val();
      }
      else {
        vrv = parseInt($('.vReal').text());
      }
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
    }
  };
  history.init();
});