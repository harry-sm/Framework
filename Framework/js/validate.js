/*
* Validation Plugin.
*/

/*
 * # Reference
 * http://github.com/jlukic/semantic-ui/
 */


$(function ($){
	var core = {
		/*
		 * debug helper function outputs message to console.
		 */
		debug : {
			warn : function ( msg, elem ) {
				console.warn( msg, elem );
			},
			error : function ( msg, elem ) {
				console.error( msg, elem );
			}
		},
		
		dom : {
			exist : function ( jElem ){
				return ( jElem.length > 0 );
			},//exist
			query : function ( elem, context ){

				var 
					$elem,
					$context = $(document),
					
					selector = ( typeof elem === 'string' ) ?
								elem.charAt(0) :
								false;
								
				/*
				 * 1. Check if context exsist
				 * 2. Check if context instance of jQuery
				 */
				if(context) { /* 1 */
					
					if( context instanceof jQuery == false ) {/* 2 */
						$context = $(context);
						if( !core.dom.exist( $context ) ){
							core.debug.error('Context not found' );
						}
					}
					else{
						$context = context;
						if( !core.dom.exist( $context ) ){
							core.debug.error('Context not found' );
						}
					}	
					
				}// context
				
				if( typeof selector === "string" ) {
					/*
					 * Determin if selector type class or id.
				 	 */
					if( selector == '#' || selector == '.' ) {
						$elem = $context.find(elem);

						if( core.dom.exist( $elem ) ) {
							return $elem;
						}
						else{
							core.debug.error('Element: ['+ elem +'] not found');
						}
					}//selector
					else{	
						/*
						 * Defualt to selector type being name.
						 */
						$elem = $context.find("input[name="+elem+"]");
						if( core.dom.exist( $elem ) ) {
							return $elem;
						}
						else{
							core.debug.error('Element: ['+ elem +'] not found');
						}
					}
				}
				/*
				 * Default to jqusry object query
				 */
				else if(typeof selector !== "undefined") {
					$elem = $context.find(elem);
						
					if( core.dom.exist( $elem ) ) {
						return $elem;
					}
					else{
						/*
						 * Show selector name.
						 */
						var index = $elem.selector.indexOf(".f", 1);
						core.debug.error( 'Cant not find element: [', $elem.selector.slice( 0, index ) +"]" );
					}
				}
				else {
					core.debug.error('Element: ['+ elem +'] not found');
				}
				
				return $('<input/>');
			},//query
		}//dom
	}
	
$.fn.form = function(fields, options){
	
	var defaults = {
		classes 	 : {
			error    : 'error',
			success  : 'success',
			fieldErr : 'field-error',
		},
		  
		selectors   : {
			message : '.prompt-block',
			field   : '.field',
			group   : '.field-block',
			submit  : '.submit-btn',
		},
		
		debug	  : true,
		valid     : function() {},
		invalid   : function() {},
		success   : function() { return true; },
		failure   : function() { return false; },	
	}
	
	var
		$allModules = $(this),
	
		settings    = $.extend( true, {}, defaults, options ),
		validation  = $.extend( {}, $.fn.form.settings.prams, fields ),
		
		klass       = settings.classes,
		selector    = settings.selectors,
		nameSpace	= this.selector,
		exports		= {};
		
	$allModules
		.each(function() {	
		
		var
			$module    = core.dom.query( this, document),
			$field     = core.dom.query( selector.field, $module ),
			$group     = core.dom.query( selector.group, $module ),
			$submit    = core.dom.query( selector.submit, $module ),
			$message   = core.dom.query( selector.message, $module ),
			
			formErrors = [];

		var module = {
			
			init : function() {
				module.addEvents();
				module.instantiate();
			},
			/*
			 * Store instance in module data
			 */
			instantiate : function() {
				$module
					.data( "form", module.exports);
			},
			/*
			 * Bind event handler to dom elements
			 */
			addEvents: function() {
				$module
					.on('submit', module.validate.form);
				
				$field
					.on('blur', module.event.blur);
					
				$submit
					.on('click', module.event.submit);
					
				if($field.is('input:checkbox') || $field.is('input:radio')){
					$field
						.on('change', module.event.blur);
				}
				
			},
			/*
			 * Debug helper outputs message to console.
			 */
			debug : {				
				warn : function ( msg, elem ) {
					if( settings.debug ){
						console.warn( msg, elem );
					}
				},
				error : function ( msg, elem ) {
					if( settings.debug ){
						console.error( msg, elem );
					}
				}	
			},
			/*
			 * Error
			 */
			error:{
				/*
				 * Add error calss to field thats invalid.
				 */
				add : function(field) {
					var
						$fieldGroup = field.closest( $group );
					
					$fieldGroup
						.addClass(klass.fieldErr);
				},
				/*
				 * Remove error calss to field thats valid.
				 */
				remove : function(field) {
					
					var 
						$fieldGroup = field.closest( $group );

					$fieldGroup
						.removeClass(klass.fieldErr);
				},
				/*
				 * Insert error meaages into html document.
				 */
			   insert : function(errors) {
				  $(selector.message)
						.html( module.error.template(errors) );
				},
				/*
				 * Html template that formats errors.
				 */
				template : function(errors) {
					
					var
						val,
						html = '<ul class="list">' ;
						
					for(val in errors){
						html += '<li>' + errors[val] + '</li>';
					}
					html += '</ul>';

					return html;
				},
			},//errors
			/*
			 * Events handlers.
			 */
			event : {
				/*
				 * Triggers Submit for html elems that are not of type submit.
				 */
				submit : function() {
					$module
						.submit();
				},
				/*
				 * Blur handle when the blue event is triggered on field.
				 */
				 blur : function() {
					 /*
					  * 1. The field.
					  * 2. Get the rules that are related to that field.
					  * 3. Check if field has error and revalidate it.
					  */
					 var
						 $field = $(this), /* 1 */
						 rules = module.get.rules( $field ); /* 2 */
					 if( $field.closest( $group ).hasClass( klass.fieldErr ) ) { /* 3 */

						if(rules){
							module.validate.field( rules, $field );
						}
						else{
							module.debug.error("Rules not found")
						}
					 }
				 }
			},//event
			
			get : {
				/*
				 * Accepts field parameter and iterate ofver the validation array to find
				 * the matching field and get the rules relavant to that field.
				 */
				rules: function($field) {
					var
						field,
						rules,
						_field,
						index;

					for(field in validation){
						_field = core.dom.query(field, $module);
						for(index = 0; index < _field.length; index++){
							if( _field.eq(index)[0]  == $field[0] ){
								rules = validation[field];
								break;
							}
						}
					}	
					return rules || false;
				}
			},//get
			
			validate : {
				/*
				 * Test regular epresion pattern on values.
				 */
				pattern : function (value, pattern){
					var
						regExp = new RegExp(pattern);
					return regExp.test(value);
				},
				/*
				 * Interate over validation array and passes values to the field function.
				 * Check if the value the field function returns true of false and adds error
				 * class to form.
				 * Returns public functions success or faild.
				 */
				form : function () {
					var 
						formValid = true;
						
					/* Reset form errors*/
					formErrors = [];
					  
					for(var fields in validation){
						if(!module.validate.field(validation[fields], fields)){
							formValid = false;
						}
					}
					
					if(formValid) {
						$module
							.removeClass(klass.error)
							.addClass(klass.success);
						return $.proxy(settings.success, $module)(event);
					 
					}
					else {
						if( formErrors.length > 0 ) {
							module
								.error.insert(formErrors);
							$module
								.addClass(klass.error);
						}
						
					    return $.proxy(settings.failure, $module)(formErrors);
					}
				},
				/*
				 * Interate over validation array to get rules and passes rules
				 * to the rule function.
				 * Check if the value the rule function returns true of false and adds error
				 * class to that field.
				 * Adds error messages to formError array.
				 * Returns public functions valid and invalid specfic to fields.
				 */
				field : function (validation, fields){
					
					var 
						$field 	= core.dom.query(fields, $module),
						fieldValid = true,
						errorMsg   = [],
						rule;

					if( core.dom.exist($field) ){
						if(validation.rules !== undefined) {
							
							for(var val in validation.rules){							
								rule = module.validate.rule( $field , validation.rules[val] )
								
								if(typeof rule !== "undefined" ) {
									
									if(!rule){
										errorMsg.push(validation.rules[val].prompt)
										fieldValid = false;
									}
									
								}
								else{
									return false;
								}
							}//rules
							
						}	
					}
					else{
						module.debug.error("Can not find field:", $field.selector);
						return false;
					}
					
					formErrors = formErrors.concat(errorMsg);
	
					if(fieldValid) {			
						module.error.remove( $field );
						$.proxy(settings.valid, $field)();
					}
					else {
						module.error.add ($field );
						$.proxy(settings.invalid, $field)();
						return false;
					}
					return true;
				},
				/*
				 * Accepts rule type and test field value agains that rule. 
				 */
				rule : function (field, validation){
					/*
					 * 1. Matched text as the first item in arrray
					 *    and every other expression in paranthesis.
					 *
					 * 2. If bracket notation is used, pass in extra parameters. 
					 * 3. Find in type and replace with empty string.
					 */
					var 
						$field     = field,
						type       = validation.type,
						value      = $.trim($field .val() + ''),
			
						bracketReg = /\[(.*)\]/i,
						bracket    = bracketReg.exec(type), /* 1 */
												
						ruleType,
						condition,
						isValid;
					
					if(typeof bracket !== "undefined" && bracket !== null) { /* 2 */
						
						condition = bracket[1];
						ruleType  = type.replace(bracket[0], '');  /* 3 */
						
						if(typeof module.validate.rules[ruleType] !== "undefined") {
							isValid   = $.proxy(module.validate.rules[ruleType], $field )(value, condition);
						}
						else{
							module.debug.error("Rule "+ruleType+" does not exist");
							return;
						}
					}
					// normal notation
					else {
						if(typeof module.validate.rules[type] !== "undefined") {
							isValid = $.proxy(module.validate.rules[type], $field )(value);
						}
						else{
							module.debug.error("Rule "+ruleType+" does not exist");
							return;
						}
					}
					return  isValid;
				},
				/*
				 * Validation Rules.
				 */
				rules : {
					required : function ( value ) {
						return !( value === undefined || value === '' );
					},
					checked : function (){
						return $(this).is(':checked');
					},
					selected : function (val, field){
						/*
						 * has bug.
						 */
						var 
							index,
							$allFields = core.dom.query( field, $module );

						for( index = 0; index < $allFields.length; index++ ){
							if($allFields.eq(index).is(':checked')){
								return true;
							}
						}
						 
						return false;
					},
					
					email : function (value){
						
						emailReg = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", "i"
				
						return module.validate.pattern(value, emailReg);	
					},
					url : function (value){
						urlReg = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
						return module.validate.pattern(value, urlReg);
					},
					numeric : function (value){
						return !isNaN(value);
					},
					alphaNumeric : function (value){
						return module.validate.pattern(value, /^[a-z0-9]+$/i);
					},
					range : function (value, range) {
						//0, 1.7976931348623157E+10308
						var 
							ii,
							arr = [];
							
						if(range){
							arr = range.split(",");
							for(ii in arr){
								arr[ii] = parseInt(arr[ii])
							}
						}
				
						if( value >= arr[0] && value <= arr[1]) {
							return true;
						}
						return false;
					},
					maxLength : function ( value , maxLength ) {
						return (value !== undefined) ?
						(value.length <= parseInt(maxLength)) :
						false;
					},
					minLength : function ( value, minLength ) {
						return (value !== undefined) ?
						(value.length >= parseInt(minLength)) :
						false;
					},
					length : function ( value, length ) {
						return (value !== undefined) ?
						(value.length == parseInt(length)) :
						false;
					},
					atLeast : function (value, atLeast ) { 
						/*eg atleast[number of feilds, fieldname]*/
						var 
							count 	   = 0,
							arr 	   = atLeast.split(","),
							
							field	   = $.trim(arr[1]),
							atLeast	   = parseInt(arr[0]);
							$allFields = core.dom.query(field.toString());
							
						for(var ii = 0; ii < $allFields.length; ii++){
							value = $allFields.eq(ii).val();
							
							//count how many fields are filled in
							if(!( value === "undefined" || value == '' )){
								count++;
							}
						}
					
						if(count >= atLeast) {
							module.error.remove($allFields);
							return true;
						}
						else {
							module.error.add($allFields);
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
							matchingField = core.dom.query(matchingField),
							matchingValue = matchingField.val();
							
						return (matchingValue !== undefined || matchingValue !=='') ? 
						( value.toString() == matchingValue.toString() ) : 
						false;
					},
					blackList: function (value, list){
						var
							ii,
							arr = [];
							
							arr = list.split(",");
						for(ii = 0; ii < arr.length; ii++){

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
							}
							
							if(matchType[type]){
								if(matchType[type].length < value){
									isValid = false;

								}	
							}
							
						}
						return isValid;
					},	
				}//rules				
			},//validate
			/*
			 * Public functions
			 */
			exports  : {
				/*
				 *  Unregister event listerners.
				 *  Remove instance data.
				 */
				destroy : function () {
					$module
						.off('submit', module.validate.form);
						
					$field
						.off('blur', module.event.blur);
						
					$submit
						.off('click', module.event.submit);
						
					if($field.is('input:checkbox') || $field.is('input:radio')){
						$field
							.off('change', module.event.blur);
					}
					$module.removeData()
					
				},
				reInitilize : function() {
					module.init();
				},
				/*
				 * Allows user ato add custom validation rules
				 */
				addRule : function ( name, rule ){
					if( typeof name !== null || typeof name !== "undefined" ) {
						if( rule && typeof rule === "function" ) {
							module.validate.rules[name] = rule
						}
					}
						
				}
				
			}//exports
			
		}//module
		
		
		module.init();
		
		
	})//allModules
	

}//validate plugin


$.fn.form.settings = {
	
}


}(jQuery));
 
