  function copyAliexpress() {
    jQuery("#aliexpressCopy").val("Working...");
    //document.getElementsByTagName("head")[0].appendChild(script);

    var all_main_images = [];
    var main_gallery_html = jQuery("div#j-detail-gallery-main")
      .find("script")
      .html();
    all_main_images = main_gallery_html.match(/http.*alicdn\.com\/.*\.jpg/g);
    
    if (all_main_images==null){
    	main_gallery_html=jQuery("div#j-detail-gallery-main").html();
    	all_main_images = main_gallery_html.match(/http.*alicdn\.com\/.*\.jpg/g);
    }

    var all_main_var_images = [];
    var all_main_var_images_src = [];
    var all_main_var_images_with_info = [];
    try {
      var main_var_gallery_html = jQuery("div#j-product-info-sku").html();
      //all_main_var_images = main_var_gallery_html.match(/http.*alicdn\.com\/.*\.jpg/g);
      all_main_var_images = jQuery(main_var_gallery_html).find("img");
      all_main_var_images=all_main_var_images.concat(jQuery("ul.sku-property-list").find("img"));
      
      for (var i = 0; i < all_main_var_images.length; i++) {
    	  if (typeof jQuery(all_main_var_images[i]).attr("bigpic") !='undefined'){
    		  var bigpic = jQuery(all_main_var_images[i]).attr("bigpic").replace("_50x50.jpg","");
    		  var title = jQuery(all_main_var_images[i]).attr("title");
    	        all_main_var_images_src = all_main_var_images_src.concat(bigpic);
    	        all_main_var_images_with_info= all_main_var_images_with_info.concat({'src':bigpic.replace("_50x50.jpg",""),'title':title});
    	  } else {
    		  var pic = jQuery(all_main_var_images[i]).attr("src").replace("_50x50.jpg","");
    		  var title = jQuery(all_main_var_images[i]).attr("title");
    	       all_main_var_images_src = all_main_var_images_src.concat(pic);
    	       all_main_var_images_with_info= all_main_var_images_with_info.concat({'src':bigpic.replace("_50x50.jpg",""),'title':title});
    	  }
        
      }
    } catch (e) {
      console.log(e);
    }
    
    var json_all_main_var_images_with_info=JSON.stringify(all_main_var_images_with_info);
    var json_all_main_images = JSON.stringify(all_main_images.concat(all_main_var_images_src));

    var all_desc_images = jQuery("div#j-product-description")
      .find("div.ui-box-body")
      .find("img");
    var all_desc_images_src = [];
    for (var i = 0; i < all_desc_images.length; i++) {
      var desc_src = all_desc_images[i].src.split("?")[0];
      all_desc_images_src = all_desc_images_src.concat(all_desc_images[i].src);
    }
    var json_desc_images = JSON.stringify(all_desc_images_src);

    var title = jQuery("h1.product-name")
      .text()
      .trim();

    var desc_html = "";
    var desc = "";

    desc_html = jQuery("div.description-content")
      .parent()
      .html();
    desc = jQuery(desc_html);

    //desc.find("*[style]").removeAttr("style");
    //desc.find("*[class]").removeAttr("class");
    //desc.find('*[style]').attr('style', '');
    //desc.find('*[class]').attr('class', '');
    //desc.find("img").find('*[height]').attr('height', '');
    //desc.find("img").find('*[width]').attr('width', '');
    //desc.find("img").find('*[height]').removeAttr('height');
    //desc.find("img").find('*[width]').removeAttr('width');

    desc_html = desc[0].outerHTML;

    var pck_weight = jQuery(jQuery("ul.product-packaging-list")[0]).find("li.packaging-item")[1];

    try {
      var pck_weight_kg = jQuery(pck_weight)
        .text()
        .trim()
        .match(/\d+\.?\d+kg/)[0]
        .replace("kg", "");
    } catch (e) {
      var pck_weight_kg = 0;
    }

    try {
      var pck_weight_lb = jQuery(pck_weight)
        .text()
        .trim()
        .match(/\d+\.?\d+lb/)[0]
        .replace("lb", "");
    } catch (e) {
      var pck_weight_lb = 0;
    }

    try {
      var pck_size = jQuery(jQuery("ul.product-packaging-list")[0]).find("li.packaging-item")[2];
    } catch (e) {
      var pck_size = 0;
    }

    try {
      var pck_length = jQuery(pck_size)
        .text()
        .trim()
        .match(/\d+cm\sx\s\d+cm\sx\s\d+cm/)[0]
        .match(/\d+/g)[0];
    } catch (e) {
      var pck_length = 0;
    }

    try {
      var pck_height = jQuery(pck_size)
        .text()
        .trim()
        .match(/\d+cm\sx\s\d+cm\sx\s\d+cm/)[0]
        .match(/\d+/g)[2];
    } catch (e) {
      var pck_height = 0;
    }

    try {
      var pck_width = jQuery(pck_size)
        .text()
        .trim()
        .match(/\d+cm\sx\s\d+cm\sx\s\d+cm/)[0]
        .match(/\d+/g)[1];
    } catch (e) {
      var pck_width = 0;
    }

    try {
      var pck_length_in = jQuery(pck_size)
        .text()
        .trim()
        .match(/\((\d+\.?\d+in)\s+x\s+(\d+\.?\d+in)\s+x\s+(\d+\.?\d+in)\)/)[1];
    } catch (e) {
      var pck_length_in = 0;
    }

    try {
      var pck_height_in = jQuery(pck_size)
        .text()
        .trim()
        .match(/\((\d+\.?\d+in)\s+x\s+(\d+\.?\d+in)\s+x\s+(\d+\.?\d+in)\)/)[3];
    } catch (e) {
      var pck_height_in = 0;
    }

    try {
      var pck_width_in = jQuery(pck_size)
        .text()
        .trim()
        .match(/\((\d+\.?\d+in)\s+x\s+(\d+\.?\d+in)\s+x\s+(\d+\.?\d+in)\)/)[2];
    } catch (e) {
      var pck_width_in = 0;
    }

    var item_specifics_array = [];
    var item_specifics = [];
    if (jQuery("li[ae_object_type='specs']:visible").length){
    	//jQuery("li[ae_object_type='specs']:visible").click();
    	item_specifics = jQuery("li.product-prop");
        
        for (var i = 0; i < item_specifics.length; i++) {
          try {
            var left_side = jQuery(jQuery(item_specifics[i]).find("span.property-title"))
              .text()
              .trim();
            left_side = left_side.substring(0, left_side.length - 1);
            var right_side = jQuery(jQuery(item_specifics[i]).find("span.property-desc"))
              .text()
              .trim();
            item_specifics_array = item_specifics_array.concat([
              {
                left_side: left_side,
                right_side: right_side
              }
            ]);
          } catch (e) {}
        }
    } else if (jQuery("li.property-item[id^=product-prop]").length){
    	item_specifics = jQuery("li.property-item[id^=product-prop]");
	    for (var i = 0; i < item_specifics.length; i++) {
	      try {
	        var left_side = jQuery(jQuery(item_specifics[i]).find("span")[0])
	          .text()
	          .trim();
	        left_side = left_side.substring(0, left_side.length - 1);
	        var right_side = jQuery(jQuery(item_specifics[i]).find("span")[1])
	          .text()
	          .trim();
	        item_specifics_array = item_specifics_array.concat([
	          {
	            left_side: left_side,
	            right_side: right_side
	          }
	        ]);
	      } catch (e) {}
	    }
    }
    

    try {
      var left_side = "Model";
      var right_side = "001";
      item_specifics_array = item_specifics_array.concat([
        {
          left_side: left_side,
          right_side: right_side
        }
      ]);
    } catch (e) {}

    //item_specifics_array = item_specifics_array.concat([{"Country/Region of Manufacture","China"}]);
    var var_images={};
    var variations = {};
    if (jQuery("ul.sku-property-list").length){
    	var variations_ul = jQuery("ul.sku-property-list");
    	for (var v = 0; v < variations_ul.length; v++) {
            try {
            	var variation_text = jQuery(variations_ul[v]).parent().find("div.sku-title").text().split(":")[0].trim();
                var variations_li = jQuery(variations_ul[v])
                  .find("li.sku-property-item");
                temp_vars = [];
                var var_title="";
                for (var tv = 0; tv < variations_li.length; tv++) {
                    temp_vars = temp_vars.concat(
                      jQuery(variations_li[tv])
                        .find("img")
                        .attr("title")
                    );
                    var_title=jQuery(variations_li[tv])
                    .find("img")
                    .attr("title");
                    if (typeof var_images[variation_text]=='undefined'){
                      	var_images[variation_text]=[];
                      }
                      var var_obj = {};
                      var_obj[var_title]=jQuery(variations_li[tv])
                      .find("img").attr("src").replace(/(\.jpg)?_\d+x\d+\.(jpg|JPG|jpeg|png)/,".jpg");
             		  var_images[variation_text]=var_images[variation_text].concat(var_obj);
                  }
                  variations[variation_text] = temp_vars;
                  
         			
            } catch (e) {}
          }
    	
    } if (jQuery("#j-product-info-sku").length) {
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
            var var_title="";
            for (var tv = 0; tv < variation_vars.length; tv++) {
              if (
                typeof jQuery(variation_vars[tv])
                  .find("a")
                  .attr("title") == "undefined"
              ) {
                temp_vars = temp_vars.concat(
                  jQuery(variation_vars[tv])
                    .find("a")
                    .text().trim()
                );
                var_title=jQuery(variation_vars[tv])
                .find("a")
                .text().trim();
              } else {
                temp_vars = temp_vars.concat(
                  jQuery(variation_vars[tv])
                    .find("a")
                    .attr("title")
                );
                var_title=jQuery(variation_vars[tv])
                .find("a")
                .attr("title");
              }
              variations[variation_text] = temp_vars;
              if (typeof var_images[variation_text]=='undefined'){
              	var_images[variation_text]=[];
              }
              if (jQuery(variation_vars[tv]).find("img").length>0){
            	  if (typeof jQuery(variation_vars[tv]).find("img")!='undefined'){
            		  if (typeof jQuery(variation_vars[tv]).find("img").attr("bigpic")!='undefined'){
            			  var real_src = jQuery(variation_vars[tv]).find("img").attr("bigpic");
            			  var var_obj = {};
               			 var_obj[var_title]=real_src.replace(".jpg_50x50.jpg",".jpg");
               			var_images[variation_text]=var_images[variation_text].concat(var_obj);
            		  } else if (typeof jQuery(variation_vars[tv]).find("img").attr("src")!='undefined'){
            			  var real_src = jQuery(variation_vars[tv]).find("img").attr("src");
            			  var var_obj = {};
               			 var_obj[var_title]=real_src.replace(".jpg_50x50.jpg",".jpg");
               			var_images[variation_text]=var_images[variation_text].concat(var_obj);
            		  }
            	  }
              }
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
                  .text().trim()
              );
              var_title=jQuery(variation_vars[tv])
              .find("span")
              .text().trim();
            }
            variations[variation_text] = temp_vars;
            if (typeof var_images[variation_text]=='undefined'){
            	var_images[variation_text]=[];
            }
            if (jQuery(variation_vars[tv]).find("img").length>0){
          	  if (typeof jQuery(variation_vars[tv]).find("img")!='undefined'){
          		  if (typeof jQuery(variation_vars[tv]).find("img").attr("bigpic")!='undefined'){
          			  var real_src = jQuery(variation_vars[tv]).find("img").attr("bigpic");
          			  //var_images[variation_text].append(real_src);
          			 var var_obj = {};
          			 var_obj[var_title]=real_src.replace(".jpg_50x50.jpg",".jpg");
          			var_images[variation_text]=var_images[variation_text].concat(var_obj);
          		  } else if (typeof jQuery(variation_vars[tv]).find("img").attr("src")!='undefined'){
          			  var real_src = jQuery(variation_vars[tv]).find("img").attr("src");
          			var var_obj = {};
         			 var_obj[var_title]=real_src.replace(".jpg_50x50.jpg",".jpg");
         			var_images[variation_text]=var_images[variation_text].concat(var_obj);
          		  }
          	  }
            }
          }
        } catch (e) {}
      }
    }
    
    var json_var_images = JSON.stringify(var_images);

    var location = jQuery(".store-address")
      .text()
      .trim();
    
    try{
    	var ourprice = jQuery("#priceblock_ourprice").text().trim().replace(/[^\d\.\,]+/g,"");
    } catch(e){
    	var ourprice = "0.00";
    }
    
    var stor_obj = {
            source: "aliexpress",
            title: title,
            description: desc_html,
            weight: pck_weight_lb,
            length: pck_length_in,
            height: pck_height_in,
            width: pck_width_in,
            specifics: item_specifics_array,
            variations: variations,
            location: location,
            price: ourprice,
            main_images: json_all_main_images,
            var_images: json_var_images,
            var_images_with_info: json_all_main_var_images_with_info,
            desc_images: json_desc_images,
            vendor_link:window.location.href
          };

      if (jQuery("li[ae_object_type='specs']:visible").length){
          try{

              var offset = jQuery("li[ae_object_type='specs']:visible").offset();
              offset.left -= 20;
              offset.top -= 20;
              jQuery("body").animate(
                  {
                      scrollTop: offset.top,
                      scrollLeft: offset.left
                  },
                  function() {
                      //sleep(500);
                      jQuery("li[ae_object_type='specs']:visible").click();
                      setTimeout(function(){
                          var item_specifics_array = [];
                          var item_specifics = [];
                          if (jQuery("li[ae_object_type='specs']:visible").length){
                              //jQuery("li[ae_object_type='specs']:visible").click();
                              item_specifics = jQuery("li.product-prop");

                              for (var i = 0; i < item_specifics.length; i++) {
                                  try {
                                      var left_side = jQuery(jQuery(item_specifics[i]).find("span.property-title"))
                                          .text()
                                          .trim();
                                      left_side = left_side.substring(0, left_side.length - 1);
                                      var right_side = jQuery(jQuery(item_specifics[i]).find("span.property-desc"))
                                          .text()
                                          .trim();
                                      item_specifics_array = item_specifics_array.concat([
                                          {
                                              left_side: left_side,
                                              right_side: right_side
                                          }
                                      ]);
                                  } catch (e) {}
                              }
                          }
                          stor_obj.specifics=item_specifics_array;

                          jQuery("li[ae_object_type='prodetail']:visible").click();

                          setTimeout(function(){
                              var desc_html = "";
                              var desc = "";

                              if (jQuery("li[ae_object_type='prodetail']:visible").length) {

                                  try{
                                      desc_html = jQuery("div#product-description")
                                          .html();
                                      desc = jQuery(desc_html);

                                      //desc.find("*[style]").removeAttr("style");
                                      //desc.find("*[class]").removeAttr("class");
                                      //desc.find('*[style]').attr('style', '');
                                      //desc.find('*[class]').attr('class', '');
                                      //desc.find("img").find('*[height]').attr('height', '');
                                      //desc.find("img").find('*[width]').attr('width', '');
                                      //desc.find("img").find('*[height]').removeAttr('height');
                                      //desc.find("img").find('*[width]').removeAttr('width');

                                      desc_html = desc[0].outerHTML;
                                  } catch(e){
                                      desc_html="";
                                  }
                                  stor_obj.description=desc_html;
                              }
                              if (typeof info_obj=='undefined'){
                                  var info_obj={};
                              }

                              var listing =  stor_obj;

                              info_obj.saved_listing = listing;

                              chrome.runtime.sendMessage({
                                  type: "update_listing_cache",
                                  info_obj: info_obj
                              });



                              chrome.storage.local.set(stor_obj,function(){
                                  jQuery("#aliexpressCopyFranchise").val("Working...");

                                  chrome.runtime.sendMessage(
                                      {
                                          type: "upload_images",
                                          title: title,
                                          main_images: json_all_main_images,
                                          var_images: json_var_images,
                                          desc_images: json_desc_images
                                      },
                                      function() {
                                          chrome.runtime.sendMessage({
                                              type: "create_listing"
                                          });
                                      }
                                  );
                              });


                          },1000);


                      },1000);
                  }
              );
          } catch(e) {

          }

      } else {

          if (typeof info_obj=='undefined'){
              var info_obj={};
          }

          var listing =  stor_obj;

          info_obj.saved_listing = listing;

          chrome.runtime.sendMessage({
              type: "update_listing_cache",
              info_obj: info_obj
          });

          chrome.storage.local.set(stor_obj,function() {

              jQuery("#aliexpressCopy").val("Working...");

              chrome.runtime.sendMessage(
                  {
                      type: "upload_images",
                      title: title,
                      main_images: json_all_main_images,
                      var_images: json_var_images,
                      desc_images: json_desc_images
                  },
                  function() {
                      chrome.runtime.sendMessage({
                          type: "create_listing"
                      });
                  }
              );


          });




      }



  }
  
  function copyAliexpressFranchise() {
	    jQuery("#aliexpressCopyFranchise").val("Working...");
	    //document.getElementsByTagName("head")[0].appendChild(script);

	    var all_main_images = jQuery("div.product-main-wrap div[itemprop='image']").find("img");
	    var all_main_images_src = [];
	    
	    for (var i = 0; i < all_main_images.length; i++) {
	        var pic = jQuery(all_main_images[i]).attr("src");
	        pic=pic.replace("jpg_50x50.jpg","jpg");
	        all_main_images_src = all_main_images_src.concat(pic);
	      }
	    
	    var json_main_images = JSON.stringify(all_main_images_src);

	    var all_main_var_images = [];
	    var all_main_var_images_src = [];
	    var all_main_var_images_with_info = [];
	    try {
	      //all_main_var_images = main_var_gallery_html.match(/http.*alicdn\.com\/.*\.jpg/g);
	      all_main_var_images = jQuery(".sku-property-image img");

	      for (var i = 0; i < all_main_var_images.length; i++) {
	        var bigpic = jQuery(all_main_var_images[i]).attr("src").replace("_50x50.jpg","");
	        var title = jQuery(all_main_var_images[i]).attr("title");
	        all_main_var_images_src = all_main_var_images_src.concat(bigpic.replace("_50x50.jpg",""));
	        all_main_var_images_with_info= all_main_var_images_with_info.concat({'src':bigpic.replace("_50x50.jpg",""),'title':title});
	      }
	      var json_main_var_images = JSON.stringify(all_main_var_images_src);
	    } catch (e) {
	      console.log(e);
	    }

	    var json_all_main_var_images_with_info=JSON.stringify(all_main_var_images_with_info);
	    var json_all_main_images = JSON.stringify(all_main_images_src.concat(all_main_var_images_src));

	    var all_desc_images = jQuery("div#product-description")
	      .find("img");
	    var all_desc_images_src = [];
	    for (var i = 0; i < all_desc_images.length; i++) {
	      var desc_src = all_desc_images[i].src.split("?")[0];
	      all_desc_images_src = all_desc_images_src.concat(all_desc_images[i].src);
	    }
	    var json_desc_images = JSON.stringify(all_desc_images_src);

	    var title = jQuery("div.product-title[itemprop='name']")
	      .text()
	      .trim();

	    var desc_html = "";
	    var desc = "";

	    desc_html = jQuery("div#product-description")
	      .html();
	    desc = jQuery(desc_html);

	    //desc.find("*[style]").removeAttr("style");
	    //desc.find("*[class]").removeAttr("class");
	    //desc.find('*[style]').attr('style', '');
	    //desc.find('*[class]').attr('class', '');
	    //desc.find("img").find('*[height]').attr('height', '');
	    //desc.find("img").find('*[width]').attr('width', '');
	    //desc.find("img").find('*[height]').removeAttr('height');
	    //desc.find("img").find('*[width]').removeAttr('width');

        try{
            desc_html = desc[0].outerHTML;
        } catch (e) {
            desc_html='';
        }


	      var pck_weight_kg = 0;

	      var pck_weight_lb = 0;

	      var pck_size = 0;

	      var pck_length = 0;

	      var pck_height = 0;

	      var pck_width = 0;

	      var pck_length_in = 0;

	      var pck_height_in = 0;

	      var pck_width_in = 0;

	    
	    var item_specifics_array = [];
	    var item_specifics = [];
	    if (jQuery("li[ae_object_type='specs']:visible").length){
	    	//jQuery("li[ae_object_type='specs']:visible").click();
	    	item_specifics = jQuery("li.product-prop");
	        
	        for (var i = 0; i < item_specifics.length; i++) {
	          try {
	            var left_side = jQuery(jQuery(item_specifics[i]).find("span.property-title"))
	              .text()
	              .trim();
	            left_side = left_side.substring(0, left_side.length - 1);
	            var right_side = jQuery(jQuery(item_specifics[i]).find("span.property-desc"))
	              .text()
	              .trim();
	            item_specifics_array = item_specifics_array.concat([
	              {
	                left_side: left_side,
	                right_side: right_side
	              }
	            ]);
	          } catch (e) {}
	        }
	    } else if (jQuery("li.property-item[id^=product-prop]").length){
	    	item_specifics = jQuery("li.property-item[id^=product-prop]");
		    for (var i = 0; i < item_specifics.length; i++) {
		      try {
		        var left_side = jQuery(jQuery(item_specifics[i]).find("span")[0])
		          .text()
		          .trim();
		        left_side = left_side.substring(0, left_side.length - 1);
		        var right_side = jQuery(jQuery(item_specifics[i]).find("span")[1])
		          .text()
		          .trim();
		        item_specifics_array = item_specifics_array.concat([
		          {
		            left_side: left_side,
		            right_side: right_side
		          }
		        ]);
		      } catch (e) {}
		    }
	    }
	    
	    var var_images={};
	    var variations = {};
	    if (jQuery("ul.sku-property-list").length){
	    	var variations_ul = jQuery("ul.sku-property-list");
	    	for (var v = 0; v < variations_ul.length; v++) {
	            try {
	            	var variation_text = jQuery(variations_ul[v]).parent().find("div.sku-title").text().split(":")[0].trim();
	                var variations_li = jQuery(variations_ul[v])
	                  .find("li.sku-property-item");
	                temp_vars = [];
	                var var_title="";
	                for (var tv = 0; tv < variations_li.length; tv++) {
	                    temp_vars = temp_vars.concat(
	                      jQuery(variations_li[tv])
	                        .find("img")
	                        .attr("title")
	                    );
	                    var_title=jQuery(variations_li[tv])
	                    .find("img")
	                    .attr("title");
	                    if (typeof var_images[variation_text]=='undefined'){
	                      	var_images[variation_text]=[];
	                      }
	                      var var_obj = {};
	                      var_obj[var_title]=jQuery(variations_li[tv])
	                      .find("img").attr("src").replace(/(\.jpg)?_\d+x\d+\.(jpg|JPG|jpeg|png)/,".jpg");
	             		  var_images[variation_text]=var_images[variation_text].concat(var_obj);
	                  }
	                  variations[variation_text] = temp_vars;
	                  
	         			
	            } catch (e) {}
	          }
	    	
	    }
	    if (jQuery("div.product-sku").length) {
	      var variations_dl = jQuery("div.sku-property");
	      for (var v = 0; v < variations_dl.length; v++) {
	        try {
	          var variation_text = jQuery(variations_dl[v]).find(".sku-title")
	            .text()
	            .trim()
	            .split(":")[0];

	          if (variation_text.indexOf("Colo") != -1) {
	            var variation_vars = jQuery(variations_dl[v]).find("li");
	            temp_vars = [];
	            var var_title="";
	            for (var tv = 0; tv < variation_vars.length; tv++) {
	              if (
	                typeof jQuery(variation_vars[tv])
	                  .find("img")
	                  .attr("title") == "undefined"
	              ) {
	                temp_vars = temp_vars.concat(
	                		toTitleCase(jQuery(variation_vars[tv])
	                    .find("a")
	                    .text().trim())
	                );
	                var_title=jQuery(variation_vars[tv])
	                .find("a")
	                .text().trim();
	              } else {
	                temp_vars = temp_vars.concat(
	                		toTitleCase(jQuery(variation_vars[tv])
	                    .find("img")
	                    .attr("title"))
	                );
	                var_title=jQuery(variation_vars[tv])
	                .find("img")
	                .attr("title");
	              }
	              variations[variation_text] = temp_vars;
	              if (typeof var_images[variation_text]=='undefined'){
	              	var_images[variation_text]=[];
	              }
	              if (jQuery(variation_vars[tv]).find("img").length>0){
	            	  if (typeof jQuery(variation_vars[tv]).find("img")!='undefined'){
	            		  if (typeof jQuery(variation_vars[tv]).find("img").attr("bigpic")!='undefined'){
	            			  var real_src = jQuery(variation_vars[tv]).find("img").attr("bigpic");
	            			  var var_obj = {};
	               			 var_obj[var_title]=real_src.replace(".jpg_50x50.jpg",".jpg");
	               			var_images[variation_text]=var_images[variation_text].concat(var_obj);
	            		  } else if (typeof jQuery(variation_vars[tv]).find("img").attr("src")!='undefined'){
	            			  var real_src = jQuery(variation_vars[tv]).find("img").attr("src");
	            			  var var_obj = {};
	               			 var_obj[var_title]=real_src.replace(".jpg_50x50.jpg",".jpg");
	               			var_images[variation_text]=var_images[variation_text].concat(var_obj);
	            		  }
	            	  }
	              }
	            }
	          } else {
	            var variation_vars = jQuery(variations_dl[v]).find("li");
	            temp_vars = [];
	            for (var tv = 0; tv < variation_vars.length; tv++) {
	              temp_vars = temp_vars.concat(
	            		  toTitleCase(jQuery(variation_vars[tv])
	                  .find("span")
	                  .text().trim())
	              );
	              var_title=jQuery(variation_vars[tv])
	              .find("span")
	              .text().trim();
	            }
	            variations[variation_text] = temp_vars;
	            if (typeof var_images[variation_text]=='undefined'){
	            	var_images[variation_text]=[];
	            }
	            if (jQuery(variation_vars[tv]).find("img").length>0){
	          	  if (typeof jQuery(variation_vars[tv]).find("img")!='undefined'){
	          		  if (typeof jQuery(variation_vars[tv]).find("img").attr("bigpic")!='undefined'){
	          			  var real_src = jQuery(variation_vars[tv]).find("img").attr("bigpic");
	          			  //var_images[variation_text].append(real_src);
	          			 var var_obj = {};
	          			 var_obj[var_title]=real_src.replace(".jpg_50x50.jpg",".jpg");
	          			var_images[variation_text]=var_images[variation_text].concat(var_obj);
	          		  } else if (typeof jQuery(variation_vars[tv]).find("img").attr("src")!='undefined'){
	          			  var real_src = jQuery(variation_vars[tv]).find("img").attr("src");
	          			var var_obj = {};
	         			 var_obj[var_title]=real_src.replace(".jpg_50x50.jpg",".jpg");
	         			var_images[variation_text]=var_images[variation_text].concat(var_obj);
	          		  }
	          	  }
	            }
	          }
	        } catch (e) {}
	      }
	    }
	    
	    var json_var_images = JSON.stringify(var_images);

      try{
          var ourprice = jQuery("[itemprop='price']").text().trim().replace(/[^\d\.\,]+/g,"");
      } catch(e){
          var ourprice = "0.00";
      }

	    var stor_obj = {
		        source: "aliexpress",
		        title: title,
		        description: desc_html,
		        weight: pck_weight_lb,
		        length: pck_length_in,
		        height: pck_height_in,
		        width: pck_width_in,
		        specifics: item_specifics_array,
		        variations: variations,
		        location: location,
                price: ourprice,
		        main_images: json_all_main_images,
		        var_images: json_var_images,
		        var_images_with_info: json_all_main_var_images_with_info,
		        desc_images: json_desc_images,
                vendor_link:window.location.href
		      };

      if ( jQuery("#product-detail").length){
          try{

              var offset = jQuery("#product-detail").offset();
              offset.left -= 20;
              offset.top -= 20;
              jQuery("body").animate(
                  {
                      scrollTop: offset.top,
                      scrollLeft: offset.left
                  },{
                      complete:function() {
                          //sleep(500);
                          jQuery("li[ae_object_type='specs']:visible").click();
                          setTimeout(function(){
                              var item_specifics_array = [];
                              var item_specifics = [];
                              if (jQuery("li[ae_object_type='specs']:visible").length){
                                  //jQuery("li[ae_object_type='specs']:visible").click();
                                  item_specifics = jQuery("li.product-prop");

                                  for (var i = 0; i < item_specifics.length; i++) {
                                      try {
                                          var left_side = jQuery(jQuery(item_specifics[i]).find("span.property-title"))
                                              .text()
                                              .trim();
                                          left_side = left_side.substring(0, left_side.length - 1);
                                          var right_side = jQuery(jQuery(item_specifics[i]).find("span.property-desc"))
                                              .text()
                                              .trim();
                                          item_specifics_array = item_specifics_array.concat([
                                              {
                                                  left_side: left_side,
                                                  right_side: right_side
                                              }
                                          ]);
                                      } catch (e) {}
                                  }
                              }
                              stor_obj.specifics=item_specifics_array;

                              jQuery("li[ae_object_type='prodetail']:visible").click();

                              setTimeout(function(){
                                  var desc_html = "";
                                  var desc = "";

                                  if (jQuery("li[ae_object_type='prodetail']:visible").length) {

                                      try{
                                          desc_html = jQuery("div#product-description")
                                              .html();
                                          desc = jQuery(desc_html);

                                          //desc.find("*[style]").removeAttr("style");
                                          //desc.find("*[class]").removeAttr("class");
                                          //desc.find('*[style]').attr('style', '');
                                          //desc.find('*[class]').attr('class', '');
                                          //desc.find("img").find('*[height]').attr('height', '');
                                          //desc.find("img").find('*[width]').attr('width', '');
                                          //desc.find("img").find('*[height]').removeAttr('height');
                                          //desc.find("img").find('*[width]').removeAttr('width');

                                          desc_html = desc[0].outerHTML;
                                      } catch(e){
                                          desc_html="";
                                      }
                                      stor_obj.description=desc_html;
                                  }

                                  if (typeof info_obj=='undefined'){
                                      var info_obj={};
                                  }

                                  var listing =  stor_obj;

                                  info_obj.saved_listing = listing;

                                  chrome.runtime.sendMessage({
                                      type: "update_listing_cache",
                                      info_obj: info_obj
                                  });


                                  chrome.storage.local.set(stor_obj,function(){
                                      jQuery("#aliexpressCopyFranchise").val("Working...");

                                      chrome.runtime.sendMessage(
                                          {
                                              type: "upload_images",
                                              title: title,
                                              main_images: json_all_main_images,
                                              var_images: json_var_images,
                                              desc_images: json_desc_images
                                          },
                                          function() {
                                              chrome.runtime.sendMessage({
                                                  type: "create_listing"
                                              });
                                          }
                                      );
                                  });


                              },1000);


                          },1000);
                      }
                  }

              );
          } catch(e){

          }

      } else {


          if (typeof info_obj=='undefined'){
              var info_obj={};
          }

          var listing =  stor_obj;

          info_obj.saved_listing = listing;

          chrome.runtime.sendMessage({
              type: "update_listing_cache",
              info_obj: info_obj
          });

          chrome.storage.local.set(stor_obj,function(){

              jQuery("#aliexpressCopyFranchise").val("Working...");

              chrome.runtime.sendMessage({
                      type: "upload_images",
                      title: title,
                      main_images: json_all_main_images,
                      var_images: json_var_images,
                      desc_images: json_desc_images
                  },
                  function() {
                      chrome.runtime.sendMessage({
                          type: "create_listing"
                      });
                  });
          });


      }





	    	



	    
	  }


