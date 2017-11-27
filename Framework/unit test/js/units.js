
/*
 * validation rules test
 */

/*
 * Required by validation rules
 */

var validate = {
   pattern : function (value, pattern){
		   var regExp = new RegExp(pattern);
   return regExp.test(value);
   }
}

/*
 * Required by validation rules
 */
var dom = {
	query : function ( elem, context ){

		var 
			$elem,
			$context = $(document),
			
			selector = ( typeof elem === 'string' ) ?
						elem.charAt(0) :
						false;
						
		/*
		 * 1. Check if context exsist
		 * 2. Check if context has propery find
		 */
		if(context) { /* 1 */
			if(context.find) {/* 2 */
				$context = $(context)
			}
		}
		
		if( typeof selector === "string" ) {
			
			if( selector == '#' || selector == '.' ) {
				$elem = $context.find(elem);
				
				if( $elem.length > 0 ) {
					return $elem;
				}
			}//selector
			else{					
				$elem = $context.find("input[name="+elem+"]");
				if( $elem.length > 0 ) {
					return $elem;
				}
			}
		}
		else if(typeof selector !== "undefined") {
			$elem = $context.find(elem);
				
			if( $elem.length > 0 ) {
				return $elem;
			}
			console.log('Element: ['+ field +'] found');
		}
		else{
			console.log('Element: ['+ field +'] not found');
		}
		
		return $('<input/>');
	},//query
};//dom


/*
 * validation rules
 */
var rules = {
	  required : function ( value ) {
		  return !( value === undefined || value === '' );
	  },
	  checked : function (){
		  return $(this).is(':checked');
	  },
	  email : function (value){
		  var emailReg;
		  emailReg ="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", "i";

		  return validate.pattern(value, emailReg);	
	  },
	  url : function (value){
		  var
		  urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
		  return validate.pattern(value, urlReg);
	  },
	  numeric : function (value){
		  return !isNaN(value);
		  /*var 
			  digit = /^\d+$/;
		  return validate.pattern(value, digit);*/
	  },
	  alphaNumeric : function (value){
		  return validate.pattern(value, /^[a-z0-9]+$/i);
	  },
	  range : function (value, range) {
		  var 
			  ii,
			  arr = [];
			  
		  if(range){
			  arr = range.split(",");
			  for(ii in arr){
				  arr[ii] = parseInt(arr[ii])
			  }
		  }
  
		  if( value >= arr[0] && value <= arr[1]){
			  return true;
		  }
		  return false;
	  },
	  maxLength : function ( value , maxLength ){
		  return (value !== undefined) ?
		  (value.length <= parseInt(maxLength)) :
		  false;
	  },
	  minLength : function ( value, minLength ){
		  return (value !== undefined) ?
		  (value.length >= parseInt(minLength)) :
		  false;
	  },
	  length : function ( value, length ) {
		  return (value !== undefined) ?
		  (value.length == parseInt(length)) :
		  false;
	  },
	  atLeast : function (value, atLeast ){ 
		  //eg atleast[number of feilds, fieldname]
		  var 
			  count 	 = 0,
			  arr 	     = atLeast.split(","),
			  
			  field	     = $.trim(arr[1]),
			  atLeast	 = parseInt(arr[0]),
			  $allFields = dom.query(field.toString());
			  
		  for(var ii = 0; ii < $allFields.length; ii++){
			  value = $allFields.eq(ii).val();
			  
			  //count how many feilds are filled in
			  if(!( value === "undefined" || value == '' )){
				  count++;
			  }
		  }
		  //console.log("count :" + count);
	  
		  if(count >= atLeast) {
			  return true;
		  }
		  else {
			  return false;
		  }
	  },
	  has : function (value, hasValue){
		  return (value.search(hasValue) !== -1)
	  },
	  not : function (value, notValue) {
		return (value != notValue)
	  },
	  is : function (value, isValue){
		  return (value == isValue)
	  },
	  match : function (value, matchingField){
		  var 
			  matchingField = dom.query(matchingField),
			  matchingValue = matchingField.val();
			  
		  return (matchingValue !== undefined) ? 
		  ( value.toString() == matchingValue.toString() ) : 
		  false;
	  },
	  blackList: function (value, list){
		  var
			  ii,
			  arr = [];
			  
			  arr = list.split(",");
			  console.log(arr);
		  for(ii = 0; ii < arr.length; ii++){
			  console.log("val: " + value + " blc: " + arr[ii]);
			  if( value == $.trim(arr[ii]) ){
				  return false;
			  }
		  }
		  return true;
	  },
	  contains : function (_value, types){
		  var 
			  ii,
			  type,
			  value,
			  seperator,
			  isValid  = true,
			  typeList = types.split(","),
			  
			  matchType = {
				  numbers : _value.match(/\d/g),
				  chars	: _value.match(/[a-zA-Z]/g),
				  symbols : _value.match(/[^a-zA-Z0-9]/g),
			  };
		  
  
		  for( ii = 0; ii < typeList.length; ii++ ){
			  seperator = typeList[ii].indexOf(':');
			  type 	  = typeList[ii].slice(0, seperator).trim();
			  value 	  = parseInt(typeList[ii].slice(seperator+1));
			  
			  if(/\d/g.test(value) && matchType[type] === null){
				  isValid = false;
				  //debug
			  }
			  
			  if(matchType[type]){
				  if(matchType[type].length < value){
					  isValid = false;
				  }	
			  }else{
				  //debug
			  }
		  }
		  return isValid;
	  },	
  }//rules