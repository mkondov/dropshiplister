  
  function copyVidaxl() {
	    jQuery("#vidaxlCopy").val("Working...");

	    var all_main_images = [];
	    var all_main_images_src = [];
	    
	    if (jQuery("div.product-slider").length){
	    	all_main_images = jQuery("div.product-slider").find("img");
	    	for (var i = 0; i < all_main_images.length; i++) {
			      var bigpic = all_main_images
			        .eq(i)
			        .attr("src")
			        .split("?")[0];
			      bigpic=bigpic.replace(/_\w?\w?\d+\.(\w{0,3})$/,".$1");
			      all_main_images_src = all_main_images_src.concat(bigpic);
			    }
	    } else if (jQuery("a[data-href*='vdxl.im'][data-href*='hd']").length){
	        all_main_images = jQuery("a[data-href*='vdxl.im'][data-href*='hd']");
	        for (var i = 0; i < all_main_images.length; i++) {
	          var bigpic = all_main_images
	            .eq(i)
	            .attr("data-href")
	            .split("?")[0];
	          all_main_images_src = all_main_images_src.concat(bigpic);
	        }

	        
	    } else if (jQuery("div.product-gallery img").length){
		    all_main_images = jQuery("div.product-gallery img");
		    for (var i = 0; i < all_main_images.length; i++) {
		      var bigpic = all_main_images
		        .eq(i)
		        .attr("src")
		        .split("?")[0];
		      bigpic=bigpic.replace(/_\w?\w?\d+\.(\w{0,3})$/,".$1");
		      all_main_images_src = all_main_images_src.concat(bigpic);
		    }
	    }
	    

	    var json_main_images = JSON.stringify(all_main_images_src);
	    
	    
	    if (jQuery("h1.title[itemprop='name']:first").length){
	    	var title = jQuery("h1.title[itemprop='name']:first")
	        .text()
	        .trim();

	    } else if (jQuery("h1[itemprop='name'].title").length){
	    	var title = jQuery("h1[itemprop='name'].title")
		      .text()
		      .trim().split("\n")[0].trim();
	    } else if (jQuery("div.title").length){
	    	var title = jQuery("div.title")
		      .text()
		      .trim();
	    }

	    if (jQuery(".auction-description div:nth-of-type(2)").length){
	    	try {
		        var desc_html = jQuery(".auction-description div:nth-of-type(2)").html();
		      } catch (e) {
		        var desc_html = "";
		      }
	    } else if (jQuery()){
	    	try {
		        var desc_html = jQuery("div.product-description-box").html();
		      } catch (e) {
		        var desc_html = "";
		      }
	    }
	    
	      
	    var pck_weight_lb = 0;
	    var pck_length_in = 0;
	    var pck_height_in = 0;
	    var pck_width_in = 0;
	    
	    if (jQuery(".product-specifications__text").length){
	    	var item_specifics = jQuery(".product-specifications__text").find("li");
		    var item_specifics_array = [];
		    for (var i = 0; i < item_specifics.length; i++) {
		      try {
		        var left_side = jQuery(item_specifics[i])
		          .text()
		          .split(":")[0]
		          .trim();
		        //left_side = left_side.substring(0, left_side.length - 1);
		        var right_side = jQuery(item_specifics[i])
		          .text()
		          .split(":")[1]
		          .trim();
		        right_side = right_side.replace(/^:/, "").trim();
		        if (left_side.toLowerCase().indexOf("weight") != -1) {
		          try {
		            pck_weight_lb = right_side.match(/[0-9]*[.]?[0-9]+/g)[0];
		          } catch (e) {
		            pck_weight_lb = 0;
		          }
		        }

		        if (left_side.toLowerCase().indexOf("dimension") != -1) {
		          try {
		            pck_length_in = right_side.match(/[0-9]*[.]?[0-9]+/g)[2];
		          } catch (e) {
		            pck_length_in = 0;
		          }

		          try {
		            pck_height_in = right_side.match(/[0-9]*[.]?[0-9]+/g)[0];
		          } catch (e) {
		            pck_height_in = 0;
		          }

		          try {
		            pck_width_in = right_side.match(/[0-9]*[.]?[0-9]+/g)[1];
		          } catch (e) {
		            pck_width_in = 0;
		          }
		        }
		        item_specifics_array = item_specifics_array.concat([
		          {
		            left_side: left_side,
		            right_side: right_side
		          }
		        ]);
		      } catch (e) {}
		    }
	    } else if (jQuery("div.product-specifications-box").find("li").length){
	    	var item_specifics = jQuery("div.product-specifications-box").find("li");
		    var item_specifics_array = [];
		    for (var i = 0; i < item_specifics.length; i++) {
		      try {
		        var left_side = jQuery(item_specifics[i])
		          .text()
		          .split(":")[0]
		          .trim();
		        //left_side = left_side.substring(0, left_side.length - 1);
		        var right_side = jQuery(item_specifics[i])
		          .text()
		          .split(":")[1]
		          .trim();
		        right_side = right_side.replace(/^:/, "").trim();
		        if (left_side.toLowerCase().indexOf("weight") != -1) {
		          try {
		            pck_weight_lb = right_side.match(/[0-9]*[.]?[0-9]+/g)[0];
		          } catch (e) {
		            pck_weight_lb = 0;
		          }
		        }

		        if (left_side.toLowerCase().indexOf("dimension") != -1) {
		          try {
		            pck_length_in = right_side.match(/[0-9]*[.]?[0-9]+/g)[2];
		          } catch (e) {
		            pck_length_in = 0;
		          }

		          try {
		            pck_height_in = right_side.match(/[0-9]*[.]?[0-9]+/g)[0];
		          } catch (e) {
		            pck_height_in = 0;
		          }

		          try {
		            pck_width_in = right_side.match(/[0-9]*[.]?[0-9]+/g)[1];
		          } catch (e) {
		            pck_width_in = 0;
		          }
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
	    
	    if (jQuery("#product-options-wrapper").length){
	    	var variations_li = jQuery("#product-options-wrapper ul li");
	    	for (var v = 0; v < variations_li.length; v++) {
	            try {
	              var variation_text =jQuery(variations_li[v]).find("div.label-c").text().trim();

	              var variation_vars = jQuery(variations_li[v]).find("select.super-attribute-select").find("option");
	                temp_vars = [];
	                for (var tv = 0; tv < variation_vars.length; tv++) {
	                  temp_vars = temp_vars.concat(
	                    jQuery(variation_vars[tv])
	                      .attr("value")
	                  );
	                }
	                variations[variation_text] = temp_vars;
	            } catch (e) {}
	          }
	        }
	    if (jQuery("#j-product-info-sku").length) {
	      var variations_dl = jQuery("#j-product-info-sku").find("dl.p-property-item");
	      for (var v = 0; v < variations_dl.length; v++) {
	        try {
	          var variation_text = jQuery(variations_dl[v])
	            .text()
	            .trim()
	            .split(":")[0];

	          if (variation_text.indexOf("Colo") != -1) {
	            var variation_vars = jQuery(variations_dl[v])
	              .find("dd")
	              .find("li");
	            temp_vars = [];
	            for (var tv = 0; tv < variation_vars.length; tv++) {
	              if (
	                typeof jQuery(variation_vars[tv])
	                  .find("a")
	                  .attr("title") == "undefined"
	              ) {
	                temp_vars = temp_vars.concat(
	                  jQuery(variation_vars[tv])
	                    .find("a")
	                    .text()
	                );
	              } else {
	                temp_vars = temp_vars.concat(
	                  jQuery(variation_vars[tv])
	                    .find("a")
	                    .attr("title")
	                );
	              }
	              variations[variation_text] = temp_vars;
	            }
	          } else {
	            var variation_vars = jQuery(variations_dl[v])
	              .find("dd")
	              .find("li");
	            temp_vars = [];
	            for (var tv = 0; tv < variation_vars.length; tv++) {
	              temp_vars = temp_vars.concat(
	                jQuery(variation_vars[tv])
	                  .find("span")
	                  .text()
	              );
	            }
	            variations[variation_text] = temp_vars;
	          }
	        } catch (e) {}
	      }
	    }

	    if (jQuery("[class^='product-price']").length){
	    	try{
		    	var ourprice = jQuery("[class^='product-price']").text().trim().replace(/[^\d\.\,]+/g,"");
		    } catch(e){
		    	var ourprice = "0.00";
		    }
	    } else if (jQuery("#bid_price").length) {
	    	try{
		    	var ourprice = jQuery("#bid_price").attr("price_num").replace(/[^\d\.\,]+/g,"");
		    } catch(e){
		    	var ourprice = "0.00";
		    }
	    } else if (jQuery("div.price.title").length){
	    	try{
		    	var ourprice = jQuery("div.price.title").text.trim().replace(/[^\d\.\,]+/g,"");
		    } catch(e){
		    	var ourprice = "0.00";
		    }
	    }


	  if (typeof info_obj=='undefined'){
		  var info_obj={};
	  }
	  if (typeof stor_obj=='undefined'){
		  var stor_obj={};
	  }

	  stor_obj={
		  source: "vidaxl",
		  title: title,
		  description: desc_html,
		  weight: pck_weight_lb,
		  length: pck_length_in,
		  height: pck_height_in,
		  width: pck_width_in,
		  price: ourprice,
		  specifics: item_specifics_array,
		  variations: variations,
		  main_images: json_main_images,
		  desc_images: "[]",
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
	      function() {}
	    );

	    jQuery("#vidaxlCopy").val("Working...");

	    chrome.runtime.sendMessage(
	      {
	        type: "upload_images",
	        title: title,
	        main_images: json_main_images,
	        desc_images: "[]"
	      },
	      function() {
	        chrome.runtime.sendMessage({
	          type: "create_listing"
	        });
	      }
	    );
	  }
  

