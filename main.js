document.addEventListener('DOMContentLoaded', function() {
  replaceLinks();
});

function replaceLinks(){
	var links = document.querySelectorAll('a');
	
	for (i=0; i<links.length; i++){
		var link = links[i];
		link.addEventListener("click",replacePage, false);
	}
	
}

function replacePage(){
	event.preventDefault();
	var href= this.href;
	
	var ajax = new XMLHttpRequest();
	ajax.open("GET",href,true);
	ajax.send();

	ajax.onreadystatechange=function(){
		if(ajax.readyState==4 && (ajax.status==200)){
			var body = document.querySelector('body');
			var bodyContent =  grabBody(ajax.responseText, "body");

			body.addEventListener( 'webkitTransitionEnd', moveToRight, false);
			body.style.left = "-100%";
			window.addEventListener("popstate", handleBackButton);

			function moveToRight(event){
				var body = document.querySelector('body');
				body.removeEventListener( 'webkitTransitionEnd', moveToRight, false);
				body.addEventListener( 'webkitTransitionEnd', returnToCenter, false);
				body.style.opacity = 0;
				body.style.left = "100%"
			}

			function returnToCenter(event){
				var body = document.querySelector('body');
				body.removeEventListener( 'webkitTransitionEnd', returnToCenter, false);
				body.innerHTML = bodyContent;
				history.pushState(null, null, href);
				body.style.opacity = 1;
				body.style.left = 0;
				replaceLinks();
			}

			function handleBackButton(e) {

		   		var ajaxBack = new XMLHttpRequest();
				ajaxBack.open("GET",location.pathname,true);
				ajaxBack.send();

				ajaxBack.onreadystatechange=function(){
					var bodyBack = document.querySelector('body');
					var bodyBackContent =  grabBody(ajaxBack.responseText, "body");
					bodyBack.addEventListener( 'webkitTransitionEnd', moveToLeft, false);
					bodyBack.style.left = "100%";

					function backToCenter(event){
						var body = document.querySelector('body');
						body.removeEventListener( 'webkitTransitionEnd', backToCenter, false);
						body.innerHTML = bodyBackContent;
						body.style.opacity = 1;
						body.style.left = 0;
						replaceLinks();
					}

					function moveToLeft(event){
						var body = document.querySelector('body');
						body.removeEventListener( 'webkitTransitionEnd', moveToLeft, false);
						body.addEventListener( 'webkitTransitionEnd', backToCenter, false);
						body.style.opacity = 0;
						body.style.left = "-100%"
					}
				}
			}
		}
	}		
}

function grabBody(html){
	var tagStart = html.indexOf("<body");
	var start = html.indexOf(">", tagStart) + 1;
	var end = html.indexOf("</body", start);
	return html.slice(start, end);
}