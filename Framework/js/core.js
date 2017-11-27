/*
* Core.
*/

CORE = {
	/*
	 * Debug helper to logs messages to console
	 */
	debug : {
		error : function (msg, elem) {
			console.error(msg, elem);
		}
	},
	dom : {
		/*
		 * Check if element exist inside dom.
		 */
		exist : function ( jElem ){
			return ( jElem.length > 0 );
		},//exist
		
		/*
		 * Query dom to find element.
		 * 1. Element selector.
		 * 2. Context/parent of element selector.
		 */
		query : function ( selector, /* 1 */ context /* 1 */){	
			var 
				jqElems;
		
			if( selector ){
				if( context ){

					/*
					 * Check if context is a jquery element.
					 * If it is use method find otherwire pass in jquery constructor
					 */
					jqElems = ( typeof context.find !=='undefined' && CORE.dom.exist(selector) ) ? 
							   context.find(selector) :
							   jQuery(context).find(selector);
					
					
					if( !CORE.dom.exist( jqElems ) ) {
						CORE.debug.error( "Element does not exist: ", jqElems.selector );
						return;
					}
					
				}//check context
				else{
					/*
					 * If Context dont exist query selector in dom.
					 */
					jqElems =  jQuery( selector );
					
					if( !CORE.dom.exist( jqElems ) ) {
						CORE.debug.error( "Element does not exist: ", jqElems.selector );
						return;
					}
				}
				
			return jqElems
			
			}
			else{
				CORE.debug.error( selector, "Not a valid selector" );
			}//check selector
		}//query
	},
	/*
	 * Query dom for selector and create Object of type CORE.
	 */
	create : function ( elem, jQuery ) {
		var MODULE = CORE.dom.query( elem, document );
        return CORE.wrap( MODULE );
	},//create
	/*
	 * Recreate Object of type CORE and give object access to methods.
	 */
	wrap:function( MODULE ){
		/*
		 * Save methods in object and expose them as public methods
		 */		
		var 
			exports = {};
			exports = MODULE;
		/*
		 * Query dom.
		 */
		exports.query = function ( elem ) {
			return CORE.dom.query( elem, MODULE );
		}
		/*
		 * Remove eventhandler from element in dom.
		 */
		exports.removeEvent = function ( elem, evt, fn ) {
			if( CORE.dom.exist( elem ) && typeof fn === 'function' && typeof evt === "string" ) {
				elem.unbind( evt, fn );
			}
			else{
				CORE.debug.error( "Please check RemoveEvent parameters" );
			}
		}//removeEvent
		
		/*
		 * Add eventhandler from element in dom.
		 */
		exports.addEvent = function ( elem, evt, fn ) {
			if( CORE.dom.exist( elem ) && typeof fn === 'function' && typeof evt === "string" ) {
				elem.bind( evt, fn );
			}
			else{
				CORE.debug.error( "Please check addEvent parameters" );
			}
		}//addEvent
		
		/*
		 * Reduce the set of matched elements to the one at the specified index
		 * and recrete object of type CORE.
		 */
		exports.eq = function ( e ) {
			return (e=+e, e===-1 ? 
					CORE.wrap( $(exports.slice(e)[0]) ) :
					CORE.wrap( $(exports.slice(e,e+1)[0]) )
			)//return
		}//eq

	return exports;
	}//wrap
}
