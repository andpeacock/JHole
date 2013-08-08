$(document).ready(function() {
  var list = {
    init: function() {
      this.binding();
      this.addItemBinding();
    },
    binding: function() {
      var self = this;
      $('.person-tile').on('click', '.addItem', function() {
        self.addItem($(this));
      });
      $('.person-tile').on('click', '.boughtToggle', function() {
        ($(this).data('bought')) ? $(this).removeClass('btn-success').addClass('btn-default').data('bought', false) : $(this).removeClass('btn-default').addClass('btn-success').data('bought', true);
        if($(this).siblings('input.itemCost').val()) {
          //Check if it has a value and bought is true, need to then slide down menu to figure out buyer
        }
      });
    },
    addItemBinding: function() {
      var self = this;
      var p = $('.person-tile');
      p.on('click', '.submitItem', function() {
        var par = $(this).parent().parent('.person-tile');
        var tmpl = '<li data-new=true><span class="litem">'+$(this).siblings('.itemEnter').val()+'</span><span class="lnum">'+$(this).siblings('.numberEnter').val()+'</span></li>';
        var ultmpl = '<ul class="itemList list-unstyled"></ul>';
        (par.find('ul.itemList').length) ? $(tmpl).appendTo(par.find('ul.itemList')) : $(ultmpl).insertAfter(par.find('h3')).append(tmpl);
        $(this).siblings('.numberEnter, .itemEnter').val('');
      });
      p.on('click', '.update', function() {
        var par = $(this).parent('.person-tile');
        var x = {
          person: par.find('h3').text(),
          arr: []
        };
        par.find('ul.itemList li').each(function() {
          if($(this).data('new')) {
            x.arr.push({'item': $(this).find('.litem').text(), 'quantity': $(this).find('.lnum').text()});
            $(this).data('new', false);
            $(this).append('<input type="text" class="form-control itemCost" /><button type="button" class="btn btn-small btn-default boughtToggle" data-bought=false></button>');
            console.log($(this).data());
          }
        });
        console.log(x.arr);
        if(x.arr.length) {
          // $.post('/listUp', x, function(data) {
          //   console.log(data);
          // });
        }
        closeState(par);
      });
      p.on('click', '.cancel', function() {
        var par = $(this).parent('.person-tile');
        closeState(par);
      });
      function closeState(par) {
        var etmpl = '<button type="button" class="edit btn btn-small btn-warning">Edit<i class="icon-pencil icon-white"></i>';
        par.find('ul.itemList li').each(function() {
          if($(this).data('new')) {
            $(this).remove();
          }
        });
        if(!(par.find('ul.itemList li').length)) {
          par.find('ul.itemList').remove();
          etmpl = '<button type="button" class="addItem btn btn-small btn-success">Add Item</button>';
          par.append(etmpl);
        }
        else {
          par.append(etmpl);
        }
        par.removeClass('expanded').find('button.update, button.cancel, form.addItemMenu').remove();
      }
    },
    addItem: function(t) {
      /*
       * .submitItem
       * .update
       * .cancel
      */
      var self = this;
      var tpar = t.parent('.person-tile');
      ($(tpar).find('.addItemMenu').length > 0) ? $(tpar).find('.addItemMenu').remove() : null; //Checks if addItemMenu exists, if it does, remove, if not, do nothing
      tpar.addClass('expanded');
      var tmpl = '<form class="form-inline addItemMenu"><input type="text" class="form-control itemEnter" placeholder="Item"><input type="number" class="form-control numberEnter" placeholder="Number"><button type="button" class="btn btn-success submitItem">+</button></form>';
      tmpl += '<button type="button" class="update btn btn-small btn-primary">Update</button><button type="button" class="cancel btn btn-small btn-danger">Cancel</button>';
      $(tmpl).insertAfter(t.siblings('h3'));
      //self.addItemBinding(tpar);
      t.remove();
    }
  };
  list.init();
});