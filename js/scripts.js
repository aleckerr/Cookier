//function to display the active cookie list
var addedDomains = [];
function activeCookieList(){
	var cookieArray = [];
	chrome.cookies.getAll({}, function(all_cookies){
		for(var cookie in all_cookies){
			cookieArray[cookie] = (all_cookies[cookie]);
			//console.log(all_cookies[cookie].domain);
			//console.log(cookieArray.length);
		}
		/*The below loop creates input checkboxes with the 'id' of each being the domain
		of the cookie followed buy "_num:" + index. Example: docs.google.com_num:1. The
		'name' of each checkbox is the domain of the cookie. It then creates a label 
		with a text node containing the cookie's domain. Each iteration appends a new 
		checkbox with appropriate id/name, followed by a relevant label, followed by a 
		line break to the "presentCookieCheckList".

		There is a boolean check in the loop such that no no domain is added twice and
		no cookie in the whitelist is displayed in the cookies list. Using both the ID
		and name is unnescary, but it may come in handy if I ever need to get more
		specific with the cookies.

		The value of the each checkbox is either "" or "s" depending on if the cookie
		uses http or https.
		*/
		//var addedDomains = [];
		var list = document.getElementById("presentCookieCheckList");

		for(var i in cookieArray){
			if(!(addedDomains.includes(cookieArray[i].domain)) &&
			 !(whiteListArray.includes(cookieArray[i].domain))){
				//checkbox
				//var cookieURL = chrome.runtime.getURL(cookieArray[i].domain);
				var ele = document.createElement("input");
				ele.setAttribute('type','checkbox');
				ele.setAttribute('id',cookieArray[i].domain);
				ele.setAttribute('name',cookieArray[i].domain);
				ele.setAttribute('value',(cookieArray[i].secure ? "s" : ""));//http or https

				//label
				var label = document.createElement("label");
				label.setAttribute('for',cookieArray[i].domain);//finds cookie based on ID^
				label.setAttribute('id',cookieArray[i].domain + "label");
				label.appendChild(document.createTextNode(cookieArray[i].domain));//display the domain

				//linebreak
				var span = document.createElement("span");
				span.setAttribute('id',cookieArray[i].domain + 'span');
				var lineBreak = document.createElement("br");
				span.appendChild(lineBreak);

				// list.appendChild(ele);
				// list.appendChild(label);
				// list.appendChild(span);
				////////////////////////
				list.appendChild(span);
				span.appendChild(ele);
				span.appendChild(label);

				addedDomains.push(cookieArray[i].domain);
			}
		}
	});
}
activeCookieList();

/***********************Refresh******************************/

function refreshCookieList(){
	var list = document.getElementById("presentCookieCheckList");
	var checkBoxes = document.getElementById('cookieForm');

	console.log("length:"+ checkBoxes.elements.length);
	for(var i = 0; i < checkBoxes.elements.length; i++){
		//var label = document.getElementById(checkBoxes.elements[i].id + "label");
		var span = document.getElementById(checkBoxes.elements[i].id + "span");
		var domain = document.getElementById(checkBoxes.elements[i].name);/*domain*/
		//var checkBox = document.getElementById(checkBoxes.element[i].id);
		//console.log("removing this box: "+domain.id);
		//label.parentNode.removeChild(label);
		span.parentNode.removeChild(span);
		//list.removeChild(checkBox);
		//list.removeChild(label);
		//console.log("addedDomains before:" + addedDomains);
		addedDomains.splice(addedDomains.indexOf(domain), 1);
		//console.log("addedDomains after:" + addedDomains);

	}
	//activeCookieList();
}

document.addEventListener('DOMContentLoaded', function(){
	var button5 = document.getElementById('refreshCookieList');
	if(button5){//probably unnesecary 
		button5.addEventListener('click', refreshCookieList)
	}
});
/***********************************************************/

/**********************white list handlers *******************************/
var whiteListArray = [];
function buildWhiteList(){
	var checkBoxes = document.getElementById('cookieForm');
	for(var i = 0; i < checkBoxes.length; i++){
		var check = document.getElementById(checkBoxes.elements[i].id);
		if(check.checked && !(whiteListArray.includes(check.name))){
			whiteListArray.push(check.name);//domain
			console.log("http" + check.value + "://" /*+"*"*/+ check.name + "/" +"*");
			chrome.contentSettings.cookies.set({primaryPattern: 
				"http" + check.value + "://" /*+"*"*/+ check.name + "/" + "*", 
				setting: 'allow'});

		}
	}
	activeCookieList();
	console.log(whiteListArray);
	/*At this point in execution, I now have a white list containing the URLS
	of any cookie that the user does not want destroyed*/
	// for(var x = 0; x < whiteListArray.length; x++){
	// 	whiteListArray.pop();
	// }
}

document.addEventListener('DOMContentLoaded', function(){
	var button2 = document.getElementById('appendWhiteList');
	if(button2){//probably unnesecary 
		button2.addEventListener('click', buildWhiteList)
	}
});
/***********************************************************************/

/********************Don't Block Cookies Code****************/

function allowCookies(){
		chrome.contentSettings.cookies.set({primaryPattern: '<all_urls>', setting: 'allow'});
		console.log('Just allowed all cookies.');
}


document.addEventListener('DOMContentLoaded', function(){
	var button3 = document.getElementById('allowCookies');
	if(button3){//probably unnesecary 
		button3.addEventListener('click', allowCookies)
	}
});
/*******************************************************/

/********************Block Cookies Code****************/

function blockCookies(){
		chrome.contentSettings.cookies.set({primaryPattern: '<all_urls>', setting: "block"});
		console.log('Just blocked all cookies.');
}


document.addEventListener('DOMContentLoaded', function(){
	var button4 = document.getElementById('blockCookies');
	if(button4){//probably unnesecary 
		button4.addEventListener('click', blockCookies)
	}
});
/*******************************************************/

/*******************************************************/
function deleteCookies(){
	chrome.cookies.getAll({}, function(cookies){
		for(var c in cookies){
			//console.log(cookies[c].domain);
			if(!(whiteListArray.includes(cookies[c].domain))){
				var fullURL = "http" + (cookies[c].secure ? "s" : "") + "://" + 
					cookies[c].domain + cookies[c].path;

				chrome.cookies.remove({"url": fullURL, "name":cookies[c].name});

				console.log("Removed: " + arrayURL);
			}
		}
	});
	//getAllCookies();//this call updates the list
	//destructionVar = setInterval(destroy, 15 * 1000);//15 second timer
}


document.addEventListener('DOMContentLoaded', function(){
	var button0 = document.getElementById('deleteCookies');
	if(button0){//probably unnesecary 
		button0.addEventListener('click', deleteCookies)
	}
});


/******************************************************/



/*********************stop destroy handlers********************************
function stopDestroy(){
	clearInterval(destructionVar);
}


document.addEventListener('DOMContentLoaded', function(){
	var button1 = document.getElementById('stopdestroy');
	if(button1){//probably unnesecary 
		button1.addEventListener('click', stopDestroy)
	}
});
/*****************************************************/









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



potentially base this off of chrome's own cookie settings.

/Users/aleckerr/Library/Application Support/Google/Chrome/Default/Preferences(txt)
contains a file which has a line "block_third_party_cookies: false". Use this to 
turn on and off cookies, allowing us to easily update the "allow" list with the api

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
Issue #2:

Certain cookies do not want to be earased sometimes. Even on click and clean, they
presist after not failing an api call to remove them. one example is:

https://nexus-long-poller-b.intercom.io/

I also noticed this with www.alluc.ee, but on my laptop these cookeis cleared fine

Solution 2:
IDK about that nexus url, its weird. I think websites must always leave a cookie,
but not one that they can store data on. When I earase and refresh my cookie list
I can still see my cookies, they just seem to have no associated data.

I now have the contentSettings wroking. They set the allow and block buttons to 
allow or block all cookies/cookie data from being set on the browser. I have verified
this using click&clean and the chrome://settings/content/cookies with alluc.ee and 
youtube.com

What I need to do next:

-Add a delete button to delete any nonwhitelisted/nonchecked cookies

-figure out how to manage the array of cookies (what element to. store) and
	make sure whitelist is only adding single cookies if possible,
	or decide on domains and if so, how to group them.

-Implelment a checkbox list to display the whitelist

-Add a boolean to not add whitlisted cookies to the main list

-Add a button to remove from whitelist

-stylize with css
_______________________________2



______________________________________________
















*/