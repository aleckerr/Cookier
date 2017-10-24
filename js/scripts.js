function getAllCookies(){
	var cookieArray = [];
	chrome.cookies.getAll({}, function(all_cookies){
		for(var cookie in all_cookies){
			cookieArray[cookie] = (all_cookies[cookie]);
			//console.log(all_cookies[cookie].domain);
			//console.log(cookieArray.length);
		}
		/*The below loop creates input checkboxes with the 'id' of each being the domain
		of the cookie followed buy "_num:" + index. Example: docs.google.com_num:1. The
		'value' of each checkbox is the full URL of the cookie. It then creates a label 
		with a text node containing the cookie's domain. Each iteration appends a new 
		checkbox with appropriate id/value, followed by a relevant label, followed by a 
		line break to the "presentCookieCheckList".

		Each checkbox element has an 'id' paramater set to the full url of the cookie*/
		for(var i in cookieArray){

			//checkbox
			var cookieURL = chrome.runtime.getURL(cookieArray[i].domain);
			var ele = document.createElement("input");
			ele.setAttribute('type','checkbox');
			ele.setAttribute('id',cookieArray[i].domain + "_num:"+i);
			ele.setAttribute('value',cookieURL);

			//label
			var label = document.createElement("label");
			label.setAttribute('for',cookieArray[i].domain + "_num:"+i);//finds cookie based on ID^
			label.appendChild(document.createTextNode(cookieArray[i].domain));//display the domain

			//linebreak
			var lineBreak = document.createElement("br");

			document.getElementById("presentCookieCheckList").appendChild(ele);
			document.getElementById("presentCookieCheckList").appendChild(label);
			document.getElementById("presentCookieCheckList").appendChild(lineBreak);
		}
	});
}
getAllCookies();



function resumeDestroy(){
	destroy();
	function destroy(){
		console.log("in destroy");
		chrome.cookies.getAll({}, function(cookies){
		for(var c in cookies){
			var URL = chrome.runtime.getURL(cookies[c].domain);
			console.log("in loop");
			if(!(whiteListArray.includes(URL))){
				console.log("Removing: " + URL);
				chrome.cookies.remove({"url": URL, "name":cookies[c].name});
			}
		}
		});
	}
	destructionVar = setInterval(destroy, 15 * 1000/*1 * 60 * 1000*/);//1 minute timer
}


document.addEventListener('DOMContentLoaded', function(){
	var button0 = document.getElementById('destroy');
	if(button0){//probably unnesecary 
		button0.addEventListener('click', resumeDestroy)
	}
});


function stopDestroy(){
	clearInterval(destructionVar);
}


document.addEventListener('DOMContentLoaded', function(){
	var button1 = document.getElementById('stopdestroy');
	if(button1){//probably unnesecary 
		button1.addEventListener('click', stopDestroy)
	}
});


var whiteListArray = [];
function buildWhiteList(){
	var selectedCookies = document.getElementById('cookieForm');
	for(var i = 0; i < selectedCookies.length; i++){
		var ele = document.getElementById(selectedCookies.elements[i].id);
		if(ele.checked){
			whiteListArray[i] = ele.value;
		}
	}
	console.log(whiteListArray);

	/*At this point in execution, I now have a white list containing the URLS
	of any cookie that the user does not want destroyed*/
}

document.addEventListener('DOMContentLoaded', function(){
	var button2 = document.getElementById('appendWhiteList');
	if(button2){//probably unnesecary 
		button2.addEventListener('click', buildWhiteList)
	}
});




/*The idea is to have a extension which constantly delets any cookie
which is not on the whitelist

The first issue is that in oder to create an effective whitelist, we must
fisrt generate some cookies

This could be mitigated by redirecting the user to a page where they can
proactively define what kinds of cookies they want to perserve such as
lastpass domains and google domains, but thats something for a later version

The way I will deal with the issue in this version is as follows. By default
every cookie will be allowed, and a button which controlls cookie desctruction
will be set to off. The user can then view cookies in a selection menu and 
check them if they wish them to be added to the whitelist. The user can then
activate cookie destruction which will run on a timer I suppose, destroying any
non whitelisted cookies. 

The user can, at anytime, diable cookie destruction. If they wish to add whitelisted
cookie they could disable destruction, generate the cookie by interacting with the
site (loging in or whatever), and whitelist the cookie. They can then resume destruction.

One potential issue I see is whitelisting specific cookies which will eventually
become irrevelvant. Idk if login cookies and such work like that, but when I'm actually
destroying cookies, I could base it off of domain so that, for example, nothing from
login.website.com is ever destroyed.

_____________________________1
Issue #1:
datamation.com left two identical cookies, how to remove?

Surveymonkey left 5 cookies. selecting 1 did nothing, selecting 2 added all 5 to my
white list. I'm noticing that the first 4 cookies are associated with a label which has
the ID of the 5th one.

Solution #1:
I now set each checkbox 'id' to also include a unique number, and se the checkbox
'value' to include the full URL. THIS WAY: some urls may be doubly added to the whitelist,
but no cookie will fail to be added. Additionally, since I don't group domains together,
if the cookies actually do happen to be different and the user wants to be very spefic, 
they cab do so.

I may need to change the white list to be populated with the non-index appended domain for 
better removal down the road
_______________________________1

_______________________________2

_______________________________2



*/