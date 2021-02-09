$(document).ready(function () {
  $('input[name=name_last]').attr('placeholder', 'Фамилия');
  $('input[name=name_first]').attr('placeholder', 'Имя');
  $('input[name=phone]').attr('placeholder', 'Телефон');
  filter();
  validateForm();
});
function filter() {
  $('input[name="phone"]').on('keyup keypress', function (e) {
    if (e.keyCode == 8 || e.keyCode == 46) {
    }
    else {
      var letters = ' 1234567890()-+';
      return (letters.indexOf(String.fromCharCode(e.which)) != -1);
    }
  });
}
function validateForm() {
  $('.order-form').each(function () {
    $(this).validate({
      rules: {
        phone: 'customphone'
      }
    });
  });
}
$.validator.addMethod('customphone', function (value, element) {
  return this.optional(element) || /^([+]?[ 0-9-\(\)]{3,25})*$/i.test(value);
}, "Введите корректный телефон");