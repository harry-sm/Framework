/*
* Accordion Plugin.
*/


;(function($, CORE) {
	
	var Accordion = function ( elem, options ){
		
		var 
			module 	  = elem, 
			settings  = options,
			$tabs 	  = module.query( settings.tabs );

	   /*
	    * Priviate methods.
	    */
		var _methods = {
			/*
			 * Initializde methods.
			 */
			init: function () {
				this.selectTab( 0 );
				this.setAnimation();
				module.addEvent( $tabs, "click", this.handler );
			},
			/*
			* Set animation if exist.
			*/
			setAnimation : function () {
				if( settings.animate && typeof settings.animate === "string" ) {
					module.addClass( settings.animate );
				}
				else{
					_methods.debug.warn( "No animation found" );
				}
			},
			/*
			* Set which tab to diaplay.
			*/
			selectTab : function ( index ) {
				/*
				 * Check if tab has class is active.
				 */
				if( $tabs.eq(index).is(".is-active") ) {
					$tabs.eq(index).removeClass("is-active");
				}
				else {
					$tabs.removeClass("is-active");
					$tabs.eq(index).addClass("is-active");
				}
				
			},
			/*
			 * Change tabs when click event occurs.
			 */
			handler : function (e) {
				var ii = $tabs.index(this);
				_methods.selectTab(ii);
				e.preventDefault();
			},
			/*
			 * Debug helper to logs messages to console
			 */
			debug : {
				warn : function ( msg, elem ){
					if( settings.debug ) {
						console.warn (msg, elem );
					}
				},
				error : function ( msg, elem ) {
					if( settings.debug ) {
						console.error( msg, elem );
					}
				}
			}
		}
		
		_methods.init()
		
		/*
	     * Public methods.
	     */
		var exports = {
		   /*
			* Choose which tab to diaplay on initilzation.
			*/
			changeTab : function( tabIndex ) {
				
				if( !isNaN( tabIndex ) ) {
					
					if( tabIndex < $tabs.length ) {
						_methods.selectTab( tabIndex );
					}
					else{
						_methods.debug.error( "Tab index invalid" );
					}
				}else{
					_methods.debug.error("Tab index invalid not a number");
				}
			},
			destroy : function() {
				/*
				 * 1. Remove elements, unregister listerners.
				 * 2. Remove instance data.
				 */
				module.removeEvent( $tabs, "click", this.tabHandler ); /* 1 */
				module.removeData();/* 2 */
	   		},
			reInitilize : function() {
				_methods.init();
			}
		}
		
	   return exports;

	}//Accordion
$.fn.accordion = function( options ) {
	/*
	 * Default setting.
	 */
	var 
		defaults = {
			debug 	: true,
			animate : 'scaleIn',
			tabs 	: '.accordion-tab'
		}

	if( CORE.dom.exist( this ) ){
		/*
		 * 1. Create core wrapper.
		 * 2. Merge options with defaults.
		 */
		var 
			module 	 = CORE.create( this, jQuery ); /* 1 */
			settings = $.extend( {}, defaults, options ); /* 2 */	
		
		
		return this.each(function( index ){
			/*
			 * 1. Instantiate Accordion.
			 * 2. Store plugin object in this element's data for public access.
			 * 3. Return early if insance found.
			 */
			var $this = $(this);

			if( $this.data('myplugin') ) return; /* 3 */
			
			var plugin = new Accordion( module.eq( index ), settings );/* 1 */
			
			$this.data( 'accordion', plugin ); /* 2 */
		 }); 
	}
	else{ 
		CORE.debug.error( "Can not find", this.selector + " selector" );
	}
}
})(jQuery, CORE);


