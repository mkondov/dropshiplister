function loadPasteShopifyButtons(){

    function triggerFocus(element) {
        var eventType = "onfocusin" in element ? "focusin" : "focus",
            bubbles = "onfocusin" in element,
            event;

        if ("createEvent" in document) {
            event = document.createEvent("Event");
            event.initEvent(eventType, bubbles, true);
        }
        else if ("Event" in window) {
            event = new Event(eventType, { bubbles: bubbles, cancelable: true });
        }

        element.focus();
        element.dispatchEvent(event);
    }

    function triggerClick(element){
        var target = element;//<--(insert your target here);
        if(document.createEvent){
            var clickEvent = document.createEvent("MouseEvents");
            clickEvent.initMouseEvent("click", true, true, window,
                0, 0, 0, 0, 0, false, false, false, 0, null);
            target.dispatchEvent(clickEvent);
        }
        else{
            target.fireEvent("onclick");
        }
    }

    function triggerChange(element){
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        element.dispatchEvent(evt);
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

            //jQuery("div[id^='Polarispopover']:visible").find("li").eq(0).find("button").click();

            jQuery("#imagesButton").next().find("button[aria-controls^='Polarispopover']").click();

            var aria_controls = jQuery("#imagesButton").next().find("button[aria-controls^='Polarispopover']").attr("aria-controls");
            jQuery("div[id='" + aria_controls + "']").find("button").eq(0).click();


            var parsed_main_images = JSON.parse(resp.main_images);
            var main_images = [];

            var loop_index = 0;
            while (main_images.length < 12) {
                for (var f = 0; f < parsed_main_images.length; f += 1) {
                    main_images = main_images.concat(parsed_main_images[f]);
                }

                loop_index += 1;
                if (loop_index == 11) {
                    break;
                }
            }


            var info_obj={};
            info_obj.action="shopify_image_url_insert";
            info_obj.target="";
            info_obj.main_images = parsed_main_images;
            info_obj.element_index = 0;
            info_obj.content = info_obj.main_images[info_obj.element_index];


            info_obj.target = jQuery("div[role='dialog']").parent().find("input[id^='PolarisTextField']").eq(0)[0].getBoundingClientRect();


            triggerClick(jQuery("div[role='dialog']").parent().find("input[id^='PolarisTextField']").eq(0)[0]);
            triggerFocus(jQuery("div[role='dialog']").parent().find("input[id^='PolarisTextField']").eq(0)[0]);
            triggerChange(jQuery("div[role='dialog']").parent().find("input[id^='PolarisTextField']").eq(0)[0]);

            //jQuery("div[role='dialog']").parent().find("input[id^='PolarisTextField']").eq(0).focus();

            chrome.runtime.sendMessage({type:"debug_action","info_obj":info_obj});


        });
    }
    var imagesButtonInterval = setInterval(function(){

        if (!jQuery("#imagesButton").length){

            var imagesButton = jQuery(
                "<a id='imagesButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Images</a>"
            );
            jQuery("input#PolarisDropZone1").parents("div").not("[class]").eq(0).find("button").parents().eq(2).before(imagesButton);
            imagesButton.on("click",imagesButtonClicked);
            clearInterval(imagesButtonInterval);
        }
    });

    function variationsButtonClicked(event) {
        event.preventDefault();
        chrome.storage.local.get(function (resp) {

            jQuery("#variations").notify("Inserting...", {
                className: "success",
                position: "t"
            });

            var info_obj={};
            info_obj.action="shopify_variation_insert";
            info_obj.variations = resp.variations;
            info_obj.keys = Object.keys(resp.variations);

            if (info_obj.keys.length){
                info_obj.element_key_index = 0;
                info_obj.element_value_index = 0;
                info_obj.content=info_obj.keys[info_obj.element_key_index];
                info_obj.endline=false;
                jQuery("#variationsButton").parent().parent().find("input[id^='PolarisTextField']").eq(0).focus();

                triggerClick(jQuery("#variationsButton").parent().parent().find("input[id^='PolarisTextField']").eq(0)[0]);
                triggerFocus(jQuery("#variationsButton").parent().parent().find("input[id^='PolarisTextField']").eq(0)[0]);
                triggerChange(jQuery("#variationsButton").parent().parent().find("input[id^='PolarisTextField']").eq(0)[0]);

                chrome.runtime.sendMessage({type:"debug_action","info_obj":info_obj});
            }


        });
    }
    var variationsButtonInterval = setInterval(function(){

        if (!jQuery("#variationsButton").length){

            var variationsButton = jQuery(
                "<a id='variationsButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Variations</a>"
            );
            //jQuery("button#VariantCreateCard-AddOptionButton").parent().prepend(variationsButton);
            jQuery("div#VariantsCardAddVariantsCheckbox").parent().parent().before(variationsButton);

            jQuery("#variationsButton").on("click",variationsButtonClicked);
            jQuery("#variationsButton").hide();
            jQuery("#variationsButton").parent().find("input[id^='Polaris'][type='checkbox']").eq(0).on("change",function(input,event){
                    if (jQuery(this).is(":checked")){
                        jQuery("#variationsButton").show();
                    } else {
                        jQuery("#variationsButton").hide();
                    }
            })

            //jQuery("div[data-hydration-id='./app/sections/Products/components/VariantsCard/VariantsCard.tsx2']").eq(0).before(variationsButton);

            //clearInterval(variationsButtonInterval);
        }
    });



    function specificsButtonClicked(event) {
        event.preventDefault();
        chrome.storage.local.get(function (resp) {

            jQuery("#specifics").notify("Inserting...", {
                className: "success",
                position: "t"
            });

            var inputs = [];

            for (var s=0;s<resp.specifics.length;s+=1){
                var specific = resp.specifics[s];
                var specific_key = specific.left_side.toLowerCase();
                var specific_value = specific.right_side.toLowerCase();

                if (specific_key.indexOf("price")!=-1){
                    inputs=inputs.concat({"type":"price","selector":"input[name='price']","content":specific_value});
                } else if (specific_key.indexOf("weight")!=-1){
                    inputs=inputs.concat({"type":"weight","selector":"input#ShippingCardWeight","content":specific_value});
                } else if (specific_key.indexOf("barcode")!=-1){
                    inputs=inputs.concat({"type":"barcode","selector":"input[name='barcode']","content":specific_value});
                } else if (specific_key.indexOf("brand")!=-1){
                    inputs=inputs.concat({"type":"brand","selector":"input[placeholder*='Nike']","content":specific_value});
                }
            }


            var info_obj={};
            info_obj.action="shopify_specific_insert";
            info_obj.specifics = inputs;
            info_obj.element_index = 0;

            info_obj.content=info_obj.specifics[info_obj.element_index].content;

            triggerClick(jQuery(info_obj.specifics[info_obj.element_index].selector).eq(0)[0]);
            triggerFocus(jQuery(info_obj.specifics[info_obj.element_index].selector).eq(0)[0]);
            triggerChange(jQuery(info_obj.specifics[info_obj.element_index].selector).eq(0)[0]);

            chrome.runtime.sendMessage({type:"debug_action","info_obj":info_obj});


        });
    }
    var specificsButtonInterval = setInterval(function(){

        if (!jQuery("#specificsButton").length){

            var specificsButton = jQuery(
                "<a id='specificsButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Details</a>"
            );
            jQuery("input[name='price']").parents().eq(10).before(specificsButton);
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

            //jQuery("input[name='title']").val(resp.title.trim());

            var info_obj={};
            info_obj.action="shopify_title_insert";
            info_obj.content = resp.title.trim();

            jQuery("input[name='title']").eq(0).focus();
            triggerClick(jQuery("input[name='title']").eq(0)[0]);
            triggerFocus(jQuery("input[name='title']").eq(0)[0]);
            triggerChange(jQuery("input[name='title']").eq(0)[0]);

            chrome.runtime.sendMessage({type:"debug_action","info_obj":info_obj});


        });
    }
    var titleButtonInterval = setInterval(function(){

        if (!jQuery("#titleButton").length){

            var titleButton = jQuery(
                "<a id='titleButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Title</a>"
            );
            jQuery("input[name='title']").parent().before(titleButton);
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


            jQuery("path[d='M9 8.406L5.24 10.01 9 11.6V13l-5-2.334V9.34L9 7v1.406zm2 0V7l5 2.34v1.326L11 13v-1.4l3.76-1.59L11 8.405z']").parents("button").eq(0).click();

            try {

                var desc_html = "";

                    resp.description += resp.bullet_points_html;
                    resp.description += resp.bullet_points_html;
                    resp.description += resp.ebay_desc;


                if (resp.description.indexOf("<html>") == -1) {
                    desc_html = resp.description;


                } else {

                    desc = resp.description

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


            jQuery("textarea#product-description").val(html_as_text.textContent);
            jQuery("path[d='M9 8.406L5.24 10.01 9 11.6V13l-5-2.334V9.34L9 7v1.406zm2 0V7l5 2.34v1.326L11 13v-1.4l3.76-1.59L11 8.405z']").parents("button").eq(0).click();

        });
    }
    var descriptionButtonInterval = setInterval(function(){

        if (!jQuery("#descButton").length){
                var descButton = jQuery(
                    "<a id='descButton' target='_blank' class='shipping-btn' style='margin-top:15px;display: inline-block;' type='button' >Insert Description</a>"
                );
                jQuery("label[id^='product-description']").after(descButton);
                descButton.on("click",descriptionButtonClicked);
                clearInterval(descriptionButtonInterval);
        }
    });
}