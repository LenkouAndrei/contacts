function Hash(){
	var self = this;
	var newRep = [];

	self.getData = function(){
		if($('#table').attr('data-present')){
			var num  = numCheck();

				for(prop in localStorage){

					if(newRep.indexOf(prop) == -1){

						var $tr = $('<tr/>');
						$('<td/>').text(num).addClass('position').appendTo($tr);
						var obj = JSON.parse(localStorage[prop]);

						for(prop in obj){
							$('<td/>').text(obj[prop]).appendTo($tr);
						};//окончние цикла for

					$('<td/>').text('remove').addClass('remove').appendTo($tr);
					$($tr).appendTo('#table');
					num++;
					
					};//окончание if
				};//окончание цикла
			
			$('#table').attr({'data-present':""});
		}else{
			alert('значения из хранилища уже были перенесены, второй раз их добавить нельзя!');
		}
	};// окончание метода getData

	self.clear = function(){
		$('input:not(.info_button)').val('');
		$('#err1').text('');
		$('#err2').text('');
		$('#err3').text('');
	};//окончание метода clear

	self.newString = function(){
		var $tr = $('<tr/>');
		var numb = numCheck();
		$('<td/>').text(numb).addClass('position').appendTo($tr);

		var arr = $('input:not(.info_button)');

		for(var i = 0; i < arr.length; i++){
			$('<td/>').text(arr[i].value).appendTo($tr);
		};//окончание цикла for

		$('<td/>').text('remove').addClass('remove').appendTo($tr);
		$($tr).appendTo('#table');

		return {
			lsString: {
				name: arr[0].value,
				email: arr[1].value,
				phone: arr[2].value
			},
			lSKey: arr[2].value
		};
	};//окончание метода newString

	self.remove = function(){//v - td с текстом remove из таблицы
		var deleted = $('.target td:nth-child(4)').text();
		findRemovable(deleted);
		$('.target').empty();
		numerate();
		localStorage.removeItem(deleted);
		console.log(newRep);
		//вспомогательный цикл для себя
		for(prop in localStorage){
			console.log('Ключ: ' + prop + '; значение: ' + localStorage[prop]);
		};
	};//окончание метода remove

	self.validate = function(str){
		var OK = isvalide(str);
		if(OK && str == null) {
			var obj = self.newString();
			newRep.push(obj.lSKey);
			var ad = JSON.stringify(obj.lsString);
			localStorage.setItem(obj.lSKey,ad);
		}
	};

	function isvalide(fieldName){
	  var OK = true;

	  if( (fieldName == 'name') || (fieldName == null) ) {
	    var $str = $('#name').val();
	    var nameReg = /^[а-яА-ЯёЁa-zA-Z]+$/;
	    if(!nameReg.test($str)){
	      $('#err1').text('Должны быть только буквы');
	      if( OK && (fieldName == null) ) OK = false;
	    }
	    else{
	      $('#err1').text('');
	    }
	  };

	  if( (fieldName == 'phone') || (fieldName == null) ){
	    var $str = $('#phone').val();
	    var nameReg = /^([+]{1}375[0-9]{9}|8017[0-9]{7})+$/;
	    if(!nameReg.test($str)) {
	      $('#err2').text('номер телефона должен быть в формате +375ZZXXXYYYY или 8017XXXYYYY');
	      if( OK && (fieldName == null) ) OK = false;
	    }
	    else if((fieldName == null) && inHash('phone', $str)){
	    	$('#err2').text('Такой телефон уже есть в базе');
	    	if( OK && (fieldName == null) ) OK = false;
	    }
	    else{
	      $('#err2').text('');
	    }
	  };

	  if( (fieldName == 'email') || (fieldName == null) ){
	    var $str = $('#email').val();
	    var nameReg = /.+@.+\..+/i;
	    if(!nameReg.test($str)) {
	      $('#err3').text('Email должен соответствовать формату RFC-822');
	      if( OK && (fieldName == null) ) OK = false;
	    }
	    else if((fieldName == null) && inHash('email', $str)){
	    	$('#err3').text('Такой email уже есть в базе');
	    	if( OK && (fieldName == null) ) OK = false;
	    }
	    else{
	      $('#err3').text('');
	    }
	  };

	  return OK;
	};

	function inHash(str, value){
		var isInHash = false;
		for(var i = 0; i<newRep.length; i++){
			if(newRep[i][str] == value){
				isInHash = true;
				break;
			};//окончание условия
		};//окончание цикла
		return isInHash;
	};

	function findRemovable(a){//а - значение из поля phone таблицы
		for(var i = 0; i<newRep.length; i++){
			if(newRep[i] == a){
				newRep.splice(i,1);
				break;
			};//окончание условия
		};//окончание цикла
	};//окончание функции findRemovable

	function numerate(){
		var posit = $('.position');
		var numEl = 1;
		for(var i = 0; i < posit.length; i++){
			posit[i].innerText = numEl;
			numEl++;
		};//окончание цикла
	};//окончание ф-ции numerate

	function numCheck(){
			var pos  = $('#table tr:last-child td:first-child').text() || 0;
			pos++;
			return pos;
	}
};

console.log(localStorage.length);

var formFunc = new Hash;

$('#gData').click(function(){
  formFunc.getData();
});

$('#cLEAR').click(function(){
  formFunc.clear();
});

$('#addit').click(function(){
  formFunc.validate(null);
});

$('#table').on('click', '.remove', function(e){
	e.preventDefault();
	$(this).parent()[0].classList.add('target');
	formFunc.remove();
});//окончание события on

$('#name').blur(function(){
  formFunc.validate('name');
});

$('#phone').blur(function(){
  formFunc.validate('phone');
});

$('#email').blur(function(){
  formFunc.validate('email');
});