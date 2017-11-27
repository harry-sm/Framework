// JavaScript Document


$(document).ready(function(e) {

	$("#js-side-menu").on("click" , function (){
			$(this).toggleClass("is-active");
			$("body").toggleClass("toggle-side-bar");
			});

	
	appUi.init();
    $("#show-grid").on("click" , function (){
		$(".overlay").toggleClass("show");
		});
});


var appUi = window.appUi || {};	

appUi.tiles = appUi.tiles || {};

appUi.tiles = (function (){
	var eventFired = null,
		titleIndex = null,
		$tileBlock = $(".tile-block"),
		$rowBlock = $(".row");
		
		
		
		
		
	var bindTile = function (){
		$(".tile-block").on("mousedown", function (e){
				var $tileBlock = $(this),
					height = $tileBlock.height(),
					width = $tileBlock.width(),
					Yhalf = Math.floor(height/2),
					Xhalf = Math.floor(width/2),
					x = e.pageX - $tileBlock.offset().left,
					y = e.pageY - $tileBlock.offset().top,
					ratioX = x/Xhalf,
					ratioY = y/Yhalf;
					calc(ratioY, ratioX, $tileBlock);
					
					bindRowBlock($tileBlock);

			})
		} 
	
	 var calc = function (ratioY, ratioX, elem){
		 //console.log(ratioY)
	 	if(ratioY < 1 && ratioX < 1){
			 if(ratioY <  ratioX)
			 	elem.addClass("tilt top");
			 else
			 	elem.addClass("tilt left");
		}else if(ratioY > 1 && ratioX < 1){
			if((ratioY-1) >  ratioX)
				elem.addClass("tilt left");
			else
				elem.addClass("tilt bottom");
		}else if(ratioY < 1 && ratioX > 1){
		    if(ratioY < (ratioX-1))
			  elem.addClass("tilt top");
		    else
			  elem.addClass("tilt right")
		}else if(ratioY > 1 && ratioX > 1){
		   if(ratioY <  ratioX)
			  elem.addClass("tilt right");
		   else
			  elem.addClass("tilt bottom")
			}//end if
	 }
	 
	 var bindRowBlock = function (elem){		 
		 var elemt;
		 var IE = navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i);
		 if (IE){
			 elemt= elem;
			 }else{				 
				 elemt = elem.parent($rowBlock);
				 }
		elemt.on("mouseup", function (e){
			elem.removeClass("tilt top left bottom right")
			});
		 
		 }	
	 
		return {
				init: function (){
					bindTile();
					
					},
				}
}());

appUi.init = function (){
	appUi.tiles.init();
}