(function(document, window, $) {
  "use strict";

  var temp_info_obj={};

  function periodicLoginCheckPopup() {
    chrome.storage.local.get(function(resp) {
      if (typeof resp.user == "undefined" || resp.user == "") {
        popupLogout();
      }
    });
  }

  function popupLogin() {
    jQuery(".member-container")["removeClass"]("shipping-hide");
    jQuery(".login-container")["addClass"]("shipping-hide");
    jQuery("body")["addClass"]("loggedin");
  }

  function popupLogout() {
    chrome.storage.local.set(
      {
        user: "",
        pass: "",
        status: 0
      },
      function() {
        jQuery(".login-container")["removeClass"]("shipping-hide");
        jQuery(".member-container")["addClass"]("shipping-hide");
        jQuery("body")["removeClass"]("loggedin");
      }
    );
  }

  jQuery("#shipping-logout")["on"]("click", function() {
    popupLogout();
  });
  jQuery("#shipping-login").on("submit", function(event) {
    console.log("Logging in...");
    event.preventDefault();
    var user = jQuery("#user").val();
    var pass = jQuery("#pass").val();

    if (user === "" || pass === "") {
      return;
    }

    var login_obj = {
      email: user,
      pass: pass
    };
    console.log("signin_attempt sent");
    chrome.runtime.sendMessage({
      type: "signin_attempt",
      user: user,
      pass: pass
    });
  });

  chrome.runtime.onMessage.addListener(function(msg) {
    if (msg.type == "signed_in") {
      popupLogin();
    } else if (msg.type == "signed_out") {
      popupLogout();
    } else if (msg.type == "loginMessage") {
    	if (msg.info_obj.message_type == "error" && msg.info_obj.error_code == 503) {
	        setTimeout(function() {
	          chrome.tabs.create({ url: "https://dropshiplister.com/my-account", active: true });
	        }, 3000);
	      } else if (msg.info_obj.message_type == "error" && msg.info_obj.error_code == 504) {
	        setTimeout(function() {
	          chrome.tabs.create({ url: "https://dropshiplister.com/my-account", active: true });
	        }, 3000);
	      }  else if (msg.info_obj.message_type == "error" && msg.info_obj.error_code == 505) {
	          setTimeout(function() {
	              chrome.tabs.create({ url: "https://dropshiplister.com/my-account", active: true });
	            }, 3000);
	          } else if (msg.info_obj.message_type == "error" && msg.info_obj.error_code == 506) {
	              setTimeout(function() {
	                  chrome.tabs.create({ url: "https://dropshiplister.com/my-account", active: true });
	                }, 3000);
	              }else if (msg.info_obj.message_type == "error" && msg.info_obj.error_code == 502) {
    	              setTimeout(function() {
    	                  chrome.tabs.create({ url: "https://dropshiplister.com/my-account", active: true });
    	                }, 3000);
    	              }
      jQuery("#login-btn").notify(msg.info_obj.message_text, {
        className: msg.info_obj.message_type,
        position: "top center"
      });
    } else if (msg.type="dom_elements_parsed"){

        temp_info_obj=msg.info_obj;
        chrome.storage.local.get(function(resp){
            var info_obj=temp_info_obj;
            for (var el_name in info_obj.stor_elements){

                var stor_element = info_obj.stor_elements[el_name];

                if (el_name=="Title"){
                    jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Length)"+"</strong>");
                }

                if (el_name=="Gallery"){
                    jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Imgs)"+"</strong>");
                }

                if (el_name=="Summary"){
                    jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Length)"+"</strong>");
                }
                if (el_name=="Price"){
                    jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+""+"</strong>");
                }

                if (el_name=="Variations"){
                    jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Types)"+"</strong>");
                }

                if (el_name=="Specifics"){
                    jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Items)"+"</strong>");
                }

                if (el_name=="Description"){
                    jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Length)"+"</strong>");
                }

            }


        });

    }

  });


  jQuery(".country-domain")["on"]("change", function() {
    var dom = jQuery(this).val();
    chrome.storage.local.get(function(resp) {
      resp.main_domain = dom;
      chrome.storage.local.set(resp);
    });
  });

  jQuery(".item-location-select")["on"]("change", function() {
    var val = jQuery(this).val();
    chrome.storage.local.get(function(resp) {
      resp.item_location_select = val;
      chrome.storage.local.set(resp);
    });
  });


    jQuery("input#login-btn").on("click",function(){
        //jQuery(".page-content.saved_orders").hide();
        jQuery(this).notify("Please wait...", {
            className: "success",
            position: "top center"
        });
    });



    /*jQuery("#save-csv")["on"]("click", function(event) {
        event.preventDefault();

        jQuery("#save-csv").notify("Preparing file...", {
            className: "success",
            position: "top center"
        });

        chrome.storage.local.get(function(resp){

            var info_obj={};
            info_obj.new_element_selected=false;
            info_obj.save_content=true;
            info_obj.save_csv=true;
            info_obj.main_domain = resp.main_domain;
            chrome.runtime.sendMessage({ type: "parse_listing", info_obj:info_obj});


        });
    });*/


    jQuery("#redirect-ebay-checkbox")["on"]("change", function() {
        var that = jQuery(this);

        chrome.storage.local.get(function(resp) {
            resp.redirect_ebay = that.is(":checked");
            chrome.storage.local.set(resp);
        });
    });

    jQuery("#auto-download-images-checkbox")["on"]("change", function() {
        var that = jQuery(this);

        chrome.storage.local.get(function(resp) {
            resp.auto_download_images = that.is(":checked");
            chrome.storage.local.set(resp);
        });
    });
	 

  jQuery("li.dom-selectors input")["on"]("click", function(event) {
	    event.preventDefault();

	    if (jQuery(this).attr("class").indexOf("clear")!=-1){
            jQuery("span[dom-selected-type]").html("...");
            chrome.storage.local.get(function(resp) {
                resp['stor_elements']={};
                resp['stor_suppliers']={};

                chrome.storage.local.set(resp,function(){
                    chrome.storage.local.set(
                        {
                            source: "",
                            title: "",
                            description: "",
                            weight: "",
                            length: "",
                            height: "",
                            width: "",
                            specifics: [],
                            variations: {},
                            location: "",
                            UPC: "",
                            EAN: "",
                            MPN: "",
                            price: "",
                            main_images: [],
                            desc_images: [],
                            uploaded_images: [],
                            uploaded_images_normal: [],
                            uploaded_var_images: [],
                            uploaded_var_images_normal: [],
                            compat_vehicles:[],
                            zip_file: "",
                            zip_file_normal: "",
                            zip_file_var: "",
                            zip_file_var_normal: "",
                            vendor_link:""
                        },
                        function() {
                            jQuery("input.dom-select-clear").notify("Cleared!", {
                                className: "success",
                                position: "top center"
                            });
                        }
                    );


                });
            });

            return true;
        }
	    var hexDigits = new Array
		  ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 
		
		//Function to convert rgb color to hex format
		function rgb2hex(rgb) {
			rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		}
		
		function hex(x) {
			return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
		}
		
	    var info_obj={};
	    info_obj['type']=jQuery(this).attr('value');
	    info_obj['color']=rgb2hex(jQuery(this).css('background-color'));
	    
	    chrome.runtime.sendMessage({ type: "activate_dom_selector","info_obj":info_obj },function(){
            jQuery("span[dom-selected-type='"+info_obj.type+"']").html("...");
            window.close();
        });
	  });

    jQuery("#dash_link")["on"]("click", function(event) {
        event.preventDefault();
        chrome.runtime.sendMessage({ type: "open_dash" });
    });
  
  chrome.storage.local.get(function(resp) {
    if (typeof resp.settings == "undefined") {
      resp.settings = {};
    }
    if (typeof resp.main_domain == "undefined") {
      resp.main_domain = ".com";
    }
    if (typeof resp.item_location_select == "undefined" || resp.item_location_select == null) {
      resp.item_location_select = "No";
    }

      if (typeof resp.auto_listing=='undefined'){
          resp.auto_listing=true;
      }

      if (typeof resp.redirect_ebay=='undefined'){
          resp.redirect_ebay=true;
      }

      if (typeof resp.auto_download_images=='undefined'){
          resp.auto_download_images=true;
      }

    jQuery(".country-domain").val(resp.main_domain);

    jQuery(".item-location-select").val(resp.item_location_select);

    jQuery("#redirect-ebay-checkbox").prop("checked",resp.redirect_ebay);
    jQuery("#auto-download-images-checkbox").prop("checked",resp.auto_download_images);

    for (var el_name in resp.stor_elements){

              var stor_element = resp.stor_elements[el_name];

              if (el_name=="Title"){
                  jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Length)"+"</strong>");
              }

              if (el_name=="Gallery"){
                  jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Imgs)"+"</strong>");
              }

              if (el_name=="Summary"){
                  jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Length)"+"</strong>");
              }
              if (el_name=="Price"){
                  jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+""+"</strong>");
              }

              if (el_name=="Variations"){
                  jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Types)"+"</strong>");
              }

              if (el_name=="Specifics"){
                  jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Items)"+"</strong>");
              }

              if (el_name=="Description"){
                  jQuery("span[dom-selected-type='"+el_name+"']").html("<strong>"+stor_element.element_payload+" (Length)"+"</strong>");
              }

    }

    chrome.storage.local.set(resp);



  });

  setInterval(periodicLoginCheckPopup, 1000);
})(document, window, jQuery);
