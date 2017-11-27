/*
* Tabs Plugin.
*/
;(function( $, CORE ) {
	
	var Tabs = function( elem, options ){
		
		var 
			module 	  = elem, 
			settings  = options,
			$tabs 	  = module.find( settings.tabs ),
			$tabPanes = module.find( settings.tabPanes );
		
	   /*
	    * Priviate methods.
	    */
		var _methods = {
			/*
			 * Initializde methods.
			 */
			init : function () {
				
				this.selectTab( 0 );
				this.setAnimation();
				module
					.addEvent( $tabs, "click", this.handler );
			},
			/*
			 * Set display animation if exist.
			 */
			setAnimation : function () {
				if( settings.animate && typeof settings.animate === "string" ) {
					module
						.addClass( settings.animate );
				}
				else{
					_methods.debug.warn( "No animation found" );
				}
			},
			/*
			 * Set which tab to diaplay..
			 */
			selectTab : function ( index ) {				
				$tabs
					.removeClass( "is-active" );
					
				$tabPanes
					.removeClass( "show" );
					
				$tabs.eq(index)
					.addClass( "is-active" );
					
				$tabPanes.eq(index)
					.addClass( "show" );				
			},
			/*
			 * Change tabs when click event occurs.
			 */
			handler : function (e) {
				ii = $tabs.index( this );
				_methods.selectTab( ii );
				e.preventDefault();
			},
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
			}//debug
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
				
				if( !isNaN( tabIndex ) ){
					
					if( tabIndex < $tabs.length ){
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
				 * 1. Unregister event listerners.
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
       
   };
	

   
$.fn.tabs = function( options ) {	
	/*
	 * Default setting.
	 */
	var 
		defaults = {
			animate  : 'scaleIn',
			tabs	 : '.tab-btns',
			tabPanes : '.tab-panes',
		}

	if(this.length > 0){		
		/*
		 * 1. Create core wrapper.
		 * 2. Merge options with defaults.
		 */
		var 
			$allModules = this;
			module 	    = CORE.create( this, jQuery ); /* 1 */
			settings    = $.extend( {}, defaults, options ); /* 2 */
	

		$allModules
			.each( function( ii ) {
			/*
			 * 1. Instantiate tabs.
			 * 2. Store plugin object in this element's data for public access.
			 */
			 
			var $this = $(this),
				plugin = new Tabs( module.eq(ii), settings ); /* 1 */
			

			$this
				.data( 'tabs', plugin ); /* 2 */
		 }); 
	}
}
})(jQuery, CORE);







