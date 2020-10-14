
	  function copyOverstock() {
		    jQuery("#overstockCopy").val("Working...");
		    //document.getElementsByTagName("head")[0].appendChild(script);
		    
		    var all_main_images = [];
		    var all_main_images_src = [];
		    
		    if (jQuery("#image-gallery").find("img").length){
		    	var all_main_images = jQuery("#image-gallery").find("img");

			    for (var i = 0; i < all_main_images.length; i++) {
			      var bigpic = jQuery(all_main_images[i]).attr("src");
			      bigpic=bigpic.replace(/_\d+\.(\w{0,3})$/,".$1");
			      all_main_images_src = all_main_images_src.concat(bigpic);
			    }
		    }
		    
		    if (jQuery("#mainContent").find("li[data-zoom-image*='images/products']").length){
		    	var all_main_images = jQuery("#mainContent").find("li[data-zoom-image*='images/products']");

			    for (var i = 0; i < all_main_images.length; i++) {
			      var bigpic = jQuery(all_main_images[i]).attr("data-zoom-image");
			      all_main_images_src = all_main_images_src.concat(bigpic);
			    }
		    }
		    
		    var json_main_images = JSON.stringify(all_main_images_src);

		    var json_all_main_images = json_main_images;

		    try{
		    if (jQuery("[data-cy='product-title']").length){
		    	var title = jQuery("[data-cy='product-title']")
			      .text()
			      .trim();
		    } else if (jQuery("div.product-title").length){
		    	 var title = jQuery("div.product-title")
			      .text()
			      .trim();
		    }
			   
		    } catch(e){
		    	var title ="";
		    }

		    
		    var desc_html = "";
		    var desc = "";

		    if (jQuery("div.description").length){
		    	desc_html = jQuery("div.description")
			      .parent()
			      .html();
			    desc = jQuery(desc_html);
		    } else if (jQuery("section#details").length){
		    	desc_html = jQuery("section#details")
			      .parent().parent()
			      .html();
			    desc = jQuery(desc_html);
		    }
		    
		    desc_html = desc[0].outerHTML;

		    var item_specifics_array = [];
		    
		    if (jQuery("h2:contains('Specifications')").length){
		    	 var item_specifics = jQuery("h2:contains('Specifications')")
			      .parent()
			      .find("div");
			    
			    for (var i = 0; i < item_specifics.length; i++) {
			      try {
			        var left_side = jQuery(jQuery(item_specifics[i]).find("div")[0])
			          .text()
			          .trim();
			        var right_side = jQuery(jQuery(item_specifics[i]).find("div")[1])
			          .text()
			          .trim();
			        if (left_side==''){
			        	continue;
			        }
			        item_specifics_array = item_specifics_array.concat([
			          {
			            left_side: left_side,
			            right_side: right_side
			          }
			        ]);
			      } catch (e) {}
			    }
		    }
		    
		    if (jQuery("h2:contains('Specs')").length){
		    	var item_specifics = jQuery("h2:contains('Specs')")
			      .next()
			      .find("tr");
			    for (var i = 0; i < item_specifics.length; i++) {
			      try {
			        var left_side = jQuery(jQuery(item_specifics[i]).find("td")[0])
			          .text()
			          .trim();
			        var right_side = jQuery(jQuery(item_specifics[i]).find("td")[1])
			          .text()
			          .trim();
			        if (left_side==''){
			        	continue;
			        }
			        item_specifics_array = item_specifics_array.concat([
			          {
			            left_side: left_side,
			            right_side: right_side
			          }
			        ]);
			      } catch (e) {}
			    }

		    }
		   
		    var variations = {};
		    		
		    if (jQuery("div.controls-section").length) {
		      var variation_vars = jQuery("div.controls-section").find("div[data-cy='facets']");
		      temp_vars = [];
		      for (var tv = 0; tv < variation_vars.length; tv++) {
		        try {
		        	var var_title = jQuery(variation_vars[tv]).prev().text().split("(")[0].trim();
		        	
		        	var var_options = jQuery(variation_vars[tv]).find("button");
		        	for (var tvi = 0; tvi < variation_vars.length; tvi++) {
		        		var var_option=jQuery(var_options[tvi]).find("button").text();
		        		temp_vars = temp_vars.concat(var_option);
		        	}
		          
		        } catch (e) {}
		      }

		      variations[var_title] = temp_vars;
		      temp_vars=[];
		    }
		    
		    if (jQuery("select.options-dropdown").length) {
		      var variation_vars = jQuery("select.options-dropdown").find("option");
		      temp_vars = [];
		      for (var tv = 0; tv < variation_vars.length; tv++) {
		        try {
		          temp_vars = temp_vars.concat(
		            jQuery(variation_vars[tv])
		              .text()
		              .trim()
		          );
		        } catch (e) {}
		      }

		      variations["Options"] = temp_vars;
		    }

		    if (jQuery("#optionSelection").length) {
		      var variation_vars = jQuery("#optionSelection").find("article");
		      temp_vars = [];
		      for (var tv = 0; tv < variation_vars.length; tv++) {
		        var variations_vars_text = jQuery(variation_vars[tv]).attr("data-facet");
		        var variations_vars_inner = jQuery(variation_vars[tv])
		          .find("a.option-facet")
		          .not(".color-outofstock");
		        temp_vars_inner = [];
		        for (var tvi = 0; tvi < variations_vars_inner.length; tvi++) {
		          try {
		            temp_vars_inner = temp_vars_inner.concat(
		              jQuery(variations_vars_inner[tvi])
		                .text()
		                .trim()
		                .replace(/\n/g, "")
		                .replace(/\s+/g, " ")
		            );
		          } catch (e) {}
		        }
		        variations[variations_vars_text] = temp_vars_inner;
		      }
		    }
		    
		    try{
		    	var brand=jQuery("[data-cy='brand-name'] a").text();
		    } catch(e){
		    	var brand="";
		    }
		    
		    try{
		    	var ourprice = jQuery("#product-price").text().trim().replace(/[^\d\.\,]+/g,"");
		    } catch(e){
		    	var ourprice = "0.00";
		    }

		  if (typeof info_obj=='undefined'){
			  var info_obj={};
		  }
		  if (typeof stor_obj=='undefined'){
			  var stor_obj={};
		  }

		  stor_obj={
			  source: "overstock",
			  title: title,
			  description: desc_html,
			  weight: 0,
			  length: 0,
			  height: 0,
			  width: 0,
			  brand: brand,
			  price: ourprice,
			  specifics: item_specifics_array,
			  variations: variations,
			  vendor_link: window.location.href
		  };

		  var listing =  stor_obj;

		  info_obj.saved_listing = listing;

		  chrome.runtime.sendMessage({
			  type: "update_listing_cache",
			  info_obj: info_obj
		  });


		  chrome.storage.local.set(stor_obj
		      ,
		      function() {}
		    );

		    jQuery("#overstockCopy").val("Working...");

		    chrome.runtime.sendMessage(
		      {
		        type: "upload_images",
		        title: title,
		        main_images: json_all_main_images,
		        desc_images: JSON.stringify([])
		      },
		      function() {
		        chrome.runtime.sendMessage({
		          type: "create_listing"
		        });
		      }
		    );
		  }
