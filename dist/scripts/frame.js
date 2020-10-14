(function(document, window, $) {
  "use strict";
	
	function toTitleCase(str) {
	    return str.replace(/\w\S*/g, function(txt) {
	      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    });
	  }

	
  function pasteEbayDoesNotApply() {
    var dnas = jQuery("a:contains('Does not apply')");
    for (var e = 0; e < dnas.length; e++) {
      dnas[e].click();
    }
  }

  function pasteEbayCustomCodes() {
    var upc_inputs = jQuery("input[cn='upc']");
    var ean_inputs = jQuery("input[cn='ean']");

    chrome.storage.local.get(["codes"], function(resp) {
      for (var e = 0; e < upc_inputs.length; e++) {
        for (var c = 0; c < resp.codes.length; c += 1) {
          if (resp.codes[c].right_num == "UPC") {
            jQuery(upc_inputs)
              .eq(e)
              .val(resp.codes[c].left_num);

            resp.codes.splice(c, 1);
            break;
          }
        }
      }

      for (var e = 0; e < ean_inputs.length; e++) {
        for (var c = 0; c < resp.codes.length; c += 1) {
          if (resp.codes[c].right_num == "EAN") {
            jQuery(ean_inputs)
              .eq(e)
              .val(resp.codes[c].left_num);
            resp.codes.splice(c, 1);
            break;
          }
        }
      }

      chrome.storage.local.set({ codes: resp.codes });
    });
  }
  function pasteEbayImages() {
    chrome.storage.local.get(function(resp) {
      if (!resp.uploaded_images || resp.uploaded_images.length < 1) {
        jQuery("#ebayImgsPaste").notify("Images on product page still loading. Please wait...", {
          className: "error",
          position: "r"
        });
        return;
      }

      jQuery(".copyWebLink2").click(); //button only visible when home page

      var main_images = [];

      var loop_index =0;
      while (main_images.length < 12) {
        for (var f = 0; f < resp.uploaded_images.length; f += 1) {
          if (resp.uploaded_images[f].indexOf("main-") != -1) {
            main_images = main_images.concat(resp.uploaded_images[f]);
          }
        }
        
        loop_index+=1;
        if (loop_index==11){
        	break;
        }
      }
      
      if (main_images.length<12){
    	  loop_index =0;
    	  while (main_images.length < 12) {
    	        for (var f = 0; f < resp.uploaded_images.length; f += 1) {
    	            main_images = main_images.concat(resp.uploaded_images[f]);
    	        }
    	        
    	        loop_index+=1;
    	        if (loop_index==11){
    	        	break;
    	        }
    	      }
      }


      function nextElement(ind, main_images) {
        try {
          if (typeof main_images[ind] != "undefined") {
        	  var tail = "";
        	  if (typeof main_images[ind].split("main-")[1]=="undefined"){
        		  tail="desc-"+main_images[ind].split("desc-")[1];
        	  } else {
        		  tail="main-"+main_images[ind].split("main-")[1];
        	  }
            var createdUrl =
              "https://dropshiplister.com/app/assets/lis/images/" +
             tail;

            jQuery("#cw-inpList")
              .find("input:last")
              .val(createdUrl);

            try {
              if (ind < 11) {
                jQuery("#cw-addUrl")[0].click();
              }
            } catch (e) {}
          }
        } catch (e) {}

        try {
          if (ind == main_images.length - 1 || index > 10) {
            jQuery(".btns.cw-btnPairWrap")
              .find("a[role=button]")
              .eq(0)[0]
              .click();
          }
        } catch (e) {}

        if (index < 11) {
          index += 1;
          setTimeout(function() {
            nextElement(index, main_images);
          }, 500);
        }
      }
      var index = 0;
      nextElement(index, main_images);
    });
  }
  function pasteEbayVarImages() {
	    chrome.storage.local.get(function(resp) {
	      if (!resp.uploaded_var_images || resp.uploaded_var_images.length < 1) {
	        jQuery("#ebayVarImgsPaste").notify("No variation images extracted.", {
	          className: "error",
	          position: "r"
	        });
	        return;
	      }

	      jQuery(".copyWebLink2").click(); //button only visible when home page

	      var var_images = [];

	      var loop_index =0;
	        for (var f = 0; f < resp.uploaded_var_images.length; f += 1) {
	          if (resp.uploaded_var_images[f].indexOf("var-") != -1) {
	            var_images = var_images.concat(resp.uploaded_var_images[f]);
	          }
	        }
	        
	        //loop_index+=1;
	        //if (loop_index==11){
	        	//break;
	        //}
	      
	      if (var_images.length<12){
	    	  loop_index =0;
	    	  while (var_images.length < 12) {
	    	        for (var f = 0; f < resp.uploaded_var_images.length; f += 1) {
	    	            var_images = var_images.concat(resp.uploaded_var_images[f]);
	    	        }
	    	        
	    	        loop_index+=1;
	    	        if (loop_index==11){
	    	        	break;
	    	        }
	    	      }
	      }


	      function nextElement(ind, var_images) {
	        try {
	          if (typeof var_images[ind] != "undefined") {
	        	  var tail = "";
	        		  tail="var-"+var_images[ind].split("var-")[1];
	            var createdUrl =
	              "https://dropshiplister.com/app/assets/lis/images/" +
	             tail;

	            jQuery("#cw-inpList")
	              .find("input:last")
	              .val(createdUrl);

	            try {
	              if (ind < 11) {
	                jQuery("#cw-addUrl")[0].click();
	              }
	            } catch (e) {}
	          }
	        } catch (e) {}

	        try {
	          if (ind == var_images.length - 1 || index > 10) {
	            jQuery(".btns.cw-btnPairWrap")
	              .find("a[role=button]")
	              .eq(0)[0]
	              .click();
	          }
	        } catch (e) {}

	        if (index < 11) {
	          index += 1;
	          setTimeout(function() {
	            nextElement(index, var_images);
	          }, 500);
	        }
	      }
	      var index = 0;
	      nextElement(index, var_images);
	    });
	  }
  function pasteEbayImagesNormal() {
    chrome.storage.local.get(function(resp) {
      if (!resp.uploaded_images_normal || resp.uploaded_images_normal.length < 1) {
        jQuery("#ebayImgsPasteNormal").notify(
          "Images on product page still loading. Please wait...",
          {
            className: "error",
            position: "r"
          }
        );
        return;
      }

      jQuery(".copyWebLink2").click(); //button only visible when home page

      var main_images = [];

      var loop_index =0;
      while (main_images.length < 12) {
        for (var f = 0; f < resp.uploaded_images_normal.length; f += 1) {
          if (resp.uploaded_images_normal[f].indexOf("main-") != -1) {
            main_images = main_images.concat(resp.uploaded_images_normal[f]);
          }
        }
        
        loop_index+=1;
        if (loop_index==11){
        	break;
        }
      }
      
      if (main_images.length<12){
    	  loop_index =0;
    	  while (main_images.length < 12) {
    	        for (var f = 0; f < resp.uploaded_images_normal.length; f += 1) {
    	            main_images = main_images.concat(resp.uploaded_images_normal[f]);
    	        }
    	        
    	        loop_index+=1;
    	        if (loop_index==11){
    	        	break;
    	        }
    	      }
      }

      function nextElement(ind, main_images) {
        try {
          if (typeof main_images[ind] != "undefined") {
        	  var tail = "";
        	  if (typeof main_images[ind].split("main-")[1]=="undefined"){
        		  tail="desc-"+main_images[ind].split("desc-")[1];
        	  } else {
        		  tail="main-"+main_images[ind].split("main-")[1];
        	  }
            var createdUrl =
              "https://dropshiplister.com/app/assets/lis/images/" +
             tail;

            jQuery("#cw-inpList")
              .find("input:last")
              .val(createdUrl);

            try {
              if (ind < 11) {
                jQuery("#cw-addUrl")[0].click();
              }
            } catch (e) {}
          }
        } catch (e) {}

        try {
          if (ind == main_images.length - 1 || index > 10) {
            jQuery(".btns.cw-btnPairWrap")
              .find("a[role=button]")
              .eq(0)[0]
              .click();
          }
        } catch (e) {}

        if (index < 11) {
          index += 1;
          setTimeout(function() {
            nextElement(index, main_images);
          }, 500);
        }
      }
      var index = 0;
      nextElement(index, main_images);
    });
  }
  
  function pasteEbayVarImagesNormal() {
	    chrome.storage.local.get(function(resp) {
	      if (!resp.uploaded_var_images_normal || resp.uploaded_var_images_normal.length < 1) {
	        jQuery("#ebayVarImgsPasteNormal").notify(
	          "No variation images extracted.",
	          {
	            className: "error",
	            position: "r"
	          }
	        );
	        return;
	      }

	      jQuery(".copyWebLink2").click(); //button only visible when home page

	      var var_images = [];

	      var loop_index =0;
	        for (var f = 0; f < resp.uploaded_var_images_normal.length; f += 1) {
	          if (resp.uploaded_var_images_normal[f].indexOf("var-") != -1) {
	            var_images = var_images.concat(resp.uploaded_var_images_normal[f]);
	          }
	        }
	        
	       // loop_index+=1;
	        //if (loop_index==11){
	       // 	break;
	       // }
	      
	      if (var_images.length<12){
	    	  loop_index =0;
	    	  while (var_images.length < 12) {
	    	        for (var f = 0; f < resp.uploaded_var_images_normal.length; f += 1) {
	    	            var_images = var_images.concat(resp.uploaded_var_images_normal[f]);
	    	        }
	    	        
	    	        loop_index+=1;
	    	        if (loop_index==11){
	    	        	break;
	    	        }
	    	      }
	      }

	      function nextElement(ind, var_images) {
	        try {
	          if (typeof var_images[ind] != "undefined") {
	        	  var tail = "";
	        		  tail="main-"+var_images[ind].split("var-")[1];
	            var createdUrl =
	              "https://dropshiplister.com/app/assets/lis/images/" +
	             tail;

	            jQuery("#cw-inpList")
	              .find("input:last")
	              .val(createdUrl);

	            try {
	              if (ind < 11) {
	                jQuery("#cw-addUrl")[0].click();
	              }
	            } catch (e) {}
	          }
	        } catch (e) {}

	        try {
	          if (ind == var_images.length - 1 || index > 10) {
	            jQuery(".btns.cw-btnPairWrap")
	              .find("a[role=button]")
	              .eq(0)[0]
	              .click();
	          }
	        } catch (e) {}

	        if (index < 11) {
	          index += 1;
	          setTimeout(function() {
	            nextElement(index, var_images);
	          }, 500);
	        }
	      }
	      var index = 0;
	      nextElement(index, var_images);
	    });
	  }
  
  function pasteEbayVarImagesRaw() {
	    chrome.storage.local.get(function(resp) {
	      jQuery(".copyWebLink2").click(); //button only visible when home page

	      var parsed_var_images = JSON.parse(resp.var_images);
	      var parsed_var_images_flat = [];
	      for (var par_var_img in parsed_var_images){
	    	  parsed_var_images_flat=parsed_var_images_flat.concat(parsed_var_images[par_var_img]);
	      }
	      parsed_var_images=parsed_var_images_flat;
	      
	      var var_images = [];

	      var loop_index=0;
	        for (var f = 0; f < parsed_var_images.length; f += 1) {
	          var_images = var_images.concat(parsed_var_images[f]);
	        }
	        
	        //loop_index+=1;
	        //if (loop_index==11){
	        //	break;
	        //}
	      

	      function nextElement(ind, var_images) {
	        try {
	          if (typeof var_images[ind] != "undefined") {
	            var createdUrl = var_images[ind][Object.keys(var_images[ind])[0]];
	            jQuery("#cw-inpList")
	              .find("input:last")
	              .val(createdUrl);

	            try {
	              if (ind < 11) {
	                jQuery("#cw-addUrl")[0].click();
	              }
	            } catch (e) {}
	          }
	        } catch (e) {}

	        try {
	          if (ind == var_images.length - 1 || index > 10) {
	            jQuery(".btns.cw-btnPairWrap")
	              .find("a[role=button]")
	              .eq(0)[0]
	              .click();
	          }
	        } catch (e) {}

	        if (index < 11) {
	          index += 1;
	          setTimeout(function() {
	            nextElement(index, var_images);
	          }, 500);
	        }
	      }
	      var index = 0;
	      nextElement(index, var_images);
	    });
	  }
  
  function pasteEbayVarImagesTitle() {
	    chrome.storage.local.get(function(resp) {
	      jQuery(".copyWebLink2").click(); //button only visible when home page

	      var parsed_var_images = JSON.parse(resp.var_images_with_info);
	      var var_images=[];
	      for (var p=0;p<parsed_var_images.length;p+=1){
	    	  if (parsed_var_images[p].title.trim().toLowerCase()==resp.var_title.trim().toLowerCase()){
	    		  var_images=var_images.concat(parsed_var_images[p]);
	    		  break;
	    	  }
	      }
	      
	      function nextElement(ind, var_images) {
	        try {
	          if (typeof var_images[ind] != "undefined") {
	            var createdUrl = var_images[ind].src;
	            jQuery("#cw-inpList")
	              .find("input:last")
	              .val(createdUrl);

	            try {
	              if (ind < 11 && (ind != var_images.length - 1)) {
	                jQuery("#cw-addUrl")[0].click();
	              }
	            } catch (e) {}
	          }
	        } catch (e) {}

	        try {
	          if (ind == var_images.length - 1 || index > 10) {
	            jQuery(".btns.cw-btnPairWrap")
	              .find("a[role=button]")
	              .eq(0)[0]
	              .click();
	          }
	        } catch (e) {}

	        if (index < 11) {
	          index += 1;
	          setTimeout(function() {
	            nextElement(index, var_images);
	          }, 500);
	        }
	      }
	      var index = 0;
	      nextElement(index, var_images);
	    });
	  }
  
  function pasteEbayImagesRaw() {
    chrome.storage.local.get(function(resp) {
    	
    	if (!resp.main_images || resp.main_images.length < 1) {
            jQuery("#ebayImgsPasteRaw").notify(
              "No images copied!",
              {
                className: "error",
                position: "r"
              }
            );
            return;
          }
    	
      jQuery(".copyWebLink2").click(); //button only visible when home page

      var parsed_main_images = JSON.parse(resp.main_images);
      var main_images = [];

      var loop_index=0;
      while (main_images.length < 12) {
        for (var f = 0; f < parsed_main_images.length; f += 1) {
          main_images = main_images.concat(parsed_main_images[f]);
        }
        
        loop_index+=1;
        if (loop_index==11){
        	break;
        }
      }



      function nextElement(ind, main_images) {
        try {
          if (typeof main_images[ind] != "undefined") {
            var createdUrl = main_images[ind];
            jQuery("#cw-inpList")
              .find("input:last")
              .val(createdUrl);

            try {
              if (ind < 11) {
                jQuery("#cw-addUrl")[0].click();
              }
            } catch (e) {}
          }
        } catch (e) {}

        try {
          if (ind == main_images.length - 1 || index > 10) {
            jQuery(".btns.cw-btnPairWrap")
              .find("a[role=button]")
              .eq(0)[0]
              .click();
          }
        } catch (e) {}

        if (index < 11) {
          index += 1;
          setTimeout(function() {
            nextElement(index, main_images);
          }, 500);
        }
      }
      var index = 0;
      nextElement(index, main_images);
    });
  }
	    
  
  function pasteEbayCompatVehicles(){
	  
	  
	  chrome.storage.local.get(function(resp) {
		  var compat_vehicles = resp.compat_vehicles;
		  
		  	if (typeof resp.compat_vehicles=='undefined' || resp.compat_vehicles.length==0){
	    		jQuery("#ebayCompatVehiclesPaste").notify("You haven't yet copied any compatible vehicles!", {
	    	          className: "error",
	    	          position: "t"
	    	        });
	    		return;
	    	}
		  
			  jQuery("button[id*='filter1-enhancedSelectButton']").click();
			  
			  var maker_options = jQuery("div[id*='filter1-selectOptions-overlayBody']").find("ul.options-container.listbox").find("li[title]");
			  
			  // clearInterval(makerInterval);
			  
			  const manuNames = Object.keys(compat_vehicles)
			  
			  for (const manuName of manuNames) {
			    console.log(manuName)
			    
			    for (var m=0;m<maker_options.length;m+=1){
			  		var makerTitle = jQuery(maker_options[m]).attr('title');
			  		// console.log(option);
			  		if (manuName.toLowerCase().trim()==makerTitle.toLowerCase().trim()){
			  			if (!jQuery(maker_options[m]).find("input").is(":checked")){
			  				jQuery(maker_options[m]).find("input").click();
			  			}
			  		}
			  	}
			    
			  }
			  
			  setTimeout(function(){
				  jQuery("button[id*='filter2-enhancedSelectButton").click();
				  	
				  var model_options = jQuery("div[id*='filter2-selectOptions-overlayBody").find("ul.options-container.listbox").find("li[title]");
				  	
				  for (const manuName of manuNames) {
					    console.log(manuName)
					    
					    for (var m=0;m<model_options.length;m+=1){
					  		var modelTitle = jQuery(model_options[m]).attr('title');
					  		var makerPrefix = jQuery(model_options[m]).attr('data-prefix').split("|")[0];
					  		// console.log(option);
					  		if (manuName.toLowerCase().trim()==makerPrefix.toLowerCase().trim()){
					  			for (var c=0;c<compat_vehicles[manuName].length;c+=1){
					  				if (compat_vehicles[manuName][c].model.toLowerCase().replace(" ","").trim().indexOf(modelTitle.toLowerCase().replace(" ","").trim())!=-1 ||
					  						compat_vehicles[manuName][c].carName.toLowerCase().replace(" ","").trim().indexOf(modelTitle.toLowerCase().replace(" ","").trim())!=-1){
							  			if (!jQuery(model_options[m]).find("input").is(":checked")){
							  				jQuery(model_options[m]).find("input").click();
							  			}
					  			}
					  			
					  		}
					  	}
					    
					  }
				  }
				  
				  setTimeout(function(){
					  jQuery("button[id*='filter3-enhancedSelectButton").click();
						 
					  	var modification_options = jQuery("div[id*='filter3-selectOptions-overlayBody").find("ul.options-container.listbox").find("li[title]");
					  	
					  
					  	for (const manuName of manuNames) {
						    console.log(manuName)
						    
						    for (var m=0;m<modification_options.length;m+=1){
						  		var yearTitle = jQuery(modification_options[m]).attr('title');
						  		var makerPrefix = jQuery(modification_options[m]).attr('data-prefix').split("|")[0];
						  		var modelPrefix = jQuery(modification_options[m]).attr('data-prefix').split("|")[1];
						  		try{
						  			var yearPrefix = parseInt(jQuery(modification_options[m]).attr('data-prefix').split("|")[2].match("\\[(\\d+)\\-(\\d+)\\]")[1]);
						  		} catch(e){
						  			try{
						  				
						  					var yearPrefix=jQuery(modification_options[m]).attr('data-prefix').split("|")[2].match(/(\d\d\d\d)\-(\d\d\d\d)/)[1];
						  				
						  				} catch(e){
							  				try{
							  					
							  						var yearPrefix = parseInt(jQuery(modification_options[m]).attr('data-prefix').split("|")[2]);
									  			
							  					} catch(e){
							  						continue;
							  				}
						  			}
						  			
						  		}
						  		// console.log(option);
						  		if (manuName.toLowerCase().trim()==makerPrefix.toLowerCase().trim()){
						  			try{
						  				for (var c=0;c<compat_vehicles[manuName].length;c+=1){
							  				try{
							  					var yearFrom = parseInt(compat_vehicles[manuName][0].yearOfConstrFrom.match(/\d\d\d\d/)[0]);
							  				} catch(e){
							  					// var yearFrom=parseInt(new
												// Date().getFullYear());
							  					continue;
							  				}
							  				try{
							  					var yearTo = compat_vehicles[manuName][0].yearOfConstrTo.match(/\d\d\d\d/)[0];
							  				} catch(e){
							  					var yearTo=parseInt(new Date().getFullYear());
							  				}
							  				
							  				if (yearPrefix>=yearFrom && yearPrefix<=yearTo){
									  			if (!jQuery(modification_options[m]).find("input").is(":checked")){
									  				jQuery(modification_options[m]).find("input").click();
									  			}
							  			}
							  			
						  				}
						  			} catch(e){
						  				
						  			}
						  			
						  	}
						    
						  }
					  }
					  	
					  	setTimeout(function(){
					  		 var trimLabels=jQuery("[data-w-onclick*='treeList-item'].l1-text");
					  		 trimLabels.click();
					  		 
					  		 jQuery("button[id*='saveVehicles']").click();
					  		 
					  		/*
							 * for (var m=0;m<trimLabels.length;m+=1){ var
							 * label = trimLabels[m]; var labelButton =
							 * label.prev(); labelButton.click(); var
							 * trimlSubLabels =
							 * label.parent().parent().find("tree-leaf");
							 * 
							 * for (var sm=0;sm<trimSubLabels.length;sm+=1){
							 * var subLabel=trimSubLabels[sm];
							 * subLabel.find("[data-w-onclick*='treeList-item'].node-text");
							 * var subLabelButton = label.prev();
							 * subLabelButton.click(); var years =
							 * label.parent().parent().find("tree-leaf-content").find("[data-w-onclick*='treeList-item'].by-many");
							 * 
							 * for (var y=0;y<years.length;y+=1){
							 * 
							 * var year=parseInt(years[y].text.trim()); for
							 * (const manuName of manuNames) {
							 * console.log(manuName)
							 * 
							 * for (var m=0;m<modification_options.length;m+=1){
							 * var yearTitle =
							 * jQuery(modification_options[m]).attr('title');
							 * var makerPrefix =
							 * jQuery(modification_options[m]).attr('data-prefix').split("|")[0];
							 * var modelPrefix =
							 * jQuery(modification_options[m]).attr('data-prefix').split("|")[1];
							 * try{ var yearPrefix =
							 * parseInt(jQuery(modification_options[m]).attr('data-prefix').split("|")[2]); }
							 * catch(e){ continue; } //console.log(option); if
							 * (manuName.toLowerCase().trim()==makerPrefix.toLowerCase().trim()){
							 * for (var c=0;c<compat_vehicles[manuName].length;c+=1){
							 * try{ var yearFrom =
							 * parseInt(compat_vehicles[manuName][0].yearOfConstrFrom.match(/\d\d\d\d/)[0]); }
							 * catch(e){ //var yearFrom=parseInt(new
							 * Date().getFullYear()); continue; } try{ var
							 * yearTo =
							 * compat_vehicles[manuName][0].yearOfConstrTo.match(/\d\d\d\d/)[0]; }
							 * catch(e){ var yearTo=parseInt(new
							 * Date().getFullYear()); } if (year>=yearFrom &&
							 * year<=yearTo){ year.find("input").click(); } }
							 *  } }
							 *  } }
							 *  }
							 *  }
							 */
					  		 
					  	},10000);
				  },2000);
				  
			  },2000);
			  

		
	  });
  }
      
  function loadPasteEbayFrameButtons(){

	  var pastBtnImgsRaw = jQuery(
		  "<input class='shipping-btn' style='margin-top:15px;display: inline-block;font-weight:700;' type='button' id='ebayImgsPasteRaw' value='Source'>"
	  );
	  pastBtnImgsRaw.off();
	  pastBtnImgsRaw["on"]("click", pasteEbayImagesRaw);

	  setInterval(function() {
		  if (!jQuery("#ebayImgsPasteRaw")["length"]) {
			  jQuery("#ab-actBarTop").before(pastBtnImgsRaw);
		  }
	  }, 500);


	        var pastBtnImgsNormal = jQuery(
	          "<input class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' id='ebayImgsPasteNormal' value='Server'>"
	        );
	        pastBtnImgsNormal.off();
	        pastBtnImgsNormal["on"]("click", pasteEbayImagesNormal);

	        setInterval(function() {
	          if (!jQuery("#ebayImgsPasteNormal")["length"]) {
	            jQuery("#ab-actBarTop").before(pastBtnImgsNormal);
	          }
	        }, 500);

		  var pastBtnImgs = jQuery(
			  "<input class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' id='ebayImgsPaste' value='1500x1500'>"
		  );
		  pastBtnImgs.off();
		  pastBtnImgs["on"]("click", pasteEbayImages);

		  setInterval(function() {
			  if (!jQuery("#ebayImgsPaste")["length"]) {
				  jQuery("#ab-actBarTop").before(pastBtnImgs);
			  }
		  }, 500);


	  var pastBtnVarImgsRaw = jQuery(
		  "<input class='shipping-btn' style='margin-top:15px;display: inline-block;font-weight:700;' type='button' id='ebayVarImgsPasteRaw' value='Variations'>"
	  );
	  pastBtnVarImgsRaw.off();
	  pastBtnVarImgsRaw["on"]("click", pasteEbayVarImagesRaw);

	  setInterval(function() {
		  if (!jQuery("#ebayVarImgsPasteRaw")["length"]) {
			  jQuery("#ab-actBarTop").before(pastBtnVarImgsRaw);
		  }
	  }, 500);


			  var pastBtnVarImgsNormal = jQuery(
				  "<input class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' id='ebayVarImgsPasteNormal' value='Va.r Unresized'>"
			  );
			  pastBtnVarImgsNormal.off();
			  pastBtnVarImgsNormal["on"]("click", pasteEbayVarImagesNormal);

			  setInterval(function() {
				  if (!jQuery("#ebayVarImgsPasteNormal")["length"]) {
					  jQuery("#ab-actBarTop").before(pastBtnVarImgsNormal);
				  }
			  }, 500);

	        
	        var pastBtnVarImgs = jQuery(
	                "<input class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' id='ebayVarImgsPaste' value='Var. Resized'>"
	              );
	              pastBtnVarImgs.off();
	              pastBtnVarImgs["on"]("click", pasteEbayVarImages);

	              setInterval(function() {
	                if (!jQuery("#ebayVarImgsPaste")["length"]) {
	                  jQuery("#ab-actBarTop").before(pastBtnVarImgs);
	                }
	              }, 500);
	              

	              chrome.storage.local.set({"var_title":null},function(){
	            	  var varTitleInterval = setInterval(function() {
	                  	chrome.storage.local.get(function(resp){
	                  		
	                  		if (resp.var_title){
	                  			if (!jQuery("#ebayVarImgsPasteTitle").length){
	                  				
	          	          				var $ebayVarImgsTitle = jQuery(
	          	                                "<input class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' id='ebayVarImgsPasteTitle' title='"+resp.var_title+"' value='Var ("+resp.var_title+")'>"
	          	                              );
	          		          			  $ebayVarImgsTitle.off();
	          		          			  $ebayVarImgsTitle["on"]("click", pasteEbayVarImagesTitle);
	          		          			  
	                                      jQuery("#ab-actBarTop").before($ebayVarImgsTitle);
	                             } else {
	                                  	  jQuery("#ebayVarImgsPasteTitle").attr("title",resp.var_title);
	                                  	  jQuery("#ebayVarImgsPasteTitle").val("Var ("+resp.var_title+")");
	                            }
	          	          			
	          	          				/*chrome.storage.local.set({"var_title":null},function(){
	          	          					
	          	          				});*/
	                  		}
	                  	});
	                  },1000);
	              });
	             

	        var pastBtnVar = jQuery(
	          "<input class='shipping-btn' style='margin-top:15px;' type='button' id='ebayVarPaste' value='Insert Variations'>"
	        );
	        pastBtnVar.off();
	        pastBtnVar["on"]("click", pasteEbayVariations);

	        setInterval(function() {
	          if (!jQuery("#ebayVarPaste")["length"]) {
	            jQuery("#msku-variation-selection-container").before(pastBtnVar);
	          }
	        }, 500);
	        
	        var pastBtnCompatVehiclesOpen = jQuery(
                "<input class='shipping-btn' style='margin-top:15px;' type='button' id='ebayCompatVehiclesOpen' value='Insert Vehicles'>"
              );
	        pastBtnCompatVehiclesOpen.off();
	        pastBtnCompatVehiclesOpen["on"]("click", function(){
	        	jQuery("button[data-frame-meta*='edit-fitments']").click();
	        });
              setInterval(function() {
                if (!jQuery("#ebayCompatVehiclesOpen")["length"]) {
                  jQuery("#fitmentDiv").before(pastBtnCompatVehiclesOpen);
                }
              }, 500);
              
        var compatVehiclesInterval=setInterval(function(){
    			  
    			  if (!jQuery("button[id*='filter1-enhancedSelectButton']").length){
    				  return;
    			  }
    			  
    			  var pastBtnCompatVehicles = jQuery(
    		                "<input class='shipping-btn' style='margin-top:15px;' type='button' id='ebayCompatVehiclesPaste' value='Insert Compatible Vehicles'>"
    		              );
    		        pastBtnCompatVehicles.off();
    		        pastBtnCompatVehicles["on"]("click", pasteEbayCompatVehicles);

    		              setInterval(function() {
    		                if (!jQuery("#ebayCompatVehiclesPaste")["length"]) {
    		                		jQuery("body.edit-fitments div[id*='viewContainer']").before(pastBtnCompatVehicles);
    		                }
    		                if (jQuery("button[id*='filter1-enhancedSelectButton']").length){
		                		jQuery("#ebayCompatVehiclesPaste").show();
			      			  } else {
			      				jQuery("#ebayCompatVehiclesPaste").hide();
			      			  }
    		                
    		              }, 500);
    			  
    			  // jQuery("button[id*='filter1-enhancedSelectButton']").click();
    			  
    			  // var maker_options =
					// jQuery("div[id*='filter1-selectOptions-overlayBody']").find("ul.options-container.listbox").find("li[title]");
    			  
    			  
    			  clearInterval(compatVehiclesInterval);
        });
	        
	        var pastBtnDNA = jQuery(
	          "<input class='shipping-btn' style='margin-top:15px;' type='button' id='ebayDNAPaste' value='Does Not Apply'>"
	        );
	        pastBtnDNA.off();
	        pastBtnDNA["on"]("click", pasteEbayDoesNotApply);
	        
	        var pastBtnCustomCodes = jQuery(
	          "<input class='shipping-btn' style='margin-top:15px;' type='button' id='ebayCodesPaste' value='Custom UPC/EAN'>"
	        );
	        pastBtnCustomCodes.off();
	        pastBtnCustomCodes["on"]("click", pasteEbayCustomCodes);
	  		pastBtnCustomCodes.hide();

	        setInterval(function() {
	          if (!jQuery("#ebayDNAPaste")["length"]) {
	            jQuery("#msku-bulkedit").before(pastBtnDNA);
	          }
	          if (!jQuery("#ebayCodesPaste")["length"]) {
	            jQuery("#msku-bulkedit").before(pastBtnCustomCodes);
	          }
	          
	        }, 500);
 }
 
  function pasteEbayVariations() {
    chrome.storage.local.get(function(resp) {
      function openAddAttr() {
        var button = document.getElementById("msku-attribute-add");
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent(
          "click",
          true,
          true,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        button.dispatchEvent(e);
      }

      function closeAddAttr() {
        var button = document.getElementById("msku-cancel-parent-tag-btn");
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent(
          "click",
          true,
          true,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        button.dispatchEvent(e);
      }

      function saveAddAttr() {
        jQuery("#msku-add-parent-tag-btn").click();
      }
      var updated_variations = {};
      function nextElement(ind, stor) {
        try {
          if (ind == 1) {
            jQuery("span[id^='msku-variation-tag']")
              .find("a")
              .click();
            var exist_vars = jQuery("span[id^='msku-variation-tag']").find("a");
            for (var e = 0; e < exist_vars.length; e++) {
              exist_vars[e].click();
            }
            updated_variations = {};
            for (var varName in stor.variations) {
              if (varName.length < 2) {
                continue;
              }
              if (typeof varName != "undefined") {
                closeAddAttr();
                openAddAttr();

                var exists = false;
                for (
                  var labl = 0;
                  labl < jQuery("label[for^=msku-parent-tag-checkbox]").length;
                  labl += 1
                ) {
                  if (
                    jQuery("label[for^=msku-parent-tag-checkbox]")
                      .eq(labl)
                      .text() == varName
                  ) {
                    exists = true;
                    jQuery("label[for^=msku-parent-tag-checkbox]")
                      .eq(labl)
                      .find("input")
                      .prop("checked", true);
                    break;
                  }
                }

                if (!exists) {
                  updated_variations[varName] = stor.variations[varName];
                  jQuery("#msku-own-parent-tag-checkbox").click();
                  jQuery("#msku-custom-parent-attribute-input").val(varName);
                }

                updated_variations[varName] = stor.variations[varName];
                saveAddAttr();
                closeAddAttr();
              }
            }
          } else if (ind == 2) {
            for (var varName in updated_variations) {
              try {
                jQuery("span[id^=msku-variation-tag]:contains('" + varName + "')").click();

                var var_types = updated_variations[varName];
                for (var c = 0; c < var_types.length; c++) {
                  //jQuery("a#msku-custom-option-link").click();
                  if (var_types[c] == "") {
                    continue;
                  }
                  if (
                    jQuery("div[id^=msku-variation-values]")
                      .not(".hide")
                      .find("li[role=button]:contains(" + var_types[c] + ")").length == 1
                  ) {
                    if (
                      jQuery("div[id^=msku-variation-values]")
                        .not(".hide")
                        .find("li[role=button]:contains(" + var_types[c] + ")")
                        .is(":visible")
                    ) {
                      jQuery("div[id^=msku-variation-values]")
                        .not(".hide")
                        .find("li[role=button]:contains(" + var_types[c] + ")")
                        .click();
                      continue;
                    }
                  }
                  var button = document.getElementById("msku-custom-option-link");
                  var e = document.createEvent("MouseEvents");
                  e.initMouseEvent(
                    "click",
                    true,
                    true,
                    window,
                    0,
                    0,
                    0,
                    0,
                    0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    null
                  );
                  button.dispatchEvent(e);
                  jQuery("input#msku-custom-option-input").val(var_types[c]);
                  jQuery("a#msku-custom-option-add").click();
                  var button = document.getElementById("msku-custom-option-add");
                  var e = document.createEvent("MouseEvents");
                  e.initMouseEvent(
                    "click",
                    true,
                    true,
                    window,
                    0,
                    0,
                    0,
                    0,
                    0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    null
                  );
                  button.dispatchEvent(e);
                  //jQuery("a#msku-custom-option-add").click();
                }
              } catch (e) {}
            }
          } else if (ind == 5) {
          } else if (ind == 6) {
          } else if (ind == 7) {
          } else if (ind == 8) {
          }
        } catch (e) {}

        setTimeout(function() {
          if (index <= 10) {
            index++;
            nextElement(index, stor);
          }
        }, 300);
      }
      var index = 0;
      nextElement(index, resp);
    });
  }
  
  function pasteEbayVariationPhotos() {
	    chrome.storage.local.get(function(resp) {
	    	
	    	//jQuery("select#msku-photos_options").val("Color");
	    	var uploaded_var_images = resp.uploaded_var_images;
	    	for (var vi in uploaded_var_images) {
	    	    var var_photo = uploaded_var_images[vi];
	    	    	var var_obj_key = toTitleCase(var_photo.split("_-_")[1].replace("-"," "));
	    	    	jQuery("#msku-photos_variations").find("li:contains('"+var_obj_key+"')").find("a").click();
	    	    	jQuery(".copyWebLink2").parent().parent().show();
	    	    	jQuery(".copyWebLink2").click();
	    	    	
	    	    	var parsed_var_images = [];
	  	    	  parsed_var_images=parsed_var_images.concat(var_photo);
	  	  	      var var_images = [];

	  	  	      var loop_index=0;
	  	  	        for (var f = 0; f < parsed_var_images.length; f += 1) {
	  	  	          var_images = var_images.concat(parsed_var_images[f]);
	  	  	        }
	  	  	        
	  	  	        loop_index+=1;
	  	  	        if (loop_index==11){
	  	  	        	break;
	  	  	        }
	  	  	      

	  	  	    function nextElement(ind, var_images) {
	  		        try {
	  		          if (typeof var_images[ind] != "undefined") {
	  		        	  var tail = "";
	  		        		  tail="var-"+var_images[ind].split("var-")[1];
	  		            var createdUrl =
	  		              "https://dropshiplister.com/app/assets/lis/images/" +
	  		             tail;

	  		            jQuery("#cw-inpList")
	  		              .find("input:last")
	  		              .val(createdUrl);

	  		            try {
	  		              if (ind < 11) {
	  		                jQuery("#cw-addUrl")[0].click();
	  		              }
	  		            } catch (e) {}
	  		          }
	  		        } catch (e) {}

	  		        try {
	  		          if (ind == var_images.length - 1 || index > 10) {
	  		            jQuery(".btns.cw-btnPairWrap")
	  		              .find("a[role=button]")
	  		              .eq(0)[0]
	  		              .click();
	  		          }
	  		        } catch (e) {}

	  		        if (index < 11) {
	  		          index += 1;
	  		          setTimeout(function() {
	  		            nextElement(index, var_images);
	  		          }, 500);
	  		        }
	  		      }
	  	  	      var index = 0;
	  	  	      nextElement(index, var_images);
	    	}
	    	  
	    		
	    		
	    		//jQuery("#msku-photos_variations li:contains('"++"')").click();
	    		
	    	});
  }
	
	    	

  if (window.location.href.indexOf("ebay") && jQuery("#ds_div").length) {
    chrome.storage.local.set({ ebay_desc: jQuery("#ds_div").html() });
  }

  if (!window.isTop) {
    chrome.storage.local.get(function(resp) {
      if (resp.status == 1) {
    	  
    	  loadPasteEbayFrameButtons();
    	  
        setInterval(function() {
            if (jQuery("#msku-photos_variations").length) {
          	  var title = jQuery("#msku-photos_variations li.select").find("a").text().trim();
          	  chrome.storage.local.set(
          		      {
          		    	  var_title: title,
          		      },
          		      function() {
          		      }
          		    );
            }
        }, 1000);

        setTimeout(function(){
	        if (jQuery("div[id*='find-product-searchbar'] > div > input").length) {
	          chrome.storage.local.get(function(resp) {
	            if (resp.auto_listing == false) {
	              return;
	            }
	            jQuery("div[id*='find-product-searchbar'] > div > input").val(resp.title);
	            jQuery("div[id*='find-product-searchbar'] > button").prop("disabled", false);
	            jQuery("div[id*='find-product-searchbar'] > button").click();
	            setTimeout(function() {
	              jQuery("button.btn:contains('Continue')").click();
	              jQuery("button.continue-without-product").click();
	              jQuery("div.continue-without-product button").click();
	            }, 1000);
	
	            chrome.storage.local.set({ auto_listing: false });
	          });
	        } else if (jQuery("input.find-product").length) {
	          chrome.storage.local.get(function(resp) {
	            if (resp.auto_listing == false) {
	              return;
	            }
	            jQuery("input.find-product").val(resp.title);
	            jQuery("button.btn--primary").prop("disabled", false);
	            jQuery("button.btn--primary").click();
	            setTimeout(function() {
	              jQuery("button.btn:contains('Continue')").click();
	              jQuery("button.continue-without-product").click();
	              jQuery("div.continue-without-product button").click();
	            }, 1000);

	            chrome.storage.local.set({ auto_listing: false });
	          });
	        } else if (jQuery("div[id*='find-product-search-bar']").find("input").length) {
	          chrome.storage.local.get(function(resp) {
	            if (resp.auto_listing == false) {
	              return;
	            }
	            jQuery("div[id*='find-product-search-bar']")
	              .find("input")
	              .first()
	              .val(resp.title);
	            jQuery("div[id*='find-product-search-bar']")
	              .find("button")
	              .prop("disabled", false);
	            jQuery("div[id*='find-product-search-bar']")
	              .find("button")
	              .click();
	            setTimeout(function() {
	              jQuery("button.btn:contains('Continue')").click();
	              jQuery("button.continue-without-product").click();
	              jQuery("div.continue-without-product button").click();
	            }, 1000);

	            chrome.storage.local.set({ auto_listing: false });
	          });
	        } else if (jQuery("[aria-owns$='find-product-search-bar-autocomplete']").length){
	        	chrome.storage.local.get(function(resp) {
	                if (resp.auto_listing == false) {
	                  return;
	                }
	                
	        	jQuery("input[aria-owns$='find-product-search-bar-autocomplete']")
	            .val(resp.title);
	
		          jQuery(jQuery("button.btn.btn--primary")[0]).removeAttr("disabled");
		          jQuery(jQuery("button.btn.btn--primary")[0]).click();
		          
		          setTimeout(function() {
		              jQuery("button.btn:contains('Continue')").click();
		              jQuery("button.continue-without-product").click();
		              jQuery("div.continue-without-product button").click();
		              jQuery(jQuery("button.btn.btn--primary")[0]).removeAttr("disabled");
		              jQuery(jQuery("button.btn.btn--primary")[0]).click();
		            }, 1000);
		          chrome.storage.local.set({ auto_listing_title: false });
	            });
	        }
        },2000);
        
        chrome.runtime.onMessage.addListener(function(message, sender) {
          if (message == "fixed_price") {
            if (jQuery("#format").length) {
              jQuery("select#format").click();
              setTimeout(function() {
                try {
                  jQuery("option[value=FixedPrice]").click();
                } catch (e) {}
              }, 500);
            }
          }
        });
      }
    });
  }
})(document, window, jQuery);
