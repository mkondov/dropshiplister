var i18n_labels={
		  ".com":
			  {"Manufacturer":"Manufacturer",
			  "Condition":"Condition",
			  "Reference Number(s) OE":"Reference Number(s) OE",
			  "Reference Number(s) OEM":"Reference Number(s) OEM",
			  "Manufacturer Part Number":"Manufacturer Part Number",
			  "Manufacturer Number":"Manufacturer Number",
			  "Reference OE/OEM Number":"Reference OE/OEM Number",
			  "Other Part Number":"Other Part Number",
		      "Interchange Part Number":"Interchange Part Number",
			  "EAN":"EAN",
			  "UPC":"UPC",
			  "Brand":"Brand",
			  "Model":"Model",
			  "Size":"Size",
			  "New":"New",
			  "Does Not Apply":"Does Not Apply"}
		  ,
		  ".com.au":
			  {"Manufacturer":"Manufacturer",
			  "Condition":"Condition",
			  "Reference Number(s) OE":"Reference Number(s) OE",
			  "Reference Number(s) OEM":"Reference Number(s) OEM",
			  "Manufacturer Part Number":"Manufacturer Part Number",
			  "Manufacturer Number":"Manufacturer Number",
			  "Reference OE/OEM Number":"Reference OE/OEM Number",
			  "Other Part Number":"Other Part Number",
		      "Interchange Part Number":"Interchange Part Number",
			  "EAN":"EAN",
			  "UPC":"UPC",
			  "Brand":"Brand",
			  "Model":"Model",
			  "Size":"Size",
			  "New":"New",
			  "Does Not Apply":"Does Not Apply"}
		  ,
		  ".co.uk":
			  {"Manufacturer":"Manufacturer",
			  "Condition":"Condition",
			  "Reference Number(s) OE":"Reference Number(s) OE",
			  "Reference Number(s) OEM":"Reference Number(s) OEM",
			  "Manufacturer Part Number":"Manufacturer Part Number",
			  "Manufacturer Number":"Manufacturer Number",
			  "Reference OE/OEM Number":"Reference OE/OEM Number",
			  "Other Part Number":"Other Part Number",
		      "Interchange Part Number":"Interchange Part Number",
			  "EAN":"EAN",
			  "UPC":"UPC",
			  "Brand":"Brand",
			  "Model":"Model",
			  "Size":"Size",
			  "New":"New",
			  "Does Not Apply":"Does Not Apply"}
		  ,
		  ".de":
			  {"Manufacturer":"Hersteller",
			  "Condition":"Artikelzustand",
			  "Reference Number(s) OE":"Referenznummer(n) OE",
			  "Reference Number(s) OEM":"Referenznummer(n) OEM",
			  "Manufacturer Part Number":"Herstellernummer",
			  "Manufacturer Number":"Herstellernummer",
			  "Reference OE/OEM Number":"Referenznummer(n) OEM",
			  "Other Part Number":"Weitere Artikelnummer",
		      "Interchange Part Number":"Austauschbar Teilenummer",
			  "EAN":"EAN",
			  "UPC":"UPC",
			  "Brand":"Marke",
			  "Model":"Modell",
			  "Size":"Größe",
			  "New":"Neu",
			  "Does Not Apply":"Nicht zutreffend"}
		  ,
		  ".fr":
			  {"Manufacturer": "Fabricant",
			  "Condition": "Condition",
			  "Reference Number(s) OE": "Numéro de référence(n) OE",
			  "Reference Number(s) OEM": "Référence(n) OEM",
			  "Manufacturer Part Number": "Numéro de pièce du fabricant",
			  "Manufacturer Number": "Numéro de fabricant",
			  "Reference OE/OEM Number":"Référence(n) OEM",
			  "Other Part Number":"Autre référence",
		      "Interchange Part Number":"Numéros de pièces échangeables",
			  "EAN": "EAN",
			  "UPC": "UPC",
			  "Brand": "Marque",
			  "Model": "Modèle",
			  "Size": "Taille",
			  "New": "Nouveau",
			  "Does Not Apply": "Ne s'applique pas"}
			  ,
		 ".es":{"Manufacturer": "Fabricante",
				  "Condition": "Condición",
				  "Reference Number(s) OE": "Número(s) de referencia OE",
				  "Reference Number(s) OEM": "Número(s) de referencia OEM",
				  "Manufacturer Part Number": "Número de pieza del fabricante",
				  "Manufacturer Number": "Número de fabricante",
				  "Reference OE/OEM Number":"Número(s) de referencia OEM",
				  "Other Part Number":"Otro número de parte",
			      "Interchange Part Number":"Números de parte intercambiables",
				  "EAN": "EAN",
				  "UPC": "UPC",
				  "Brand": "Marca",
				  "Model": "Modelo",
				  "Size": "Tamaño",
				  "New": "Nuevo",
				  "Does Not Apply": "No se aplica"}
			,
		  ".it":
			  {"Manufacturer": "Produttore",
			  "Condition": "Condition",
			  "Reference Number(s) OE": "Numero/i di riferimento OE",
			  "Reference Number(s) OEM": "Numero/i di riferimento OEM",
			  "Manufacturer Part Number": "Numero di parte del produttore",
			  "Manufacturer Number": "Numero produttore",
			  "Reference OE/OEM Number":"Numero/i di riferimento OEM",
			  "Other Part Number":"Altro numero parte",
		      "Interchange Part Number":"Numeri di parte intercambiabili",
			  "EAN": "EAN",
			  "UPC": "UPC",
			  "Brand": "Brand",
			  "Model": "Modello",
			  "Size": "Dimensione",
			  "New": "Nuovo",
			  "Does Not Apply": "Non applicabile"}
			
  }
var labels = i18n_labels[".com"];

var gl_ebay_id_interval=null;

function getAccInfo() {
    $.ajax({
      url: "https://www.ebay.com/sh/ovw",
      method: "GET",
      cache: false,
      success: function(resp) {
        try {
          var ebay_acc = jQuery("#sho-sellerhub-header > div > div.sh-member-badge > a")
            .html()
            .split("<span")[0];
          chrome.storage.local.set({ ebay_acc: ebay_acc });
        } catch (e) {}
      }
    });
  }
function loadPasteEbayButtons(){

    jQuery("input[fn='svLr']").on("click",function(){
        chrome['storage']['local']['get'](function(resp) {

            var new_listing_domain = window.location.hostname.match(/\.co\.uk|\.com|\.com\.au|\.de|\.fr|\.es|\.it/);
            new_listing_domain=new_listing_domain[0];
            //var new_listing_id = resp['vendor_link']['split']('/itm/')[1].split("/")[1].split("?")[0];
			try{
				var new_listing_id = window['location']['href'].toString().match(/draft_id=([\w]+)&/)[1];
			} catch(e){
				try{
					var new_listing_id = window['location']['href'].toString().match(/draftId=([\w]+)&/)[1];
				} catch(e){
					var new_listing_id='';
				}

			}
            var new_listing_url = "https://ebay"+new_listing_domain+"/itm/"+new_listing_id;
            var listing_title = jQuery("#editpane_title").val();
            var listing_cat = jQuery("#origCat").val();
            var listing_price = jQuery("#binPrice").val().trim().replace(/[^\d\.\,]+/g,"");
            var listing_quantity = jQuery("#quantity").val();
            var main_images = resp.main_images;

            try{
                var vendor_link = resp['vendor_link'];
            } catch(e){
                var vendor_link = "";
            }
            try{
                var vendor_price = "0.00";
            } catch(e){
                var vendor_price = resp['price'];
            }

            $["ajax"]({
                url: "https://dalio.io/app/api/extauth",
                method: "GET",
                contentType: "application/json",
                cache: false,
                success: function(resp) {
                    if (resp["code"] == 200) {
                        chrome.runtime.sendMessage({
                            type: 'new_listing',
                            'info_obj':{
                                "user_email":resp['user_email'],
                                "store": "ebay",
                                "store_id": new_listing_id,
                                "store_domain": new_listing_domain,
                                "store_url": new_listing_url,
                                "supplier_url": vendor_link,
                                "supplier_price":vendor_price,
                                "item_name": listing_title,
                                "store_category": listing_cat,
                                "store_quantity": listing_quantity,
                                "store_price":listing_price,
                                "main_images":main_images
                            }
                        });
                    }
                }
            });
        });
    });
	
	jQuery("input[fn='pub']").on("click",function(){
  	  chrome['storage']['local']['get'](function(resp) {
      	  
  		var new_listing_domain = window.location.hostname.match(/\.co\.uk|\.com|\.com\.au|\.de|\.fr|\.es|\.it/);
    	  new_listing_domain=new_listing_domain[0];
          //var new_listing_id = resp['vendor_link']['split']('/itm/')[1].split("/")[1].split("?")[0];
		  try{
			  var new_listing_id = window['location']['href'].toString().match(/draft_id=([\w]+)&/)[1];
		  } catch(e){
			  try{
				  var new_listing_id = window['location']['href'].toString().match(/draftId=([\w]+)&/)[1];
			  } catch(e){
				  var new_listing_id='';
			  }

		  }
          var new_listing_url = "https://ebay"+new_listing_domain+"/itm/"+new_listing_id;
          var listing_title = jQuery("#editpane_title").val();
          var listing_cat = jQuery("#origCat").val();
          var listing_price = jQuery("#binPrice").val().trim().replace(/[^\d\.\,]+/g,"");
          var listing_quantity = jQuery("#quantity").val();
		  var main_images = resp.main_images;

          try{
              	var vendor_link = resp['vendor_link'];
  		} catch(e){
  			var vendor_link = "";
  		}
          try{
          	var vendor_price = "0.00";
          } catch(e){
          	var vendor_price = resp['price'];
          }
          
          $["ajax"]({
              url: "https://dalio.io/app/api/extauth",
              method: "GET",
              contentType: "application/json",
              cache: false,
              success: function(resp) {
              	if (resp["code"] == 200) {
              		chrome.runtime.sendMessage({
                          type: 'new_listing',
                          'info_obj':{
							  "user_email":resp['user_email'],
							  "store": "ebay",
							  "store_id": new_listing_id,
							  "store_domain": new_listing_domain,
							  "store_url": new_listing_url,
							  "supplier_url": vendor_link,
							  "supplier_price":vendor_price,
							  "item_name": listing_title,
							  "store_category": listing_cat,
							  "store_quantity": listing_quantity,
							  "store_price":listing_price,
							  "main_images":main_images
                          }
                      });
              	}
              }
            });
        });
    });
	
	gl_ebay_id_interval = setInterval(function() {
        chrome['storage']['local']['get'](function(resp) {
            if (jQuery('#success_msg_title')['is'](':visible')) {
          	  var new_listing_domain = window.location.hostname.match(/\.co\.uk|\.com|\.com\.au|\.de|\.fr|\.es|\.it/);
          	  new_listing_domain=new_listing_domain[0];
                var new_listing_id = jQuery('#success_msg_title')['attr']('href')['split']('/itm/')[1];
				if (new_listing_id=='#itemId'){
					try{
						var new_listing_id = window['location']['href'].toString().match(/draft_id=([\w]+)&/)[1];
					} catch(e){
						try{
							var new_listing_id = window['location']['href'].toString().match(/draftId=([\w]+)&/)[1];
						} catch(e){
							var new_listing_id='';
						}

					}
				}

				if (new_listing_id=='#itemId' || new_listing_id==''){
					return;
				}

                var new_listing_url = "https://ebay"+new_listing_domain+"/itm/"+new_listing_id;
                var listing_title = jQuery("#editpane_title").val();
                var listing_cat = jQuery("#origCat").val();
                var listing_price = jQuery("#binPrice").val().trim().replace(/[^\d\.\,]+/g,"");
                var listing_quantity = jQuery("#quantity").val();
                var main_images = resp.main_images;
                
                try{
	                	var vendor_link = resp['vendor_link'];
        		} catch(e){
        			var vendor_link = "";
        		}
                try{
                	var vendor_price = "0.00";
                } catch(e){
                	var vendor_price = resp['price'];
                }
                
                $["ajax"]({
                    url: "https://dalio.io/app/api/extauth",
                    method: "GET",
                    contentType: "application/json",
                    cache: false,
                    success: function(resp) {
                    	if (resp["code"] == 200) {
                    		chrome.runtime.sendMessage({
                                type: 'new_listing',
                                'info_obj':{
									"user_email":resp['user_email'],
									"store": "ebay",
									"store_id": new_listing_id,
									"store_domain": new_listing_domain,
									"store_url": new_listing_url,
									"supplier_url": vendor_link,
									"supplier_price":vendor_price,
									"item_name": listing_title,
									"store_category": listing_cat,
									"store_quantity": listing_quantity,
									"store_price":listing_price,
									"main_images":main_images
                                }
                            });
                    	}
                    }
                  });
                clearInterval(gl_ebay_id_interval);
            }
        })
    }, 1000);
    

	
	  var pastBtn = jQuery(
	          "<input class='shipping-btn' style='width:100%;margin-top:15px;' type='button' id='ebayPaste' value='Insert Details'>"
	        );
	        pastBtn.off();
	        pastBtn["on"]("click", pasteEbay);
	        pastBtn["on"]("click", getAccInfo);

	        setInterval(function() {
	          if (!jQuery("#ebayPaste")["length"]) {
	            jQuery("#editpaneSect_Title").before(pastBtn);
	          }
	        }, 500);
	        
	function descriptionButtonClicked(event){
	      	  event.preventDefault();
	      	  chrome.storage.local.get(function(resp){

				  if ((typeof resp.description=='undefined' || resp.description=='') &&
					  (typeof resp.desc_template=='undefined' || resp.desc_template=='')){
					  jQuery("#descButton").notify("Description empty, or not yet copied!", {
						  className: "error",
						  position: "t"
					  });
					  return;
				  }

				  jQuery("#descButton").notify("Inserted!", {
					  className: "success",
					  position: "t"
				  });

	      		 
	      		try {
	                jQuery("a[id$=cancle]")[0].click();
	              } catch (e) {}

	              jQuery("[id$=_switchLnk] > a.std-lnk")[0].click();
	              try {


	                var desc_html = "";

	                  if (resp.source == "amazon") {
	                    resp.description += resp.bullet_points_html;
	                  } else if (resp.source == "ebay" && typeof(resp.ebay_desc)!='undefined') {
	                    resp.description = resp.ebay_desc;
	                  }

	                  if (resp.description.indexOf("<html>") == -1) {
	                    desc_html = resp.description;

	                    
	                  } else {
	                    desc_html = jQuery(resp.description).html();

	                    desc = jQuery(desc_html);

	                    desc.find("*[style]").removeAttr("style");
	                    desc.find("*[class]").removeAttr("class");
	                    desc.find("*[onclick]").removeAttr("onclick");
	                    desc.find("*[oncontextmenu]").removeAttr("oncontextmenu");
	                    desc.find("*[onmousedown]").removeAttr("onmousedown");
	                    desc.find("*[onmouseup]").removeAttr("onmouseup");
	                    desc.find("*[onselectstart]").removeAttr("onselectstart");
	                    desc.find("script").remove();

	                    var clean_html = "";
	                    for (var d = 0; d < desc.length; d++) {
	                      clean_html += desc[d].outerHTML;
	                    }

	                    desc_html=clean_html;
	                   // var html_as_text = document.createTextNode(desc_html);
	                  }

	              } catch (e) {
	                var html_as_text = document.createTextNode("");
	              }
	              
	              //desc_html=desc_html.replace(/http\:/gi,"https:");
	              desc_html=desc_html.replace(/<a(.*)href=("|')([^'"]+)("|')(.*)>/gi,"<a$1href=''$5>");//.replace(/<img(.*)src=("|')([^'"]+)("|')(.*)>/gi,"<img$1src=''$5>");
	              desc_html=desc_html.replace(/<script.*?>[\s\S]*?<\/script>/ig, "");
	              var html_as_text = document.createTextNode(desc_html);
	              //HTTPS->HTTP
	              //html_as_text=html_as_text.replace(/https\:/gi,"http:");
	              //html_as_text=html_as_text.replace(/<script.*?>[\s\S]*?<\/script>/ig, "");
	              

	              jQuery("[id$=txtEdit_ht]")
	                .contents()
	                .find("body")
	                .html(html_as_text);
	              jQuery("[id$=_switchLnk] > a.htm-lnk")[0].click();
	      	  });
	        }
	        var descriptionButtonInterval = setInterval(function(){
	      	  
	      	  if (!jQuery("#descButton").length){
	      		  if (jQuery("div#descDiv:visible").length){
	      				  
	      		          var descButton = jQuery(
	      		                        "<a id='descButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Description</a>"
	      		                      );
	      		          jQuery("div#descDiv").prepend(descButton);
	      		          descButton.on("click",descriptionButtonClicked);
	      		          //clearInterval(descriptionButtonInterval);
	      			 
	      		  }
	      		  
	      	  }
	              },3000);
	        
	        function itemSpecificsButtonClicked(event){
		      	  event.preventDefault();
		      	  chrome.storage.local.get(function(resp){

					  if (resp.specifics.length==0){
						  jQuery("#itmSpcButton").notify("No item specifics copied!", {
							  className: "error",
							  position: "t"
						  });
						  return;
					  }

					  jQuery("#itmSpcButton").notify("Inserting...", {
						  className: "success",
						  position: "t"
					  });

		      		
		      		var domain = window.location.hostname.match(/\.co\.uk|\.com|\.com\.au|\.de|\.fr|\.es|\.it/);
		  			domain=domain[0];
		  			labels = i18n_labels[domain];
		      		 
		      		function nextElement(ind) {
		      	        try {
		      	          if (ind == 1) {
		      	        	for (var s = 0; s < resp.specifics.length; s++) {
		      	              var spec = resp.specifics[s];

		      	              spec.left_side = spec.left_side
		      	                .replace(
		      	                  /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
		      	                  ""
		      	                )
		      	                .trim();
		      	              spec.right_side = spec.right_side
		      	                .replace(
		      	                  /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
		      	                  ""
		      	                )
		      	                .trim();

		      	              if (spec.left_side.indexOf("ASIN") != -1) {
		      	                continue;
		      	              }
		      	              if (spec.left_side.indexOf("Seller") != -1) {
		      	                continue;
		      	              }
		      	              if (spec.left_side.indexOf("Rank") != -1) {
		      	                continue;
		      	              }
		      	              if (spec.left_side.indexOf("Reviews") != -1) {
		      	                continue;
		      	              }
		      	              if (spec.left_side.indexOf("Amazon") != -1) {
		      	                continue;
		      	              }

		      	              if (spec.left_side == "") continue;

		      	              if (spec.left_side.toLowerCase().indexOf("model") != -1) {
		      	                jQuery("input[name=_st_Model]").val(spec.right_side);
		      	                try {
		      	                  jQuery("input[id*='MPN']").val(spec.right_side);
		      	                } catch (e) {}
		      	              try {
		      	                	jQuery("input[name=_st_"+labels['Model']+"]").val(spec.right_side);
		      	                } catch(e){
		      	                	
		      	                }
		      	              }
		      	              if (spec.left_side.toLowerCase().indexOf("material") != -1) {
		      	                jQuery("input[name=_st_Material]").val(spec.right_side);
		      	                try {
		      	                	jQuery("input[name=_st_"+labels['Material']+"]").val(spec.right_side);
		      	                } catch(e){
		      	                	
		      	                }
		      	              }
		      	              if (spec.left_side.toLowerCase().indexOf("dimensions") != -1) {
		      	                jQuery("input[name=_st_Size]").val(spec.right_side);
		      	                try {
		      	                	jQuery("input[name=_st_"+labels['Size']+"]").val(spec.right_side);
		      	                } catch(e){
		      	                	
		      	                }
		      	              }

		      	              /*if (jQuery("input[id^=Listing\\.Item\\.ItemSpecific\\["+spec.left_side+"\\]]").length!=0){
		      									jQuery("input[id^=Listing\\.Item\\.ItemSpecific\\["+spec.left_side+"\\]]").val(spec.right_side);
		      									continue;
		      								}*/
		      	              /*if (jQuery("input[id^=Listing\.Item\.ItemSpecific\["+spec.left_side+"\]]").length!=0){
		      									jQuery("input[id^=Listing\.Item\.ItemSpecific\["+spec.left_side+"\]]").val(spec.right_side);
		      								continue;
		      								jQuery("input[id*=Brand]")
		      								}*/

		      	              try {
		      	                jQuery("input[id^=_st_CustomTag]")
		      	                  .parent()
		      	                  .find("span:contains('" + spec.left_side + "')")
		      	                  .parent()
		      	                  .find("input[id^=_st_CustomTag]")
		      	                  .val(spec.right_side);
		      	              } catch (e) {}
		      	              try {
		      	                if (jQuery("input[id*='" + spec.left_side + "']").length == 1) {
		      	                  jQuery("input[id*='" + spec.left_side + "']").val(spec.right_side);
		      	                }
		      	              } catch (e) {}
		      	              //jQuery("input[id^=upc").val
		      	              //jQuery("#v4-26")[0].click();
		      	              //jQuery("div[id$=itmSpcMain]:contains('Add your own item specific') a")[0].click()

		      	              try {
		      	                jQuery("a[id$=cancle]")[0].click();
		      	              } catch (e) {}
		      	              try {
		      	                //jQuery("div[id$=itmSpcMain]:contains('Add your own item specific') a[id^=v4]")[0].click();
		      	            	 try{
		      	            		  jQuery("a[class$='Cust'][id^=v4]")[0].click();
		      	            	  } catch(e){
		      	            		  if (jQuery("a[id^=v4]:contains('Add your own item specific')").length){
		      	                		  jQuery("a[id^=v4]:contains('Add your own item specific')")[0].click();
		      	                	  } else {
		      	                		  jQuery("a[id^=v4]:contains('item specific')")[0].click();
		      	                	  }
		      	            	  }

		      	                if (spec.left_side.length > 63) {
		      	                  spec.left_side = spec.left_side.substring(0, 63);
		      	                }
		      	                if (spec.right_side.length > 63) {
		      	                  spec.right_side = spec.right_side.substring(0, 63);
		      	                }
		      	                jQuery("#_isTag")[0].value = spec.left_side;
		      	                jQuery("#_isVal")[0].value = spec.right_side;
		      	                if (jQuery("#_errTag").is(":visible")) {
		      	                  //jQuery("#v4-47cancle")[0].click();
		      	                  jQuery("a[id$=cancle]")[0].click();
		      	                } else {
		      	                  jQuery("#_isSave")[0].click();
		      	                }
		      	              } catch (e) {
		      	                
		      	              }
		      	              try {
		      	                  jQuery("a[id$=cancle]")[0].click();
		      	                } catch (e) {}
		      	              var dropdownSpecifics = jQuery("[id^='editpane_Listing.Item.ItemSpecific']");
		      	              for (var d = 0; d < dropdownSpecifics.length; d += 1) {
		      	                try {
		      	                  var dropdownSpecificTitle = dropdownSpecifics
		      	                    .eq(d)
		      	                    .attr("id")
		      	                    .match(/\[[\w\s]+\]/)[0]
		      	                    .replace(/\[|\]/g, "");
		      	                  if (
		      	                    spec.left_side.toLowerCase().indexOf(dropdownSpecificTitle.toLowerCase()) != -1
		      	                  ) {
		      	                    var ddSpid = dropdownSpecifics
		      	                      .eq(d)
		      	                      .attr("id")
		      	                      .replace("editpane_", "");

		      	                    jQuery("input[id='" + ddSpid + "']")
		      	                      .parent()
		      	                      .find("button")
		      	                      .click();

		      	                    jQuery("ul[id='" + ddSpid + "_menu_js']")
		      	                      .find("li[title='" + spec.right_side.trim() + "']")
		      	                      .find("a")[0]
		      	                      .click();
		      	                  }
		      	                } catch (e) {}
		      	              }
		      	              
		      	              
		      	              try {
		      	                  jQuery("a[id$=cancle]")[0].click();
		      	                } catch (e) {}
		      	              
		      	              
		      	            }
		      	          } else if (ind==2){
		      	        	for (var s = 0; s < resp.specifics.length; s++) {
		                        var spec = resp.specifics[s];

		                        if (spec.left_side.indexOf("EAN") != -1) {
		                       	 if (resp.EAN==""){
		                       		 resp.EAN=spec.right_side;
		                       	 }
		                       	 try {
		                                jQuery("input[name=_st_EAN]").val(spec.right_side);
		                              } catch (e) {}
		                              try {
		                                jQuery("input[id*='EAN']").val(spec.right_side);
		                              } catch (e) {}
		                              try {
		                              	 jQuery("input#ean").val(spec.right_side);
		                                } catch (e) {}
		                        }
		                        
		                        if (spec.left_side.indexOf("UPC") != -1) {
		                       	 
		                       	 if (resp.UPC==""){
		                       		 resp.UPC=spec.right_side;
		                       	 }
		                       	 try {
		                                jQuery("input[name=_st_UPC]").val(spec.right_side);
		                              } catch (e) {}
		                              try {
		                                jQuery("input[id*='UPC']").val(spec.right_side);
		                              } catch (e) {}
		                              try {
		                              	 jQuery("input#upc").val(spec.right_side);
		                                } catch (e) {}
		                        }
		               	 }
		      	          } else if (ind==3){
		      	        	  
		      	        	if (resp.MPN){
		                 	   try {
		                         jQuery("[name*='Manufacturer Part Number']").val(resp.MPN);
		                         jQuery("[id='Listing.Item.ItemSpecific[Manufacturer Part Number]']").val(resp.MPN);
		                       } catch (e) {}
		                       
		                       try {
			                         jQuery("[name*='"+labels['Manufacturer Part Number']+"']").val(resp.MPN);
			                         jQuery("[id='Listing.Item.ItemSpecific["+labels['Manufacturer Part Number']+"]']").val(resp.MPN);
			                       } catch (e) {}
		                       
		                       try {
		                           jQuery("input[id*='MPN']").val(resp.MPN);
		                         } catch (e) {}
		                   }
		      	        	
		      	        	  
		      	        	if (resp.brand) {
		      	                try {
		      	                  jQuery("input[id*='Brand']").val(resp.brand);
		      	                } catch (e) {}
		      	                try {
		      	                	jQuery("input[name*='Brand']").val(resp.brand);
		      	                } catch (e) {}
		      	              try {
		      	                  jQuery("input[name=_st_"+labels['Manufacturer']+"]").val(resp.brand);
		      	                } catch (e) {}
		      	                
		      	                try {
		      	                	
		      	                	jQuery("[id='Listing.Item.ItemSpecific[Brand]']").val(resp.brand);
		      	                  } catch (e) {}
		      	                try {
			                         jQuery("[name*='"+labels['Brand']+"']").val(resp.brand);
			                         jQuery("[id='Listing.Item.ItemSpecific["+labels['Brand']+"]']").val(resp.brand);
			                       } catch (e) {}
			                       try {
				                         jQuery("[name*='"+labels['Manufacturer']+"']").val(resp.brand);
				                         jQuery("[id='Listing.Item.ItemSpecific["+labels['Manufacturer']+"]']").val(resp.brand);
				                       } catch (e) {}
		      	                
		      	              }
		      	        	  
		      	        	if (resp.oems){
		      	           	   try {
		      	           		   for (var o=0;o<resp.oems.length;o+=1){
		      	           			   resp.oems[o].articleNumber=resp.oems[o].articleNumber.replace(/[^\s\d]+/,"").trim();
		      	           			   try{
		      	           				jQuery("input[id='Listing.Item.ItemSpecific[Reference OE/OEM Number]']").val(resp.oems[o].articleNumber.trim());
		      	           				jQuery("[id='_st_Reference OE/OEM Number.drpBtnDiv'] input[class*='sbtn xs-pad']").prop('disabled', false);
			      	                    jQuery("[id='_st_Reference OE/OEM Number.drpBtnDiv'] input[class*='sbtn xs-pad']").click();
		      	           			   } catch(e){
		      	           				   
		      	           			   }
		      	           			try{
		      	           				jQuery("input[id='Listing.Item.ItemSpecific["+labels['Reference OE/OEM Number']+"]']").val(resp.oems[o].articleNumber.trim());
		      	           				jQuery("input[name*='"+labels['Reference OE/OEM Number']+"']").val(resp.oems[o].articleNumber.trim());
		      	           				
		      	           				jQuery("[id='_st_"+labels['Reference OE/OEM Number']+".drpBtnDiv'] input[class*='sbtn xs-pad']").prop('disabled', false);
		      	           				jQuery("[id='_st_"+labels['Reference OE/OEM Number']+".drpBtnDiv'] input[class*='sbtn xs-pad']").click();
		      	           				//jQuery("input[name*='"+labels['Reference OE/OEM Number']+"'] input[class*='sbtn xs-pad']").prop('disabled', false);
		      	           				//jQuery("input[name*='"+labels['Reference OE/OEM Number']+"'] input[class*='sbtn xs-pad']").click();
		      	           			
		      	           				//jQuery("input[id='Listing.Item.ItemSpecific["+labels['Reference OE/OEM Number']+"]'] input[class*='sbtn xs-pad']").prop('disabled', false);
			      	                    
		      	           			   } catch(e){
		      	           			   }
		      	           		   }
		      	                   
		      	                 } catch (e) {}
		      	             }
		      	              
		      	              if (resp.crosses){
		      	              	   
		      	              		   for (var o=0;o<resp.crosses.length;o+=1){
		      	              			//resp.crosses[o].articleNumber=resp.crosses[o].articleNumber.replace(/[^\s\d]+/,"").trim();
		      	              			 try {
		      	              			jQuery("input[id='Listing.Item.ItemSpecific[Other Part Number]']").val(resp.crosses[o].articleNumber.trim());
		      	              			jQuery("[id='_st_Other Part Number.drpBtnDiv'] input[class*='sbtn xs-pad']").prop('disabled', false);
		      	              			jQuery("[id='_st_Other Part Number.drpBtnDiv'] input[class*='sbtn xs-pad']").click();
		      		              		 } catch (e) {}
			      		              	 try {
				      	              			jQuery("input[id='Listing.Item.ItemSpecific["+labels['Other Part Number']+"]']").val(resp.crosses[o].articleNumber.trim());
				      	              			jQuery("[id='_st_"+labels['Other Part Number']+".drpBtnDiv'] input[class*='sbtn xs-pad']").prop('disabled', false);
				      	              			jQuery("[id='_st_"+labels['Other Part Number']+".drpBtnDiv'] input[class*='sbtn xs-pad']").click();
				      		              		 } catch (e) {}
			      		              	   }
		      	                    
		      	               		   for (var o=0;o<resp.crosses.length;o+=1){
		      	               			//resp.crosses[o].articleNumber=resp.crosses[o].articleNumber.replace(/[^\s\d]+/,"").trim();
				      	               		try {
			      	               				jQuery("input[id='Listing.Item.ItemSpecific[Interchange Part Number]']").val(resp.crosses[o].articleNumber.trim());
			      	               				jQuery("[id='_st_Interchange Part Number.drpBtnDiv'] input[class*='sbtn xs-pad']").prop('disabled', false);
			      	               				jQuery("[id='_st_Interchange Part Number.drpBtnDiv'] input[class*='sbtn xs-pad']").click();
			      	               			} catch (e) {}
				      	               		try {
			      	               				jQuery("input[id='Listing.Item.ItemSpecific["+labels['Interchange Part Number']+"]']").val(resp.crosses[o].articleNumber.trim());
			      	               				jQuery("[id='_st_"+labels['Interchange Part Number']+".drpBtnDiv'] input[class*='sbtn xs-pad']").prop('disabled', false);
			      	               				jQuery("[id='_st_"+labels['Interchange Part Number']+".drpBtnDiv'] input[class*='sbtn xs-pad']").click();
			      	               			} catch (e) {}
		      	               		   }
		      	                }
		      	          } else if (ind==4){
		      	        	 //--
		      	              if (window.location.href.indexOf(".com/") != -1) {
		      	                  var toInsert = "UPC";
		      	                  var toInsertValue = resp.UPC;
		      	                } else {
		      	                  var toInsert = "EAN";
		      	                  var toInsertValue = resp.EAN;
		      	                }
		      	              
		      	              try {
		      	                jQuery("a[id$=cancle]")[0].click();
		      	              } catch (e) {}
		      	              try {
		      	            	  try{
		      	            		  jQuery("a[class$='Cust'][id^=v4]")[0].click();
		      	            	  } catch(e){
		      	            		  if (jQuery("a[id^=v4]:contains('Add your own item specific')").length){
		      	                		  jQuery("a[id^=v4]:contains('Add your own item specific')")[0].click();
		      	                	  } else {
		      	                		  jQuery("a[id^=v4]:contains('item specific')")[0].click();
		      	                	  }
		      	            	  }

		      	                jQuery("#_isTag")[0].value = toInsert;
		      	                jQuery("#_isVal")[0].value = toInsertValue;
		      	                if (jQuery("#_errTag").is(":visible")) {
		      	                  // jQuery("#v4-47cancle")[0].click();
		      	                  jQuery("a[id$=cancle]")[0].click();
		      	                } else {
		      	                  jQuery("#_isSave")[0].click();
		      	                }
		      	              } catch (e) {
		      	                try {
		      	                  jQuery("a[id$=cancle]")[0].click();
		      	                } catch (e) {}
		      	              }
		      	              //----
		      	          } else if (ind==5){
		      	        	try {
		    	                jQuery("a[id$=cancle]")[0].click();
		    	              } catch (e) {}
		      	          }

		      	        } catch (e) {}

		      	        setTimeout(function() {
		      	          if (index <= 10) {
		      	            index++;
		      	            nextElement(index);
		      	          } else {
			      	        	jQuery("#itmSpcButton").notify("Done!", {
				        	          className: "success",
				        	          position: "t"
				        	        });
			      	        try{
			      	           	var itm_spec_offset = jQuery("#itmSpcButton").offset();
			      	           	//itm_spec_offset.left -= 20;
			      	            //   itm_spec_offset.top -= 20;
			      	               jQuery("body").animate(
			      	                 {
			      	                   scrollTop: itm_spec_offset.top,
			      	                   scrollLeft: itm_spec_offset.left
			      	                 },
			      	                 function() {
			      	                 }
			      	               );
			      	           } catch(e){
			      	           	
			      	           }
			      	          }
		      	        }, 200);
		      	      }
		      	      var index = 0;
		      	      nextElement(index);
		      	    });
		        }
		        var itemSpecificsButtonInterval = setInterval(function(){
		      	  
		      	  if (!jQuery("#itmSpcButton").length){
		      		  if (jQuery("#editpane_itmspc:visible").length || jQuery("div[id$='itmSpcMain']:visible").length){
		      				  
		      		          var tmSpcButton = jQuery(
		      		                        "<a id='itmSpcButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Item Specifics</a>"
		      		                      );
		      		          jQuery("div[id$='itmSpcMain]']").prepend(tmSpcButton);
		      		          jQuery("#editpane_itmspc").prepend(tmSpcButton);
		      		          tmSpcButton.on("click",itemSpecificsButtonClicked);
		      		          //clearInterval(itemSpecificsButtonInterval);
		      			 
		      		  }
		      		  
		      	  }
		              },3000);
		        
  }
  function loadPasteEbayModernButtons(){
	  
	    gl_ebay_id_interval = setInterval(function() {
	        chrome['storage']['local']['get'](function(resp) {
	            if (jQuery("button[data-key='listItCallToAction']")['is'](':visible')) {
	            	jQuery("button[data-key='listItCallToAction']").on("click",function(){
	            		var new_listing_domain = window.location.hostname.match(/\.co\.uk|\.com|\.com\.au|\.de|\.fr|\.es|\.it/);
	   	          	        new_listing_domain=new_listing_domain[0];
						try{
							var new_listing_id = window['location']['href'].toString().match(/draft_id=([\w]+)&/)[1];
						} catch(e){
							try{
								var new_listing_id = window['location']['href'].toString().match(/draftId=([\w]+)&/)[1];
							} catch(e){
								var new_listing_id='';
							}

						}
	   	                var new_listing_url = "https://ebay"+new_listing_domain+"/itm/"+new_listing_id;
	   	                var listing_title = jQuery("[id*='titleField__-textbox']").text().trim();
	   	                var listing_cat = jQuery("[data-key='displayCategoryNamePath']").find("li:last").text();
	   	                var listing_price = jQuery("[id*='binPrice__-textbox']").val().trim().replace(/[^\d\.\,]+/g,"");
	   	                //var listing_quantity = jQuery("#quantity").val();
	   	                
	   	                try{
	   	                	var vendor_link = resp['vendor_link'];
	            		} catch(e){
	            			var vendor_link = "";
	            		}
	   	                try{
	   	                	var vendor_price = "0.00";
	   	                } catch(e){
	   	                	var vendor_price = resp['price'];
	   	                }
	   	                
	   	                $["ajax"]({
	   	                    url: "https://dalio.io/app/api/extauth",
	   	                    method: "GET",
	   	                    contentType: "application/json",
	   	                    cache: false,
	   	                    success: function(resp) {
	   	                    	if (resp["code"] == 200) {
	   	                    		chrome.runtime.sendMessage({
	   	                                type: 'new_listing',
	   	                                "info_obj":{
	   	                                "user_email":resp['user_email'],
	   	                                "store": "ebay",
	   	                                "store_id": new_listing_id,
	   	                                "store_domain": new_listing_domain,
	   	                                "store_url": new_listing_url,
	   	                                "vendor_link": vendor_link,
	   	                                "vendor_price":vendor_price,
	   	                                "title": listing_title,
	   	                                "category": listing_cat,
	   	                                "price": listing_price
	   	                                }
	   	                            });
	   	                    	}
	   	                    }
	   	                  });
	   	             
	            	});
	            	clearInterval(gl_ebay_id_interval);
	            }
	        })
	    }, 1000);
	  
	  var ebayListingPageNewInterval = setInterval(function(){
		  if (!jQuery("#ebayPaste")["length"]) {
			  
			  if (jQuery("[data-key='titleLabel']:visible").length){
				  if (jQuery("button[data-action*='SWITCH_TO_ADVANCED_TOOL_OVERLAY']").not("[id*='SWITCH_TO_ADVANCED']").length){
    		    	  var text=jQuery("button[data-action*='SWITCH_TO_ADVANCED_TOOL_OVERLAY']").not("[id*='SWITCH_TO_ADVANCED']").text();
    		    	  var html =
    			            '<div class="">\n' +
    			            '                    <blockquote class="blockquote blockquote-info">\n' +
    			            "                       <p style=\"font-size: 16px;\">You are using the modern listing page layout. In order to import images fully automatically and/or add custom item specifics, switch to the advanced layout, by clicking on \"<a href='#' id='aph_switch_advanced'>"+text+"</a>\"</p>\n" +
    			            "                    </blockquote>\n" +
    			            "                </div>";
    		    	  jQuery("[id*='titleLabel']").before(html);
    			      jQuery("#aph_switch_advanced").on("click",function(){
    			    	  jQuery("button[data-action*='SWITCH_TO_ADVANCED_TOOL_OVERLAY']").not("[id*='SWITCH_TO_ADVANCED']").click();
    			      });
    		      }
    			  
		        var pastBtn = jQuery(
		          "<input class='shipping-btn' style='width:100%;margin-top:15px;' type='button' id='ebayPaste' value='Insert Details'>"
		        );
		        pastBtn.off();
		        pastBtn["on"]("click", pasteEbayModern);
		        pastBtn["on"]("click", getAccInfo);
		
		         
		        jQuery("[data-key='titleLabel']").before(pastBtn);
		        clearInterval(ebayListingPageNewInterval);
			  }
			 
	        
	      }
	  },1000);
	  
	  var ebayCompatVehiclesInterval = setInterval(function() {
		  
          if (!jQuery("#ebayCompatVehiclesOpen")["length"]) {
        	  if (jQuery("[data-key='fitmentsLabel']:visible").length){
        		  
        		  var pastBtnCompatVehiclesOpen = jQuery(
        		          "<input class='shipping-btn' style='margin-top:15px;' type='button' id='ebayCompatVehiclesOpen' value='Insert Compatible Vehicles'>"
        		        );
        		  pastBtnCompatVehiclesOpen.off();
        		  pastBtnCompatVehiclesOpen["on"]("click", function(){
        		  	jQuery("button[data-frame-meta*='edit-fitments']").click();
        		  });
        		  
        		  jQuery("[data-key='fitmentsLabel']").after(pastBtnCompatVehiclesOpen);
        		  clearInterval(ebayCompatVehiclesInterval);
        	  }
          }
        }, 1000);
  
   /*function downloadImagesZip(event){
	   if (typeof jQuery("#ebayDownloadImagesZip").attr("href")=='undefined' || jQuery("#ebayDownloadImagesZip").attr("href")=='#'){
		   event.preventDefault();
		   chrome.storage.local.get(function(resp){
			  if (typeof resp.zip_file=='undefined' || resp.zip_file==''){
				  jQuery("#ebayDownloadImagesZip").notify("Images are not yet ready, or not copied.", {
	    	          className: "error",
	    	          position: "t"
	    	        });
	    		return;
			  }
			  
			  jQuery("#ebayDownloadImagesZip").attr("href", "https://dropshiplister.com/app/assets/lis" + resp.zip_file);
			  //jQuery("#ebayDownloadImagesZip").click();
			  chrome.tabs.create({ url:  "https://dropshiplister.com/app/assets/lis" + resp.zip_file, active: false });
		   });
	   }
  }
  function downloadImagesZipNormal(event){
	  if (typeof jQuery("#ebayDownloadImagesZipNormal").attr("href")=='undefined' || jQuery("#ebayDownloadImagesZipNormal").attr("href")=='#'){
		  event.preventDefault();
		  chrome.storage.local.get(function(resp){
			  if (typeof resp.zip_file=='undefined' || resp.zip_file==''){
				  jQuery("#ebayDownloadImagesZipNormal").notify("Images are not yet ready, or not copied.", {
	    	          className: "error",
	    	          position: "t"
	    	        });
	    		return;
			  }
			  jQuery("#ebayDownloadImagesZipNormal").attr("href", "https://dropshiplister.com/app/assets/lis" + resp.zip_file_normal);
			  //jQuery("#ebayDownloadImagesZipNormal").click();
			  chrome.tabs.create({ url:  "https://dropshiplister.com/app/assets/lis" + resp.zip_file_normal, active: false });
			  
		  });
	  }
	 
  }*/
  var downloadZipButtonInterval = setInterval(function(){
	  
	  if (!jQuery("#ebayDownloadImagesZip").length){
		  if (jQuery("h2[data-key='photosLabel']:visible").length){
			  
			  chrome.storage.local.get(function(resp){
				  
				  var zipBtn = jQuery(
		                  "<a id='ebayDownloadImagesZip' target='_blank' class='shipping-btn zip_file' style='margin-top:15px;display: inline-block;' type='button' >Download Images (Resized)</a>"
		                );
				  
				  jQuery("h2[data-key='photosLabel']").after(zipBtn);
		          //zipBtn.on("click",downloadImagesZip);
		          //clearInterval(downloadZipButtonInterval);
		          
		          if (typeof resp.zip_file=='undefined' || resp.zip_file==''){
		        	  jQuery("#ebayDownloadImagesZip").attr("href", "#");
				  } else {
					  jQuery("#ebayDownloadImagesZip").attr("href", "https://dropshiplister.com/app/assets/lis" + resp.zip_file);
					  //jQuery("#ebayDownloadImagesZip").click();
					  //chrome.tabs.create({ url:  "https://dropshiplister.com/app/assets/lis" + resp.zip_file, active: false });
				  }
				  
			   });
		  }
		  
	  }
		  chrome.storage.local.get(function(resp){
			  if (typeof resp.zip_file=='undefined' || resp.zip_file==''){
				  return;
			  } else {
				  jQuery("#ebayDownloadImagesZip").attr("href", "https://dropshiplister.com/app/assets/lis" + resp.zip_file);
				  //jQuery("#ebayDownloadImagesZip").click();
				  //chrome.tabs.create({ url:  "https://dropshiplister.com/app/assets/lis" + resp.zip_file, active: false });
			  }
			  
		   });
	  
    });
  
  var downloadZipNormalButtonInterval = setInterval(function(){
	  
	  if (!jQuery("#ebayDownloadImagesZipNormal").length){
		  if (jQuery("h2[data-key='photosLabel']:visible").length){
			  
			  chrome.storage.local.get(function(resp){
				  var zipBtnNormal = jQuery(
		                  "<a id='ebayDownloadImagesZipNormal' target='_blank' class='shipping-btn zip_file' style='margin-top:15px;display: inline-block;' type='button' >Download Images</a>"
		                );
				  
				  jQuery("h2[data-key='photosLabel']").after(zipBtnNormal);
		          //zipBtn.on("click",downloadImagesZipNormal);
		          
		          if (typeof resp.zip_file_normal=='undefined' || resp.zip_file_normal==''){
		        	  jQuery("#ebayDownloadImagesZipNormal").attr("href", "#");
				  } else {
					  jQuery("#ebayDownloadImagesZipNormal").attr("href", "https://dropshiplister.com/app/assets/lis" + resp.zip_file_normal);
					  //jQuery("#ebayDownloadImagesZipNormal").click();
					  //chrome.tabs.create({ url:  "https://dropshiplister.com/app/assets/lis" + resp.zip_file, active: false });
				  }
				  
			   });
		  }
		  
	  } 
		  chrome.storage.local.get(function(resp){
			  if (typeof resp.zip_file_normal=='undefined' || resp.zip_file_normal==''){
				  return;
			  } else {
				  jQuery("#ebayDownloadImagesZipNormal").attr("href", "https://dropshiplister.com/app/assets/lis" + resp.zip_file_normal);
				  //jQuery("#ebayDownloadImagesZipNormal").click();
				  //chrome.tabs.create({ url:  "https://dropshiplister.com/app/assets/lis" + resp.zip_file, active: false });
				  
			  }
			  
		   });
    });
  
  function descriptionButtonClicked(event){
	  event.preventDefault();
	  chrome.storage.local.get(function(resp){

		  if (resp.description.length==0){
			  jQuery("#descButton").notify("Description not copied!", {
				  className: "error",
				  position: "t"
			  });
			  return;
		  }

		  jQuery("#descButton").notify("Inserted!", {
			  className: "success",
			  position: "t"
		  });
		  
		  
		  try {
      		if (!jQuery("div[data-key='DESCRIPTION'] [data-key='REQUIRED_GROUP']:visible").length && jQuery("span[id*='defaultDescriptionChangeLink']:visible").length){
      			jQuery("div[data-key='DESCRIPTION'] button.listToggleLink__link span[id*='defaultDescriptionChangeLink']").click();
      		}
	         } catch (e) {}
		 
		//jQuery("span[aria-hidden='true']").click();
      	//jQuery("div[data-key='PRICE_VIEW'] button.listToggleLink__link span[id*='priceViewSelection']").click()
      	
      	// data-value="RTE_EDITOR" data-selected="false"
      	  //jQuery("button.feature--editHtml").attr("aria-pressed")=="true"
            //jQuery("textarea[id*='descriptionField__-editorSource']")
	         
	         if (jQuery("button.feature--editHtml").attr("aria-pressed")!="true"){
	        	 jQuery("button.feature--editHtml").click();
	         }
      		
	         try {


	                var desc_html = "";

	                  if (resp.source == "amazon") {
	                    resp.description += resp.bullet_points_html;
	                  } else if (resp.source == "ebay" && typeof(resp.ebay_desc)!='undefined') {
	                    resp.description = resp.ebay_desc;
	                  }

	                  if (resp.description.indexOf("<html>") == -1) {
	                    desc_html = resp.description;

	                    
	                  } else {
	                    desc_html = jQuery(resp.description).html();

	                    desc = jQuery(desc_html);

	                    desc.find("*[style]").removeAttr("style");
	                    desc.find("*[class]").removeAttr("class");
	                    desc.find("*[onclick]").removeAttr("onclick");
	                    desc.find("*[oncontextmenu]").removeAttr("oncontextmenu");
	                    desc.find("*[onmousedown]").removeAttr("onmousedown");
	                    desc.find("*[onmouseup]").removeAttr("onmouseup");
	                    desc.find("*[onselectstart]").removeAttr("onselectstart");
	                    desc.find("script").remove();

	                    var clean_html = "";
	                    for (var d = 0; d < desc.length; d++) {
	                      clean_html += desc[d].outerHTML;
	                    }

	                    desc_html=clean_html;
	                   // var html_as_text = document.createTextNode(desc_html);
	                  }

	              } catch (e) {
	                //var html_as_text = document.createTextNode("");
	              }
	              
	              //desc_html=desc_html.replace(/http\:/gi,"https:");
	              desc_html=desc_html.replace(/<a(.*)href=("|')([^'"]+)("|')(.*)>/gi,"<a$1href=''$5>");//.replace(/<img(.*)src=("|')([^'"]+)("|')(.*)>/gi,"<img$1src=''$5>");
	              desc_html=desc_html.replace(/<script.*?>[\s\S]*?<\/script>/ig, "");
	              //var html_as_text = document.createTextNode(desc_html);
	              
	              jQuery("textarea[id*='editorSource']").text(desc_html);
	              //HTTPS->HTTP
	              //html_as_text=html_as_text.replace(/https\:/gi,"http:");
	              //html_as_text=html_as_text.replace(/<script.*?>[\s\S]*?<\/script>/ig, "");
          
		          // data-value="RTE_EDITOR" data-selected="false"
				
		      	  //jQuery("button.feature--editHtml").attr("aria-pressed")=="true"
	              if (jQuery("button.feature--editHtml").attr("aria-pressed")=="true"){
	 	        	 jQuery("button.feature--editHtml").click();
	 	         }
	  });
  }
  var descriptionButtonInterval = setInterval(function(){
	  
	  if (!jQuery("#descButton").length){
		  if (jQuery("h2[data-key='descriptionLabel']:visible").length){
				  
		          var descButton = jQuery(
		                        "<a id='descButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Description</a>"
		                      );
		          //zipBtnNormal.attr("href", "https://dropshiplister.com/app/assets/lis" + resp.zip_file_normal);
		          jQuery("h2[data-key='descriptionLabel']").after(descButton);
		          descButton.on("click",descriptionButtonClicked);
		          //clearInterval(descriptionButtonInterval);
			 
		  }
		  
	  }
        },3000);
    
	  
  	function insertExistingSpecificSelect(label,text,select){
  		
  		if (!jQuery("div.listInlineSelect__selectBox:contains('"+label+"') input").length){
  			return false;
  		}
  		
  		if (label==''){
  			return false;
  		}
  		
		try{
 		    
 		    
 		    
 		    if (jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible").find("button").find("span[id*='valueSelect']:contains('"+select+"')").length){
 		    	return true;
 		    }
 		    
 		   jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible").find("button").click();
 		    
 		    //jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").find("input").focus();
 		    
 		    if (jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").parent().find("li[role*='checkbox']").length){
 		    	if (jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").parent().find("li[role*='checkbox']").attr("aria-selected")!=true){
 		    		jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").parent().find("span[id*='customDropdown-menuList']:contains('"+select+"')").first().click();
 		    	}
 		    	var sel_array=select.split(",");
		    		for (var i=0;i<sel_array.length;i+=1){
		    			var inner_select = sel_array[i].trim();
		    			if (jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").parent().find("li[role*='checkbox']:contains('"+inner_select+"')").attr("aria-selected")!=true){
		    			jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").parent().find("span[id*='customDropdown-menuList']:contains('"+inner_select+"'):first").first().click();
		    			}
		    		}
 		    }
 		    else if (jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").parent().find("li[role*='radio']").length){
 		    	if (jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").parent().find("span[id*='customDropdown-menuList']:contains('"+select+"'):first").length){
 		    		jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").parent().find("span[id*='customDropdown-menuList']:contains('"+select+"'):first").first().click();
 		    	}
 		    } else {
 		    		
 		 	         var id=jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").find("input").attr("id");
 		 	         if (text!='' && text!='X'){
 		 	        	document.getElementById(id).value= text;
 		 	         } else if (select!='' && select!='X'){
 		 	        	document.getElementById(id).value= select;
 		 	         }
 		 	         
 		 	         
 		    }
 		    
 		   return true;
 		   
         } catch(e){
         	return false;
         }
         
	}
  	function appendExistingSpecificText(label,text){
  		
  		if (!jQuery("div.listInlineSelect__selectBox:contains('"+label+"') textarea").length){
  			return false;
  		}
  		
  		if (label==''){
  			return false;
  		}
  		
		//try {
			//jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").find("button").click();
          //var existingText = jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").find("textarea").text();
          //jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").find("textarea").text(existingText+", "+text);
          //jQuery("span[id*='valueSelect']").text(text);
          //jQuery("li.inputField__label:visible:first").click();
         // } catch (e) {}
          
          try {
        	  var existingText = jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").find("textarea").val();
 	         var id=jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").find("textarea").attr("id");
 	         document.getElementById(id).value= existingText+", "+text;
          } catch (e) {}
          
	}
  	
	function insertExistingSpecificText(label,text){
		
		if (!jQuery("div.listInlineSelect__selectBox:contains('"+label+"') textarea").length){
  			return false;
  		}
		
		if (label==''){
  			return false;
  		}
		/*try {
          jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").find("textarea").text(text);
         } catch (e) {}*/
         
         try {
	         var id=jQuery("div.listInlineSelect__selectBox:contains('"+label+"'):visible:first").find("textarea").attr("id");
	         document.getElementById(id).value= text;
         } catch (e) {}
	}
	
  chrome.runtime.onMessage.addListener(function(msg) {
	    if (msg.type == "item_specific_loaded") {
	    	loadNextItemSpecific(msg.info_obj);
	    } else if (msg.type == "debug_item_specific_loaded") {
	    	debugLoadNextItemSpecific(msg.info_obj);
	    }
  });
  
  
  function itemSpecificsButtonClicked(event){
  	  event.preventDefault();
  	  chrome.storage.local.get(function(resp){


		  if (resp.specifics.length==0){
			  jQuery("#itmSpcButton").notify("No item specifics copied!", {
				  className: "error",
				  position: "t"
			  });
			  return;
		  }

		  jQuery("#itmSpcButton").notify("Inserting...", {
			  className: "success",
			  position: "t"
		  });
  		
  		try {
  			 
		  		if (jQuery("[id*='widget--hidden'][data-key='collapseAttributeOptions']").length){
		  			jQuery("[id*='widget--hidden'][data-key='collapseAttributeOptions']").click();
		  		}
        		if (!jQuery("div[data-key='ATTRIBUTES'] [data-key='REQUIRED_GROUP']:visible").length){
        			jQuery("div[data-key='ATTRIBUTES'] button.listToggleLink__link span[id*='attributeViewSelection']").click();
        		}
        		
        		jQuery("[id*='recommendedAttributesMoreOptions'] [class*='listToggleLink__link--collapsed'] span[id*='additionalAttributesMoreOptions']:visible").click()
        		
		} catch (e) {}
		
  		
			var domain = window.location.hostname.match(/\.co\.uk|\.com|\.com\.au|\.de|\.fr|\.es|\.it/);
  			domain=domain[0];
  			labels = i18n_labels[domain];
  		function nextElement(ind) {
         	    
  	        try {
  	        if (ind == 1) {
  	        	
  	        	insertExistingSpecificSelect(labels['Condition'],'',labels['New']);
	            
  	        } else if (ind == 2) {
  	        	
  	            	 for (var s = 0; s < resp.specifics.length; s++) {
  	                     var spec = resp.specifics[s];
  	                     
  	                     if (spec.left_side == "") continue;

  	                     if (spec.left_side.indexOf("EAN") != -1) {
  	                    	if (resp.EAN==""){
 	                    		 resp.EAN=spec.right_side;
 	                    	 }
  	                    		insertExistingSpecificText(labels['EAN'],resp.EAN);
  	                     }
  	                     
  	                     if (spec.left_side.indexOf("UPC") != -1) {
  	                    	if (resp.UPC==""){
 	                    		 resp.UPC=spec.right_side;
 	                    	 }
  	                    		insertExistingSpecificText(labels['UPC'],resp.UPC);
  	                     }
  	                     
  	                   spec.left_side = spec.left_side
      	                .replace(
      	                  /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
      	                  ""
      	                )
      	                .trim();
      	              spec.right_side = spec.right_side
      	                .replace(
      	                  /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
      	                  ""
      	                )
      	                .trim();

      	              if (spec.left_side.toLowerCase().indexOf("model") != -1) {
      	                insertExistingSpecificText(labels['Model'],spec.right_side);
      	              }
      	              if (spec.left_side.toLowerCase().indexOf("material") != -1) {
      	                insertExistingSpecificText(labels['Material'],spec.right_side);
      	              }
      	              if (spec.left_side.toLowerCase().indexOf("dimensions") != -1) {
      	                insertExistingSpecificText(labels['Size'],spec.right_side);
      	              }
      	              
      	                insertExistingSpecificText(spec.left_side,spec.right_side);
      	            	insertExistingSpecificSelect(spec.left_side,"",spec.right_side);
  	            	 }
  	          } else if (ind==3){
  	        	
  	        	 if (resp.UPC) {
	            	  try {
		                 insertExistingSpecificText(labels['UPC'],resp.UPC);
		                  } catch (e) {}
	                }
	              
	             if (resp.EAN) {
	                	try {
	                		insertExistingSpecificText(labels['EAN'],resp.UPC);
			            } catch (e) {}
	                }
	             if (resp.brand) {
	                  try {
	                	insertExistingSpecificText(labels['Brand'],resp.brand);
	                  } catch (e) {}
	              }
	              
	             if (resp.MPN){
	            	insertExistingSpecificText(labels['Manufacturer Part Number'],resp.MPN);
	            	insertExistingSpecificText(labels['Manufacturer Number'],resp.MPN);
	            	
	              }
  	          } else if (ind==4){
  	        	  
  	        	if (resp.oems){
   	           	   try {
   	           		   for (var o=0;o<resp.oems.length;o+=1){
   	           			   //resp.oems[o].articleNumber=resp.oems[o].articleNumber.replace(/[^\s\d]+/,"").trim();
   	           			   try{
   	           				appendExistingSpecificText(labels['Reference OE/OEM Number'],resp.oems[o].articleNumber);
   	           			   } catch(e){
   	           				   
   	           			   }
   	           		   }
   	                 } catch (e) {}
   	             }
   	              
   	              if (resp.crosses){
   	              	   
   	              		   for (var o=0;o<resp.crosses.length;o+=1){
   	              			//resp.crosses[o].articleNumber=resp.crosses[o].articleNumber.replace(/[^\s\d]+/,"").trim();
   	              			 try {
   	              			appendExistingSpecificText(labels['Other Part Number'],resp.oems[o].articleNumber);
		      		              		 } catch (e) {}
	      		             }
   	              		   for (var o=0;o<resp.crosses.length;o+=1){
   	              			//resp.crosses[o].articleNumber=resp.crosses[o].articleNumber.replace(/[^\s\d]+/,"").trim();
   	              			 try {
   	              			appendExistingSpecificText(labels['Interchange Part Number'],resp.oems[o].articleNumber);
		      		              		 } catch (e) {}
	      		             }
   	                    
   	                }
  	        	
  	          }

  	        } catch (e) {}

  	        setTimeout(function() {
  	          if (index <= 3) {
  	            index++;
  	            nextElement(index);
  	          } else {
  	        	jQuery("#itmSpcButton").notify("Done!", {
      	          className: "success",
      	          position: "t"
      	        });
		        try{
		           	var itm_spec_offset = jQuery("#itmSpcButton").offset();
		           	//itm_spec_offset.left -= 20;
		            //   itm_spec_offset.top -= 20;
		               jQuery("body").animate(
		                 {
		                   scrollTop: itm_spec_offset.top,
		                   scrollLeft: itm_spec_offset.left
		                 },
		                 function() {
		                 }
		               );
		           } catch(e){
		           	
		           }
  	          }
  	        }, 1000);
  	      }
  		
  		
  	      var index = 0;
  	      nextElement(index);
  	    });
    }
  var itemSpecificsButtonInterval = setInterval(function(){
	  
	  if (!jQuery("#itmSpcButton").length){
		  if (jQuery("h2[data-key='attributeLabel']:visible").length){
		          var itmSpcButton = jQuery(
		                        "<a id='itmSpcButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Item Specifics</a>"
		                      );
		          jQuery("h2[data-key='attributeLabel']").after(itmSpcButton);
		          itmSpcButton.on("click",itemSpecificsButtonClicked);
		          //clearInterval(itemSpecificsButtonInterval);
		  }
		  
	  }
        },3000);
  }  
  


function copyEbay() {
    jQuery("#ebayCopy").val("Working...");
    //document.getElementsByTagName("head")[0].appendChild(script);

    var main_img_src = [];
    try {
      var gallery_html = jQuery("div#PicturePanel").html();
      var main_imgs = gallery_html.match(/http.+?i\.ebayimg\..+?\/images\/.?\/.+\/s\-l.+?\.jpg/g);
      for (var i = 0; i < main_imgs.length; i++) {
        var main_src = main_imgs[i].split("/s-l")[0] + "/s-l1200.jpg";
        
        found=false;
        for (var v=0;v<main_img_src.length;v+=1){
        	if (main_img_src[v]==main_src){
        		found=true;
        	}
        }
        if (!found){
        	main_img_src = main_img_src.concat(main_src);
        }
        
      }
      
      
    } catch (e) {
      console.log(e);
    }

    var var_img_src = [];
    try {
      var var_lis = jQuery("div#vi_main_img_fs").find("li");
      for (var i = 0; i < var_lis.length; i++) {
        var var_src = jQuery(var_lis[i])
          .find("img")
          .attr("src")
          .split("?")[0];
        if (var_src.indexOf("/s-l") != -1) {
          var_src = var_src.split("/s-l")[0] + "/s-l1200.jpg";
        }
        found=false;
        for (var v=0;v<var_img_src.length;v+=1){
        	if (var_img_src[v]==var_src){
        		found=true;
        	}
        }
        if (!found){
        	var_img_src = var_img_src.concat(var_src);
        }
        
      }
    } catch (e) {
      console.log(e);
    }

    main_img_src = main_img_src.concat(var_img_src);

    var json_main_images = JSON.stringify(main_img_src);

    var all_dpx_desc_images_src = [];
    if (jQuery("#desc_div2").length) {
      var all_dpx_desc_images = jQuery("#desc_div").find("img");
      var all_dpx_desc_images_src = [];
      for (var i = 0; i < all_dpx_desc_images.length; i++) {
        all_dpx_desc_images_src = all_dpx_desc_images_src.concat(all_dpx_desc_images[i].src);
      }
    }
    var json_dpx_desc_images = JSON.stringify(all_dpx_desc_images_src);

    var all_desc_images_src = [];
    if (jQuery("#desc_div").length) {
      var all_desc_images = jQuery("#desc_div").find("img");
      for (var i = 0; i < all_desc_images.length; i++) {
        all_desc_images_src = all_desc_images_src.concat(all_desc_images[i].src);
      }
    }
    var json_desc_images = JSON.stringify(all_desc_images_src);

    var json_all_desc_images = JSON.stringify(all_desc_images_src.concat(all_dpx_desc_images_src));

    var desc_html = "";
    var desc = "";

    if (jQuery("#desc_div").length) {
      // desc_html = jQuery("#productDescription").parent().html();
      desc_html = jQuery("#desc_div")
        .parent()
        .parent()
        .html();
      desc = jQuery(desc_html);

      desc.find("*[style]").removeAttr("style");
      desc.find("*[class]").removeAttr("class");
      // desc.find('*[style]').attr('style', '');
      // desc.find('*[class]').attr('class', '');
      // desc.find("img").find('*[height]').attr('height', '');
      // desc.find("img").find('*[width]').attr('width', '');
      desc
        .find("img")
        .find("*[height]")
        .removeAttr("height");
      desc
        .find("img")
        .find("*[width]")
        .removeAttr("width");

      try {
        desc_html = desc[0].outerHTML;
      } catch (e) {
        console.log(e);
      }
    }
    
    
    	if (typeof (desc_html)=='undefined'){
    		try{
    			desc_html= jQuery("#desc_div")
        	    .parent()
        	    .parent()
        	    .html();
        } catch(e){
        	
        }
    	}
    	
    	var price = jQuery("#prcIsum").text().trim();

    	 var weight = "";
    	 var dimension = "";
    	 var pck_width = "";
    	 var pck_weight = "";
    	 var pck_length = "";
    	 var pck_height = "";
    	 var brand ="";
    	 var articleNumber = "";
    	 var oems=[];
    	 var crosses=[];
    	 var ean="";
    	 
    	    
    var item_specifics_array = [];

    if (jQuery(".itemAttr").length) {
      var attr_tds = jQuery("div.itemAttr")
        .find("tr")
        .find("td");
      var left_side = "";
      var right_side = "";
      for (var t = 0; t < attr_tds.length; t++) {
        try {
          if (t % 2 == 0) {
            left_side = jQuery(attr_tds[t])
              .text()
              .trim()
              .replace(":", "");
          } else {
            right_side = jQuery(attr_tds[t])
              .text()
              .trim()
              .replace(":", "");

            item_specifics_array = item_specifics_array.concat([
              {
                left_side: left_side,
                right_side: right_side
              }
            ]);
            
            try {
            
            if (left_side.toLowerCase().trim().indexOf('manufacturer part number')!=-1){
            	articleNumber = right_side;
            }
            if (left_side.toLowerCase().trim().indexOf('alternative part number')!=-1){
            	crosses=right_side.split(",");
            }
            if (left_side.toLowerCase().trim().indexOf('brand')!=-1){
            	brand = right_side;
            }
            if (left_side.toLowerCase().trim().indexOf('oem')!=-1){
            	oems_obj=right_side.split(",");
	          	  for (var o=0;o<oems_obj.length;o+=1){
	          		  oems=oems.concat({"brand":"","articleNumber":oems_obj[o]});
	          	  }
            }
            if (left_side.toLowerCase().trim().indexOf('ean')!=-1){
            	ean=right_side;
            }
            if (left_side.toLowerCase().trim().indexOf('width')!=-1){
            	width=right_side;
            }
            
                if (left_side.indexOf("Weight") != -1) {
                	if (left_side.indexOf("lb")!=-1){
                		w_measurement='lb';
                	}
                  weight = right_side.replace(/\(.+\)/, "").trim();
                  if (weight.indexOf("pounds") != -1) {
                    pck_weight = weight.match(/[0-9]*[.]?[0-9]+/)[0];
                  } else if (weight.indexOf("ounces") != -1) {
                    pck_weight = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]) * 0.06;
                  } else {
                	  pck_weight = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]);
                  }
                } else if (left_side.indexOf("Item Weight") != -1) {
                  weight = right_side.replace(/\(.+\)/, "").trim();
                  if (weight.indexOf("pounds") != -1) {
                    pck_weight = weight.match(/[0-9]*[.]?[0-9]+/)[0];
                  } else if (weight.indexOf("ounces") != -1) {
                    pck_weight = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]) * 0.06;
                  } else {
                	  pck_weight = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]);
                  }
                }
              } catch (e) {}

              try {
                if (left_side.indexOf("Dimensions") != -1) {
                	if (left_side.indexOf("in")!=-1){
                		d_measurement='in';
                	}
                  dimension = right_side;
                  var dim_text = dimension
                    .trim()
                    .match(
                      /([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)/g
                    )[0];
                  pck_width = dim_text
                    .split("x")[0]
                    .trim()
                    .match(/[0-9]*[.]?[0-9]+/)[0];
                  pck_length = dim_text
                    .split("x")[1]
                    .trim()
                    .match(/[0-9]*[.]?[0-9]+/)[0];
                  pck_height = dim_text
                    .split("x")[2]
                    .trim()
                    .match(/[0-9]*[.]?[0-9]+/)[0];
                }
              } catch (e) {}
              
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    var title = "";
    if (jQuery("h1.it-ttl").length) {
    	
    	try{
    		var title=jQuery("h1.it-ttl").html().split("</span>")[1].trim();
    	} catch(e){
    		  var title = jQuery("h1.it-ttl")
    	        .text()
    	        .trim();
    	}
    
    }

   try{
    	var ebay_item_id = window.location.href.match("\/(\\d+)(\\/|\\?)")[1];
    } catch(e){
    	
    }
    
    var variations = {};

    if (jQuery("select[id^='msku-sel']").length) {
    	
    	 var variations_labels = jQuery("label[for^='msku-sel']");
    	 
      for (var v = 0; v < variations_labels.length; v++) {
    	  try{
          var variation_select_id = jQuery(variations_labels[v]).attr("for");
          var variation_text = jQuery(variations_labels[v]).text().trim().replace(":","");
          var variation_options = jQuery("select[id^='"+variation_select_id+"']").find("option");
          var options = [];
          for (var tv = 0; tv < variation_options.length; tv++) {
        	  options = options.concat(jQuery(variation_options[tv]).text().trim());
          }
          variations[variation_text] = options;
    	  } catch (e) {
             
            }
          
      }
    }

	if (typeof info_obj=='undefined'){
		var info_obj={};
	}
	if (typeof stor_obj=='undefined'){
		var stor_obj={};
	}

	stor_obj= {
		source: "ebay",
		title: title,
		description: desc_html,
		variations: variations,
		weight: pck_weight,
		length: pck_length,
		height: pck_height,
		width: pck_width,
		price: price,
		manufacturer: brand,
		article_number: articleNumber,
		specifics: item_specifics_array,
		MPN: articleNumber,
		EAN: ean,
		UPC: ean,
		oems: oems,
		main_images: json_main_images,
		desc_images: json_all_desc_images,
		compat_vehicles: {},
		vendor_link:window.location.href
	};

	var listing =  stor_obj;

	info_obj.saved_listing = listing;

	chrome.runtime.sendMessage({
		type: "update_listing_cache",
		info_obj: info_obj
	});

   
    chrome.storage.local.set(stor_obj
     ,
      function() {
    	  chrome.runtime.sendMessage(
    	  	      {
    	  	        type: "extract_compat_vehicles",
    	  	        ebay_item_id: ebay_item_id,
    	  	      },
    	  	      function() {
    	  	      }
    	  	    );
      }
    );
    
    

    jQuery("#ebayCopy").val("Working...");

    chrome.runtime.sendMessage(
      {
        type: "upload_images",
        title: title,
        main_images: json_main_images,
        desc_images: json_all_desc_images
      },
      function() {
        chrome.runtime.sendMessage({
          type: "create_listing"
        });
      }
    );
  }
  
  function pasteEbay() {

	  jQuery("#ebayPaste").notify("Inserting...", {
		  className: "success",
		  position: "t"
	  });

    chrome.storage.local.get(function(resp) {
    	if (typeof resp.title=='undefined' || resp.title==''){
    		jQuery("#ebayPaste").notify("You haven't yet copied anything!", {
    	          className: "error",
    	          position: "t"
    	        });
    		return;
    	}
    	
      function nextElement(ind) {
        try {
          if (ind == 1) {
            try {
              var edit_title = jQuery("#editpane_title").val();
              if (edit_title == "") {
                jQuery("#editpane_title").val(resp.title);
              }
            } catch (e) {}
            // jQuery("#editpane_title").val(resp.title);
          } else if (ind == 2) {
            try {
              if (jQuery("#upc").val() == "") {
                jQuery("#upc_menu_js_an_0")[0].click(); //does not apply
              }
            } catch (e) {}
            try {
                if (jQuery("#ean").val() == "") {
                  jQuery("#ean_menu_js_an_0")[0].click(); //does not apply
                }
              } catch (e) {}

            try {
              jQuery("select#itemCondition").val(1000); //New
            } catch (e) {}

            if (resp.source == "aliexpress") {
              try {
                jQuery("[name^=_st_Country]").val("China");
              } catch (e) {}
            }
            
            if (resp.brand) {
                try {
                  jQuery("input[id*='Brand']").val(resp.brand);
                } catch (e) {}
                try {
                  jQuery("input[name=_st_Brand]").val(resp.brand);
                } catch (e) {}
              }

              if (resp.UPC) {
                  try {
                    jQuery("input[name=_st_UPC]").val(resp.UPC);
                  } catch (e) {}
                  try {
                    jQuery("input[id*='UPC']").val(resp.UPC);
                  } catch (e) {}
                  try {
                  	jQuery("input#upc").val(resp.UPC);
                    } catch (e) {}
                }

                if (resp.EAN) {
                  try {
                    jQuery("input[name=_st_EAN]").val(resp.EAN);
                  } catch (e) {}
                  try {
                    jQuery("input[id*='EAN']").val(resp.EAN);
                  } catch (e) {}
                  try {
                  	 jQuery("input#ean").val(resp.EAN);
                    } catch (e) {}
                }

            

            if (resp.source == "amazon") {
            	
            	 for (var s = 0; s < resp.specifics.length; s++) {
                     var spec = resp.specifics[s];

                     if (spec.left_side.indexOf("EAN") != -1) {
                    	 if (resp.EAN==""){
                    		 resp.EAN=spec.right_side;
                    	 }
                    	 try {
                             jQuery("input[name=_st_EAN]").val(spec.right_side);
                           } catch (e) {}
                           try {
                             jQuery("input[id*='EAN']").val(spec.right_side);
                           } catch (e) {}
                           try {
                           	 jQuery("input#ean").val(spec.right_side);
                             } catch (e) {}
                     }
                     
                     if (spec.left_side.indexOf("UPC") != -1) {
                    	 
                    	 if (resp.UPC==""){
                    		 resp.UPC=spec.right_side;
                    	 }
                    	 try {
                             jQuery("input[name=_st_UPC]").val(spec.right_side);
                           } catch (e) {}
                           try {
                             jQuery("input[id*='UPC']").val(spec.right_side);
                           } catch (e) {}
                           try {
                           	 jQuery("input#upc").val(spec.right_side);
                             } catch (e) {}
                     }
            	 }
             
              
              
                  

              if (window.location.href.indexOf(".com/") != -1) {
                var toInsert = "UPC";
                var toInsertValue = resp.UPC;
              } else {
                var toInsert = "EAN";
                var toInsertValue = resp.EAN;
              }
              try {
                jQuery("a[id$=cancle]")[0].click();
              } catch (e) {}
              try {
                //jQuery("div[id$=itmSpcMain]:contains('Add your own item specific') a[id^=v4]")[0].click();
            	  try{
            		  jQuery("a[class$='Cust'][id^=v4]")[0].click();
            	  } catch(e){
            		  if (jQuery("a[id^=v4]:contains('Add your own item specific')").length){
                		  jQuery("a[id^=v4]:contains('Add your own item specific')")[0].click();
                	  } else {
                		  jQuery("a[id^=v4]:contains('item specific')")[0].click();
                	  }
            	  }

                jQuery("#_isTag")[0].value = toInsert;
                jQuery("#_isVal")[0].value = toInsertValue;
                if (jQuery("#_errTag").is(":visible")) {
                  //jQuery("#v4-47cancle")[0].click();
                  jQuery("a[id$=cancle]")[0].click();
                } else {
                  jQuery("#_isSave")[0].click();
                }
              } catch (e) {
                try {
                  jQuery("a[id$=cancle]")[0].click();
                } catch (e) {}
              }
            }
            

            if (resp.source == "aliexpress") {
            	
            	var use_title = resp.title;
                var edit_title2 = jQuery("#editpane_title").val();
                if (edit_title2 != "") {
                  var use_title = edit_title2;
                }
                
              var brand_name =
                use_title.split(" ")[0] + " " + use_title.split(" ")[1] + " " + "China";
              var mpn = use_title.split(" ")[0] + use_title.split(" ")[1] + "001";
              mpn = mpn.toLowerCase();
              try {
                jQuery("input[id*='Brand']").val(brand_name);
              } catch (e) {}

              try {
                jQuery("input[name=_st_Brand]").val(brand_name);
              } catch (e) {}

              try {
                jQuery("input[id*='MPN']").val(mpn);
              } catch (e) {}

              try {
                jQuery("input[id*='Model']")
                  .not("input[id*='Compatible Model']")
                  .val("001");
              } catch (e) {}

              try {
                //jQuery("input[id*='Model']").val(spec.right_side);
              } catch (e) {}
            }
          } else if (ind == 3) {
            //jQuery("#pkgLength").val((resp.length/2.54).toFixed(0));
            //jQuery("#pkgWidth").val((resp.width/2.54).toFixed(0));
            //jQuery("#pkgHeight").val((resp.height/2.54).toFixed(0));
            try {
              resp.length = resp.length.toString().match(/[0-9]*[.]?[0-9]+/)[0];
              resp.width = resp.width.toString().match(/[0-9]*[.]?[0-9]+/)[0];
              resp.height = resp.height.toString().match(/[0-9]*[.]?[0-9]+/)[0];

              jQuery("#pkgLength").val(Math.round(resp.length));
              jQuery("#pkgWidth").val(Math.round(resp.width));
              jQuery("#pkgHeight").val(Math.round(resp.height));
            } catch (e) {}

            //var weight = resp.weight*2.2;

            //jQuery("#majorUnitWeight").val(weight/weight);
            //jQuery("#minorUnitWeight").val(((weight%(weight/weight))*1000).toFixed(0));

            try {
              resp.weight = resp.weight.toString().match(/[0-9]*[.]?[0-9]+/)[0];
              var weight = resp.weight;
              var minor_weight = Math.round(((weight % (weight / weight)) * 16).toFixed(2));
              if (minor_weight == "NaN") {
                minor_weight = 0;
              }
              jQuery("#majorUnitWeight").val(Math.floor(weight));
              jQuery("#minorUnitWeight").val(minor_weight);
            } catch (e) {}
          } else if (ind == 6) {
            if (resp.item_location_select == "Yes") {
              if (resp.source == "aliexpress") {
                try {
                  jQuery("#anLocId")[0].click();
                } catch (e) {}

                try {
                  jQuery("select[name='itemCountry']").val(
                    jQuery("select[name='itemCountry']")
                      .find("option:contains('" + resp.location + "')")
                      .val()
                  );
                } catch (e) {}
                //jQuery("select[name=itemCountry]").val("CN");
                //jQuery("#location").val("Hong Kong");
              }
            }
          } else if (ind == 7) {
            //chrome.runtime.sendMessage({msg:"fixed_price"});
			  if (jQuery("#format").find("option[value='StoresFixedPrice']").length){
				  jQuery("#format").val("StoresFixedPrice");
			  } else {
				  jQuery("#format").val("FixedPrice");
			  }
        	  var evt = document.createEvent("HTMLEvents");
              evt.initEvent("change", false, true);
              document.getElementById("format").dispatchEvent(evt);
          } else if (ind == 18) {
			  jQuery("#binPrice").val(resp.price);
          }
        } catch (e) {}

        setTimeout(function() {
          if (index <= 20) {
            index++;
            nextElement(index);
          }
        }, 100);
      }
      var index = 0;
      nextElement(index);
    });
  }
  
  function pasteEbayModern() {
	    chrome.storage.local.get(function(resp) {
	    	
	    	if (typeof resp.title=='undefined' || resp.title==''){
	    		jQuery("#ebayPaste").notify("You haven't yet copied anything!", {
	    	          className: "error",
	    	          position: "t"
	    	        });
	    		return;
	    	}
	    	
	    	
	    	
	      function nextElement(ind) {
	        try {
	          if (ind == 1) {
	            try {
	              var edit_title = jQuery("span[id*='titleField__-textbox']").text();
	              if (edit_title == "") {
	            	  jQuery("span[id*='titleField__-textbox']").text(resp.title);
	              }
	            } catch (e) {}
	            
	          } else if (ind==2){
	        	  try {
	        		  if (!jQuery("input[type='checkbox'][name='binPriceSelection']").is(":checked")){
	        			  jQuery("input[type='checkbox'][name='binPriceSelection']").click();
	        		  }
		            } catch (e) {}
	          } else if (ind==3){
	        	 /*//chrome.runtime.sendMessage({msg:"fixed_price"});
	              jQuery("#format").val("StoresFixedPrice")
	         	  var evt = document.createEvent("HTMLEvents");
	               evt.initEvent("change", false, true);
	               document.getElementById("format").dispatchEvent(evt);*/
	          }
	        	  
	        	
	        } catch (e) {}

	        setTimeout(function() {
	          if (index <= 4) {
	            index++;
	            nextElement(index);
	          }
	        }, 100);
	      }
	      var index = 0;
	      nextElement(index);
	    });
	  }
