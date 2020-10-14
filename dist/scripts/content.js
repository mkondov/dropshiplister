(function(document, window, $) {
        "use strict";


        var LOGGED_IN = false;
        var temp_info_obj={};

        function sanitizeSelector(el_selector){
            try{
                var sane_selector = el_selector.match(/>[^>]+>[^>]+>[^>]+$/gi)[0].replace(/^>/,"").trim().replace(/\.\.+/gi,".");
                return sane_selector;
            } catch(e){
                try{
                    var sane_selector = el_selector[0].match(/>[^>]+>[^>]+>[^>]+$/gi)[0].replace(/^>/,"").trim().replace(/\.\.+/gi,".");
                    return sane_selector;
                } catch(e){
                    return el_selector;
                }


            }

        }


        function extractHostname(url) {
            var hostname;
            if (url.indexOf("//") > -1) {
                hostname = url.split('/')[2];
            }
            else {
                hostname = url.split('/')[0];
            }
            hostname = hostname.split(':')[0];
            hostname = hostname.split('?')[0];
            if(hostname.indexOf("www.") > -1) {
                hostname = hostname.split("www.")[1]
            }
            return hostname;
        }

        var DomOutline = function (options) {
            options = options || {};

            var pub = {};
            var self = {
                opts: {
                    namespace: options.namespace || 'DomOutline',
                    borderWidth: options.borderWidth || 2,
                    onClick: options.onClick || false,
                    filter: options.filter || false,
                    info_obj: options.info_obj || false
                },
                keyCodes: {
                    BACKSPACE: 8,
                    ESC: 27,
                    DELETE: 46
                },
                active: false,
                initialized: false,
                elements: {}
            };

            function writeStylesheet(css) {
                var element = document.createElement('style');
                element.type = 'text/css';
                document.getElementsByTagName('head')[0].appendChild(element);

                if (element.styleSheet) {
                    element.styleSheet.cssText = css; // IE
                } else {
                    element.innerHTML = css; // Non-IE
                }
            }

            function initStylesheet() {
                if (self.initialized !== true) {
                    var css = '' +
                        '.' + self.opts.namespace + ' {' +
                        '    background: '+self.opts.info_obj.color+';' +
                        '    position: absolute;' +
                        '    z-index: 1000000;' +
                        '}' +
                        '.' + self.opts.namespace + '_label {' +
                        '    background: '+self.opts.info_obj.color+';' +
                        '    border-radius: 2px;' +
                        '    color: #fff;' +
                        '    font: bold 12px/12px Helvetica, sans-serif;' +
                        '    padding: 4px 6px;' +
                        '    position: absolute;' +
                        '    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);' +
                        '    z-index: 1000001;' +
                        '}';

                    writeStylesheet(css);
                    self.initialized = true;
                }
            }

            function createOutlineElements() {
                self.elements.label = jQuery('<div></div>').addClass(self.opts.namespace + '_label').appendTo('body');
                self.elements.top = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
                self.elements.bottom = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
                self.elements.left = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
                self.elements.right = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
            }

            function removeOutlineElements() {
                jQuery.each(self.elements, function(name, element) {
                    element.remove();
                });
            }

            function compileLabelText(element, width, height) {
                var label = self.opts.info_obj.type+" ";

                if (self.opts.info_obj.type=="Gallery"){
                    var imgs = jQuery(element).find("img").length;
                    label+=" ("+imgs+" Images)";
                }

                if (self.opts.info_obj.type=="Title"){
                    var textLength=jQuery(element).text().trim().length;
                    label+=" ("+textLength+" Length)";
                }

                if (self.opts.info_obj.type=="Price"){
                    try{
                        var parsedPrice=jQuery(element).text().trim().match(/\d+(\.|\,)\d+/)[0];
                    } catch(e){
                        var parsedPrice="00.00";
                    }

                    label+=" ("+parsedPrice+")";
                }

                if (self.opts.info_obj.type=="Specifics"){
                    var specCount = jQuery(element).find("li").length;
                    specCount += jQuery(element).find("tr").length;
                    specCount += jQuery(element).find("dl").length;
                    specCount += jQuery(element).find("br").length;
                    label+=" ("+specCount+" Specifics)";
                }

                if (self.opts.info_obj.type=="Description"){
                    var textLength=jQuery(element).text().trim().length;
                    label+=" ("+textLength+" Length)";
                }

                if (self.opts.info_obj.type=="Summary"){
                    var textLength=jQuery(element).text().trim().length;
                    label+=" ("+textLength+" Length)";
                }

                if (self.opts.info_obj.type=="Variations"){
                    //var textLength=jQuery(element).text().trim().length;
                    //label+=" ("+textLength+" Length)";
                }

                /*label += element.tagName.toLowerCase();
                if (element.id) {
                    label += '#' + element.id;
                }
                if (element.className) {
                    label += ('.' + jQuery.trim(element.className).replace(/ /g, '.')).replace(/\.\.+/g, '.');
                }
                return label + ' (' + Math.round(width) + 'x' + Math.round(height) + ')';*/



                return label;
            }

            function getScrollTop() {
                if (!self.elements.window) {
                    self.elements.window = jQuery(window);
                }
                return self.elements.window.scrollTop();
            }

            function updateOutlinePosition(e) {
                if (e.target.className.indexOf(self.opts.namespace) !== -1) {
                    return;
                }

                try{
                    if (jQuery(e.target).attr("class").search(self.opts.namespace)!=-1){
                        return;
                    }
                } catch(e){

                }
                /*if (self.opts.filter) {
                    if (!jQuery(e.target).is(self.opts.filter)) {
                        return;
                    }
                }  */
                pub.element = e.target;

                var b = self.opts.borderWidth;
                var scroll_top = getScrollTop();
                var pos = pub.element.getBoundingClientRect();
                var top = pos.top + scroll_top;

                var label_text = compileLabelText(pub.element, pos.width, pos.height);
                var label_top = Math.max(0, top - 20 - b, scroll_top);
                var label_left = Math.max(0, pos.left - b);

                self.elements.label.css({ top: label_top, left: label_left }).text(label_text);
                self.elements.top.css({ top: Math.max(0, top - b), left: pos.left - b, width: pos.width + b, height: b });
                self.elements.bottom.css({ top: top + pos.height, left: pos.left - b, width: pos.width + b, height: b });
                self.elements.left.css({ top: top - b, left: Math.max(0, pos.left - b), width: b, height: pos.height + b });
                self.elements.right.css({ top: top - b, left: pos.left + pos.width, width: b, height: pos.height + (b * 2) });
            }

            function stopOnEscape(e) {
                if (e.keyCode === self.keyCodes.ESC || e.keyCode === self.keyCodes.BACKSPACE || e.keyCode === self.keyCodes.DELETE) {
                    pub.stop(false);
                }

                return false;
            }

            function clickHandler(e,info_obj) {
                pub.stop(true);
                self.opts.onClick(pub.element,info_obj);

                return false;
            }

            pub.start = function (info_obj) {

                self.opts.namespace = info_obj.namespace || 'DomOutline';
                self.opts.onClick = info_obj.onClick || false;
                self.opts.filter =info_obj.filter || false;
                self.opts.info_obj = info_obj || false;



                initStylesheet();
                if (self.active !== true) {
                    self.active = true;
                    createOutlineElements();
                    jQuery('body').on('mousemove.' + self.opts.namespace, updateOutlinePosition);
                    jQuery('body').on('keyup.' + self.opts.namespace, stopOnEscape);
                    if (self.opts.onClick) {
                        setTimeout(function () {
                            jQuery('body').on('click.' + self.opts.namespace, function(e){
                                if (self.opts.filter) {
                                    //if (!jQuery(e.target).is(self.opts.filter)) {
                                    //    return false;
                                    //}
                                    try{
                                        if (jQuery(e.target).attr("class").search(self.opts.namespace)!=-1){
                                            return false;
                                        }
                                    } catch(e){

                                    }

                                }
                                clickHandler.call(this, e, self.opts.info_obj);
                            });
                        }, 50);
                    }
                }
            };

            pub.stop = function (success) {
                self.active = false;
                if (success){
                    //chrome.runtime.sendMessage({ type: "parse_listing", info_obj:self.opts.info_obj});
                } else {
                    removeOutlineElements();
                }

                jQuery('body').off('mousemove.' + self.opts.namespace)
                    .off('keyup.' + self.opts.namespace)
                    .off('click.' + self.opts.namespace);
                jQuery('body').off('mousemove.' + self.opts.namespace+"_label")
                    .off('keyup.' + self.opts.namespace+"_label")
                    .off('click.' + self.opts.namespace+"_label");

                jQuery('body').off('mousemove');

            };

            pub.clear = function(info_obj) {
                self.opts.namespace = info_obj.namespace || 'DomOutline';
                self.opts.onClick = info_obj.onClick || false;
                self.opts.filter =info_obj.filter || false;
                self.opts.info_obj = info_obj || false;

                self.active=false;

                removeOutlineElements();

                jQuery('body').off('mousemove.' + self.opts.namespace)
                    .off('keyup.' + self.opts.namespace)
                    .off('click.' + self.opts.namespace);
                jQuery('body').off('mousemove.' + self.opts.namespace+"_label")
                    .off('keyup.' + self.opts.namespace+"_label")
                    .off('click.' + self.opts.namespace+"_label");

                jQuery('body').off('mousemove');
            }

            pub.drawOutline = function(info_obj) {

                if (info_obj.type=='Title'){
                    info_obj.color = "#0336ab";
                } else if (info_obj.type=='Gallery'){
                    info_obj.color = "#56ab22";
                } else if (info_obj.type=='Summary'){
                    info_obj.color = "#00b5e0";
                } else if (info_obj.type=='Price'){
                    info_obj.color = "#e6bb04";
                } else if (info_obj.type=='Variations'){
                    info_obj.color = "#d45cd0";
                } else if (info_obj.type=='Specifics'){
                    info_obj.color = "#0479a7";
                } else if (info_obj.type=='Description'){
                    info_obj.color = "#d02626";
                }

                self.opts.namespace = info_obj.namespace || 'DomOutline';
                self.opts.onClick = info_obj.onClick || false;
                self.opts.filter =info_obj.filter || false;
                self.opts.info_obj = info_obj || false;


                initStylesheet();
                createOutlineElements();

                self.active=false;

                pub.element = info_obj.target;

                var b = self.opts.borderWidth;
                var scroll_top = getScrollTop();
                var pos = pub.element.getBoundingClientRect();
                var top = pos.top + scroll_top;

                var label_text = compileLabelText(pub.element, pos.width, pos.height);
                var label_top = Math.max(0, top - 20 - b, scroll_top);
                var label_left = Math.max(0, pos.left - b);

                self.elements.label.css({ top: label_top, left: label_left }).text(label_text);
                self.elements.top.css({ top: Math.max(0, top - b), left: pos.left - b, width: pos.width + b, height: b });
                self.elements.bottom.css({ top: top + pos.height, left: pos.left - b, width: pos.width + b, height: b });
                self.elements.left.css({ top: top - b, left: Math.max(0, pos.left - b), width: b, height: pos.height + b });
                self.elements.right.css({ top: top - b, left: pos.left + pos.width, width: b, height: pos.height + (b * 2) });



                jQuery('body').off('mousemove.' + self.opts.namespace)
                    .off('keyup.' + self.opts.namespace)
                    .off('click.' + self.opts.namespace);
                jQuery('body').off('mousemove.' + self.opts.namespace+"_label")
                    .off('keyup.' + self.opts.namespace+"_label")
                    .off('click.' + self.opts.namespace+"_label");

                jQuery('body').off('mousemove');
            }

            return pub;
        };

        var domSelectorClickHandler = function (element,info_obj) {
            console.log('Clicked element:', element);


            info_obj['stor_elements']={};
            info_obj['stor_elements'][info_obj.type]={};
            info_obj['stor_elements'][info_obj.type].element=jQuery(element).html();
            info_obj['stor_elements'][info_obj.type].element_content = jQuery(element).parent().html();
            //info_obj['stor_elements'][info_obj.type].element_selector = jQuery(element).getSelector()[0].split(">")[jQuery(element).getSelector()[0].split(">").length-1].trim().replace(/\.\.+/gi,".");
            info_obj['stor_elements'][info_obj.type].element_selector = sanitizeSelector(jQuery(element).getSelector())//[0].match(/>[^>]+>[^>]+>[^>]+$/gi)[0].replace(/^>/,"").trim().replace(/\.\.+/gi,".");


            if (info_obj.type.toLowerCase()=='title'){
                var btnValue = "Copy Listing (Smart)";
                var btnId = "copySmartListingButton";

                var copy_btn = jQuery(
                    "<input class='shipping-btn' style='width:100%;margin-top:15px;' type='button' id='"+btnId+"' value='"+btnValue+"'>"
                );

                copy_btn.on("click", function() {
                    jQuery("a[class*='zip_file']").remove();
                    jQuery("a[class*='zip_file_normal']").remove();
                    info_obj.btnId=jQuery(this).attr("id");
                    resetAndCopy(copyListing,info_obj);
                });

                jQuery("#"+btnId).remove();
                jQuery(info_obj['stor_elements'][info_obj.type].element_selector).before(copy_btn);

            }



            chrome.storage.local.get(function(resp){

                var vendor_link = window['location']['href'].toString();
                vendor_link=vendor_link.split("/ref=")[0];
                vendor_link=vendor_link.split("?")[0];

                info_obj.vendor_link=vendor_link;

                info_obj.domain_name=extractHostname(vendor_link);

                info_obj.supplier_type="stor";

                if (typeof resp['stor_suppliers']=='undefined'){
                    resp['stor_suppliers']={};
                }

                if (typeof resp['stor_suppliers'][info_obj.domain_name]=='undefined'){
                    resp['stor_suppliers'][info_obj.domain_name]={};
                }

                if (typeof resp['stor_suppliers'][info_obj.domain_name][info_obj.type.toLowerCase()]!='undefined'){
                    //resp['stor_suppliers'][info_obj.domain_name][info_obj.type.toLowerCase()]=info_obj['stor_elements'][info_obj.type].element_selector;
                    resp['stor_suppliers'][info_obj.domain_name][info_obj.type.toLowerCase()]=resp['stor_suppliers'][info_obj.domain_name][info_obj.type.toLowerCase()].concat(info_obj['stor_elements'][info_obj.type].element_selector);
                } else {
                    resp['stor_suppliers'][info_obj.domain_name][info_obj.type.toLowerCase()]=[info_obj['stor_elements'][info_obj.type].element_selector];
                }

                resp['vendor_link']=info_obj.vendor_link;

                chrome.storage.local.set(resp,function(){

                    //parseListing(info_obj);
                    info_obj.new_element_selected=true;
                    info_obj.save_content=true;
                    info_obj.main_domain = resp.main_domain;
                    chrome.runtime.sendMessage({ type: "parse_listing", info_obj:info_obj});
                });
            });

            return info_obj;

        }
        var glDomSelectors={
            'Title':DomOutline({}),
            'Gallery':DomOutline({}),
            'Price':DomOutline({}),
            'Summary':DomOutline({}),
            'Variations':DomOutline({}),
            'Specifics':DomOutline({}),
            'Description':DomOutline({})
        }

        function selectDom(info_obj){

            info_obj.namespace=info_obj.type.replace("domSelector","");
            info_obj.namespace='domSelector'+info_obj.type.replace(/\s+/,"");
            info_obj.onClick = domSelectorClickHandler;

            //myDomOutline.clear();
            glDomSelectors[info_obj.type].clear(info_obj);
            glDomSelectors[info_obj.type].start(info_obj);
        }


        function periodicLoginCheck() {
            chrome.storage.local.get(function(resp) {
                if (typeof resp.user != "undefined" && resp.user != "") {
                    chrome.runtime.sendMessage({
                        type: "periodic_signin_attempt"
                    });
                }
            });
        }
        function periodicStatusCheck() {
            if (LOGGED_IN) {
                return;
            }
            chrome.storage.local.get(function(resp) {
                if (LOGGED_IN == true) {
                    if (typeof resp.user == "undefined" || resp.user == "") {
                        LOGGED_IN = false;
                    }
                } else if (LOGGED_IN == false) {
                    if (typeof resp.user != "undefined" && resp.user != "") {
                        LOGGED_IN = true;
                        loadExtension();
                    }
                }
            });
        }

        function resetAndCopy(function_name,info_obj) {
            var vendor_link = window['location']['href'].toString();
            vendor_link=vendor_link.split("/ref=")[0];
            vendor_link=vendor_link.split("?")[0];
            chrome.storage.local.set(
                {
                    source: "",
                    title: "",
                    description: "",
                    summary: "",
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
                    vendor_link:vendor_link
                },
                function() {
                    function_name(info_obj);
                    //eval(function_name+"()");
                }
            );
        }

        function loadExtension() {

            chrome.storage.local.get(function(resp) {
                if (resp["status"] != 1) {
                    return false;
                }
                //var domain = "com";

                if (typeof resp['stor_elements']=='undefined'){
                    resp['stor_elements']={};
                }
                if (typeof resp['global_elements']=='undefined'){
                    resp['global_elements']={};
                }
                if (typeof resp['global_suppliers']=='undefined'){
                    resp['global_suppliers']={};
                }
                if (typeof resp['stor_suppliers']=='undefined'){
                    resp['stor_suppliers']={};
                }

                for (var stor_domain in resp['stor_suppliers']){
                    if (typeof stor_suppliers[stor_domain]=='undefined'){
                        stor_suppliers[stor_domain]={};
                    }

                    stor_suppliers[stor_domain]=resp['stor_suppliers'][stor_domain];
                }


                var aliProductPage = new RegExp("aliexpress\\.", "i");
                //var ebayListingPage = new RegExp("bulksell\\.ebay\\."+domain+"\\/ws\\/eBayISAPI\\.dll\\?SingleList","i");
                var amazonListingPage = new RegExp("sellercentral\\.amazon.+\\/abis\\/Classify\\/SelectCategory\\?itemType", "i");
                var amazonListingPageNew = new RegExp("abis\\/listing\\/create", "i");
                var ebayListingPage = new RegExp("bulksell\\.ebay\\.", "i");
                var ebayListingPageNew = new RegExp("ebay\\..+list\\/v2", "i");
                var amzProductPage = new RegExp("amazon\\.", "i");
                var walmartProductPage = new RegExp("walmart\\.","i");
                var ebayProductPage = new RegExp("ebay\\.", "i");

                var shopifyListingPage = new RegExp("\\.myshopify\\.com\\/admin\\/products\\/new", "i");
                //var woocommerceListingPage = new RegExp("wp-admin\\/post-new.php\\?post_type=product", "i");
                var woocommerceListingPage = new RegExp("wp-admin\\/post.+post", "i");

                var autodocProductPage = new RegExp("autodoc", "i");

                if (!ebayListingPage.test(location["href"]) && !ebayListingPageNew.test(location["href"]) && ebayProductPage.test(location["href"])) {
                    try{ var desc_offset = jQuery("#desc_div").offset();
                        desc_offset.left -= 20;
                        desc_offset.top -= 20;
                        jQuery("body").animate(
                            {
                                scrollTop: desc_offset.top,
                                scrollLeft: desc_offset.left
                            },
                            function() {
                                //sleep(500);
                            }
                        );
                    } catch(e){

                    }

                    var sell_now = jQuery("#inst_sale_msg")
                        .parent()
                        .find("a");
                    sell_now.on("click", function() {
                        jQuery("#ebayCopy")[0].click();
                    });

                    var copyBtn = jQuery(
                        "<input class='shipping-btn' style='width:100%;margin-top:15px;' type='button' id='ebayCopy' value='Copy Listing'>"
                    );
                    copyBtn.off();

                    copyBtn.on("click", function() {
                        jQuery("a[class*='zip_file']").remove();
                        jQuery("a[class*='zip_file_normal']").remove();
                        resetAndCopy(copyEbay);
                    });

                    setInterval(function() {
                        if (!jQuery("#ebayCopy")["length"]) {
                            jQuery("#CenterPanel").before(copyBtn);
                        }
                    }, 1000);
                } else if (ebayListingPage.test(location["href"])) {

                    loadPasteEbayButtons();

                    var indInterval = setInterval(function() {
                        chrome.storage.local.get(function(resp) {
                            if (jQuery("#findprod-find-product-find-product-searchbar").length) {
                                jQuery("#findprod-find-product-find-product-searchbar")
                                    .find("input.find-product")
                                    .val(resp.title);

                                jQuery(jQuery("button.btn.btn--primary")[0]).removeAttr("disabled");
                                jQuery(jQuery("button.btn.btn--primary")[0]).click();
                                removeInterval(indInterval);
                            }
                        });
                    }, 500);

                }else if (ebayListingPageNew.test(location["href"])) {
                    loadPasteEbayModernButtons();
                }else if (amazonListingPage.test(location["href"])) {
                    //loadPasteAmazonButtons();
                }else if (amazonListingPageNew.test(location["href"])) {
                    //loadPasteAmazonButtons();
                }else if (shopifyListingPage.test(location["href"])) {
                    loadPasteShopifyButtons();
                } else if (woocommerceListingPage.test(location["href"])) {
                    loadPasteWoocommerceButtons();
                } else if (walmartProductPage.test(location["href"])) {

                        var copyBtn = jQuery(
                            "<input class='shipping-btn' style='width:100%;margin-top:15px;' type='button' id='walmartCopy' value='Copy Listing'>"
                        );
                        copyBtn.off();
                        copyBtn.on("click", function() {
                            jQuery("a[class*='zip_file']").remove();
                            jQuery("a[class*='zip_file_normal']").remove();
                            //jQuery("button:contains('Read more')").click();
                            //jQuery("button.prod-prodDetails-revealer").click();
                            setTimeout(resetAndCopy(copyWalmart), 1000);

                        });


                    setInterval(function() {

                        if (!jQuery("#walmartCopy")["length"]) {

                            if (jQuery("h1[itemprop='name']").length){
                                jQuery("h1[itemprop='name']").before(copyBtn);
                            } else if (jQuery("div.ResponsiveContainer.prod-ProductPage").length){
                                jQuery("div.ResponsiveContainer.prod-ProductPage")
                                    .eq(0)
                                    .before(copyBtn);
                            } else if (jQuery("div.prod-AboveTheFoldSection").length) {
                                //new design
                                jQuery("div.prod-AboveTheFoldSection").before(copyBtn);
                            } else if (jQuery("div.ProductTitle").last().length) {
                                jQuery("div.ProductTitle")
                                    .last()
                                    .before(copyBtn);
                            }

                        }
                    }, 1000);

                } else if (aliProductPage.test(location["href"])) {
                    try{
                        var desc_offset = jQuery("div.product-detail-tab").offset();
                        desc_offset.left -= 20;
                        desc_offset.top -= 20;
                        jQuery("body").animate(
                            {
                                scrollTop: desc_offset.top,
                                scrollLeft: desc_offset.left
                            },
                            function() {
                                //sleep(500);
                            }
                        );
                    } catch(e){

                    }

                    try{
                        var desc_offset = jQuery("div.description-content").offset();
                        desc_offset.left -= 20;
                        desc_offset.top -= 20;
                        jQuery("body").animate(
                            {
                                scrollTop: desc_offset.top,
                                scrollLeft: desc_offset.left
                            },
                            function() {
                                //sleep(500);
                            }
                        );
                    } catch(e){

                    }


                    var copyBtn = jQuery(
                        "<input class='shipping-btn' style='width:100%;margin-top:15px;' type='button' id='aliexpressCopy' value='Copy Listing'>"
                    );
                    var copyBtnFranchise = jQuery(
                        "<input class='shipping-btn' style='width:100%;margin-top:15px;' type='button' id='aliexpressCopyFranchise' value='Copy Listing'>"
                    );
                    copyBtn.off();
                    copyBtnFranchise.off();

                    copyBtnFranchise.on("click",function(){
                        jQuery("a[class*='zip_file']").remove();
                        jQuery("a[class*='zip_file_normal']").remove();
                        resetAndCopy(copyAliexpressFranchise);
                    });
                    copyBtn.on("click", function() {
                        jQuery("a[class*='zip_file']").remove();
                        jQuery("a[class*='zip_file_normal']").remove();
                        resetAndCopy(copyAliexpress);
                    });

                    setInterval(function() {
                        if (!jQuery("#aliexpressCopy")["length"]) {
                            jQuery("div#j-product-detail-bd").before(copyBtn);
                            //jQuery("#j-product-description").before(copyBtn);
                        }
                        if (!jQuery("#aliexpressCopyFranchise")["length"]) {
                            jQuery("div.product-title").before(copyBtnFranchise);
                            //jQuery("#j-product-description").before(copyBtn);
                        }
                    }, 1000);
                }  else if (amzProductPage.test(location["href"])) {
                    if (jQuery("#productDescription").length) {
                        try{
                            var desc_offset = jQuery("#productDescription").offset();
                            desc_offset.left -= 20;
                            desc_offset.top -= 20;
                            jQuery("body").animate(
                                {
                                    scrollTop: desc_offset.top,
                                    scrollLeft: desc_offset.left
                                },
                                function() {
                                    //sleep(500);
                                }
                            );
                        } catch(e){

                        }
                    } else if (jQuery("[id$='_feature_div']").length){
                        try{
                            var desc_offset = jQuery("[id$='_feature_div']").offset();
                            desc_offset.left -= 20;
                            desc_offset.top -= 20;
                            jQuery("body").animate(
                                {
                                    scrollTop: desc_offset.top,
                                    scrollLeft: desc_offset.left
                                },
                                function() {
                                    //sleep(500);
                                }
                            );
                        } catch(e){

                        }
                    }

                    var copyBtn = jQuery(
                        "<input class='shipping-btn' style='width:100%;margin-top:15px;' type='button' id='amazonCopy' value='Copy Listing'>"
                    );
                    copyBtn.off();
                    copyBtn.on("click", function() {
                        jQuery("a[class*='zip_file']").remove();
                        jQuery("a[class*='zip_file_normal']").remove();

                        resetAndCopy(copyAmazon);
                    });

                    setInterval(function() {
                        if (!jQuery("#amazonCopy")["length"]) {
                            //jQuery("div#j-product-detail-bd").before(copyBtn);
                            //jQuery("#j-product-description").before(copyBtn);
                            jQuery("div#dp-container").before(copyBtn);
                        }
                    }, 1000);
                } else if (autodocProductPage.test(location["href"])) {

                    var copyBtn = jQuery(
                        "<input class='shipping-btn' style='width:100%;margin-top:15px;' type='button' id='autodocCopy' value='Copy Listing'>"
                    );
                    copyBtn.off();

                    copyBtn.on("click", function() {
                        jQuery("a[class*='zip_file']").remove();
                        jQuery("a[class*='zip_file_normal']").remove();
                        resetAndCopy(copyAutodoc);
                    });

                    setInterval(function() {
                        if (!jQuery("#autodocCopy")["length"]) {
                            jQuery("div.product-block").before(copyBtn);
                        }
                    }, 1000);

                }

                var gl_supplier_detected = false;
                var stor_supplier_detected = false;
                for (var domain_name in global_suppliers){
                    if (location.href.indexOf(domain_name)!== -1){
                        var heuristics = global_suppliers[domain_name];
                        var info_obj={};
                        info_obj.heuristics=heuristics;
                        info_obj.domain_name = domain_name;
                        info_obj.supplier_type="global";


                        loadSupplierButtons(info_obj);

                        gl_supplier_detected=true;
                        break;
                    }
                }

                for (var domain_name in stor_suppliers){
                    if (location.href.indexOf(domain_name)!== -1){
                        var heuristics = stor_suppliers[domain_name];
                        var info_obj={};
                        info_obj.heuristics=heuristics;
                        info_obj.domain_name = domain_name;
                        info_obj.supplier_type="stor";

                        loadSupplierButtons(info_obj);

                        stor_supplier_detected=true;
                        break;
                    }
                }

                setTimeout(function () {
                    for (var domain_name in stor_suppliers){
                        if (location.href.indexOf(domain_name)!== -1){
                            var heuristics = stor_suppliers[domain_name];
                            var info_obj={};
                            info_obj.heuristics=heuristics;
                            info_obj.domain_name = domain_name;
                            info_obj.supplier_type="stor";

                            for (var key in heuristics){
                                info_obj.type = key.charAt(0).toUpperCase() + key.slice(1);
                                info_obj.namespace=info_obj.type.replace("domSelector","");
                                info_obj.namespace='domSelector'+info_obj.type.replace(/\s+/,"");

                                for (var d=0;d<jQuery(heuristics[key][0]).length;d+=1){
                                    info_obj.target = jQuery(heuristics[key][0])[d];
                                    if (d==0){
                                        glDomSelectors[info_obj.type].clear(info_obj);
                                    }
                                    glDomSelectors[info_obj.type].drawOutline(info_obj);
                                }

                            }

                            break;
                        }
                    }
                },3000);

            });
        }

        function copyListing(info_obj){
            jQuery("#"+info_obj.btnId).val("Working...");
            if (info_obj.btnId=='copySmartListingButton'){
                info_obj.btn_clicked='smart';
            } else {
                info_obj.btn_clicked='normal';
            }

            temp_info_obj = info_obj;
            chrome.storage.local.get(function(resp){
                var info_obj=temp_info_obj;

                var vendor_link = window['location']['href'].toString();
                vendor_link=vendor_link.split("/ref=")[0];
                vendor_link=vendor_link.split("?")[0];

                info_obj.vendor_link=vendor_link;

                info_obj.domain_name=extractHostname(vendor_link);


                if (typeof resp[info_obj.supplier_type+'_elements']=='undefined'){
                    resp[info_obj.supplier_type+'_elements']={};
                }

                if (typeof resp[info_obj.supplier_type+'_suppliers']=='undefined'){
                    resp[info_obj.supplier_type+'_suppliers']={};
                }

                if (info_obj.supplier_type=='global'){
                    resp[info_obj.supplier_type+'_suppliers']=global_suppliers;
                }



                for (var key_domain in resp[info_obj.supplier_type+'_suppliers']){
                    if (info_obj.supplier_type=='stor'){
                        if (typeof stor_suppliers[key_domain]=='undefined'){
                            stor_suppliers[key_domain]={};
                        }

                        stor_suppliers[key_domain]=resp[info_obj.supplier_type+'_suppliers'][key_domain];
                        var heuristics = stor_suppliers[info_obj.domain_name];
                    } else {
                        if (typeof global_suppliers[key_domain]=='undefined'){
                            global_suppliers[key_domain]={};
                        }

                        global_suppliers[key_domain]=resp[info_obj.supplier_type+'_suppliers'][key_domain];
                        var heuristics = global_suppliers[info_obj.domain_name];
                    }

                }



                resp['vendor_link']=info_obj.vendor_link;
                info_obj.heuristics=heuristics;

                info_obj[info_obj.supplier_type+'_elements']={};

                for (var key in heuristics){
                    info_obj.type = key.charAt(0).toUpperCase() + key.slice(1);
                    info_obj[info_obj.supplier_type+'_elements'][info_obj.type]={};


                    for (var d=0;d<jQuery(heuristics[key]).length;d+=1){

                        try{
                            info_obj.target = jQuery(heuristics[key])[d];
                            var element = info_obj.target;


                            if (typeof info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element == 'undefined' || info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element==''){

                                info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element=jQuery(element).html();
                            }

                            if (typeof info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_content == 'undefined' || info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_content==''){

                                info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_content = jQuery(element).parent().html();
                            }

                            if (typeof info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector == 'undefined' || info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector==''){

                                try{
                                    //info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector = jQuery(element).getSelector()[0].match(/>[^>]+>[^>]+>[^>]+$/gi)[0].replace(/^>/,"").trim().replace(/\.\.+/gi,".");
                                    info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector = sanitizeSelector(jQuery(element).getSelector());
                                } catch(e){
                                    info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector=="";
                                }

                            } else if (jQuery(info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector).length<1){
                                try{
                                    //info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector = jQuery(element).getSelector()[0].match(/>[^>]+>[^>]+>[^>]+$/gi)[0].replace(/^>/,"").trim().replace(/\.\.+/gi,".");
                                    info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector = sanitizeSelector(jQuery(element).getSelector());
                                } catch(e){
                                    info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector=="";
                                }
                            }
                        } catch(e){

                        }



                        //info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector = jQuery(element).getSelector()[0].split(">")[jQuery(element).getSelector()[0].split(">").length-1].trim().replace(/\.\.+/gi,".");


                    }

                }

                /*if (typeof resp[info_obj.supplier_type+'_suppliers']=='undefined'){
                    resp[info_obj.supplier_type+'_suppliers']={};
                }

                if (typeof resp[info_obj.supplier_type+'_suppliers'][info_obj.domain_name]=='undefined'){
                    resp[info_obj.supplier_type+'_suppliers'][info_obj.domain_name]={};
                }

                if (typeof resp[info_obj.supplier_type+'_suppliers'][info_obj.domain_name][info_obj.type.toLowerCase()]!='undefined'){
                    //resp[info_obj.supplier_type+'_suppliers'][info_obj.domain_name][info_obj.type.toLowerCase()]=info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector;
                    resp[info_obj.supplier_type+'_suppliers'][info_obj.domain_name][info_obj.type.toLowerCase()]=resp[info_obj.supplier_type+'_suppliers'][info_obj.domain_name][info_obj.type.toLowerCase()].concat(info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector);
                } else {
                    resp[info_obj.supplier_type+'_suppliers'][info_obj.domain_name][info_obj.type.toLowerCase()]=[info_obj[info_obj.supplier_type+'_elements'][info_obj.type].element_selector];
                }*/


                resp[info_obj.supplier_type+"_elements"]=info_obj[info_obj.supplier_type+"_elements"];
                chrome.storage.local.set(resp,function(){

                    info_obj.new_element_selected=false;
                    info_obj.copy_button_clicked=true;
                    info_obj.save_content=true;
                    info_obj.main_domain = resp.main_domain;
                    chrome.runtime.sendMessage({ type: "parse_listing", info_obj:info_obj});
                });


                return info_obj;
            });

        }

        function loadSupplierButtons(info_obj){

            var heuristics = info_obj.heuristics;

            if (info_obj.supplier_type=='stor'){
                var btnValue = "Copy Listing (Selected)";
                var btnId = "copySmartListingButton";
            } else {
                var btnValue = "Copy Listing (Default)";
                var btnId = "copyListingButton";
            }

            info_obj.btnId=btnId;

            var copy_btn = jQuery(
                "<input class='shipping-btn' style='width:100%;margin-top:15px;' type='button' id='"+btnId+"' value='"+btnValue+"'>"
            );

            copy_btn.on("click", function() {
                jQuery("a[class*='zip_file']").remove();
                jQuery("a[class*='zip_file_normal']").remove();
                info_obj.btnId=jQuery(this).attr("id");
                resetAndCopy(copyListing,info_obj);
            });

            var copyListingButtonInterval = setInterval(function() {
                if (!jQuery("#"+btnId)["length"]) {
                    jQuery(heuristics['title'][0]).before(copy_btn);
                    clearInterval(copyListingButtonInterval);
                }
            }, 1000);


        }



        chrome.storage.local.get(function(resp) {

            var detected_domain = ".com";
            if (window.location.hostname.indexOf(".com.au") != -1) {
                detected_domain = ".com.au";
            } else if (window.location.hostname.indexOf(".com") != -1) {
                detected_domain = ".com";
            } else if (window.location.hostname.indexOf(".co.uk") != -1) {
                detected_domain = ".co.uk";
            } else if (window.location.hostname.indexOf(".de") != -1) {
                detected_domain = ".de";
            } else if (window.location.hostname.indexOf(".fr") != -1) {
                detected_domain = ".fr";
            } else if (window.location.hostname.indexOf(".ca") != -1) {
                detected_domain = ".ca";
            } else if (window.location.hostname.indexOf(".es") != -1) {
                detected_domain = ".es";
            } else if (window.location.hostname.indexOf(".it") != -1) {
                detected_domain = ".it";
            }

            resp.detected_domain = detected_domain;

            if (typeof resp.title=='undefined'){
                resp.title="";
            }
            if (typeof resp.redirect_ebay=='undefined'){
                resp.redirect_ebay=true;
            }

            if (typeof resp.auto_listing=='undefined'){
                resp.auto_listing=true;
            }
            if (typeof resp.specifics=='undefined'){
                resp.specifics=[];
            }
            if (typeof resp.description=='undefined'){
                resp.description="";
            }
            if (typeof resp.zip_file=='undefined'){
                resp.zip_file="";
            }
            if (typeof resp.zip_file_normal=='undefined'){
                resp.zip_file_normal="";
            }
            if (typeof resp.compat_vehicles=='undefined'){
                resp.compat_vehicles="";
            }
            if (typeof resp.auto_download_images=='undefined'){
                resp.auto_download_images=true;
            }


            setInterval(periodicStatusCheck, 1000);

            setInterval(periodicLoginCheck, 1000 * 60 * 60 * 1);

            chrome.storage.local.set(resp,function(){
                periodicLoginCheck();
            });

        });

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


        function nextDebugAction(info_obj){

            if (info_obj.action=='shopify_image_url_insert'){



                chrome.storage.local.get(function(resp){
                    //return; //one by one
                    //jQuery("input[id^='PolarisTextField']").val(createdUrl);
                    if (jQuery("div[role='dialog']:visible").find("button").eq(2).is(":enabled")){
                        jQuery("div[role='dialog']:visible").find("button").eq(2).click();
                    } else {
                        return;
                    }

                    setTimeout(function(){

                        if (info_obj.element_index<info_obj.main_images.length){

                            jQuery("input#PolarisDropZone1").parents("div").not("[class]").eq(0).find("button").eq(0).click();

                            jQuery("#imagesButton").next().find("button[aria-controls^='Polarispopover']").click();

                            var aria_controls = jQuery("#imagesButton").next().find("button[aria-controls^='Polarispopover']").attr("aria-controls");
                            jQuery("div[id='"+aria_controls+"']").find("button").eq(0).click();

                            //var info_obj={};
                            info_obj.action="shopify_image_url_insert";
                            info_obj.target="";
                            //info_obj.main_images = parsed_main_images;
                            info_obj.element_index +=1;

                            info_obj.content = info_obj.main_images[info_obj.element_index];
                            info_obj.target = jQuery("div[role='dialog']").parent().find("input[id^='PolarisTextField']").eq(0)[0].getBoundingClientRect();

                            triggerClick(jQuery("div[role='dialog']").parent().find("input[id^='PolarisTextField']").eq(0)[0]);
                            triggerFocus(jQuery("div[role='dialog']").parent().find("input[id^='PolarisTextField']").eq(0)[0]);
                            triggerChange(jQuery("div[role='dialog']").parent().find("input[id^='PolarisTextField']").eq(0)[0]);
                            //jQuery("div[role='dialog']").parent().find("input[id^='PolarisTextField']").eq(0).focus();


                            chrome.runtime.sendMessage({type:"debug_action","info_obj":info_obj});
                        }

                    },2000);




                });

            } else if (info_obj.action=='shopify_variation_insert'){

                chrome.storage.local.get(function(resp){

                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);

                    if (info_obj.element_key_index<=info_obj.keys.length-1){

                        if (info_obj.element_value_index<info_obj.variations[info_obj.keys[info_obj.element_key_index]].length){

                            info_obj.element_value_index +=1;
                            info_obj.content = info_obj.variations[info_obj.keys[info_obj.element_key_index]][info_obj.element_value_index];
                            if (typeof info_obj.content !='undefined'){
                                info_obj.content+=',';

                                info_obj.endline=true;
                                jQuery("#variationsButton").parent().find("input[id^='TagTextField']").eq( info_obj.element_key_index).focus();
                            }
                        } else if (info_obj.element_key_index<info_obj.keys.length-1){

                            jQuery("button#VariantCreateCard-AddOptionButton").click();

                            info_obj.element_key_index +=1;
                            info_obj.element_value_index = -1;
                            info_obj.content = info_obj.keys[info_obj.element_key_index];
                            info_obj.endline=false;
                            info_obj.clear_contents=true;
                            jQuery("#variationsButton").parent().find("input[id^='PolarisTextField']").eq( info_obj.element_key_index).focus();


                        } else {
                            return;
                        }

                        chrome.runtime.sendMessage({type:"debug_action","info_obj":info_obj});
                    }


                });

            }  else if (info_obj.action=='shopify_specific_insert'){

                chrome.storage.local.get(function(resp){

                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);


                    if (info_obj.element_index<=info_obj.specifics.length-1) {

                        info_obj.specifics = inputs;
                        info_obj.element_index +=1;

                        info_obj.content=info_obj.specifics[info_obj.element_index].content;

                        triggerClick(jQuery(info_obj.specifics[info_obj.element_index].selector).eq(0)[0]);
                        triggerFocus(jQuery(info_obj.specifics[info_obj.element_index].selector).eq(0)[0]);
                        triggerChange(jQuery(info_obj.specifics[info_obj.element_index].selector).eq(0)[0]);

                        chrome.runtime.sendMessage({type:"debug_action","info_obj":info_obj});

                    } else {
                        return;
                    }

                });

            }


        }

        chrome.runtime.onMessage.addListener(function(msg) {
            if (msg.type == "activate_dom_selector"){
                selectDom(msg.info_obj);
            } else if (msg.type == "debug_action_finished"){

                nextDebugAction(msg.info_obj);

            } else if (msg.type == "zip_received") {
                //var batch_number = jQuery("a.zip_file").length + 1;

                if (msg.btn_clicked=='smart'){
                    jQuery("#copySmartListingButton").val("Copy Listing (Selected)");
                } else if (msg.btn_clicked=='normal'){
                    jQuery("#copyListingButton").val('Copy Listing');
                    jQuery("input[id*='Copy'].shipping-btn").val('Copy Listing');
                } else if (typeof msg.btn_clicked=='undefined'){
                    jQuery("#copySmartListingButton").val("Copy Listing (Selected)");
                    jQuery("#copyListingButton").val('Copy Listing');
                    jQuery("input[id*='Copy'].shipping-btn").val('Copy Listing');
                } else {
                    jQuery("input[id*='Copy'].shipping-btn").val('Copy Listing');
                }


                var zipBtn = jQuery(
                    "<a target='_blank' class='shipping-btn zip_file' style='width:100%;margin-top:15px;' type='button' >Download Resized Images</a>"
                );
                zipBtn.attr("href", "https://dropshiplister.com/app/assets/lis" + msg.zip_file);

                var zipBtnNormal = jQuery(
                    "<a target='_blank' class='shipping-btn zip_file_normal' style='width:100%;margin-top:15px;' type='button' >Download Images</a>"
                );
                zipBtnNormal.attr("href", "https://dropshiplister.com/app/assets/lis" + msg.zip_file_normal);

                if (msg.var_images_length<1){
                    var zipBtnVar = "";
                    var zipBtnNormalVar = "";
                } else {
                    var zipBtnVar = jQuery(
                        "<a target='_blank' class='shipping-btn zip_file_var' style='width:100%;margin-top:15px;' type='button' >Download Resized Variations</a>"
                    );
                    zipBtnVar.attr("href", "https://dropshiplister.com/app/assets/lis" + msg.zip_file_var);

                    var zipBtnNormalVar = jQuery(
                        "<a target='_blank' class='shipping-btn zip_file_var_normal' style='width:100%;margin-top:15px;' type='button' >Download Variations</a>"
                    );
                    zipBtnNormalVar.attr("href", "https://dropshiplister.com/app/assets/lis" + msg.zip_file_var_normal);
                }


                if (msg.btn_clicked=='smart'){
                    jQuery("#copySmartListingButton").before(zipBtn).before(zipBtnNormal).before(zipBtnVar).before(zipBtnNormalVar);
                } else if (msg.btn_clicked=='normal'){
                    jQuery("#copyListingButton").before(zipBtn).before(zipBtnNormal).before(zipBtnVar).before(zipBtnNormalVar);
                    jQuery("input[id*='Copy'].shipping-btn").before(zipBtn).before(zipBtnNormal).before(zipBtnVar).before(zipBtnNormalVar);
                } else {
                    jQuery("input[id*='Copy'].shipping-btn").before(zipBtn).before(zipBtnNormal).before(zipBtnVar).before(zipBtnNormalVar);
                }




            } else if (msg.type == "zip_failed") {

                if (typeof msg.btn_clicked!='undefined' && msg.btn_clicked=='smart'){
                    jQuery("#copySmartListingButton").notify("Error while downloading images!", {
                        className: "error",
                        position: "t"
                    });
                    jQuery("#copySmartListingButton").val("Copy Listing (Selected)");
                } else if (typeof msg.btn_clicked!='undefined' && msg.btn_clicked=='normal'){
                    jQuery("#copyListingButton").notify("Error while downloading images!", {
                        className: "error",
                        position: "t"
                    });
                    jQuery("#copyListingButton").val("Copy Listing");
                    jQuery("input[id*='Copy'].shipping-btn").notify("Error while downloading images!", {
                        className: "error",
                        position: "t"
                    });
                    jQuery("input[id*='Copy'].shipping-btn").val("Copy Listing");

                } else if (typeof msg.btn_clicked=='undefined'){
                    jQuery("#copySmartListingButton").notify("Error while downloading images!", {
                        className: "error",
                        position: "t"
                    });
                    jQuery("#copySmartListingButton").val("Copy Listing (Selected)");
                    jQuery("#copyListingButton").notify("Error while downloading images!", {
                        className: "error",
                        position: "t"
                    });
                    jQuery("#copyListingButton").val("Copy Listing");
                    jQuery("input[id*='Copy'].shipping-btn").notify("Error while downloading images!", {
                        className: "error",
                        position: "t"
                    });
                    jQuery("input[id*='Copy'].shipping-btn").val("Copy Listing");

                } else {
                    jQuery("input[id*='Copy'].shipping-btn").notify("Error while downloading images!", {
                        className: "error",
                        position: "t"
                    });
                    jQuery("input[id*='Copy'].shipping-btn").val("Copy Listing");
                }
            }

            return true;
        });

    })(document, window, jQuery);


