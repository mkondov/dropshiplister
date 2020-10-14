var gl_image_index=0;

function loadPasteWoocommerceButtons(){

    function openImagesButtonClicked(event) {
        event.preventDefault();
        chrome.storage.local.get(function (resp) {

            gl_image_index = 0;

            if ((typeof resp.main_images == 'undefined' || resp.main_images == '')) {
                jQuery("#imagesButton").notify("Images not ready yet, or not copied!", {
                    className: "error",
                    position: "t"
                });
                return;
            }

            jQuery("p.add_product_images a")[0].click();

        });


    }

        function imagesButtonClicked(event) {
            event.preventDefault();
            chrome.storage.local.get(function (resp) {

                if ((typeof resp.main_images == 'undefined' || resp.main_images == '')) {
                    jQuery("#imagesButton").notify("Images not ready yet, or not copied!", {
                        className: "error",
                        position: "t"
                    });
                    return;
                }

                jQuery("p.add_product_images a")[0].click();
                jQuery("div.media-router a.media-menu-item").eq(0).click();
                jQuery("button#em-external-link").click();


                var parsed_main_images = JSON.parse(resp.main_images);

                try {
                    var createdUrl = parsed_main_images[gl_image_index];
                } catch (e) {
                    gl_image_index = 0;
                    var createdUrl = parsed_main_images[gl_image_index];
                }

                if (createdUrl.indexOf("alicdn")!=-1){
                    jQuery("input[name='url']").val(createdUrl.replace(".jpg","_"+gl_image_index+".jpg"));
                } else {
                    jQuery("input[name='url']").val(createdUrl);
                }


                jQuery("input[id='el-insert']").click();

                gl_image_index+=1;
            });


        }
        var imagesButtonInterval = setInterval(function(){

            /* if (jQuery("[class*='media-frame mode-select wp-core-ui'][id^='__wp-uploader-id-']").is(":visible") && !jQuery("#imagesButton").length){
                 jQuery("[class*='media-frame mode-select wp-core-ui'][id^='__wp-uploader-id-']").before(imagesButton);
                 imagesButton.on("click",imagesButtonClicked);
                 //clearInterval(imagesButtonInterval);
             }*/

            if (!jQuery("#imagesButton").length){

                var imagesButton = jQuery(
                    "<a id='imagesButton' target='_blank' class='shipping-btn' style='margin-top:10px;margin-bottom:10px;display: inline-block;' type='button' >Next Image</a>"
                );

                jQuery("div.media-frame-toolbar").find(".media-toolbar").prepend(imagesButton);
                imagesButton.on("click",imagesButtonClicked);
                //clearInterval(imagesButtonInterval);
            }

            if (!jQuery("#openImagesButton").length){
                var openImagesButton = jQuery(
                    "<a id='openImagesButton' target='_blank' class='shipping-btn' style='margin-top:10px;margin-bottom:10px;display: inline-block;' type='button' >Insert Images</a>"
                );
                jQuery("div#woocommerce-product-images").before(openImagesButton);
                openImagesButton.on("click",openImagesButtonClicked);
            }





        });

        function variationsButtonClicked(event) {
            event.preventDefault();
            chrome.storage.local.get(function (resp) {

                jQuery("#variations").notify("Inserting...", {
                    className: "success",
                    position: "t"
                });


                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);

                jQuery("select#product-type").val("variable");
                document.getElementById(jQuery("select#product-type").eq(0).attr("id")).dispatchEvent(evt);

                jQuery("a[href='#product_attributes']")[0].click();
                try {
                    document.getElementsByClassName(jQuery("a[href='#product_attributes']").parent().attr("class"))[0].childNodes[0].click();
                    document.getElementsByClassName(jQuery("a[href='#product_attributes']").parent().attr("class"))[0].childNodes[0].dispatchEvent(evt);
                } catch (e) {
                }

                try {
                    document.getElementsByClassName(jQuery("a[href='#product_attributes']").parent().attr("class"))[0].childNodes[1].click();
                    document.getElementsByClassName(jQuery("a[href='#product_attributes']").parent().attr("class"))[0].childNodes[1].dispatchEvent(evt);
                } catch (e) {
                }


                var var_key_index = 0;
                var attr_index = 0;
                var keys = Object.keys(resp.variations);

                var variationsInterval = setInterval(function () {

                    try{

                    if (var_key_index < keys.length) {

                    } else {

                        clearInterval(variationsInterval);


                        jQuery("a[href='#variable_product_options']")[0].click();

                        setTimeout(function(){
                            jQuery("select[class='variation_actions']").val("link_all_variations");

                            document.getElementsByClassName("variation_actions")[0].dispatchEvent(evt);
                            jQuery("a[class*='do_variation_action']").click();

                        });

                        return;

                    }

                    var var_key = keys[var_key_index];
                    var variation_values = resp.variations[var_key];

                    if (jQuery("input[name='attribute_names[" + attr_index + "]']").length == 0 && jQuery("input[name='attribute_names[" + attr_index + "]']").val() != '') {
                        jQuery("button[class*='button add_attribute']")[0].click();
                        return;
                    }

                    jQuery("input[name='attribute_names[" + attr_index + "]']").val(var_key);
                    //document.getElementById(jQuery("input[name='attribute_names[" + attr_index + "]']").eq(0).attr("id")).dispatchEvent(evt);

                    for (var v = 0; v < variation_values.length; v += 1) {
                        jQuery("textarea[name='attribute_values[" + attr_index + "]']").val(jQuery("textarea[name='attribute_values[" + attr_index + "]']").val() + "|" + variation_values[v]);
                        //document.getElementById(jQuery("textarea[name='attribute_values[" + attr_index + "]']").eq(0).attr("id")).dispatchEvent(evt);
                    }

                    jQuery("input[name='attribute_variation[" + attr_index + "]']").prop("checked", true);

                    jQuery("div#product_attributes").find("button[class*='button save_attributes button-primary']").click();

                        var_key_index += 1;
                        attr_index += 1;

                    } catch(e){
                        var_key_index += 1;
                        attr_index += 1;
                    }

                }, 5000);


            });
        }

        var variationsButtonInterval = setInterval(function(){

            if (!jQuery("#variationsButton").length){

                var variationsButton = jQuery(
                    "<a id='variationsButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Variations</a>"
                );
                jQuery("div[id*='woocommerce-product-data']").eq(0).before(variationsButton);
                variationsButton.on("click",variationsButtonClicked);
                clearInterval(variationsButtonInterval);
            }
        });


        function specificsButtonClicked(event) {
            event.preventDefault();
            chrome.storage.local.get(function (resp) {

                jQuery("#specifics").notify("Inserting...", {
                    className: "success",
                    position: "t"
                });

                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);

                //jQuery("select#product-type").val("variable");
                //document.getElementById(jQuery("select#product-type").eq(0).attr("id")).dispatchEvent(evt);

                jQuery("a[href='#product_attributes']")[0].click();
                try {
                    document.getElementsByClassName(jQuery("a[href='#product_attributes']").parent().attr("class"))[0].childNodes[0].click();
                    document.getElementsByClassName(jQuery("a[href='#product_attributes']").parent().attr("class"))[0].childNodes[0].dispatchEvent(evt);
                } catch (e) {
                }

                try {
                    document.getElementsByClassName(jQuery("a[href='#product_attributes']").parent().attr("class"))[0].childNodes[1].click();
                    document.getElementsByClassName(jQuery("a[href='#product_attributes']").parent().attr("class"))[0].childNodes[1].dispatchEvent(evt);
                } catch (e) {
                }


                var specific_index = 0;
                var specifics = resp.specifics;

                var variationsInterval = setInterval(function () {

                    try{

                        if (specific_index < specifics.length) {

                        } else {

                            clearInterval(variationsInterval);

                            jQuery("a[href='#variable_product_options']")[0].click();

                            setTimeout(function(){
                                jQuery("select[class='variation_actions']").val("link_all_variations");

                                document.getElementsByClassName("variation_actions")[0].dispatchEvent(evt);
                                jQuery("a[class*='do_variation_action']").click();

                            });

                            return;

                        }

                        var specific_key = specifics[specific_index].left_side;
                        var specific_value = specifics[specific_index].right_side;


                        if (jQuery("input[name='attribute_names[" + attr_index + "]']").length == 0 && jQuery("input[name='attribute_names[" + attr_index + "]']").val() != '') {
                            jQuery("button[class*='button add_attribute']")[0].click();
                            return;
                        }

                        jQuery("input[name='attribute_names[" + attr_index + "]']").val(specific_key);
                        //document.getElementById(jQuery("input[name='attribute_names[" + attr_index + "]']").eq(0).attr("id")).dispatchEvent(evt);

                        for (var v = 0; v < variation_values.length; v += 1) {
                            jQuery("textarea[name='attribute_values[" + attr_index + "]']").val(specific_value);
                            //document.getElementById(jQuery("textarea[name='attribute_values[" + attr_index + "]']").eq(0).attr("id")).dispatchEvent(evt);
                        }

                        //jQuery("input[name='attribute_variation[" + attr_index + "]']").prop("checked", true);

                        jQuery("div#product_attributes").find("button[class*='button save_attributes button-primary']").click();

                        specific_index += 1;

                    } catch(e){
                        specific_index += 1;
                    }

                }, 5000);

            });
        }
        var specificsButtonInterval = setInterval(function(){

            if (!jQuery("#specificsButton").length){

                var specificsButton = jQuery(
                    "<a id='specificsButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Details</a>"
                );
                jQuery("div[class*='row attributeGroup']").eq(0).before(specificsButton);
                specificsButton.on("click",specificsButtonClicked);
                clearInterval(specificsButtonInterval);
            }
        });


        function titleButtonClicked(event) {
            event.preventDefault();
            chrome.storage.local.get(function (resp) {

                if ((typeof resp.title == 'undefined' || resp.title == '')) {
                    jQuery("#titleButton").notify("Title empty, or not yet copied!", {
                        className: "error",
                        position: "t"
                    });
                    return;
                }

                jQuery("input#title").val(resp.title.trim());

            });
        }
        var titleButtonInterval = setInterval(function(){

            if (!jQuery("#titleButton").length){

                var titleButton = jQuery(
                    "<a id='titleButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Title</a>"
                );
                jQuery("input#title").parent().before(titleButton);
                titleButton.on("click",titleButtonClicked);
                clearInterval(titleButtonInterval);
            }
        });
        function descriptionButtonClicked(event){
            event.preventDefault();
            chrome.storage.local.get(function(resp){

                if ((typeof resp.description=='undefined' || resp.description=='')){
                    jQuery("#descButton").notify("Description empty, or not yet copied!", {
                        className: "error",
                        position: "t"
                    });
                    return;
                }


                jQuery("button#content-html").click();
                try {


                    var desc_html = "";

                    resp.description += resp.bullet_points_html;
                    resp.description += resp.bullet_points_html;
                    resp.description += resp.ebay_desc;

                    if (resp.description.indexOf("<html>") == -1) {
                        desc_html = resp.description;


                    } else {

                        desc = jQuery(resp.description);

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


                jQuery("textarea#content").val(html_as_text.textContent);
                jQuery("button#content-tmce").click();
            });
        }
        var descriptionButtonInterval = setInterval(function(){

            if (!jQuery("#descButton").length){

                var descButton = jQuery(
                    "<a id='descButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Description</a>"
                );
                jQuery("div[class*='wp-editor-expand']").prepend(descButton);
                descButton.on("click",descriptionButtonClicked);
                clearInterval(descriptionButtonInterval);



            }
        });
}
