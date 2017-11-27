/*
* Modal Plugin.
*/
;(function($, CORE) {
	
	var Modal = function ( elem,  options, type, callback ) {
		
		var 
			module 	   = elem,
			settings   = options, 
			type 	   = type,
			callback   = callback,
			ok 		   = module.query( settings.ok ),
			modalClose = module.query( settings.close ),
			cancel;
		
	   /*
		* Add this setting if modal type is promt or confirm.
		*/
		if( type == 'confirm' || type == 'prompt' ) {
			cancel = module.query( settings.cancel )
		}
		
	   /*
	    * Private methods.
	    */
		var _methods = {
			init : function () {
				this.setAnimation();
				
				/*
				 * Add this setting if modal type is promt or confirm.
				 */
				if( type && typeof type === 'string' ) {
					
					if( type == 'alert' || type == 'confirm' || type == 'prompt' ) {
						
						this.modals[type].init();
						this.message();
						module
							.addEvent( modalClose, "click", this.hide );
						setTimeout(	this.show, 80 );
						
					}
					else{
						_methods.debug.error( "Modal type [" + type + "] invalid" );
					}
				}
				else{
					_methods.debug.error( "Modal type must be string" );
				}
			},
			/*
			 * Set display animation if exist.
			 */
			setAnimation : function () {
				if( settings.animate && typeof settings.animate === "string" ){
					module
						.addClass( settings.animate );
				}
				else{
					_methods.debug.warn( "No animation found" );
				}
			},
			/*
			 * Show modal.
			 */
			show : function () {
				module
					.addClass( "show-modal" );
			},
			/*
			 * Hide modal.
			 */
			hide : function () {
				module
					.removeClass( "show-modal" );				
			},
			/*
			 * Adds message to modal window.
			 */
			message : function () {
				if ( settings.message != null ) {
					
					var 
						modalBody = module.query( settings.body ),
						message = modalBody.find("p");
						
						if( CORE.dom.exist( message ) ){
							message.html( settings.message );
						}
						else{
							modalBody.html( settings.message );
						}
						
				}
				else{
					_methods.debug.warn("No message was found");
				}
			},
			
			/*
			 * Modal types.
			 */
			modals : {
				alert : {
					init : function () {
						module
							.addEvent( ok, "click", this.handler )	
					},
					handler : function () {
						_methods.hide();
						/*
						 * 1. Check if callback is present and function.
						 * 2. Reset callback to null after executed to clear from memory
						 */
						
						if( callback && typeof callback === 'function' ) { /* 1 */
							callback();
							callback = null; /* 2 */
						}
						return false;
					}
				},
				confirm : {
					init : function () {
						module
							.addEvent( ok, "click", this.handler )
						module
							.addEvent( cancel, "click", this.handler )
					},
					handler : function () {
						/*
						 * 1. Get modal button clicked classname.
						 * 2. Check if button chick is confirm or cancel.
						 * 3. Check if callback is present and function.
						 * 4. Passes bool value to callback for public access.
						 * 5. Reset callback to null after executed to clear from memory.
						 */
						
						var 
							classname = this.className, /* 1 */
							btn 	  = settings.ok.slice( 1 ),
							bool 	  = ( classname.indexOf( btn ) > -1 ); /* 2 */
							
						_methods.hide();
						

						if( callback && typeof callback === 'function' ) {/* 3 */
							callback( bool ); /* 4 */
							callback = null; /* 5 */
						}
						return false;
					}//handler	
				},
				prompt : {
					init : function () {
						module
							.addEvent( ok, "click", this.handler )
						module
							.addEvent( cancel, "click", this.handler )
					},
					
					/*
					 * 1. Get modal button clicked classname.
					 * 2. Check if button chick is confirm or cancel.
					 * 3. Check if bool value true then get the value of the input box.
					 * 4. Passes input box value to callback for public access.
					 * 5. Reset input box value to empty.
					 */
					handler : function () {
						var 
							val 	  = null,
							input	  = null,
							classname = this.className, /* 1 */
							btn 	  = settings.ok.slice( 1 ),
							bool 	  = ( classname.indexOf( btn ) > -1 ); /* 2 */
							
						
						if( bool ) {/* 3 */
							input = module.query( settings.input );
							val = input.val();
						}
						
						_methods.hide();
						
						if( callback && typeof callback === 'function' ) {
							callback( val ); /* 4 */
							callback = null;
							input.val("");/* 5 */
							
						}
						return false;
					}//handler
				}
			},//modal
			
			/*
			 * Debug helper to logs messages to console
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
			}
		}//methods

	_methods.init();
	
	/*
	 * Public methods.
	 */
	 var exports = {
			destroy : function() {
				/*
				 * 1. Remove elements, unregister listerners.
				 * 2. Remove instance data.
				 * 3. Reset;
				 */
				module
					.removeEvent( modalClose, "click", this.hide ); /* 1 */
				/*module
					.removeEvent( cancel, "click", this.hide );*/
				module
					.removeEvent( ok, "click", this.hide );
					
				module.removeData(); /* 2 */
				callback = settings  = elem = null; /* 3 */
	   		},
			reInitilize : function() {
				_methods.init();	
			}
		}
	
}
	
$.fn.modal = function( type, options, callback ) {
	/*
	 * Default setting.
	 */
	var defaults = {
		debug	: true,
		close 	: '.modal-close',
		animate : 'scaleIn',
		body	: '.modal-body',
		message : '',
		ok 		: '.ok'
	}// defaults
	
	
	/*
	 * Add this setting if modal type is promt or confirm.
	 */
	if ( type == 'confirm' || type == 'prompt' ) {
		defaults.cancel = '.cancel';
	}// defaults
	
	/*
	 * Add this setting if modal type is promt.
	 */
	if ( type == 'prompt' ) {
		defaults.input = '.prompt-input'
	}// defaults
	
	if( CORE.dom.exist( this ) ) {
		/*
		 * 1. Create core wrapper.
		 * 2. Merge options with defaults.
		 * 3. Check options if type is function make callback equal options
		 *    and options resets to defaultt settings
		 */
		var 
			$allModules = this;
			module   	= CORE.create(this, jQuery), /* 1 */
			settings 	= $.extend( {}, defaults, options ); /* 2 */
		
		if( options && typeof options ==='function' ) {/* 3 */
			callback = options; /* 3 */
			options  = defaults; /* 3 */
			}
		
		$allModules
			.each( function( ii ) {
			
			/*
			 * 1. Return if instance exist.
			 * 2. Instantiate modal.
			 * 3. Store plugin object in this element's data for public access.
			 */
			var $this = $(this),
				plugin;

			if($this.data('plugin')) /* 1 */
				return; 
			
			plugin = new Modal( CORE.wrap(module.eq( ii ) ), settings, type, callback ); /* 2 */
			
			$this
				.data( 'modal', plugin ); /* 3 */
		 }); 
	}
		
}


})(jQuery, CORE);





