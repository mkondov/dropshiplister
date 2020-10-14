	  
function copyAutodoc() {
	    jQuery("#autodocCopy").val("Working...");
	    
	    try{
	    	jQuery("i.icon.plus")[0].click();
	    } catch(e){
	    	
	    }
	    
    	jQuery(".button_dropdown_list").not(".loaded").click();
	    

	    var all_main_images = [];
	    var main_gallery = jQuery("div.product-block__image");
	    
	    all_main_images = main_gallery.find("img[src*='cdn.autodoc.de/thumb']");
	    
	    var all_main_images_src = [];
	    for (var i = 0; i < all_main_images.length; i++) {
	        var bigpic = jQuery(all_main_images[i]).attr("src");
	        all_main_images_src = all_main_images_src.concat(bigpic);
	     }
	    
	    var json_main_images = JSON.stringify(all_main_images_src);

	    var title = jQuery("h2 span.title")
	      .text()
	      .trim();
	    
	    var subTitle = jQuery(".product-block__description__title-small").text().trim();
	    title+=" "+subTitle;
	    
	    var articleNumber = jQuery("span.subtitle-art-nummer span").text().trim();
	    
	    var ean = jQuery(".product-block__description__eom li:last").find("span:last").text().trim().replace(/\w+/,"").trim();
	    
	    var price = jQuery('.product-new-price').text().trim().replace(/[^\d\.\,]+/g, "");
	    
	    var manufacturer="";
	    
	    var oems = jQuery(".oem-list li");
	    var oems_parsed = [];
	    for (var o=0;o<oems.length;o+=1){
	    	var oem = jQuery(".oem-list li").eq(o).text().trim().split(" — ")[0].replace("OEN","").trim();
	    	var mfr = jQuery(".oem-list li").eq(o).text().trim().split(" — ")[1].trim();
	    	oems_parsed=oems_parsed.concat({"brand":mfr,"articleNumber":oem});
	    }
	    
	    var pck_weight=0;
	    var pck_width=0;
	    var pck_height=0;
	    var pck_length=0;
	    
	    var item_specifics = jQuery(".product-block__description__info li");
	    var item_specifics_array = [];
	    for (var i = 0; i < item_specifics.length; i++) {
	      try {
	        var left_side = jQuery(item_specifics[i]).find(".i1")
	          .text()
	          .trim();
	        left_side = left_side.substring(0, left_side.length - 1);
	        var right_side = jQuery(item_specifics[i]).find(".i2")
	          .text()
	          .trim();
	        item_specifics_array = item_specifics_array.concat([
	          {
	            left_side: left_side,
	            right_side: right_side
	          }
	        ]);
	        
	        try {
	            if (left_side.indexOf("Weight") != -1) {
	              weight = right_side.replace(/\(.+\)/, "").trim();
	              pck_weight = weight.match(/[0-9]*[.]?[0-9]+/)[0];
	            }
	        } catch (e) {}
	        
	        try {
	            if (left_side.indexOf("Width") != -1) {
	              width = right_side.replace(/\(.+\)/, "").trim();
	              pck_width = width.match(/[0-9]*[.]?[0-9]+/)[0];
	            }
	        } catch (e) {}
	        
	        try {
	            if (left_side.indexOf("Height") != -1) {
	              height = right_side.replace(/\(.+\)/, "").trim();
	              pck_height = height.match(/[0-9]*[.]?[0-9]+/)[0];
	            }
	        } catch (e) {}
	        
	        try {
	            if (left_side.indexOf("Length") != -1) {
	              length = right_side.replace(/\(.+\)/, "").trim();
	              pck_length = length.match(/[0-9]*[.]?[0-9]+/)[0];
	            }
	        } catch (e) {}
	        
	        try {
	            if (left_side.toLowerCase().indexOf("price") != -1) {
	              price = right_side.replace(/\(.+\)/, "").trim();
	              price = price.match(/[0-9]*[.]?[0-9]+/)[0];
	            }
	        } catch (e) {}
	        
	        try {
	            if (left_side.toLowerCase().indexOf("manufacturer") != -1) {
	            	manufacturer = right_side.text().trim();
	            }
	        } catch (e) {}

	      } catch (e) {}
	    }
	    
	    var source = window.location.hostname.match(/([\w]+\.)?([\w\W]+\.\w+\/?)/)[2].toLowerCase().replace(/\.|\-/,"");

	if (typeof info_obj=='undefined'){
		var info_obj={};
	}
	if (typeof stor_obj=='undefined'){
		var stor_obj={};
	}

	stor_obj={
		source: source,
		title: title,
		price: price,
		manufacturer: manufacturer,
		article_number: articleNumber,
		weight: pck_weight,
		length: pck_length,
		height: pck_height,
		width: pck_width,
		specifics: item_specifics_array,
		main_images: json_main_images,
		MPN:articleNumber,
		EAN: ean,
		UPC: ean,
		oems: oems_parsed,
		compat_vehicles: {},
		vendor_link:window.location.href
	};

	var listing =  stor_obj;

	info_obj.saved_listing = listing;

	chrome.runtime.sendMessage({
		type: "update_listing_cache",
		info_obj: info_obj
	});


	var local_storage = stor_obj;
	    
	    chrome.storage.local.set(local_storage,function() {
	    	setTimeout(function(){
		    	
		    	var compat_vehicles ={};
			    for (var c = 0;c<jQuery(".button_dropdown_list.loaded").length;c+=1){
			    	try{
			    		
			    	
			    	var maker_id = jQuery(".button_dropdown_list.loaded").eq(c).data('maker');
			    	var model_id = jQuery(".button_dropdown_list.loaded").eq(c).data('model');
			    	var prod_id = jQuery(".button_dropdown_list.loaded").eq(c).data('prod');
			    	if (jQuery(".button_dropdown_list.loaded").eq(c).next().find("ul li").length){
			    		var car_texts = jQuery(".button_dropdown_list.loaded").eq(c).next().find("ul li");
			    	} else {
			    		var car_texts = jQuery(".button_dropdown_list.loaded").eq(c).next().find("li");
			    	}
			    	
			    	var maker = jQuery(".button_dropdown_list.loaded").eq(c).text().match(/([\w\W]+)\(\w+\s+\d\d\./)[1].split(" ")[0];
			    	var model = jQuery(".button_dropdown_list.loaded").eq(c).text().match(/([\w\W]+)\(\w+\s+\d\d\./)[1];
			    	
			    	for (var cc=0;cc<car_texts.length;cc+=1){
			    		var matches = jQuery(car_texts[cc]).text().match(/([\w\W]+), \w+.*(\d\d\.(\d\d\d\d)).+(\d\d\.(\d\d\d\d))?,\s+(\d+)\s+ccm,\s+(\d+)\s+PS/);
					    var typeName = matches[1];
					    var yearFrom = matches[3];
					    if (matches[5]==undefined){
					    	var yearTo='';
					    } else {
					    	var yearTo = matches[5];
					    }
					    var ccm = matches[6];
					    var ps = matches[7];
					    
    	        		if (typeof compat_vehicles[maker]=='undefined'){
    	        			compat_vehicles[maker]=[];
    	        		}
    	        		compat_vehicles[maker]=compat_vehicles[maker].concat({
					    	"maker":maker,
					    	"model":model,
					    	"maker_id":maker_id,
					    	"model_id":model_id,
					    	"prod_id":prod_id,
					    	"carName":typeName,
					    	"typeName":typeName,
					    	"yearOfConstrFrom":yearFrom,
					    	"yearOfConstrTo":yearTo,
					    	"yearFrom":yearFrom,
					    	"yearTo":yearTo,
					    	"ccm":ccm,
					    	"ps":ps
					    });
			    	}
			    	
					} catch(e){
			    		
			    	}
			    	
			    }
			    
			    chrome.storage.local.get(function(resp){
			    	resp.compat_vehicles=compat_vehicles;
			    	chrome.storage.local.set(resp,function() {
			    		jQuery("#autodocCopy").val("Working...");

			    	    chrome.runtime.sendMessage(
			    	      {
			    	        type: "upload_images",
			    	        title: title,
			    	        main_images: json_main_images,
			    	      },
			    	      function() {
			    	        chrome.runtime.sendMessage({
			    	          type: "create_listing"
			    	        });
			    	      }
			    	    );
			    	});
			    })
			    
		    },3000);
	    });
	    

	    
	  }
