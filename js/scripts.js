function getAllCookies(){
	var cookieArray = [];
	chrome.cookies.getAll({}, function(all_cookies){
		for(var cookie in all_cookies){
			cookieArray[cookie] = (all_cookies[cookie]);
			//console.log(all_cookies[cookie].domain);
			//console.log(cookieArray.length);
		}
		/*The below loop creates and input checkbox with the id "cookie" + index
		of cookie. It then creates a label with a text node containing the cookie's
		domain. Each iteration appends a new checkbox with appropriate ID, followed
		by a relevant label, followed by a line break to the "presentCookieCheckList*/
		for(var i in cookieArray){

			var ele = document.createElement("input");
			ele.setAttribute('type','checkbox');
			ele.setAttribute('id',"cookie" + i);
			ele.setAttribute('value',i);

			var label = document.createElement("label");
			label.setAttribute('for',"cookie" + i);
			label.appendChild(document.createTextNode(cookieArray[i].domain));

			var lineBreak = document.createElement("br");

			document.getElementById("presentCookieCheckList").appendChild(ele);
			document.getElementById("presentCookieCheckList").appendChild(label);
			document.getElementById("presentCookieCheckList").appendChild(lineBreak);
		}
	});
	//document.getElementById("output1").innerHTML = cookieArray[3].domain;
	//return cookieArray;
}

getAllCookies();

function buildWhiteList(){
	console.log("buttonWorked");
}
//console.log("HEY!!" + getAllCookies()[1].domain);

//buildWhiteList();
























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
login.website.com is ever destroyed.*/