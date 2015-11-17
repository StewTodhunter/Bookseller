
var bookstore = function() {
	
	var loaded = false;	
	
	var featuresenabled = false;

	function CreateXHR() {			
		var xmlHttp;
		try {
			// Firefox, Opera 8.0+, Safari
			xmlHttp=new XMLHttpRequest(); 
			
			
		}
		catch (e) {  
			// Internet Explorer
			try {    
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e) {    
				try {      
					xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e) {      
					//alert("Your browser does not support AJAX!");      
					return false;
				}
			}
		}
	  return xmlHttp;
	}

	var scene;
	var camera;
	var renderer;

	var cash;
	var app;

	var sounds = {
		bell : null,
		coins : null,
		sell : null,
		books : [
			{sound : null},
			{sound : null}
		]
	}

	var mute;

	var resources = {
		mesh : null,
		bond : null,
		heading : null,
		books : null,
		textures : [
			{map : null},
			{map : null},
			{map : null}	
		]
	}
	
	var referral = null;
	
	//var uniqueid;
	
	var currentuser;

	var note = {
	
		overlay : null,
		element : null,
		pause : null,
		list : [],
		check : null,
	
		create : function(content, onclose, end, proceed, onload) {
		
			if (!proceed) {
				proceed = "Ok";
			}
				
			if (note.element == null) {			
			
				note.element = content;
			
				note.element.id = "note";
						
				var ok = document.createElement("div");
				ok.appendChild(document.createTextNode(proceed));
				ok.id = "proceed";
				
				var close = function() {
				
					note.element.parentNode.removeChild(note.element);
					
					note.element = null;
					
					if (onclose != null) {
						//console.log("kek");
						onclose();
					}
					
					if (note.list.length > 0) {
					
						setTimeout(function() {
							//console.log(note.list[0]);
							note.create(note.list[0].content, note.list[0].onclose, note.list[0].end, note.list[0].proceed, note.list[0].onload);
							note.list.splice(0,1);
						}, 500);
						
					} else {
						note.element = null;
					}

				}
				
				var touchdetect = false;
				
				/*"touchstart" = "mousedown";
				"touchend" = "mouseup";
				"touchmove" = "mousemove";*/
				
				ok.addEventListener("mousedown", function() {
				
					//alert("sdfasd");
				
					/*"touchstart" = "touchstart";
					"touchend" = "touchend";
					"touchmove" = "touchmove";*/
					
					close();
					
				}, false);
				
				if (!end) {
				
					note.element.appendChild(ok);
				
				}
				
				document.body.appendChild(note.element);
				
				if (onload) {
					onload();
				}
				
				/*if (!persist) {
				
					overlay.addEventListener("touchstart", function(e) {
						if (note.overlay !== e.target) return;
						note.close();
					}, true);
				
				}*/
			
			} else {
			
				var newnote = {"content" : content, "onclose" : onclose, "end" : end, "proceed" : proceed, "onload" : onload};
				
				note.list.push(newnote);
			}
			
			
			
		}
	}

	var catalogue = {

		books : [],
		soldbooks : [],
		
		element : null,	
		
		buyButton : null,
		
		selected : null,
		
		buying : null,
		
		content : document.createElement("html"),
		contentready : false,
		
		displayTab : {
			first : null,
			element : null,
			selected : null,
			
			clear : function() {
				if (catalogue.selected != null) {
					catalogue.displayTab.selected.classList.remove("toggleactive-" + catalogue.selected.colour);
					catalogue.displayTab.selected.classList.add("toggleinactive");		
				}
			},
				
			elements : {
				
				exterior : null,
				
				interior : null,
				
				sell : null
				
			},
		
			exterior : function() {
			
				var elem = document.getElementById("priceset");
			
				if (elem)
					elem.parentNode.removeChild(elem);
			
				pages.stop();
				
				bookDisplay.start();
								
				catalogue.displayTab.selected.classList.remove("toggleactive-" + catalogue.selected.colour);
				catalogue.displayTab.selected.classList.add("toggleinactive");
				
				catalogue.displayTab.selected = catalogue.displayTab.elements.exterior;
				
				catalogue.displayTab.selected.classList.remove("toggleinactive");
				catalogue.displayTab.selected.classList.add("toggleactive-" + catalogue.selected.colour);
			},
			
			interior : function() {
			
				
				
				pages.start(catalogue.selected);
				
				catalogue.displayTab.selected.classList.remove("toggleactive-" + catalogue.selected.colour);
				catalogue.displayTab.selected.classList.add("toggleinactive");
				
				catalogue.displayTab.selected = catalogue.displayTab.elements.interior;
				
				catalogue.displayTab.selected.classList.remove("toggleinactive");
				catalogue.displayTab.selected.classList.add("toggleactive-" + catalogue.selected.colour);
			}, 
			
			sell : function() {
				
				var elem = document.getElementById("priceset");
				
				if (elem)
					elem.parentNode.removeChild(elem);
			
				pages.stop();
				bookDisplay.stop();
				
				catalogue.displayTab.selected.classList.remove("toggleactive-" + catalogue.selected.colour);
				catalogue.displayTab.selected.classList.add("toggleinactive");
				
				catalogue.displayTab.selected = catalogue.displayTab.elements.sell;
				
				catalogue.displayTab.selected.classList.remove("toggleinactive");
				catalogue.displayTab.selected.classList.add("toggleactive-" + catalogue.selected.colour);

				catalogue.buy();
			},
			
			reset : function() {
				if (catalogue.displayTab.selected != null && catalogue.selected != null ){
				
					//console.log("displaytab reset");
				
					catalogue.displayTab.selected.classList.remove("toggleactive-" + catalogue.selected.colour);
					catalogue.displayTab.selected.classList.add("toggleinactive");
					
					//console.log(catalogue.displayTab.selected.innerHTML);
					//console.log(catalogue.displayTab.selected.className);
					
					catalogue.displayTab.selected = catalogue.displayTab.first;
					
					catalogue.displayTab.selected.classList.remove("toggleinactive");
					catalogue.displayTab.selected.classList.add("toggleactive-" + catalogue.selected.colour);
					
					//console.log(catalogue.displayTab.selected.innerHTML);
				} //else {
					//console.log("displaytab not reset");
				//}

			}
		},
		
		init : function() {
		
			//catalogue.books = [];
		
			catalogue.element = document.createElement("div");
			catalogue.element.id = "list";
			
			catalogue.buyButton = document.createElement("button");
			catalogue.buyButton.id = "buy";
			catalogue.buyButton.appendChild(document.createTextNode("Buy"));
							
			catalogue.buyButton.addEventListener("touchstart", catalogue.buy, false);
			
			//inventory.books = catalogue.books;	

			catalogue.displayTab.element = document.createElement("div");
			catalogue.displayTab.element.id = "displayTab";
			catalogue.displayTab.element.classList.add("panel");
						
			catalogue.displayTab.elements.exterior = document.createElement("div");
			catalogue.displayTab.elements.exterior.classList.add("tab");
			
			catalogue.displayTab.elements.exterior.classList.add("toggleinactive");	
			catalogue.displayTab.elements.exterior.appendChild(document.createTextNode("Step 1:"));
			catalogue.displayTab.elements.exterior.appendChild(document.createElement("br"));
			catalogue.displayTab.elements.exterior.appendChild(document.createTextNode("Exterior"));
			
			catalogue.displayTab.selected = catalogue.displayTab.elements.exterior;
			catalogue.displayTab.first = catalogue.displayTab.elements.exterior;
			
			catalogue.displayTab.element.appendChild(catalogue.displayTab.elements.exterior);
			
			catalogue.displayTab.elements.exterior.addEventListener("touchstart", function() {				
			
				catalogue.displayTab.exterior();				
				
			}, false);
			
			catalogue.displayTab.elements.interior = document.createElement("div");
			catalogue.displayTab.elements.interior.classList.add("tab");
			catalogue.displayTab.elements.interior.classList.add("toggleinactive");			
			catalogue.displayTab.elements.interior.appendChild(document.createTextNode("Step 2:"));
			catalogue.displayTab.elements.interior.appendChild(document.createElement("br"));
			catalogue.displayTab.elements.interior.appendChild(document.createTextNode("Interior"));
			
			catalogue.displayTab.element.appendChild(catalogue.displayTab.elements.interior);		
			
			catalogue.displayTab.elements.interior.addEventListener("touchstart", function() {
				
				catalogue.displayTab.interior();
			
			}, false);
			
			catalogue.displayTab.elements.sell = document.createElement("div");
			catalogue.displayTab.elements.sell.classList.add("tab");			
			catalogue.displayTab.elements.sell.classList.add("toggleinactive");			
			catalogue.displayTab.elements.sell.appendChild(document.createTextNode("Step 3:"));
			catalogue.displayTab.elements.sell.appendChild(document.createElement("br"));
			catalogue.displayTab.elements.sell.appendChild(document.createTextNode("Sell"));
			
			
			
			catalogue.displayTab.element.appendChild(catalogue.displayTab.elements.sell);
			
			catalogue.displayTab.elements.sell.addEventListener("touchstart", function() {
				
				catalogue.displayTab.sell();
				
			}, false);
			
			//catalogue.shuffle();
			
			//catalogue.displayTab.selected.classList.add("toggleactive-" + catalogue.selected.colour);
			
		},
		
		newBook : function() {
			var key = Math.floor(Math.random() * catalogue.books.length);	
			
			var book = catalogue.books[key];

			//console.log(key);
			
			//catalogue.books.push(book);	

			return book;
			
			//catalogue.books.splice(key, 1);
		},
		
		buy : function() {
		
			var fliphelp = document.getElementById("fliphelp");
					
			if (fliphelp != null) {
				fliphelp.parentNode.removeChild(fliphelp);
			}
			
			book = catalogue.selected;
					
			var sellingPrice = 0;				
			
			var price = document.createElement("span");	
			var slider = document.createElement("INPUT");	
			slider.id = "priceslider";
			var profit = document.createElement("span");
			
			var update = function(sellingPrice) {
			
				//console.log("update");
				
				//sellingPrice = parseFloat(slider.value);
				price.innerHTML = sellingPrice.toFixed(2);
				profit.innerHTML = (sellingPrice - book.price).toFixed(2);
			}
							
			var pricesetter = document.createElement("div");					
			
			var selling = document.createElement("p");
			selling.appendChild(document.createTextNode("Sell for $"));	

			var profitheading = document.createElement("p");					
			profitheading.appendChild(document.createTextNode("Profit per book: $"));	
			profitheading.appendChild(profit);
			
			selling.appendChild(price);
								
			slider.min = 0.99;
			slider.max = 69.99;
			slider.value = 0.99;
			
			slider.type = "range";
			slider.step = 0.01;
			
			//update(5);			
			
			var selected;
			
			var markup = document.createElement("div");
			markup.id = "markup";
			
			var pmargin = document.createElement("div");			
			
			var quantity = document.createElement("div");
			quantity.appendChild(document.createTextNode("Sell for: "));

			var qbooks = document.createElement("span");
			qbooks.appendChild(document.createTextNode("1"));	

			var pricespan = document.createElement("span");
			
			var confirm = document.createElement("button");		
			
			var totalprice = book.price;
			
			confirm.appendChild(document.createTextNode("Sell"));
			
			var checkmoney = function() {
				if (totalprice > finance.amount) {
					pricespan.style.color = "red";
					confirm.style.color = "red";
					confirm.innerHTML = "Not enough money";
				} else {
					pricespan.style.color = "white";					
					confirm.style.color = "white";
					confirm.innerHTML = "Buy";
				}
			}
			
			var updateslider = function() {
				qbooks.innerHTML = "$" + parseFloat(slider.value).toFixed(2);
				//pricespan.innerHTML = slider.value.toFixed(2);
				
				//checkmoney();
			}
			
			slider.addEventListener("input", updateslider, false);
			
			updateslider();
			
			quantity.appendChild(qbooks);	
			quantity.appendChild(slider);	
			
			pricesetter.appendChild(quantity);	
						
			var tprice = document.createElement("p");
			tprice.appendChild(document.createTextNode("Total price: $"));			
			
			pricespan.appendChild(document.createTextNode(book.price.toFixed(2)));
			
			tprice.appendChild(pricespan);
			
			
			confirm.id = "ok";
			
			//checkmoney();
			
			//if (finance.amount > book.price) {
				
				confirm.addEventListener("touchstart", function() {
				
					//checkmoney();
				
					//if (totalprice <= finance.amount) {
						//note.close();
						catalogue.selected.stats.sellprice = parseFloat(slider.value);
						catalogue.change();
						sounds.coins.play();
					//}
				}, false);
				
				
			//checkmoney();
			
			//} else {
			//	confirm.appendChild(document.createTextNode("Not enough money"));
			//}
			
			pricesetter.appendChild(confirm);
			
			pricesetter.id = "priceset";
			
			document.getElementById("container").appendChild(pricesetter);
			
			//note.create(pricesetter, true);
			
			
		},
		
		change : function() {
			
			if (catalogue.selected != null)			
				catalogue.soldbooks.push(catalogue.selected);
			
			//console.log(catalogue.soldbooks.length);
		
			//if (catalogue.selected != null)
				//console.log(catalogue.selected.stats);
			
			if (catalogue.books.length > 0) {
				
				catalogue.contentready = false;
			
				catalogue.displayTab.clear();
		
				var key = Math.floor(Math.random() * catalogue.books.length);
				
				
				catalogue.selected = catalogue.books[key];
				
				//console.log(catalogue.books);
				
				catalogue.books.splice(key, 1);
				
				catalogue.remaining.innerHTML = "Remaining books: " + (catalogue.books.length + 1);
				
				//catalogue.displayTab.exterior();
				
				//console.log("back to inventory: " + inventory.selected);
				
				//if (catalogue.selected) {
				
				document.getElementById("inventoryHead").innerHTML = catalogue.selected.name;
				//console.log("back to inventory")
				//console.log("book 0: " + inventory.books[0].name);
				//console.log("selected :" + inventory.selected.id);
				bookDisplay.change(catalogue.selected);
				//}else {				
				//	bookDisplay.change();				
				//}
				
				catalogue.displayTab.exterior();
				
				//var loadBooks = function(index, onload) {
				//	if (index >= catalogue.books.length) {
				//		onload();
				//		console.log("books loaded");
				//	} else {
				/*
				var client = CreateXHR();
				client.open('GET', "assets/texts/" + catalogue.selected.file );
				client.onreadystatechange = function() {
				
					if (client.readyState == 4) {
					
						var file = document.createElement("html");
						file.innerHTML = client.responseText;
						
						//var images = file.getElementsByTagName("img");
						
						//for (var i = 0; i < images.length; i++) {
						//	images[i].parentNode.removeChild(images[i]);
						//}
						
						//var links = file.getElementsByTagName("a");
						
						//for (var i = 0; i < links.length; i++) {
						//	file.getElementsByTagName("a")[i]
						//}
						
						Array.prototype.slice.call(file.getElementsByTagName('a')).forEach(function(item) { item.parentNode.removeChild(item); } );
						//Array.prototype.slice.call(file.getElementsByTagName('span')).forEach(function(item) { item.parentNode.removeChild(item); } );
						Array.prototype.slice.call(file.getElementsByTagName('img')).forEach(function(item) { item.parentNode.removeChild(item); } );
						Array.prototype.slice.call(file.getElementsByTagName('script')).forEach(function(item) { item.parentNode.removeChild(item); } );
						//Array.prototype.slice.call(file.getElementsByTagName('p')).forEach(function(item) { 
						//	if (item.textContent.length = 0)
						//		item.parentNode.removeChild(item); 						
						//
						//} );
						
						catalogue.content = file.getElementsByTagName("p");
						
						catalogue.contentready = true;
					}			
				}
				
				catalogue.contentready = false;*/
				
				//client.send();
				
				//var skip = location.search.split('skip=')[1];
						
				//if (skip != null)
					//end();
				//	}
				//}
			
			} else {
			
				end();
				
			}
		}
	}
	
	var addreferral = function(uuid) {
		var refxhr = CreateXHR();
							
		refxhr.onreadystatechange = function() {
		
			if (refxhr.readyState == 4) {
			
				console.log(refxhr.responseText);
			}
		
		}

		refxhr.open("POST", "addreferral.php", true);

		refxhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		refxhr.send("uuid=" + uuid);
	}
	
	var end = function() {
	
		bookDisplay.stop();
						
		var elem = document.getElementById("container");	
		if (elem != null)
			elem.parentNode.removeChild(elem);

		var splash = document.createElement("div");
		splash.id = "splash";
		
		document.body.appendChild(splash);
		
		var profit = 0.00;
		
		//console.log(catalogue.soldbooks);		
		
		var stats = [];
		
		for (var i = 0; i < catalogue.soldbooks.length; i++) {
			//console.log(i);
			profit += catalogue.soldbooks[i].stats.sellprice;
			//alert("book " + i + " was sold for " + catalogue.soldbooks[i].stats.sellprice);
			
			stats.push(catalogue.soldbooks[i].stats);
			stats[i].bookid = i;
			stats[i].userid = currentuser.userid;
		}
		
		//console.log(catalogue.books.length);

		var booksxhr = CreateXHR();
		booksxhr.onreadystatechange = function() {
			if (booksxhr.readyState == 4) {
			
				//console.log(booksxhr.responseText);
				
				//console.log(profit);
								
				currentuser.profit = profit;
			
				var userxhr = CreateXHR();				
				
				userxhr.onreadystatechange = function() {
					if (userxhr.readyState == 4) {
					
						//addreferral("afb26317-10d2-4060-bed2-78062ab4e7b3");
					
						//console.log(userxhr.responseText);
					
						if (referral != null) {
						
							addreferral(referral);							
						
						} else {
						//console.log(userxhr.responseText);
						
							
						
						}
						
						document.body.removeChild(splash);
						
						raffle();
					}
					
				}
				
				userxhr.open("POST", "updateuser.php", true);
		
				var statsstring = "user=" + JSON.stringify(currentuser);
				userxhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				userxhr.send(statsstring);
				
				
				
			}
		}
													
		booksxhr.open("POST", "savebooks.php", true);
		
		var statsstring = "stats=" + JSON.stringify(stats);
		//var statsstring = "stats=stats";
		//console.log(statsstring);
		booksxhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		booksxhr.send(statsstring);
		//xhr.send(JSON.stringify(stats));
			
		
	}
	
	var raffle = function() {
		var endnote = document.createElement("div");
					
		var logo = document.createElement("div");
		logo.id = "logo";					
		endnote.appendChild(logo);
		
		var text1 = document.createElement("h3");
		text1.appendChild(document.createTextNode("Thanks for participating. You made a total profit of $"));
		
		//text1.id = "thanks";
		
		var profit = document.createElement("span");
		
		profit.appendChild(document.createTextNode(parseFloat(currentuser.profit).toFixed(2) + "."));
		
		text1.appendChild(profit);
		
		var text2 = document.createElement("p");
		text2.appendChild(document.createTextNode("If you would like to register for the raffle (a $100USD gift card at a preferred digital vendor), enter your email address in the text area below. Also make sure to specify your preferred vendor. If you are interested in the outcomes of the study, also tick the box indicating that you would like to receive a debriefing via email when the results are made available."));
		
		var form = document.createElement("form");
		
		var email = document.createElement("input");
		email.type = "text";
				
		var age1 = document.createElement("input");
		age1.type = "radio";
		age1.name = "age";
		age1.id = "1";
		
		var labelage1 = document.createElement("label");
		labelage1.appendChild(document.createTextNode("18-25"));
		labelage1.setAttribute("for", "1");
		
		var age2 = document.createElement("input");
		age2.type = "radio";
		age2.name = "age";
		age2.id = "2";
		
		var labelage2 = document.createElement("label");
		labelage2.appendChild(document.createTextNode("26-35"));
		labelage2.setAttribute("for", "2");
		
		var age3 = document.createElement("input");
		age3.type = "radio";
		age3.name = "age";		
		age3.id = "3";
		
		var labelage3 = document.createElement("label");
		labelage3.appendChild(document.createTextNode("36-45"));
		labelage3.setAttribute("for", "3");
		
		var age4 = document.createElement("input");
		age4.type = "radio";
		age4.name = "age";		
		age4.id = "4";
		
		var labelage4 = document.createElement("label");
		labelage4.appendChild(document.createTextNode("46+"));
		labelage4.setAttribute("for", "4");
		
		var vendor = document.createElement("select");
		
		var amazon = document.createElement("option");
		amazon.appendChild(document.createTextNode("Amazon"));
		amazon.value = "amazon";
		vendor.appendChild(amazon);
		
		var apple = document.createElement("option");
		apple.appendChild(document.createTextNode("iTunes"));
		apple.value = "apple";
		vendor.appendChild(apple);
		
		var google = document.createElement("option");
		google.appendChild(document.createTextNode("Play Store"));
		google.value = "google";
		vendor.appendChild(google);
		
		var update = document.createElement("input");
		update.type = "checkbox";
		
		var commentarea = document.createElement("div");
		commentarea.id = "commentarea";
		var comments = document.createElement("textarea");
		comments.id = "comments";
		commentarea.appendChild(document.createTextNode("Any comments regarding the study"));
		commentarea.appendChild(document.createElement("br"));
		commentarea.appendChild(comments);
		
		form.appendChild(document.createTextNode("Email: "));
		form.appendChild(email);		
		form.appendChild(document.createElement("br"));
		form.appendChild(document.createTextNode("Your age: \u00A0"));
		form.appendChild(labelage1);
		form.appendChild(age1);
		form.appendChild(document.createTextNode("\u00A0"));
		form.appendChild(labelage2);
		form.appendChild(age2);
		form.appendChild(document.createTextNode("\u00A0"));
		form.appendChild(labelage3);
		form.appendChild(age3);
		form.appendChild(document.createTextNode("\u00A0"));
		form.appendChild(labelage4);
		form.appendChild(age4);		
		form.appendChild(document.createElement("br"));
		form.appendChild(document.createTextNode("Preferred vendor: "));
		form.appendChild(vendor);
		form.appendChild(document.createTextNode(" Debrief: "));
		form.appendChild(update);
		
		var rafflearea = document.createElement("div");
		rafflearea.id = "rafflearea";
		
		var alerts = document.createElement("div");
		alerts.id = "rafflealert";
		
		form.id = "raffleform";
		
		
		endnote.appendChild(text1);
		
		
		text2.appendChild(document.createElement("hr"));
		
		endnote.appendChild(text2);
		
		
		
		rafflearea.appendChild(commentarea);
		
		rafflearea.appendChild(form);
		rafflearea.appendChild(alerts);
		
		endnote.appendChild(rafflearea);
		
		var completion = function() {
			setTimeout(function() {
			
				var ValidateEmail = function(mail) {
					if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
						return (true)
					} else {
						return (false)
					}
				}
				
				var emailvalid = ValidateEmail(email.value);				
				
				var checkedage = 0;
				
				if (age1.checked) {
					checkedage = 1;
				} else {
					if (age2.checked) {
						checkedage = 2;
					} else {
						if (age3.checked) {
							checkedage = 3;
						} else {
							if (age4.checked) {
								checkedage = 4;
							}
						}
					}
				}
				
				var alertstring = "";
				
				if (!emailvalid) {
					alertstring = "Please enter a valid email address.<br/><br/>";
				}
				
				if (checkedage == 0) {
					alertstring = alertstring + "Please verify your age.";
				}
				
				if (emailvalid && checkedage > 0) {	

					currentuser.email = email.value;
					currentuser.age = checkedage;
					currentuser.vendor = vendor.options[vendor.selectedIndex].value;
					currentuser.referrals = 0;
					currentuser.debrief = update.checked;
					currentuser.comment = comments.value;
					
					var userxhr = CreateXHR();
				
					userxhr.onreadystatechange = function() {
						if (userxhr.readyState == 4) {
							//console.log(userxhr.responseText);
							
							//raffle(user);
							
							//console.log(userxhr.responseText);
							
							completed();
						}
						
					}
					
					userxhr.open("POST", "updateuser.php", true);
			
					var statsstring = "user=" + JSON.stringify(currentuser);
					
					console.log(statsstring);
					userxhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					userxhr.send(statsstring);
					
				} else {
					alerts.innerHTML = alertstring; 				
					note.create(endnote, completion);
				}			
			}, 500);
		}
		
		note.create(endnote, completion);
	}
	
	var completed = function() {
	
		//alert(geoplugin_countryName());
	
		var saved = document.createElement("div");
		
		var text1 = document.createElement("p");
		text1.id = "thanks";
		text1.appendChild(document.createTextNode("Your data has been saved and your raffle entry is secured. Good luck!"));
		
		var text2 = document.createElement("p");
		text2.appendChild(document.createTextNode("The raffle results will be announced in late September, but did you know you can double your chances of winning? Just share this study with at least two of your friends using the link below. For them participating in this study, you will receive an additional entry into the raffle."));
		
		var link = document.createElement("p");
		link.type = "text";
		link.id = "referral";
		link.setAttribute("readonly", true);
		
		var string = "http://bookseller.stewtodhunter.com/?referral=" + currentuser.userid;
		
		link.appendChild(document.createTextNode(string));
		
		link.size = string.length;
		
		var clipboard = document.createElement("div");
		clipboard.appendChild(document.createTextNode("Press to highlight"));
		clipboard.id = "clipboard";
		
		clipboard.addEventListener("mousedown", function() {
			//link.focus();
			
			setTimeout(function(){ link.setSelectionRange(0, link.value.length) }, 100);
			//link.focus();
//			console.log("zsxdfsad");
		}, false);
		
		//var sharearea = document.createElement("div");
		//sharearea.id = "sharearea";
		
		var share = document.createElement("div");
		share.id = "share";
		
		var email = document.createElement("a");
		email.id = "mailto";
		email.href = "mailto:?subject=Bookseller&body=Here's a great way to win $100 of digital swag.%0D%0A" + string
		share.appendChild(email);
		
		var facebook = document.createElement("div");
		facebook.classList.add("fb-share-button");
		facebook.setAttribute("data-href" , string);
		facebook.setAttribute("data-layout" , "button");
		
		share.appendChild(facebook);
		
		var tweet = document.createElement("a");		
		tweet.href = "https://twitter.com/intent/tweet?text=Here%27s%20a%20great%20way%20to%20win%20%24100%20of%20digital%20swag.";
		tweet.classList.add("twitter-share-button");
		//tweet.appendChild(document.createTextNode("Tweet"));
		tweet.setAttribute("data-url", string);
		tweet.setAttribute("data-count", "none");
		tweet.setAttribute("data-hashtags", "BooksellerStudy");
		//tweet.setAttribute("data-size", "large");		
		share.appendChild(tweet);
		
		var gplus = document.createElement("div");
		gplus.classList.add("g-plus");
		gplus.setAttribute("data-action", "share");
		gplus.setAttribute("data-annotation", "none");
		gplus.setAttribute("data-href", string);
		share.appendChild(gplus);
		
		var currentrefs = document.createElement("p");
		currentrefs.id = "refs";
		currentrefs.appendChild(document.createTextNode("You currently have "));
		var refs = document.createElement("span");
		refs.appendChild(document.createTextNode(currentuser.referrals));
		currentrefs.appendChild(refs);
		if (currentuser.referrals > 1) {
			currentrefs.appendChild(document.createTextNode(" referrals, which means you qualify for an extra raffle entry. Great job!"));
		} else {
			currentrefs.appendChild(document.createTextNode(" referrals, which means you don't yet qualify for an extra raffle entry."));
		}		
		
		//sharearea.appendChild(share);
		
		saved.appendChild(text1);
		saved.appendChild(text2);
		saved.appendChild(link);
		//saved.appendChild(clipboard);		
		saved.appendChild(share);
		//saved
		
		saved.appendChild(document.createElement("hr"));
		
		saved.appendChild(currentrefs);
		
		//var 		
		
		note.create(saved, null, true);
		
		
		var face = function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  
		  if (d.getElementById(id)) return;
		  
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4";
		  fjs.parentNode.insertBefore(js, fjs);
		}
		
		face(document, 'script', 'facebook-jssdk');
		
		window.twttr = (function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0],t = window.twttr || {};
		  if (d.getElementById(id)) return t;
		  js = d.createElement(s);
		  js.id = id;
		  js.src = "https://platform.twitter.com/widgets.js";
		  fjs.parentNode.insertBefore(js, fjs);
		 
		  t._e = [];
		  t.ready = function(f) {
			t._e.push(f);
		  };
		 
		  return t;
		}(document, "script", "twitter-wjs"));
		
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "https://apis.google.com/js/platform.js";
		script.setAttribute("defer", "defer");
		script.setAttribute("async", "async");

		document.body.appendChild(script);
	
	}

	var pages = {
		
		open : false,
		
		viewport : null,
		
		help : null,
		
		timer : 0,
		
		endtimer : function(e) {
			var d = new Date();
		
			//user.interactions.internal.push({"book" : book.id, "time" : d.getTime() - timer });
			
			catalogue.selected.stats.internaltouchtime += d.getTime() - pages.timer;
			catalogue.selected.stats.internaltouches++;
		
			catalogue.selected.sound.pause();
			/*if (pages.viewport !== e.target) {
				return;
			} else {
				pages.viewport.remove();
			}*/
		},

		start : function(book) {
		
			if (!pages.open) {
			
				//if (catalogue.contentready) {
		
					pages.open = true;
					
					var d = new Date();
					pages.timer = d.getTime();
				
					bookDisplay.stop();
					
					pages.viewport = document.createElement("div");
					
					/*var client = new XMLHttpRequest();
					client.open('GET', "assets/texts/" + catalogue.selected.file );
					client.onreadystatechange = function() {
					
						if (client.readyState == 4) {*/
						
					//var parser = new DOMParser();
					//var book = parser.parseFromString(client.responseText, "text/xml");
					
					//var doc = document.createElement("html");
					
					//console.log(doc);
					
					
					//console.log(catalogue.selected.file);
					
					var paragraphs = catalogue.content;
					
					
					//book = book.getElementsByTagName("body");
					
					//console.log(paragraphs);
					
					//fileText = book.innerHTML;
				
					//var filetext = client.responseText;
					
					
					
					//var pagecount = client.responseText.length % 1000;
					
					pages.viewport.id = "pages";
					pages.viewport.classList.add("toggleactive-" + book.colour);
					
					//pages.viewport.classList.add("page");
					//basePage.classList.add("appear");
					
					var fliphelp = document.getElementById("fliphelp");
					
					if (fliphelp != null)
						fliphelp.parentNode.removeChild(fliphelp);
					
					pages.help = document.createElement("p");
					pages.help.id = "fliphelp";
					pages.help.appendChild(document.createTextNode("- - drag from corners to flip pages - -"));
					
					container.appendChild(pages.help);
					
					//page1.appendChild(document.createTextNode("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"));
					
					container.appendChild(pages.viewport);					
					
					//alert(pagecount);
										
					//filetext = client.responseText.substr(0, 1000);
											
					var currentText = document.createElement("div");
					
					var pagearea = document.createElement("div");
					pagearea.id = "pagearea";
					
					pages.viewport.appendChild(pagearea);
					
					//pages = pagearea;
					
					var pagecount = 0;
					
					var newPage = function() {
					
						pagecount++;
					
						//console.log(currentText);
						var page = document.createElement("div");
						
						var text = document.createElement("div");
						text.id = "booktext";
						
						page.appendChild(text);
						
						var number = document.createElement("footer");
						number.classList.add("pagenumber");
						//number.appendChild(document.createTextNode(index + 1));
						
						//page.appendChild(number);
						
						//page.classList.add("page");
						
						pagearea.appendChild(page);
						
						currentText = text;
						
					}
					
					var remainingheight = 0;
					
					//$('.page').slick({
					//	infinite : false
					//});
					
					
					//alert("pgaes");
					
					var div = null;
					//var div = document.createElement("p");
					
					
					var index = 0;
					
					var getHalf = function(string) {
					
						var lines = string.split(/\r\n|\r|\n/);
						
						for (var i = 0; i < lines.length; i++) {
							lines[i] = lines[i] + "<br>";
						}
						
						var halflines = lines.length / 2;
						
						var first = lines.slice(0, halflines).join();
						
						var second = lines.slice(halflines, lines.length).join();
						
						var output = [];
						
						output.push(first);
						output.push(second);
						
						return output;
						
						//console.log(output);
					
						/*
					
						var offset = 0;					
					
						var half = Math.floor(string.length / 2);
					
						var second = string.substring(half, string.length);
						
						var firstChar = second.charCodeAt(0);
																			
					//	while (firstChar != 13 && offset < half) {
						while (firstChar != 10 && firstChar != 32 && firstChar != 9 && offset < half) {
							//console.log(half - offset);
							
							
							//console.log(second.substring(0, 1) + ", " + second.charCodeAt(0));
							
							offset++;							
							
							second = string.slice(half - offset, string.length)
							
							firstChar = second.charCodeAt(0);
						}
						
						
						var first = string.substring(0, half - offset) + "[split ";
							
						var output = [];
						
						output.push(first);
						output.push("here]" + second);
						
						//console.log(output);
					
						return output;*/
					}
					
					for (var i = 0; i < 20; i++) {
						newPage();
					}
					
					/*
					
					while (pagecount < 20) {
					
					
					
						if (remainingheight <= 0) {							
						
							if (div != null) {
							
								//div.style.color = "red";
								var text = getHalf(div.innerHTML);
								//console.log(text[0]);								
								div.innerHTML = text[0];
								//console.log("-----------");
								//console.log(text[1]);								
													
								newPage();
								remainingheight = pagearea.clientHeight / 3;
								
								var splitdiv = document.createElement("p");
								splitdiv.innerHTML = text[1];
								currentText.appendChild(splitdiv);
								remainingheight -= splitdiv.offsetHeight;
								
								//div.parentNode.removeChild(div);
							} else {
							
								newPage();
								remainingheight = pagearea.clientHeight / 3;
							
							}
						
							
							//remainingheight = 400;	
							
							//console.log(pagearea.clientHeight);							
																		
							/*console.log(currentText.clientHeight);
													
							newPage();
							
							//$("#pages").turn("addPage", currentText, pagecount );
							
							//$('.page').slick('slickAdd', currentText);
							
							
							remainingheight = currentText.clientHeight;								
							
							div.remove();
							
							div = currentText.appendChild(div);
							
							remainingheight -= div.offsetHeight;*//*
						}
						
						div = currentText.appendChild(paragraphs[index].cloneNode(true));
						
						remainingheight -= div.offsetHeight;
						
						index++;
					}*/

					$('#pagearea').turn();
					
					var timer = 0;
					
					pages.viewport.addEventListener("touchstart", function(e) {
						var d = new Date();
						pages.timer = d.getTime();
					
						catalogue.selected.sound.play();
						/*if (pages.viewport !== e.target) {
							return;
						} else {
							pages.viewport.remove();
						}*/
					}, true);
					
					
					
					document.addEventListener("touchend", pages.endtimer, true);
					
							
					//var closeEvent = function() {
					//	pages.viewport.removeEventListener("touchstart", closeEvent, false);
					//	pages.viewport.remove();
					//	createInventory(container, list);
					//}
					
					//	}
					//}
					
					//client.send();
				//} else {
				//	//alert("content not ready yet");
				
				//	pages.check = setTimeout(function() {
				//		pages.check = null;
				//		pages.start(book);
				//	}, 500);
				//}
			}
		},
		
		stop : function(backtobook) {
		
			if (pages.open) {
			
				if (pages.check != null) {
					clearTimeout(pages.null);
				}
			
				var d = new Date();
				
				catalogue.selected.stats.readtime += d.getTime() - pages.timer;
				
				document.removeEventListener("touchend", pages.endtimer, true);
		
				//console.log("stopping pages");
				
				if (pages.viewport != null) {	
					pages.viewport.parentNode.removeChild(pages.viewport);
					pages.viewport = null;
				}
				
				pages.help.parentNode.removeChild(pages.help);
				pages.help = null;
				
				//console.log("starting unwanted");
				
				if (backtobook)
					bookDisplay.start();
					
				pages.open = false;
			
			}
		}
	}

	var bookDisplay = {

		visible : false,

		mesh : resources.mesh,		
		renderLoop : null,
		
		zRotForward: null,
		
		touchTimer : null,		
		
		bookTouch : false,
		touching : false,
		
		lastUpdate : 0,
		
		mouse : new THREE.Vector2(),
		
		vector : new THREE.Vector3(),
		
		current : null,
			
		raycaster : null,
		
		book : null,
		
		remaining : null,
		
		checkTouch : function() {
			bookDisplay.vector = new THREE.Vector3( bookDisplay.mouse.x, bookDisplay.mouse.y, 0.5 ).unproject( camera );			
			bookDisplay.raycaster.setFromCamera(bookDisplay.mouse, camera);	
			var intersects = bookDisplay.raycaster.intersectObject( bookDisplay.mesh );			
			return intersects.length > 0;
		},

		timer : {
			starttime : 0,
			pausetime : 0,
						
			start : function() {
				
				//console.log("starting");
			
				var time = new Date();
				bookDisplay.timer.starttime = time.getTime();
			},
			
			stop : function() {			
				
				//console.log("stopping");
			
				if (bookDisplay.timer.starttime > 0) {
				
					if (bookDisplay.timer.pausetime > 0) {
						bookDisplay.timer.resume();
					}
			
					var time = new Date();				
					var total = time.getTime() - bookDisplay.timer.starttime;
					
					//console.log(total);
					
					catalogue.selected.stats.externaltouchtime += total;
					
					catalogue.selected.stats.externaltouches ++;
					
					bookDisplay.timer.starttime = 0;
				}
			},
			
			pause : function() {
			
				if (bookDisplay.timer.starttime > 0) {
			
					//console.log("pausing");
					
					if (bookDisplay.timer.pausetime == 0) {
						var time = new Date();
						bookDisplay.timer.pausetime = time.getTime();
					}
				
				}
			},
			
			resume : function() {
				//console.log("resuming");
			
				if (bookDisplay.timer.starttime == 0) {
					bookDisplay.timer.start();
				}
				
				if (bookDisplay.timer.pausetime > 0) { 
					//console.log("resuming " + bookDisplay.timer.pausetime);
					var time = new Date();
					bookDisplay.timer.starttime += (time.getTime() - bookDisplay.timer.pausetime);
					bookDisplay.timer.pausetime = 0;
				}
			}
		},
		
		touchStart : function(e) {
		
			if (e.target.id == "container") {
			
				document.body.style.zoom=1.0;				
							
				//e.preventDefault();
			
				bookDisplay.touching = true;	

				//if ("touchstart" == "touchstart") {
				
					//console.log("touchstart");
			
					bookDisplay.mouse.x = ( e.touches[0].clientX / window.innerWidth ) * 2 - 1;
					bookDisplay.mouse.y = - ( e.touches[0].clientY / window.innerHeight ) * 2 + 1;	
				
				/*} else {
				
					
					//console.log("mousedown");
					
					bookDisplay.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
					bookDisplay.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;	
				}*/
				
				if (bookDisplay.checkTouch()) {	

					bookDisplay.timer.start();
					
					if (feedback) {
					
						catalogue.selected.sound.play();
						//console.log("feedback is on");
					}
					//window.cancelAnimationFrame(bookDisplay.renderLoop);
					window.cancelAnimationFrame(bookDisplay.renderLoop);
					bookDisplay.renderLoop = null;
				
					//console.log("intersects");
							
					bookDisplay.bookTouch = true;
					
					//mesh.normalize();
					
					if (bookDisplay.mesh.rotation.y >= (Math.PI * 2)) {
					
						bookDisplay.mesh.rotation.y = bookDisplay.mesh.rotation.y % (Math.PI * 2);
						
					} else {
						while (bookDisplay.mesh.rotation.y < 0) {
							bookDisplay.mesh.rotation.y += (Math.PI * 2);
						}
					}
					
					if (bookDisplay.mesh.rotation.y > 0.15 && bookDisplay.mesh.rotation.y < 3.29159265) {
						bookDisplay.zRotForward = true;
					} else {
						bookDisplay.zRotForward = false;
					}
				}
			}
		},
		
		touchMove : function(e) {
			//e.preventDefault();
		
			//mouse.x = ( e.touches[0].clientX / window.innerWidth ) * 2 - 1;
			//mouse.y = - ( e.touches[0].clientY / window.innerHeight ) * 2 + 1;	
			
			var velX;
			var velY;
			
			if ("touchstart" == "touchstart") {
		
				velX = (( e.touches[0].clientX / window.innerWidth ) * 2 - 1);
				velY = -( e.touches[0].clientY / window.innerHeight ) * 2 + 1;
			
			} else {
				
				velX = (( e.clientX / window.innerWidth ) * 2 - 1);
				velY = -( e.clientY / window.innerHeight ) * 2 + 1;
			}
			
			//console.log(velX);
			
			if (bookDisplay.bookTouch) {
			
				//if (feedback)
					catalogue.selected.sound.play();
					
				bookDisplay.timer.resume();
				
				bookDisplay.mesh.rotation.y += (velX - bookDisplay.mouse.x) * 8;
				
				if (bookDisplay.zRotForward) 
					bookDisplay.mesh.rotation.z += (velY - bookDisplay.mouse.y) * 2;
				else {
					bookDisplay.mesh.rotation.z -= (velY - bookDisplay.mouse.y) * 2;
				}
								
				bookDisplay.bookTouch = bookDisplay.checkTouch();
				
				bookDisplay.delta = Date.now() - bookDisplay.lastUpdate;
				bookDisplay.lastUpdate = Date.now();			
				
				//console.log("rendering" );
			
				renderer.render( scene, camera );
				
			}
			
			bookDisplay.mouse.x = velX;
			bookDisplay.mouse.y = velY;
			
			if (bookDisplay.touching) {
				bookDisplay.bookTouch = bookDisplay.checkTouch();
												
				if (!bookDisplay.bookTouch) {
					bookDisplay.timer.pause();
					catalogue.selected.sound.pause();				
					
					//var time = new Date();					
					//bookDisplay.touchTimer = time.getTime() - bookDisplay.touchTimer;
					//catalogue.selected.stats.externaltouchtime += bookDisplay.touchTimer;
				}/* else {
					if (feedback) {
						toneControl.play();
					}
				}*/
			}
		},
		
		touchEnd : function() {
		
			//console.log("asfasdf");
			//if (booktouch) {
			
			bookDisplay.timer.stop();
			
			//console.log(bookDisplay.touchTimer);
			
			
			
			//user.interactions.external.push({"book" : bookDisplay.book.id, "time" : bookDisplay.touchTimer});				
			
			if (bookDisplay.renderLoop == null)
				bookDisplay.render();
				
			//}
		
			bookDisplay.bookTouch = false;
			bookDisplay.touching = false;
			
			//if (bookDisplay.feedback) {
				catalogue.selected.sound.pause();
				
			//}
		},
		
		init : function() {
		
			bookDisplay.lastTouch = 0;
			
			bookDisplay.mesh = resources.mesh;

			bookDisplay.mesh.position.x = -0;
			bookDisplay.mesh.rotation.y = 1;
			bookDisplay.mesh.rotation.z = 0;
			bookDisplay.mesh.rotation.x = 0;
				
			//scene.add(bookDisplay.mesh);
			
			var projector = new THREE.Projector();
			bookDisplay.vector = new THREE.Vector3();
			
			bookDisplay.raycaster = new THREE.Raycaster( camera.position, bookDisplay.vector.sub( camera.position ).normalize() );	
			
			//bookDisplay.mouse = ;
			bookDisplay.mouse.x = 0;
			bookDisplay.mouse.y = 0;
			//if (highpitch) {
				//catalogue.selected.sound = new Audio("assets/640.wav");
			//} else {
				//catalogue.selected.sound = new Audio("assets/200.wav");
			//}
			
			sounds.books[0] = new Audio("assets/200.mp3");
			sounds.books[0].type = "audio/mpeg";
			sounds.books[0].volume = 0.5;
			sounds.books[1] = new Audio("assets/640.mp3");
			sounds.books[1].volume = 0.5;
			sounds.books[1].type = "audio/mpeg";
			sounds.books[2] = new Audio("assets/pinknoise.mp3");
			sounds.books[2].volume = 0.5;
			sounds.books[2].type = "audio/mpeg";
			sounds.books[3] = new Audio("assets/bluenoise.mp3");
			sounds.books[3].volume = 0.5;
			sounds.books[3].type = "audio/mpeg";
			sounds.books[4] = new Audio("assets/silence.mp3");
			sounds.books[4].volume = 0.5;
			sounds.books[4].type = "audio/mpeg";
			
			bookDisplay.zRotForward = true;
			
			velX = 0;
			velY = 0;
			
			//catalogue.selected.sound.loop = true;
			//catalogue.selected.sound.volume = 0.1;
			
			bookDisplay.touchTimer = 0;
			
			//inventory.update();
			
			/*var toggle = document.createElement("div");
			toggle.type = "button";
			var buttonText = document.createTextNode("Feedback");
			toggle.appendChild(buttonText);
			toggle.id = "toggletest";
			toggle.className = "toggleinactive";	
			document.body.appendChild(toggle);
			
			toggle.addEventListener('touchstart', toggleFeedback, false);*/	
		},
		
		change: function(book) {
		
			
		
		
			//document.getElementById("inventoryHead").innerHTML = book.name;
		
			bookDisplay.book = book;
		
			//if (document.getElementById("priceset"))
			//	document.getElementById("priceset").remove();
			
			bookDisplay.mesh.rotation.y = 0.8;
			//bookDisplay.mesh.rotation.y = Math.PI * 2;
			bookDisplay.mesh.rotation.x = 0;
			bookDisplay.mesh.rotation.z = 0;
			
			if (pages.open) {
				pages.stop(true);
			}
			
			if (book) {
			
				var get_random_color = function () {
				  function c() {
					return Math.floor(Math.random()*256).toString(16);
				  }
				  return "#"+c()+c()+c();
				}				
				
				var key = Math.floor(Math.random() * resources.textures.length);
				
				bookDisplay.current = book;		
					
				book.colour = "blue";	
				
				//console.log(bookDisplay.mesh.material);
				
				//bookDisplay.mesh.material.uniforms.texture.value = book.texture.map;
				//console.log(bookDisplay.mesh.material);
				//console.log("changed texture: " + book.name);
				
				
				
				//console.log(texture);

				//catalogue.books[i].texture = {"map" : texture, "colour" : resources.textures[key].colour};
				
				//bookDisplay.mesh.material.setValues({map : texture});
				//bookDisplay.mesh.material.map.needsUpdate = true;
				
				
				
				
				//console.log(texture);
				
			} else {
				//console.log("change, nobook");
			}
		},
		
		render : function() {
		
				
			delta = Date.now() - bookDisplay.lastUpdate;
			bookDisplay.lastUpdate = Date.now();		
			
			//console.log("rendering. delta : " + delta);
		
			renderer.render( scene, camera );
			//camera.position.z -= 0.1;
			
			
			if (!bookDisplay.bookTouch) {
				bookDisplay.mesh.rotation.y -= 0.00005 * delta;
				//mesh.rotation.y = 0.15; // Towards
				//mesh.rotation.y += velY;
				
				//mesh.rotation.y = 3.29159265;
				
			}
			
			//console.log("step");
			
			bookDisplay.renderLoop = window.requestAnimationFrame(bookDisplay.render);
		
		},
		
		//var animation = requestAnimationFrame(render);
		stop : function() {
			
			bookDisplay.visible = false;
		
			//console.log("stopping");
			
			//scene.remove(bookDisplay.mesh);
			scene.remove(bookDisplay.mesh);
		
			//if (bookDisplay.renderLoop != null) {
				window.cancelAnimationFrame(bookDisplay.renderLoop);
				bookDisplay.renderLoop = null;
			//}
			
			renderer.render( scene, camera );
			
			//if (document.getElementById("fliphelp"))
			//	document.getElementById("fliphelp").remove();
			
			window.removeEventListener("touchstart", bookDisplay.touchStart, false);
			window.removeEventListener("touchmove", bookDisplay.touchMove, false);
			window.removeEventListener("touchend", bookDisplay.touchEnd, false);
		
		},
		
		start : function() {
		
			//console.log("start");
		
			if (bookDisplay.visible != true && bookDisplay.renderLoop == null) {
				
				//console.log("starting");
		
				bookDisplay.visible = true;

				//console.log("starting");
				
				scene.add(bookDisplay.mesh);					
				
				var time = new Date();			
				bookDisplay.lastUpdate = Date.now();
				
				window.addEventListener( "touchstart", bookDisplay.touchStart, false );
				window.addEventListener( "touchmove", bookDisplay.touchMove, false);			
				window.addEventListener( "touchend", bookDisplay.touchEnd, false);
				
				var help = document.createElement("p");
				help.id = "fliphelp";
				help.appendChild(document.createTextNode("- - drag to examine - -"));
				
				document.getElementById("container").appendChild(help);
							
				bookDisplay.render();
				
				//bookDisplay.renderLoop = window.requestAnimationFrame(bookDisplay.render);
			
			}
		},
		
		pause : function() {
			
			//console.log("pausing");
		
			//if (bookDisplay.renderLoop != null) {
				window.cancelAnimationFrame(bookDisplay.renderLoop);
				bookDisplay.renderLoop = null;
			//}
			
			window.removeEventListener("touchstart", bookDisplay.touchStart, false);
			window.removeEventListener("touchmove", bookDisplay.touchMove, false);
			window.removeEventListener("touchend", bookDisplay.touchEnd, false);
		},
		
		resume : function() {
		
			//console.log("resuming");
		
			if (bookDisplay.visible == true) {
				var time = new Date();			
				bookDisplay.lastUpdate = Date.now();
				
				window.addEventListener( "touchstart", bookDisplay.touchStart, false );
				window.addEventListener( "touchmove", bookDisplay.touchMove, false);			
				window.addEventListener( "touchend", bookDisplay.touchEnd, false);
							
				bookDisplay.render();
			}
		}
	}

	var createInventory = function(container, bookList) {
	
		var remaining = document.createElement("h3");
		remaining.id = "remaining";
		
		catalogue.remaining = remaining;
	
		var heading = document.createElement("h1");
		heading.id = "inventoryHead";
		heading.appendChild(document.createTextNode("Book"));
		
		
		
		//container.appendChild(remaining);

		container.appendChild(heading);

		catalogue.change();
			
		//console.log("starting unwanted");	
		container.appendChild(catalogue.displayTab.element);
	}

	var start = function(features) {
	
		var info = document.createElement("div");
		//info.id = "info";
		
		var logo = document.createElement("div");
		logo.id = "logo";
		
		var bond = document.createElement("div");
		bond.id = "bond";
		
		info.appendChild(logo);
		info.appendChild(bond);
		
		var infotext = document.createElement("div");
		infotext.id = "intro";
		
		var text1 = document.createElement("h2");
		text1.appendChild(document.createTextNode("Welcome to Bookseller."));
		
		var text2 = document.createElement("p");		
		text2.appendChild(document.createTextNode("This application is part of a study into the valuation of e-books being undertaken as part of Stewart Todhunter’s Masters degree at Bond University, Australia. It will take a minute to complete."));
		
		var text3 = document.createElement("p");
		text3.appendChild(document.createTextNode("As a thank-you for donating your time to this research you will be entered into the draw for a gift card valued at "));
		
		var bold = document.createElement("b");
		bold.appendChild(document.createTextNode("$100 USD"));
		
		text3.appendChild(bold);

		text3.appendChild(document.createTextNode(" at a digital retailer of your choice (Amazon, Itunes or Google Play)."));
		
		var text4 = document.createElement("p");
		text4.appendChild(document.createTextNode("Your details for the draw will be taken on completion of the activity. When you're ready to proceed, press the OK button below."));
		
		
		var image = document.createElement("img");
		image.src = "assets/books.png";
		image.id = "introbooks";
		
		infotext.appendChild(text1);
		infotext.appendChild(text2);
		infotext.appendChild(text3);
		infotext.appendChild(text4);
		
		info.appendChild(infotext);
		
		info.appendChild(image);
				
		//info.id = "info";
		
		var toggle = false;
		
		note.create(info);
		
		var consent = document.createElement("div");
		
		var text1 = document.createElement("a");
		text1.appendChild(document.createTextNode("You may find an information sheet here."));
		text1.href = "explanationsheet.pdf";
		text1.target = "_blank";
		
		var text2 = document.createElement("p");
		text2.appendChild(document.createTextNode("This study is concerned largely with touch screen interfaces such as those found on smartphones and tablets, so if you aren't using a touch screen device currently, it would be preferred that you seek one out. Apple devices (particularly iPads) are ideal, while lower-end Android devices may struggle. If no such device is available to you, any platform will suffice."));
		
		var text4 = document.createElement("p");
		//text4.id="consenttext";
		text4.appendChild(document.createTextNode("I understand my participation in this study is completely voluntary and I may withdraw at any time without risking any negative consequences. If I choose to withdraw my participation in this study  the information I have provided will be immediately destroyed. All the data collected in this study will be treated with complete confidentiality and not made accessible to any person outside of the three researchers working on this project. The information obtained from me will be dealt with in a manner that ensures I remain anonymous. Data will be stored in a secured location at Bond University for a period of five years in accordance with the guidelines set out by the Bond University Human Research Ethics Committee."));
		
		var check1 = document.createElement("input");
		var check2 = document.createElement("input");
		
		check1.type = "checkbox";
		check1.id = "18old";
		/*check1.addEventListener("touchstart", function() {
			if (check2.checked)
				toggle = !toggle;
		}, false);*/
		
		
		check2.type = "checkbox";
		check2.id = "consentto";
		/*check2.addEventListener("touchstart", function() {
			if (check1.checked)
				toggle = !toggle;
		}, false);*/
		
		var form = document.createElement("form");
		form.index = "consent";
		form.id = "consent";
		
		var label1 = document.createElement("label");
		label1.appendChild(document.createTextNode("I am 18 or older"));
		label1.setAttribute("for", "18old");

		var label2 = document.createElement("label");
		label2.appendChild(document.createTextNode("I consent to the above"));
		label2.setAttribute("for", "consentto");
		
		form.appendChild(check1);
		//form.appendChild(document.createTextNode("I am 18 or older"));
		form.appendChild(label1);
		form.appendChild(document.createElement("br"));
		form.appendChild(check2);
		
		form.appendChild(label2);
		//form.appendChild(document.createTextNode("I consent to the above"));
		
		
		consent.appendChild(text1);
		//consent.appendChild(text2);
		//consent.appendChild(document.createElement("hr"));
		consent.appendChild(text4);
		consent.appendChild(form);
		
		var splash = document.createElement("div");
		splash.id = "splash";
		
		var start = function() {				
				
			var container = document.createElement("div");        
			container.id = "container";
						
			//container.appendChild(splash);
			
			document.body.appendChild(container);

			setTimeout(function() {			
		
				catalogue.init();
				
				//var bookinit = function() {
				
					//console.log(i);
			
				for (var i = 0; i < catalogue.books.length; i++) {
				
					catalogue.books[i].id = i;
					
					var stats = {
						"sellprice" : 0,
						"readtime" : 0,
						"externaltouchtime" : 0,
						"externaltouches" : 0,
						"internaltouchtime" : 0,
						"internaltouches" : 0,
						"sound" : Math.floor(Math.random() * sounds.books.length)
					}
					
					catalogue.books[i].stats = stats;
					
					/*catalogue.books[i].readtime = 0;
					catalogue.books[i].internaltouchtime = 0;
					catalogue.books[i].externaltouchtime = 0;
					catalogue.books[i].sellprice = 0;
					catalogue.books[i].externaltouches = 0;
					catalogue.books[i].internaltouches = 0;*/
					
					catalogue.books[i].demand = Math.random() + 1;
					
					
					catalogue.books[i].sound = sounds.books[stats.sound];
					
					//console.log("key : " + key);
					//catalogue.books[i].colour = "green";
					//catalogue.books[i].texture = resources.textures[key];		
					
					catalogue.books[i].price = 0;
				}
				
				//interval = setInterval(bookinit, 20);
				
				//clearInterval(interval);
						
				var skip = location.search.split('skip=')[1];
		
				//splash.parentNode.removeChild(splash);
							
				/*if (skip != null) {
					catalogue.books[0].stats.sellprice = 5.99;
					catalogue.soldbooks.push(catalogue.books[0]);
					end();
				} else {*/
				
					var checkloaded = function() {

						if (loaded == true) {
							createInventory(container);		
						} else {
							console.log("not loaded");
							setTimeout(function() { checkloaded() }, 50);
						}
					
					}
					
					checkloaded();
				//}
			
			}, 200);
		}
		
		var briefing = function() {
			if (check1.checked && check2.checked) {
			
				var brief = document.createElement("div");
				
				var logo = document.createElement("div");
				logo.id = "logo";
				
				brief.appendChild(logo);
				
				var text = document.createElement("div");
				text.id = "intro";
				
				
				var text1 = document.createElement("h3");
				text1.appendChild(document.createTextNode("The story so far...."));
				
				var text2 = document.createElement("p");
				text2.appendChild(document.createTextNode("You’ve just inherited an electronic tablet from your Aunt.  She is an avid e-book reader and the device is overloaded with books to the point where it's no longer usable. As it turns out, there is one ebook on your new tablet that you are able to resell. This will free up enough space to make the tablet usable again."));
				
				var text3 = document.createElement("p");
				text3.appendChild(document.createTextNode("Your task in Bookseller is straightforward: appraise the book. Examine its cover and interior then set a price based on how much you think the book is worth. Drag your finger over the book to rotate it in Exterior Mode and to turn the pages in Interior Mode."));
				
				var text4 = document.createElement("p");
				text4.appendChild(document.createTextNode("Your total profit from selling the books will be shown at the end."));
				
				var text5 = document.createElement("p");
				text5.appendChild(document.createTextNode("Press OK to begin."));
				
				brief.id = "brief";
				
				var ereader = document.createElement("img");
				ereader.src = "assets/ereader.png";
				ereader.id = "introbooks";
				
				text.appendChild(text1);
				text.appendChild(text2);
				text.appendChild(text3);
				//brief.appendChild(text4);
				text.appendChild(text5);
				
				brief.appendChild(text);
				brief.appendChild(ereader);
				
				/*setTimeout(function() {
					note.create(brief, function() {
						setTimeout(function(){
							end();
						}, 500);
					});
				}, 500 );*/
			
				setTimeout(function() {
					
					alert("Please turn up the sound on your device before starting");					
					note.create(brief, start);
						
				}, 500);
			
			} else {
				setTimeout(function() {note.create(consent, briefing, false, "Begin")}, 500);
			}
		}

		detectmob = function() { 
			if( navigator.userAgent.match(/Android/i)
				|| navigator.userAgent.match(/webOS/i)
				|| navigator.userAgent.match(/iPhone/i)
				|| navigator.userAgent.match(/iPad/i)
				|| navigator.userAgent.match(/iPod/i)
				|| navigator.userAgent.match(/BlackBerry/i)
				|| navigator.userAgent.match(/Windows Phone/i)
			){
				return true;
			}
			else {
				return false;
			}
		}
		
		var testing = location.search.split('testing=')[1];
		
		if (features) {
		
			if (detectmob()/* || testing != null*/) {
			
				note.create(consent, briefing, false, "Begin");	
				
			} else {
				var oops = document.createElement("h1");
				oops.appendChild(document.createTextNode("Oops!"));
				var notmobile = document.createElement("div");
				var text = document.createElement("p");
				text.appendChild(oops);
				
				var text1 = document.createElement("p");
				text1.appendChild(document.createTextNode("To participate in this study you must view this application on a tablet, phone or other touch device. Apple devices (particularly iPads) are ideal, while lower-end Android devices may struggle."));
			
				var text2 = document.createElement("p");
				text2.appendChild(document.createTextNode("Otherwise, you can help out by getting one of your friends to participate. Simply send the link below to someone, and if they are able to participate, you will both be entered into the draw for a $100USD digital voucher valid at Amazon, iTunes or Google Play."));
				
				notmobile.appendChild(oops);
				notmobile.appendChild(text1);			
				notmobile.appendChild(text2);	
				
				//var 		
				
				//note.create(saved, null, true);
							
				var socl = function() {
				
					if (currentuser == undefined) {
						setTimeout(socl, 500);
					} else {				
				
						var link = document.createElement("p");
						link.type = "text";
						link.id = "referral";
						link.setAttribute("readonly", true);
						
						var string = "http://bookseller.stewtodhunter.com/?referral=" + currentuser.userid;
						
						link.appendChild(document.createTextNode(string));
						
						link.size = string.length;
						
						var clipboard = document.createElement("div");
						clipboard.appendChild(document.createTextNode("Press to highlight"));
						clipboard.id = "clipboard";
						
						clipboard.addEventListener("mousedown", function() {
							//link.focus();
							
							setTimeout(function(){ link.setSelectionRange(0, link.value.length) }, 100);
							//link.focus();
				//			console.log("zsxdfsad");
						}, false);
						
						//var sharearea = document.createElement("div");
						//sharearea.id = "sharearea";
						
						var share = document.createElement("div");
						share.id = "sharenotmob";
						
						var email = document.createElement("a");
						email.id = "mailto";
						email.href = "mailto:?subject=Bookseller&body=Here's a great way to win $100 of digital swag.%0D%0A" + string
						share.appendChild(email);
						
						var facebook = document.createElement("div");
						facebook.classList.add("fb-share-button");
						facebook.setAttribute("data-href" , string);
						facebook.setAttribute("data-layout" , "button");
						
						share.appendChild(facebook);
						
						var tweet = document.createElement("a");		
						tweet.href = "https://twitter.com/intent/tweet?text=Here%27s%20a%20great%20way%20to%20win%20%24100%20of%20digital%20swag.";
						tweet.classList.add("twitter-share-button");
						//tweet.appendChild(document.createTextNode("Tweet"));
						tweet.setAttribute("data-url", string);
						tweet.setAttribute("data-count", "none");
						tweet.setAttribute("data-hashtags", "BooksellerStudy");
						//tweet.setAttribute("data-size", "large");		
						share.appendChild(tweet);
						
						var gplus = document.createElement("div");
						gplus.classList.add("g-plus");
						gplus.setAttribute("data-action", "share");
						gplus.setAttribute("data-annotation", "none");
						gplus.setAttribute("data-href", string);
						share.appendChild(gplus);
						
						var currentrefs = document.createElement("p");
						currentrefs.id = "refs";
						currentrefs.appendChild(document.createTextNode("You currently have "));
						var refs = document.createElement("span");
						refs.appendChild(document.createTextNode(currentuser.referrals));
						currentrefs.appendChild(refs);
						if (currentuser.referrals > 0) {
							currentrefs.appendChild(document.createTextNode(" referrals, which means you qualify for a extra raffle entry. Great job!"));
						} else {
							currentrefs.appendChild(document.createTextNode(" referrals, which means you don't yet qualify for a raffle entry."));
						}		
						
						//sharearea.appendChild(share);
						
						notmobile.appendChild(link);
						//saved.appendChild(clipboard);		
						notmobile.appendChild(share);
						//saved
						
						notmobile.appendChild(document.createElement("hr"));
						
						notmobile.appendChild(currentrefs);
					
						//alert(notmobile);
					
						//alert("socl");
					
						var face = function(d, s, id) {
						  var js, fjs = d.getElementsByTagName(s)[0];
						  
						  if (d.getElementById(id)) return;
						  
						  js = d.createElement(s); js.id = id;
						  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4";
						  fjs.parentNode.insertBefore(js, fjs);
						}
						
						face(document, 'script', 'facebook-jssdk');
						
						window.twttr = (function(d, s, id) {
						  var js, fjs = d.getElementsByTagName(s)[0],t = window.twttr || {};
						  if (d.getElementById(id)) return t;
						  js = d.createElement(s);
						  js.id = id;
						  js.src = "https://platform.twitter.com/widgets.js";
						  fjs.parentNode.insertBefore(js, fjs);
						 
						  t._e = [];
						  t.ready = function(f) {
							t._e.push(f);
						  };
						 
						  return t;
						}(document, "script", "twitter-wjs"));
						
						var script = document.createElement("script");
						script.type = "text/javascript";
						script.src = "https://apis.google.com/js/platform.js";
						script.setAttribute("defer", "defer");
						script.setAttribute("async", "async");

						document.body.appendChild(script);
					
					}
				
				}			
				
				note.create(notmobile, null, true, null, socl);
			}
		
		} else {
			var nowebgl = document.createElement("div");
			var text = document.createElement("p");
			text.appendChild(document.createTextNode("Your browser doesn't support some of the features required to participate in this study"));
			nowebgl.appendChild(text);
			note.create(nowebgl, null, true);
		}
	
	}

	var init = function() {
	
		

		//testing = location.search.split('test=')[1];
		
		feedback = location.search.split('feed=')[1];
		
		//mute = false;	
		mute = location.search.split('mute=')[1];
		
		referral = location.search.split('referral=')[1];
		
		var empty = location.search.split('empty=')[1];
		
		if (referral == undefined) {
			referral = null;
		}
		
		if (empty) {
			localStorage.removeItem("user");
		}
		
		//alert("referral: " + referral);
		
		//if (testing) {
		//	alert("testing mode is on");
		//}
		
		if (!feedback) {
			//alert("feedback mode is off");
			feedback = false
		} else {
			feedback = true;
		}
		
		feedback = true;
		
		var loadIcon = document.createElement("img");
		loadIcon.src = "assets/icon.png";													
		
		loadIcon.onload = function() {

		
			document.body.classList.remove("black");
		
			document.body.classList.add("green");
			
			var container = document.body;
			//container.id = "container";	
			
			var splash = document.createElement("div");
			splash.id = "splash";
			
			container.appendChild(splash);	
			
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "//code.jquery.com/jquery-1.11.0.min.js";

			var checkWebgl = function() {
				try {
					return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
				} catch(e) {
					return false;
				}
			}		

			var features = checkWebgl();
			
			start(features);	
			
			document.body.appendChild(script);
			
			script.onload = function() {
				
				console.log("jquery loaded");

				script = document.createElement("script");
				script.type = "text/javascript";
				script.src = "//code.jquery.com/jquery-migrate-1.2.1.min.js";	

				document.body.appendChild(script);
				
				script.onload = function() {
				
					script = document.createElement("script");
					script.type = "text/javascript";
					script.src = "http://www.geoplugin.net/javascript.gp";	

					document.body.appendChild(script);
					
					script.onload = function() {	
						
						script = document.createElement("script");
						script.type = "text/javascript";
						script.src = "libs/turnjs/turn.js";
						
						document.body.appendChild(script);
						
						script.onload = function() {
						
							console.log("turnjs loaded");
					
							console.log("jquery migrate loaded");				
					
							var load = function(resources) {
							
								//sounds.bell = document.createElement('audio');		
								//sounds.bell.src = "assets/bell.mp3";
								
								sounds.coins = document.createElement('audio');		
								sounds.coins.src = "assets/coins.mp3";
								
								/*var bond = document.createElement("img");
								bond.src = "assets/bond_logo.png";
								bond.onload = function() {
								
									var heading = document.createElement("img");
									heading.src = "assets/heading.png";
									heading.onload = function() {
									
										var books = document.createElement("img");
										books.src = "assets/books.png";
										books.onload = function() {*/
										
								var ereader = document.createElement("img");
								ereader.src = "assets/ereader.png";
												
								var xhr;

								var randKey = Math.random();

								xhr = CreateXHR();
								xhr.onreadystatechange = function() {
									if (xhr.readyState == 4) {
									
										catalogue.books = JSON.parse(xhr.responseText);
									
										//loadBooks(0, function() {
										
											//console.log("ready");
											
											var bookLoad = new THREE.JSONLoader(); 
								
											bookLoad.load( "assets/book.js" ,function( geometry) {
											
													if (features) {
													
													//resources.textures[0] = {"colour" : "green" , "map" : green};
													//resources.textures[1] = {"colour" : "red" , "map" : red};
													//resources.textures[2] = {"colour" : "blue" , "map" : blue};
													//resources.textures[3] = {"colour" : "yellow" , "map" : yellow};
													
													var material = new THREE.MeshLambertMaterial({map : THREE.ImageUtils.loadTexture('assets/book.jpg')});
																																	
													//resources.ground = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color: '#cd7b32'}) );
													resources.mesh = new THREE.Mesh( geometry, material);
													
													//feedback = false;

													renderer = new THREE.WebGLRenderer( {alpha : true});	
													renderer.setSize( window.innerWidth, window.innerHeight );
													renderer.domElement.id = "renderer";
													document.body.appendChild(renderer.domElement);

													camera = new THREE.PerspectiveCamera(
														25,         // Field of view
														renderer.domElement.width / renderer.domElement.height,  // Aspect ratio
														0.1,         // Near
														100000       // Far
													);
													
													//controls = new THREE.OrbitControls( camera );
													//controls.damping = 0.0;
													//controls.addEventListener( 'change', render );
													
													scene = new THREE.Scene();
													
													//scene.add(mesh);
													
													var ambient = new THREE.AmbientLight('#808080');
													scene.add(ambient);
													
													var light = new THREE.SpotLight( 0xffffff, 0.6 );
													light.position.set( 0, 10, 0 );
													light.castShadow = true;

													light.shadowCameraNear = 200;
													light.shadowCameraFar = camera.far;
													light.shadowCameraFov = 50;

													light.shadowBias = -0.00022;
													light.shadowDarkness = 0.5;

													light.shadowMapWidth = 2048;
													light.shadowMapHeight = 2048;

													scene.add( light );
													
													//cube = new THREE.Mesh( new THREE.CubeGeometry( 5, 5, 5 ), new THREE.MeshNormalMaterial() );
													//scene.add(cube);
													   
													//element.id = "book";
													//game.element.classList.add("fadeIn-fast");
													//frame.appendChild(element);
													
													camera.position.z = -9;
													camera.position.x = 0;
													
													camera.lookAt( new THREE.Vector3(0, 0, 0) );
													
													//console.log("scene is set up");
													
													
													bookDisplay.init();
													
													loaded = true;
													
													//onLoad();	

													//homeScreen(container);
													//pages(container);
													
													//console.log("loaded");
													
													
													
													//window.addEventListener('resize', function() {
													//	renderer.setSize( window.innerWidth, window.innerHeight );
													//	// update the camera
													//	camera.aspect = window.innerWidth / window.innerHeight;
													//	camera.updateProjectionMatrix();
													//}, false);
													
												}
												
												splash.parentNode.removeChild(splash);
												
											});
										//});
									}
								}
								
								xhr.open("GET", "assets/books.js?id="+randKey, true);
								xhr.send(null); 
							}

							var newUser = function() {
																
								function generateUUID(){
									var d = new Date().getTime();
									var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
										var r = (d + Math.random()*16)%16 | 0;
										d = Math.floor(d/16);
										return (c=='x' ? r : (r&0x3|0x8)).toString(16);
									});
									return uuid;
								};
							
								var uuid = generateUUID();
								
								var country = geoplugin_countryName();
								
								currentuser = {
									userid : uuid,
									useragent : navigator.userAgent,
									platform : navigator.platform,
									country : country,
									profit : 0.00,
									email : "",
									age : 0,
									vendor : "",
									referrals : 0,
									debrief : 0,
									comment : ""
								}									

								var userxhr = CreateXHR();
			
								userxhr.onreadystatechange = function() {
									if (userxhr.readyState == 4) {

										localStorage.setItem("user", uuid);
										
										console.log("new user created");
										load(resources);
									}									
								}
								
								userxhr.open("POST", "saveuser.php", true);
						
								var statsstring = "user=" + JSON.stringify(currentuser);
								userxhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
								userxhr.send(statsstring);
							}
														
							if (localStorage.getItem("user") == null) {									
							
								newUser();		
								
							} else {
							
								//"touchstart" = "touchstart";
								
								//alert("touchstart");
							
								var uuid = localStorage.getItem("user");
							
								xhr = CreateXHR();
								xhr.onreadystatechange = function() {
									if (xhr.readyState == 4) {
									
										//console.log(xhr.responseText);
									
										if (xhr.responseText == "null") {
										
											newUser();										
											
										} else {
									
											//var user = JSON.pa
										

											//console.log(xhr.responseText);
																							
											currentuser = JSON.parse(xhr.responseText);
											
											//console.log(xhr.responseText);
											
											if (currentuser.profit != 0) {													
												
												splash.parentNode.removeChild(splash);
											
												if (currentuser.email == "") {
													
													raffle();
													
												} else {
												
													completed();
												
												}
											
											} else {
												load(resources);
											}
										}
									}
								}
								
								xhr.open("GET", "getuser.php?"+"uuid=" + uuid, true);
								
								xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
								xhr.send(); 
								//xhr.send("uuid=10" + uuid); 
								//alert(localStorage.getItem("user"));
							}
							
							//} else {
							/*	splash.parentNode.removeChild(splash);
				
								var nowebgl = document.createElement("div");
								var text = document.createElement("p");
								text.appendChild(document.createTextNode("Your browser doesn't support some of the features required to participate in this study"));
								nowebgl.appendChild(text);
								note.create(nowebgl, null, true);
										
				*/			//}
						}
					}
				}
			
			}
		
		}
		
	}
	
	init();
}