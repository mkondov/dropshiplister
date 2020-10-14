function copyWalmart() {
	jQuery("#walmartCopy").val("Working...");

	var all_main_images_src = [];
	var all_desc_images_src = [];

	if (jQuery("#carousel").find("img").length) {
		for (var i = 0; i < jQuery("#carousel").find("img").length; i++) {
			var bigpic = jQuery("#carousel").find("img").eq(i).attr("src")
					.split("?")[0].replace(/\d+x\d+s/, "0x0s");
			if (bigpic.indexOf("http") == -1) {
				bigpic = "https:" + bigpic;
			} else {
			}
			all_main_images_src = all_main_images_src.concat(bigpic);
		}
	} else if (jQuery("div[style*='Large']").length) {
		for (var i = 0; i < jQuery("div[style*='Large']").length; i++) {
			var bigpic = jQuery("div[style*='Large']").eq(i).attr('style')
					.split("url(\"")[1].split("\");")[0];
			all_main_images_src = all_main_images_src.concat(bigpic);
		}
	} else if (jQuery("div.product-image-carousel-container").find("img").length) {
		var main_imgs = jQuery("div.product-image-carousel-container").find(
				"img");
		for (var i = 0; i < main_imgs.length; i++) {
			var main_img_src = main_imgs[i].src.split("?")[0];
			all_main_images_src = all_main_images_src.concat(main_img_src);
		}
	}

	var json_main_images = JSON.stringify(all_main_images_src);

	if (jQuery("#about-item").length) {
		var all_desc_images = jQuery("#about-item").find("img");
		for (var i = 0; i < all_desc_images.length; i++) {
			all_desc_images_src = all_desc_images_src
					.concat(all_desc_images[i].src);
		}
	}
	var json_desc_images = JSON.stringify(all_desc_images_src);

	if (jQuery("h1.prod-ProductTitle").length) {
		var title = jQuery("h1.prod-ProductTitle").text().trim();
	} else if (jQuery(".prod-ProductTitle").length) {
		var title = jQuery(".prod-ProductTitle").text().trim();
	} else if (jQuery("h1").length) {
		var title = jQuery("h1").html().trim();
	}

	var desc_html = "";
	var desc = "";

	if (jQuery("section[aria-labelledby='product-description-heading']").length) {
		desc_html = jQuery(
				"section[aria-labelledby='product-description-heading']")
				.parent().html();
	}

	if (jQuery(".AboutThisItem div.Collapsable:first").length) {
		var temp_desc_html = jQuery(".AboutThisItem div.Collapsable:first")
				.html();
		desc = jQuery(temp_desc_html);

		desc_html += desc[0].outerHTML;
	}
	if (jQuery("[id*='iframe-AboutThisItem']").length) {
		var temp_desc_html = jQuery("[id*='iframe-AboutThisItem']").contents()
				.find("body").html();
		desc = jQuery(temp_desc_html);

		desc_html += desc[0].outerHTML;
	}
	if (jQuery(".AboutThisItem").find("iframe").length) {
		var temp_desc_html = jQuery(".AboutThisItem").find("iframe").eq(0)
				.contents().find("body").html();
		desc = jQuery(temp_desc_html);

		desc_html += desc[0].outerHTML;
	}
	if (jQuery("#about-product-section").length) {

		var temp_desc_html = jQuery("#about-product-section").html();
		desc = jQuery(temp_desc_html);

		desc_html += desc[0].outerHTML;
	}

	if (jQuery(".about-desc").length) {
		desc_html += jQuery(".about-desc").html();
	} else if (jQuery("div.product-about").length) {
		desc_html += jQuery(".about-desc").html();
	}

	desc_html = desc_html.replace(/<script[\s\S]+script>/gim, "");

	var weight = "";
	var dimension = "";
	var pck_width_in = "";
	var pck_weight_lb = "";
	var pck_length_in = "";
	var pck_height_in = "";

	var item_specifics_array = [];

	var bullet_points = [];

	if (jQuery("div#spec-group div:first").find("div").not(".header").length) {
		var item_specifics = jQuery("div#spec-group div:first").find("div")
				.not(".header");
		for (var i = 0; i < item_specifics.length + 2; i += 3) {
			try {
				var left_side = item_specifics.eq(i).text().trim().replace(":",
						"");
				var right_side = item_specifics.eq(i + 1).text().trim();
				if (left_side.toLowerCase().indexOf("weight") != -1) {
					try {
						pck_weight_lb = right_side.match(/[0-9]*[.]?[0-9]+/g)[0];
					} catch (e) {
						pck_weight_lb = 0;
					}
				}

				if (left_side.toLowerCase().indexOf("size") != -1) {
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
				item_specifics_array = item_specifics_array.concat([ {
					left_side : left_side,
					right_side : right_side
				} ]);
			} catch (e) {
			}
		}
	}

	if (jQuery("div[data-tl-id='AboutThis-ShortDescription']").length) {
		var specification_lis = jQuery(
				"div[data-tl-id='AboutThis-ShortDescription']").find("li");

		for (var s = 0; s < specification_lis.length; s++) {
			try {
				var left_side = jQuery(specification_lis[s]).text().split(":")[0];
				var right_side = jQuery(specification_lis[s]).text().split(":")[1];
				if (typeof right_side == "undefined") {
					var bullet = left_side;
					bullet_points.push(bullet.trim());
				} else {
					/*
					 * item_specifics_array = item_specifics_array.concat([{
					 * 'left_side':left_side, 'right_side':right_side }]);
					 */
				}
			} catch (e) {
			}
		}
	}
	
	if (jQuery("table.product-specification-table").length){
		var specification_trs = jQuery("table.product-specification-table").find("tr");

		for (var s = 0; s < specification_trs.length; s++) {
			try {
				var left_side = jQuery(
						jQuery(specification_trs[s]).find("td")[0]).text()
						.trim();
				var right_side = jQuery(
						jQuery(specification_trs[s]).find("td")[1]).text()
						.trim();
				if (typeof right_side == "undefined" || right_side.length < 2) {
					var left_side = jQuery(
							jQuery(specification_trs[s]).find("th").eq(0))
							.text().trim();
					var right_side = jQuery(
							jQuery(specification_trs[s]).find("td").eq(0))
							.text().trim();
					if (typeof right_side == "undefined"
							|| right_side.length < 2) {
						continue;
					}
				}
				item_specifics_array = item_specifics_array.concat([ {
					left_side : left_side,
					right_side : right_side
				} ]);

				try {
					if (left_side.indexOf("Shipping Weight") != -1) {
						weight = right_side;
						if (weight.indexOf("pounds") != -1) {
							pck_weight_lb = weight.match(/\d+\.?\d+?/)[0];
						} else if (weight.indexOf("ounces") != -1) {
							pck_weight_lb = parseFloat(weight
									.match(/\d+\.?\d+?/)[0]) * 0.06;
						}
					} else if (left_side.indexOf("Item Weight") != -1) {
						weight = right_side;
						if (weight.indexOf("pounds") != -1) {
							pck_weight_lb = weight.match(/\d+\.?\d+?/)[0];
						} else if (weight.indexOf("ounces") != -1) {
							pck_weight_lb = parseFloat(weight
									.match(/\d+\.?\d+?/)[0]) * 0.06;
						}
					} else if (left_side.indexOf("Dimension") != -1) {
						dimension = right_side;
						var dim_text = dimension
								.trim()
								.match(
										/([0-9]*[.]?[0-9]+)[\D]+([0-9]*[.]?[0-9]+)[\D]+([0-9]*[.]?[0-9]+)/);
						pck_width_in = dim_text[1];
						pck_length_in = dim_text[2];
						pck_height_in = dim_text[3];
					}
				} catch (e) {
				}
			} catch (e) {
				console.log(e);
			}
		}
	}

	if (jQuery("table.specification").length) {
		var specification_trs = jQuery("table.specification").find("tr");

		for (var s = 0; s < specification_trs.length; s++) {
			try {
				var left_side = jQuery(
						jQuery(specification_trs[s]).find("td")[0]).text()
						.trim();
				var right_side = jQuery(
						jQuery(specification_trs[s]).find("td")[1]).text()
						.trim();
				if (typeof right_side == "undefined" || right_side.length < 2) {
					var left_side = jQuery(
							jQuery(specification_trs[s]).find("th").eq(0))
							.text().trim();
					var right_side = jQuery(
							jQuery(specification_trs[s]).find("td").eq(0))
							.text().trim();
					if (typeof right_side == "undefined"
							|| right_side.length < 2) {
						continue;
					}
				}
				item_specifics_array = item_specifics_array.concat([ {
					left_side : left_side,
					right_side : right_side
				} ]);

				try {
					if (left_side.indexOf("Shipping Weight") != -1) {
						weight = right_side;
						if (weight.indexOf("pounds") != -1) {
							pck_weight_lb = weight.match(/\d+\.?\d+?/)[0];
						} else if (weight.indexOf("ounces") != -1) {
							pck_weight_lb = parseFloat(weight
									.match(/\d+\.?\d+?/)[0]) * 0.06;
						}
					} else if (left_side.indexOf("Item Weight") != -1) {
						weight = right_side;
						if (weight.indexOf("pounds") != -1) {
							pck_weight_lb = weight.match(/\d+\.?\d+?/)[0];
						} else if (weight.indexOf("ounces") != -1) {
							pck_weight_lb = parseFloat(weight
									.match(/\d+\.?\d+?/)[0]) * 0.06;
						}
					} else if (left_side.indexOf("Dimension") != -1) {
						dimension = right_side;
						var dim_text = dimension
								.trim()
								.match(
										/([0-9]*[.]?[0-9]+)[\D]+([0-9]*[.]?[0-9]+)[\D]+([0-9]*[.]?[0-9]+)/);
						pck_width_in = dim_text[1];
						pck_length_in = dim_text[2];
						pck_height_in = dim_text[3];
					}
				} catch (e) {
				}
			} catch (e) {
				console.log(e);
			}
		}
	}

	if (jQuery("div[data-tl-id='AboutThis-ShortDescription']").length) {
		var specification_lis = jQuery(
				"div[data-tl-id='AboutThis-ShortDescription']").find("li");

		for (var s = 0; s < specification_lis.length; s++) {
			try {
				var left_side = jQuery(specification_lis[s]).text().split(":")[0];
				var right_side = jQuery(specification_lis[s]).text().split(":")[1];
				if (typeof right_side == "undefined") {
					var bullet = left_side;
					bullet_points.push(bullet.trim());
				} else {
					/*
					 * item_specifics_array = item_specifics_array.concat([{
					 * 'left_side':left_side, 'right_side':right_side }]);
					 */
				}
			} catch (e) {
			}
		}
	}

	var variations = {};
	
	if (jQuery("#variants-section").length) {
		var var_wrappers = jQuery("div.variants__contain");
		// var variations_lbl = jQuery("label.variant");
		for (var v = 0; v < var_wrappers.length; v++) {
			try {
				var variation_text = jQuery(var_wrappers[v]).find(
						"div.varslabel").text()
						.trim().split(":")[0];
				
				if (jQuery(var_wrappers[v]).attr('label')=='Color'){
					var variation_vars = jQuery(var_wrappers[v]).find(
					"div.variants__list input");
					temp_vars = [];
					for (var tv = 0; tv < variation_vars.length; tv++) {
						temp_vars = temp_vars.concat(jQuery(variation_vars[tv]).attr("data-label").trim());
					}
					variations[variation_text] = temp_vars;
				} else {
					var variation_vars = jQuery(var_wrappers[v]).find(
					"div.variants__list input");
					temp_vars = [];
					for (var tv = 0; tv < variation_vars.length; tv++) {
						temp_vars = temp_vars.concat(jQuery(variation_vars[tv]).attr("data-label").trim());
					}
					variations[variation_text] = temp_vars;
				}

				
				
			} catch (e) {
			}
		}
	}

	if (jQuery("div.prod-VariantWrapper").length) {
		var var_wrappers = jQuery("div.prod-VariantWrapper");
		// var variations_lbl = jQuery("label.variant");
		for (var v = 0; v < var_wrappers.length; v++) {
			try {
				var variation_text = jQuery(var_wrappers[v]).find(
						"span.prod-ProductVariantType-label-name").text()
						.trim();

				var variation_vars = jQuery(var_wrappers[v]).find(
						"label.variant");
				temp_vars = [];
				for (var tv = 0; tv < variation_vars.length; tv++) {
					temp_vars = temp_vars.concat(jQuery(variation_vars[tv])
							.text().trim());
				}
				variations[variation_text] = temp_vars;
			} catch (e) {
			}
		}
	}

	if (jQuery("div.prod-VariantWrapper").length) {
		var var_wrappers = jQuery("div.prod-VariantWrapper");

		for (var v = 0; v < var_wrappers.length; v++) {
			try {
				var variation_text = jQuery(var_wrappers[v]).find(
						"span.prod-ProductVariantType-label-name").text()
						.trim();

				var variation_options = jQuery(var_wrappers[v]).find(
						"select[name^='js-ProductVariantDropdown'] option");
				temp_vars = [];
				for (var tv = 1; tv < variation_options.length; tv++) {
					temp_vars = temp_vars.concat(jQuery(variation_options[tv])
							.val().trim());
				}
				variations[variation_text] = temp_vars;
			} catch (e) {
			}
		}
	}

	if (jQuery("div.variant-label-container").length) {
		var var_wrappers = jQuery("div.variant-label-container");
		// var variations_lbl = jQuery("label.variant");
		for (var v = 0; v < var_wrappers.length; v++) {
			try {
				var variation_text = jQuery(var_wrappers[v]).find(
						".variants-label-text").text().trim();
				variation_text = variation_text.replace("Actual ", "");
				var variation_vars = jQuery(var_wrappers[v]).next().find(
						".variant-option-outer-container");
				temp_vars = [];
				for (var tv = 0; tv < variation_vars.length; tv++) {
					temp_vars = temp_vars.concat(jQuery(variation_vars[tv])
							.attr("title").trim()
							.replace(" is unavailable", ""));
				}
				variations[variation_text] = temp_vars;
			} catch (e) {
			}
		}
	}

	try{
		var brand = jQuery(".prod-BrandName").text().trim();
	} catch(e){
	}
	try{
		var brand = jQuery("a.brand-link").text().trim();
	} catch(e){
	}
	try{
		var brand = jQuery("[itemprop='brand']").eq(0).text().trim();
	} catch(e){
	}

	try {
		var ourprice = jQuery("section.prod-PriceSection span.visuallyhidden")
				.eq(0).text().trim().replace(/[^\d\.\,]+/g, "");
	} catch (e) {
		var ourprice = "0.00";
	}
	
	try {
		var ourprice = jQuery("[data-automation='buybox-price']")
				.eq(0).text().trim().replace(/[^\d\.\,]+/g, "");
	} catch (e) {
		var ourprice = "0.00";
	}

	if (typeof info_obj=='undefined'){
		var info_obj={};
	}
	if (typeof stor_obj=='undefined'){
		var stor_obj={};
	}

	stor_obj={
		source : "walmart",
		brand : brand,
		title : title,
		variations : variations,
		description : desc_html,
		weight : pck_weight_lb,
		length : pck_length_in,
		height : pck_height_in,
		width : pck_width_in,
		price : ourprice,
		specifics : item_specifics_array,
		bullet_points : bullet_points,
		main_images : json_main_images,
		desc_images : json_desc_images,
		vendor_link:window.location.href
	};

	var listing =  stor_obj;

	info_obj.saved_listing = listing;

	chrome.runtime.sendMessage({
		type: "update_listing_cache",
		info_obj: info_obj
	});


	chrome.storage.local.set(stor_obj, function() {
	});

	jQuery("#walmartCopy").val("Working...");

	chrome.runtime.sendMessage({
		type : "upload_images",
		title : title,
		main_images : json_main_images,
		desc_images : json_desc_images
	}, function() {
		chrome.runtime.sendMessage({
			type : "create_listing"
		});
	});
}
