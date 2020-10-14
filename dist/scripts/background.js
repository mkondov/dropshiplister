(function(document, window, $) {
    "use strict";

    //jQuery.ajaxSetup({ cache: false });
    var gl_info_obj={};
    gl_info_obj.ebay_custom_request=false;

    var temp_info_obj={};
    //var last_inserted_image_index = 0;

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function backgroundSignin() {
        chrome.storage.local.get(function(resp) {
            console.log(resp);
            var post_data = {
                pass: resp.pass,
                user: resp.user
            };

            post_data = JSON.stringify(post_data);
            $["ajax"]({
                url: "https://dropshiplister.com/app/ajax/auth",
                method: "POST",
                contentType: "application/json",
                data: post_data,
                cache: false,
                success: function(resp) {
                    console.log(resp);

                    if (resp["status"] == 1) {
                        return;
                    } else if (resp["status"] != 1) {

                        chrome.storage.local.get(function(resp) {
                            resp.user = "";
                            resp.pass = "";
                            resp.status = 0;
                            chrome.storage.local.set(resp, function() {
                                chrome.runtime.sendMessage({
                                    type: "signed_out"
                                });
                            });
                        });
                    }
                }
            });

        });
    }

    function extractAjaxCompatVehicles(ebay_item_id,next,offset=0){

        gl_info_obj.ebay_custom_request=true;
        if (next==''){
            gl_info_obj.compat_vehicles={};
            next="https://api.ebay.com/parts_compatibility/v1/compatible_products/listing/"+ebay_item_id+"?fieldgroups=full&limit=100&offset=0";
        } else {
            next = next.split("?")[0]+"?fieldgroups=full"+"&"+next.split("?")[1];
            next = "https://api.ebay.com"+next;
        }
        $.ajax({
            url: next,
            method: "GET",
            cache: false,
            success: function(resp) {
                chrome.storage.local.get(function(get_resp) {

                    //var compat_vehicles = get_resp.compat_vehicles;
                    var compat_vehicles = gl_info_obj.compat_vehicles;

                    for (var m=0;m<resp.compatibleProducts.members.length;m+=1){
                        var member = resp.compatibleProducts.members[m];

                        try{
                            var ccm = member.productProperties.Engine.match("(\\d+)\\s?ccm")[1];
                        } catch(e){
                            var ccm=0;
                        }

                        try{
                            var hp = member.productProperties.Engine.match("(\\d+)\\s?HP")[1];
                        } catch(e){
                            var hp=0;
                        }

                        try{
                            var ps = member.productProperties.Engine.match("(\\d+)\\s?PS")[1];
                        } catch(e){
                            var ps=0;
                        }
                        try{
                            var kw = member.productProperties.Engine.match("(\\d+)\\s?KW")[1];
                        } catch(e){
                            var kw=0;
                        }


                        if (typeof member.productProperties["Car Make"]!='undefined'){
                            var maker = member.productProperties["Car Make"];

                            var typeName = member.productProperties.Engine;
                            var prod = member.productProperties.Variant;
                            var model = member.productProperties.Model;
                            var carName = member.productProperties.Model;

                            try{
                                var yearFrom = member.productProperties.Variant.match("\\[(\\d+)\\-(\\d+)\\]")[1];
                            } catch(e){
                                try{
                                    var yearFrom="";
                                } catch(e){
                                    var yearFrom="";
                                }
                            }
                            try{
                                var yearTo = member.productProperties.Variant.match("\\[(\\d+)\\-(\\d+)\\]")[2];
                            } catch(e){
                                try{
                                    var yearTo=member.productProperties["Cars Year"]
                                } catch(e){
                                    var yearTo="";
                                }
                            }

                        } else {
                            var maker = member.productProperties["Make"];

                            var typeName = member.productProperties.Type;
                            var prod = member.productProperties.Platform;
                            var model = member.productProperties.Model;
                            var carName = member.productProperties.Model;

                            try{
                                var yearFrom = member.productProperties['Production Period'].match(/(\d+)\/\d\d\-(\d+)\/\d\d/)[1];
                            } catch(e){
                                try{
                                    var yearFrom="";
                                } catch(e){
                                    var yearFrom="";
                                }
                            }
                            try{
                                var yearTo = member.productProperties['Production Period'].match(/(\d+)\/\d\d\-(\d+)\/\d\d/)[2];
                            } catch(e){
                                try{
                                    var yearTo="";
                                } catch(e){
                                    var yearTo="";
                                }
                            }
                        }


                        if (typeof compat_vehicles[maker]=='undefined'){
                            compat_vehicles[maker]=[];
                        }
                        compat_vehicles[maker]=compat_vehicles[maker].concat({
                            "maker":maker,
                            "model":model,
                            "carName":carName,
                            "prod":prod,
                            "typeName":typeName,
                            "yearOfConstrFrom":yearFrom,
                            "yearOfConstrTo":yearTo,
                            "yearFrom":yearFrom,
                            "yearTo":yearTo,
                            "ccm":ccm,
                            "hp":hp,
                            "ps":ps,
                            "kw":kw
                        });
                    }

                    //get_resp.compat_vehicles = compat_vehicles;

                    gl_info_obj.compat_vehicles = compat_vehicles;
                    if (resp.compatibleProducts.next!=''){
                        extractAjaxCompatVehicles(ebay_item_id,resp.compatibleProducts.next,offset);
                    } else {
                        chrome.storage.local.set({'compat_vehicles':gl_info_obj.compat_vehicles}, function(){
                            /* if (resp.compatibleProducts.next!=''){
                                 extractAjaxCompatVehicles(ebay_item_id,resp.compatibleProducts.next,offset);
                             }*/

                        });
                    }


                });

            }
        });
    }

    function popupSignin(msg) {
        chrome.storage.local.get(function(resp) {
            try {
                var post_data = {
                    pass: msg.pass,
                    user: msg.user,
                    username: resp.username
                };
            } catch (e) {
                var post_data = {
                    pass: msg.pass,
                    user: msg.user
                };
            }
            post_data = JSON.stringify(post_data);

            $["ajax"]({
                url: "https://dropshiplister.com/app/ajax/auth",
                method: "POST",
                contentType: "application/json",
                data: post_data,
                cache: false,
                success: function(resp) {
                    if (resp["status"] == 1) {
                        chrome.storage.local.get(function(curr) {
                            curr["status"] = resp["status"];
                            curr["sid"] = resp["sid"];
                            curr["signup_date"] = resp["signup_date"];
                            curr["user"] = JSON.parse(post_data).user;
                            curr["pass"] = JSON.parse(post_data).pass;

                            chrome.storage.local.set(curr, function() {
                                chrome["runtime"]["sendMessage"]({
                                    type: "signed_in",
                                    status: resp["status"],
                                    value: resp["msg"]
                                });
                            });
                        });
                    } else if (resp["status"] == 2) {
                        var info_obj = {};
                        info_obj.message_text = "Subscription is on hold";
                        info_obj.error_code = 502;
                        info_obj.message_type = "error";
                        chrome.runtime.sendMessage({
                            type: "loginMessage",
                            info_obj: info_obj
                        });
                        return;
                    }else if (resp["status"] == 3) {
                        var info_obj = {};
                        info_obj.message_text = "Subscription has expired";
                        info_obj.error_code = 503;
                        info_obj.message_type = "error";
                        chrome.runtime.sendMessage({
                            type: "loginMessage",
                            info_obj: info_obj
                        });
                        return;
                    } else if (resp["status"] == 4) {
                        var info_obj = {};
                        info_obj.message_text = "Subscription cancelled";
                        info_obj.error_code = 504;
                        info_obj.message_type = "error";
                        chrome.runtime.sendMessage({
                            type: "loginMessage",
                            info_obj: info_obj
                        });
                        return;
                    } else if (resp["status"] == 5) {
                        var info_obj = {};
                        info_obj.message_text = "Invalid Email or Password.";
                        info_obj.error_code = 505;
                        info_obj.message_type = "error";
                        chrome.runtime.sendMessage({
                            type: "loginMessage",
                            info_obj: info_obj
                        });
                        return;
                    } else if (resp["status"] == 6) {
                        var info_obj = {};
                        info_obj.message_text = "You haven't subscribed.";
                        info_obj.error_code = 506;
                        info_obj.message_type = "error";
                        chrome.runtime.sendMessage({
                            type: "loginMessage",
                            info_obj: info_obj
                        });
                        return;
                    }else {
                        var info_obj = {};
                        info_obj.message_text = resp["msg"];
                        info_obj.error_code = 500;
                        info_obj.message_type = "error";
                        chrome.runtime.sendMessage({
                            type: "loginMessage",
                            info_obj: info_obj
                        });
                        return;
                    }
                }
            });
        });
    }


    function sendListingInfo(info_obj){
        var store = info_obj['store'];
        var store_domain = info_obj['store_domain'];
        var store_id = info_obj['store_id'];
        var store_url = info_obj['store_url'];
        var supplier_url = info_obj['supplier_url'];

        var item_name = info_obj['item_name'];
        var store_category = info_obj['store_category'];
        var store_price = info_obj['store_price'];
        //var quantity = info_obj['quantity'];
        var supplier_price = info_obj['supplier_price'];
        //var store = info_obj['vendor'];

        if (typeof info_obj['main_images'] != 'undefined' && info_obj['main_images'].length>0){
            var image = info_obj['main_images'][0];
        } else {
            var image = '';
        }


        $["ajax"]({
            info_obj:info_obj,
            url: "https://dalio.io/app/api/extauth",
            method: "GET",
            contentType: "application/json",
            cache: false,
            success: function(resp) {
                if (resp["code"] == 200 && (resp["status"] == 2 || resp["status"] == 3)) { //logged in and has access

                    var listing = {
                        "item_name": item_name,
                        "image":image,
                        "store": store,
                        "store_url": store_url,
                        "store_domain": store_domain,
                        "store_id": store_id,
                        "supplier_url": supplier_url,
                        "supplier_price": supplier_price,
                        "store_price":store_price,
                        "store_category":store_category
                        //"product_availability": quantity,
                        //"amazon_price": amazon_price
                    };
                    var post_data = {
                        "user_email":resp['user_email'],
                        "listings":{
                            "update":[listing]
                        }
                    };
                    post_data = JSON['stringify'](post_data);
                    jQuery['ajax']({
                        url: 'https://dropshiplister.com/app/ajax/listings',
                        method: 'POST',
                        data: post_data,
                        success: function(inner_resp) {
                            console.log(inner_resp);
                        }
                    })

                }
            }
        });


    }

    function debugAction(info_obj){

        chrome.debugger.attach({tabId:info_obj.tab_id}, "1.3", function() {

            /*if (info_obj.action=='shopify_image_url_insert'){

                try{

                    chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchMouseEvent",{button:"left",x:info_obj.target.x+2,y:info_obj.target.y+2,type:"mousePressed"},function(resp){console.log(resp)});
                    chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchMouseEvent",{button:"left",x:info_obj.target.x+2,y:info_obj.target.y+2,type:"mouseReleased"},function(resp){console.log(resp)});


                    var content = info_obj.main_images[info_obj.element_index];
                    for (var c=0;c<content.length;c+=1){
                        chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"char",text:content[c]},function(resp){console.log(resp)});
                    }
                } catch(e){

                }

            } else if (info_obj.action=='shopify_variation_insert'){

                //chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchMouseEvent",{button:"left",x:info_obj.target.x+2,y:info_obj.target.y+2,type:"mousePressed"},function(resp){console.log(resp)});
                //chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchMouseEvent",{button:"left",x:info_obj.target.x+2,y:info_obj.target.y+2,type:"mouseReleased"},function(resp){console.log(resp)});

                try{
                    var content = info_obj.content;
                    for (var c=0;c<content.length;c+=1){
                        chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"char",text:content[c]},function(resp){console.log(resp)});
                    }
                } catch(e){

                }


            } else if (info_obj.action=='shopify_specific_insert'){

                //chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchMouseEvent",{button:"left",x:info_obj.target.x+2,y:info_obj.target.y+2,type:"mousePressed"},function(resp){console.log(resp)});
                //chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchMouseEvent",{button:"left",x:info_obj.target.x+2,y:info_obj.target.y+2,type:"mouseReleased"},function(resp){console.log(resp)});

                try{
                    var content = info_obj.content;
                    for (var c=0;c<content.length;c+=1){
                        chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"char",text:content[c]},function(resp){console.log(resp)});
                    }
                } catch(e){

                }


            } else if (info_obj.action=='shopify_title_insert'){

                //chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchMouseEvent",{button:"left",x:info_obj.target.x+2,y:info_obj.target.y+2,type:"mousePressed"},function(resp){console.log(resp)});
                //chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchMouseEvent",{button:"left",x:info_obj.target.x+2,y:info_obj.target.y+2,type:"mouseReleased"},function(resp){console.log(resp)});

                try{
                    var content = info_obj.content;
                    for (var c=0;c<content.length;c+=1){
                        chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"char",text:content[c]},function(resp){console.log(resp)});
                    }
                } catch(e){

                }


            } */

            try{



                /*if (typeof info_obj.clear_contents!='undefined' && info_obj.clear_contents==true){
                    for (var d=0;d<15;d+=1){
                        chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"rawKeyDown",windowsVirtualKeyCode:46},function(resp){console.log(resp)});
                        chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"rawKeyUp",windowsVirtualKeyCode:46},function(resp){console.log(resp)});
                        chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"rawKeyDown",windowsVirtualKeyCode:8},function(resp){console.log(resp)});
                        chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"rawKeyUp",windowsVirtualKeyCode:8},function(resp){console.log(resp)});
                    }

                    info_obj.clear_contents=false;
                }*/

                /*if (info_obj.action=='shopify_image_url_insert'){
                    var content = info_obj.main_images[last_inserted_image_index];
                } else {
                    var content = info_obj.content;
                }*/

                try{
                    chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchMouseEvent",{button:"left",x:info_obj.target.x+2,y:info_obj.target.y+2,type:"mousePressed"},function(resp){console.log(resp)});
                    chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchMouseEvent",{button:"left",x:info_obj.target.x+2,y:info_obj.target.y+2,type:"mouseReleased"},function(resp){console.log(resp)});

                } catch(e){

                }

                var content = info_obj.content;
                for (var c=0;c<content.length;c+=1){
                    chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"char",text:content[c]},function(resp){console.log(resp)});
                }

                if (info_obj.endline){
                    chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"rawKeyDown",windowsVirtualKeyCode:"VK_RETURN"},function(resp){console.log(resp)});
                    chrome.debugger.sendCommand({tabId:info_obj.tab_id}, "Input.dispatchKeyEvent",{type:"rawKeyUp",windowsVirtualKeyCode:"VK_RETURN"},function(resp){console.log(resp)});

                }

            } catch(e){

            }

            chrome.debugger.detach({tabId:info_obj.tab_id});

            chrome.tabs.sendMessage(info_obj.tab_id,{type:"debug_action_finished", "info_obj":info_obj},{'frameId':info_obj.frameId});

        });


    }

    function directDownloadImages(info_obj){


        info_obj.title = info_obj.title.replace(/\s+/g, " ");

        var downloadableImages = [];
        try{
            var main_images = JSON.parse(info_obj.main_images);
        } catch(e){
            var main_images=[];
        }

        try{
            var desc_images = JSON.parse(info_obj.desc_images);
        } catch(e){
            var desc_images = [];
        }

        if (typeof info_obj.var_images!='undefined'){
            try{
                var var_images = JSON.parse(info_obj.var_images);
            } catch(e){
                var var_images = info_obj.var_images;
            }

        } else {
            var var_images = JSON.parse('{}');
        }

        downloadableImages=downloadableImages.concat(main_images);
        downloadableImages=downloadableImages.concat(desc_images);


        for (var prop in var_images) {
            if (Object.prototype.hasOwnProperty.call(var_images, prop)) {
                // do stuff
                for (var inner_prop in var_images[prop]) {
                    if (Object.prototype.hasOwnProperty.call(var_images[prop], inner_prop)) {
                        downloadableImages=downloadableImages.concat(var_images[prop][inner_prop]);
                    }

                }

            }
        }


        function downloadFile(url, onSuccess) {
            var xhr = new XMLHttpRequest();
            xhr.onprogress = calculateAndUpdateProgress;
            xhr.open('GET', url, true);
            xhr.responseType = "blob";
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var status = xhr.status;
                    if (status === 0 || (status >= 200 && status < 400)) {
                        // The request has been completed successfully
                        try{
                            var filetype=xhr.response.type.split("/")[1];
                            if (onSuccess) onSuccess(xhr.response,filetype,true);
                        } catch(e){
                            if (onSuccess) onSuccess(xhr.response,'',false);
                        }

                    } else {
                        // Oh no! There has been an error with the request!
                        if (onSuccess) onSuccess(xhr.response,'',false);
                    }



                }
            }
            xhr.send(null);
        }


        function onDownloadComplete(blobData,filetype,shouldAddFile){

            if (count < fileURLs.length) {

                if (shouldAddFile){
                    var fileName = fileURLs[count].substring(fileURLs[count].lastIndexOf('/')+1);
                    var fullFilename = fileName.replace(fileName.substring(fileName.lastIndexOf(".")+1),filetype);
                    zip.file(fullFilename, blobData, {binary : true, compression : "DEFLATE"});

                }
                if (count < fileURLs.length -1){
                    count++;
                    downloadFile(fileURLs[count], onDownloadComplete);
                }
                else {
                    // all files have been downloaded, create the zip
                    zip.generateAsync({type:"blob",
                        /* NOTE THESE ADDED COMPRESSION OPTIONS */
                        /* deflate is the name of the compression algorithm used */
                        compression: "DEFLATE",
                        compressionOptions: {
                            /* compression level ranges from 1 (best speed) to 9 (best compression) */
                            level: 1
                        }}).then(function (content) {
                        //    window.location.replace("data:application/zip;base64," + base64);

                        saveAs(content, 'images'+'_'+info_obj.title+'.zip');

                    });


                }


                /*blobToBase64(blobData, function(binaryData){
                    // add downloaded file to zip:

                });*/
            }
        }

        function blobToBase64(blob, callback) {
            var reader = new FileReader();
            reader.onload = function() {
                var dataUrl = reader.result;
                var base64 = dataUrl.split(',')[1];
                callback(base64);
            };
            reader.readAsDataURL(blob);
        }

        function calculateAndUpdateProgress(evt) {
            if (evt.lengthComputable) {

            }
        }

        var fileURLs = downloadableImages;
        var zip = new JSZip();
        var count = 0;



        downloadFile(fileURLs[count], onDownloadComplete);


    }


    function uploadImages(info_obj){

        info_obj.title = info_obj.title.replace(/\s+/g, " ");
        try{
            var main_images = JSON.parse(info_obj.main_images);
        } catch(e){
            var main_images=[];
        }

        try{
            var desc_images = JSON.parse(info_obj.desc_images);
        } catch(e){
            var desc_images = [];
        }

        if (typeof info_obj.var_images!='undefined'){
            try{
                var var_images = JSON.parse(info_obj.var_images);
            } catch(e){
                var var_images = info_obj.var_images;
            }

        } else {
            var var_images = JSON.parse('{}');
        }


        var post_data = {
            title: info_obj.title,
            main_images: main_images.splice(0,12),
            var_images: var_images,
            desc_images: desc_images.splice(0,12)
        };
        post_data = JSON.stringify(post_data);
        jQuery.ajax({
            info_obj:info_obj,
            url: "https://dropshiplister.com/app/ajax/upload_resize_images",
            method: "POST",
            data: post_data,
            success: function(resp) {
                var info_obj = this.info_obj;
                //console.log(resp);
                try {
                    resp = JSON.parse(resp);
                } catch (e) {
                    chrome.tabs.sendMessage(sender.tab.id, { type: "zip_failed" });
                }

                if (typeof resp.code == "undefined" || resp.code != 201) {
                    chrome.tabs.sendMessage(sender.tab.id, { type: "zip_failed" });
                } else {
                    try {
                        chrome.storage.local.get(["uploaded_images", "uploaded_images_normal","uploaded_var_images","uploaded_var_images_normal","zip_file","zip_file_normal"], function(
                            get_resp
                        ) {
                            get_resp["uploaded_images"] = get_resp["uploaded_images"].concat(resp.images);
                            get_resp["uploaded_images_normal"] = get_resp["uploaded_images_normal"].concat(
                                resp.images_normal
                            );
                            get_resp["uploaded_var_images"] = get_resp["uploaded_var_images"].concat(resp.var_images);
                            get_resp["uploaded_var_images_normal"] = get_resp["uploaded_var_images_normal"].concat(
                                resp.var_images_normal
                            );

                            get_resp["zip_file"] = resp.zip_file;
                            get_resp["zip_file_normal"] = resp.zip_file_normal;

                            get_resp["zip_file_var"] = resp.zip_file_var;
                            get_resp["zip_file_var_normal"] = resp.zip_file_var_normal;

                            chrome.storage.local.set({
                                uploaded_images: get_resp["uploaded_images"],
                                uploaded_images_normal: get_resp["uploaded_images_normal"],
                                uploaded_var_images: get_resp["uploaded_var_images"],
                                uploaded_var_images_normal: get_resp["uploaded_var_images_normal"],
                                zip_file: get_resp["zip_file"],
                                zip_file_normal: get_resp["zip_file_normal"],
                                zip_file_var:get_resp["zip_file_var"],
                                zip_file_var_normal: get_resp["zip_file_var_normal"]
                            });
                        });
                    } catch (e) {}
                    if (typeof info_obj.sender!='undefined'){
                        chrome.tabs.sendMessage(info_obj.sender.tab.id, {
                            btn_clicked:info_obj.btn_clicked,
                            type: "zip_received",
                            var_images_length: resp.var_images.length,
                            zip_file: resp.zip_file,
                            zip_file_normal: resp.zip_file_normal,
                            zip_file_var: resp.zip_file_var,
                            zip_file_var_normal: resp.zip_file_var_normal,
                        });
                    } else {
                        chrome.runtime.sendMessage({
                            btn_clicked:info_obj.btn_clicked,
                            type: "zip_received",
                            var_images_length: resp.var_images.length,
                            zip_file: resp.zip_file,
                            zip_file_normal: resp.zip_file_normal,
                            zip_file_var: resp.zip_file_var,
                            zip_file_var_normal: resp.zip_file_var_normal,
                        });
                    }

                }
            }
        });
    }

    function updateListingCache(info_obj){
        chrome.storage.local.get(['saved_listings'],function(resp){

            if (typeof resp.saved_listings=='undefined'){
                resp.saved_listings=[];
            }

            if (typeof info_obj.saved_listing.source=='undefined'){
                info_obj.saved_listing.source="";
            }
            if (typeof info_obj.saved_listing.title=='undefined'){
                info_obj.saved_listing.title="";
            }
            if (typeof info_obj.saved_listing.summary=='undefined'){
                info_obj.saved_listing.summary="";
            }
            if (typeof info_obj.saved_listing.description=='undefined'){
                info_obj.saved_listing.description="";
            }
            if (typeof info_obj.saved_listing.variations=='undefined'){
                info_obj.saved_listing.variations="{}";
            }
            if (typeof info_obj.saved_listing.specifics=='undefined'){
                info_obj.saved_listing.specifics="[]";
            }
            if (typeof info_obj.saved_listing.price=='undefined'){
                info_obj.saved_listing.price="0.00";
            }
            if (typeof info_obj.saved_listing.main_images=='undefined'){
                info_obj.saved_listing.main_images="[]";
            }
            if (typeof info_obj.saved_listing.var_images=='undefined'){
                info_obj.saved_listing.var_images="{}";
            }
            if (typeof info_obj.saved_listing.desc_images=='undefined'){
                info_obj.saved_listing.desc_images="[]";
            }

            if (typeof info_obj.saved_listing.time_created=='undefined'){
                info_obj.saved_listing.time_created=new Date().toISOString();
            }


            var exists=false;
            for (var c=0;c<resp.saved_listings.length;c+=1){


                if (info_obj.saved_listing.title.toLowerCase().replace(/\s+/,"") == resp.saved_listings[c].title.toLowerCase().replace(/\s+/,"")){
                        exists=true;
                        for (var key in info_obj.saved_listing){
                            if (typeof resp.saved_listings[c][key]=='undefined'){
                                resp.saved_listings[c][key]=info_obj.saved_listing[key];
                            } else if (typeof info_obj.saved_listing[key]!='undefined') {
                                resp.saved_listings[c][key]=info_obj.saved_listing[key];
                            }
                        }
                }
            }

            if (!exists){

                resp.saved_listings=resp.saved_listings.concat(info_obj.saved_listing);
            }

            chrome.storage.local.set({saved_listings:resp.saved_listings});

        });
    }

    function parseListing(info_obj){

        temp_info_obj=info_obj;

        chrome.storage.local.get(function(resp) {

            var info_obj=temp_info_obj;
            /*resp.domain_name=info_obj.domain_name;
            resp.stor_elements=info_obj.elements;
            resp.heuristics=info_obj.heuristics;
            resp.namespace=info_obj.namespace;
            resp.supplier_type=info_obj.supplier_type;
            resp.type=info_obj.type;*/

            resp.supplier_type=info_obj.supplier_type;
            //resp.domain_name=info_obj.domain_name;

            resp['title']="";
            resp['main_images']=[];
            resp['desc_images']=[];
            resp['var_images']={};
            resp['specifics']=[];
            resp['variations']={};
            resp['price']='0.00';
            resp['brand']='';
            resp['description']='';
            resp['summary']='';

            //var info_obj=resp;
            for (var el_name in info_obj[info_obj.supplier_type+"_elements"]) {

                if (typeof info_obj[info_obj.supplier_type+"_elements"][el_name].element_content=='undefined'){
                    continue;
                }

                var element_content = jQuery(info_obj[info_obj.supplier_type+"_elements"][el_name].element_content);
                try{
                    var element_single = jQuery(info_obj[info_obj.supplier_type+"_elements"][el_name].element);
                } catch(e){
                    var element_single = jQuery("<span>"+info_obj[info_obj.supplier_type+"_elements"][el_name].element+"</span>");
                }


                if (el_name=="Title"){
                    try{
                        var title=jQuery("<span>"+info_obj[info_obj.supplier_type+"_elements"][el_name].element+"</span>").text().trim();
                    } catch(e){

                        var title = "";

                    }
                    title=title.replace(/\s+/g," ");

                    if (info_obj.save_content){
                        resp['title']=title;
                    }


                    info_obj[info_obj.supplier_type+"_elements"][el_name].element_payload = title.length;



                } else if (el_name=="Gallery"){

                    var pure_html = "<div>";
                    try{

                        for (var e=0;e<element_single.length;e+=1){
                            pure_html+=element_single[e].outerHTML;
                        }
                        pure_html+="</div>";
                    } catch(e){
                        pure_html="<div></div>";
                    }

                    try{
                        var main_images = jQuery(element_single).find("img");
                        var main_images_html = jQuery(pure_html).html();

                        var all_main_images_html = main_images_html.match(/(http|\/\/)[^\'\"]+\.(jpg|png|jpeg)/gi);
                        var all_main_images = main_images;

                        var array_main_images=[];
                        var array_main_titled_images=[];

                        jQuery(all_main_images).each(function(index,element) {

                            try{
                                if (jQuery(element).attr("alt")!='undefined'){
                                    var img_title=jQuery(element).attr("alt");
                                } else if (jQuery(element).attr("title")!='undefined'){
                                    var img_title=jQuery(element).attr("title");
                                } else if (jQuery(element).attr("label")!='undefined'){
                                    var img_title=jQuery(element).attr("label");
                                } else {
                                    var img_title="";
                                }
                                img_title=img_title.trim();
                                var img_src=jQuery(element).attr("src").split("?")[0].replace(/\.(jpg|png|jpeg)_\d+x\d+\.(jpg|png|jpeg)/i,".$1").replace(/\.(jpg|png|jpeg)_.*/i,".$1").replace(/^\/\//,"https://").trim();
                                console.log({"title":img_title,"src":img_src});
                                array_main_titled_images=array_main_titled_images.concat({"title":img_title,"src":img_src});
                                array_main_images=array_main_images.concat(img_src);
                                jQuery.each(element.attributes, function (index,attribute) {
                                    if (attribute.textContent.match(/(http|\/\/)[^\'\"]+\.(jpg|png|jpeg)/gi)){

                                        if (jQuery(element).attr("alt")!='undefined'){
                                            var img_title=jQuery(element).attr("alt");
                                        } else if (jQuery(element).attr("title")!='undefined'){
                                            var img_title=jQuery(element).attr("title");
                                        } else if (jQuery(element).attr("label")!='undefined'){
                                            var img_title=jQuery(element).attr("label");
                                        } else {
                                            var img_title="";
                                        }
                                        img_title=img_title.trim();
                                        var img_src = attribute.textContent.split("?")[0].replace(/\.(jpg|png|jpeg)_\d+x\d+\.(jpg|png|jpeg)/i,".$1").replace(/\.(jpg|png|jpeg)_.*/i,".$1").replace(/^\/\//,"https://").trim();;
                                        console.log({"title":img_title,"src":img_src});
                                        array_main_titled_images=array_main_titled_images.concat({"title":img_title,"src":img_src});
                                        array_main_images=array_main_images.concat(img_src);

                                    }

                                });
                            } catch(e){

                            }

                        });

                        jQuery(all_main_images_html).each(function(index,element) {

                            //console.log(jQuery("img[src*='"+element+"']"));
                            //console.log(jQuery("a[src*='"+element+"']"));
                            //console.log(jQuery("a[href*='"+element+"']"));

                            //.replace(/\.(jpg|png|jpeg)_\d+x\d+\.(jpg|png|jpeg)/i,".$1")
                            var img_src = element.split("?")[0].replace(/\.(jpg|png|jpeg)_\d+x\d+\.(jpg|png|jpeg)/i,".$1").replace(/\.(jpg|png|jpeg)_.*/i,".$1").replace(/^\/\//,"https://").trim();
                            var img_title="";
                            array_main_titled_images=array_main_titled_images.concat({"title":img_title,"src":img_src});
                            array_main_images=array_main_images.concat(img_src);
                        });

                        var unique_images = [];
                        for (var i=0;i<array_main_images.length;i+=1){
                            var already_exists=false;
                                for (var u=0;u<unique_images.length;u+=1){
                                    if (unique_images[u]==array_main_images[i]){
                                        already_exists=true;
                                        break;
                                    }
                                }
                                if (!already_exists){
                                    unique_images=unique_images.concat(array_main_images[i]);
                                }
                        }

                        var unique_titled_images = [];
                        for (var i=0;i<array_main_titled_images.length;i+=1){
                            var already_exists=false;
                            for (var u=0;u<unique_titled_images.length;u+=1){
                                if (unique_titled_images[u].title==array_main_titled_images[i].title &&
                                    unique_titled_images[u].src==array_main_titled_images[i].src){
                                    already_exists=true;
                                    break;
                                }
                            }
                            if (!already_exists){
                                unique_titled_images=unique_titled_images.concat(array_main_titled_images[i]);
                            }
                        }

                        var json_main_images=JSON.stringify(unique_images);
                        var json_main_titled_images=JSON.stringify(unique_titled_images);

                        if (info_obj.save_content){
                            resp['main_images']=json_main_images;
                            resp['main_titled_images']=json_main_titled_images;
                        }

                        info_obj[info_obj.supplier_type+"_elements"][el_name].element_payload = unique_images.length;
                    } catch (e) {

                    }

                } else if (el_name=="Specifics"){

                    try{
                       // var item_specifics=[];
                        //var item_specifics_array=[];

                        var pairs = [];

                        try{
                            for (var e=0;e<element_content.length;e+=1){
                                try{
                                var text_elements = element_content[e].outerText.split("\n");
                                for (var t=0;t<text_elements.length;t+=1){
                                    try{
                                        var left_side = text_elements[t].split(":")[0];
                                        var right_side = text_elements[t].split(":")[1];

                                        pairs=pairs.concat({"left_side":left_side.trim(),"right_side":right_side.trim()});

                                    } catch(e){

                                    }

                                }
                                } catch(e){

                                }
                            }
                        } catch(e){

                        }


                        var commonTags = {};

                        commonTags['li']=jQuery(element_content).find("li");
                        commonTags['div']=jQuery(element_content).find("div");
                        commonTags['span']=jQuery(element_content).find("span");
                        commonTags['a']=jQuery(element_content).find("a");
                        commonTags['tr']=jQuery(element_content).find("tr");
                        commonTags['dl']=jQuery(element_content).find("dl");
                        commonTags['dt']=jQuery(element_content).find("dt");
                        commonTags['dd']=jQuery(element_content).find("dd");



                        for (var tag in commonTags){
                            var tagArray = commonTags[tag];
                            tagArray.each(function(index,element){
                                temp_info_obj['element']=jQuery(element).html();
                                jQuery(element).each(function() {
                                    //jQuery.each(element.attributes, function() {

                                        var left_side="";
                                        var right_side="";

                                        try{
                                            left_side=jQuery(element).text().trim().split(":")[0].trim().replace(/:/gi,"");
                                        } catch(e){
                                            left_side="";
                                        }

                                        try{
                                            right_side=jQuery(element).text().trim().split(":")[1].trim();
                                        } catch(e){
                                            right_side="";
                                        }

                                        pairs=pairs.concat({"left_side":left_side,"right_side":right_side});
                                        left_side="";
                                        right_side="";

                                        try{
                                            left_side=jQuery(element).find("dt").text.trim().replace(/:/gi,"");
                                        } catch(e){
                                            left_side="";
                                        }

                                        try{
                                            right_side=jQuery(element).find("dd").text.trim();
                                        } catch(e){
                                            right_side="";
                                        }

                                        pairs=pairs.concat({"left_side":left_side,"right_side":right_side});
                                        left_side="";
                                        right_side="";

                                        try{
                                            left_side=jQuery(element).find("td").eq(0).text.trim().replace(/:/gi,"");
                                        } catch(e){
                                            left_side="";
                                        }

                                        try{
                                            right_side=jQuery(element).find("td").eq(1).text.trim();
                                        } catch(e){
                                            right_side="";
                                        }

                                        pairs=pairs.concat({"left_side":left_side,"right_side":right_side});
                                        left_side="";
                                        right_side="";

                                        try{
                                            left_side = jQuery(element).children().eq(0).text().trim().replace(/:/gi,"");
                                        } catch(e){
                                            left_side="";
                                        }


                                        try{
                                            right_side= jQuery(element).children().eq(1).text().trim();
                                        } catch(e){
                                            right_side="";
                                        }

                                        pairs=pairs.concat({"left_side":left_side,"right_side":right_side});
                                        left_side="";
                                        right_side="";


                                        try{
                                            left_side=jQuery(element).text().trim().match(/<[^>]+>([\w\s]+)<\/[^>]+>/g)[0].match(/<.+>([\w]+)<\/.+>/i)[1].replace(/:/gi,"");
                                        } catch(e){
                                            left_side="";
                                        }

                                        try{
                                            right_side=jQuery(element).text().trim().match(/<[^>]+>([\w\s]+)<\/[^>]+>/g)[1].match(/<.+>([\w]+)<\/.+>/i)[1];
                                        } catch(e){
                                            right_side="";
                                        }

                                        pairs=pairs.concat({"left_side":left_side,"right_side":right_side});
                                        left_side="";
                                        right_side="";

                                        try{
                                            left_side=jQuery(element).text().trim().match(/<[^>]+>([\w\s]+)<\/[^>]+>/g)[0].match(/<.+>([\w]+)<\/.+>/i)[1].replace(/:/gi,"");
                                        } catch(e){
                                            left_side="";
                                        }

                                        try{
                                            right_side=jQuery(element).text().trim().replace(jQuery(element).text().trim().match(/<.+>([\w]+)<\/.+>/i)[0],"");
                                        } catch(e){
                                            right_side="";
                                        }

                                        pairs=pairs.concat({"left_side":left_side,"right_side":right_side});
                                        left_side="";
                                        right_side="";

                                        try{
                                            left_side=jQuery(element).text().trim().replace(jQuery(element).text().trim().match(/<.+>([\w]+)<\/.+>/i)[0],"").replace(/:/gi,"");
                                        } catch(e){
                                            left_side="";
                                        }

                                        try{
                                            right_side=jQuery(element).text().trim().match(/<[^>]+>([\w\s]+)<\/[^>]+>/g)[0].match(/<.+>([\w]+)<\/.+>/i)[1];
                                        } catch(e){
                                            right_side="";
                                        }

                                        pairs=pairs.concat({"left_side":left_side,"right_side":right_side});
                                        left_side="";
                                        right_side="";


                                    //});
                                });

                            });
                        }

                        var pairs_unique_specifics =[];

                        for (var p=0;p<pairs.length;p+=1){
                            if (pairs[p]['left_side']==""){
                                continue;
                            }
                            if (pairs[p]['right_side']==""){
                                continue;
                            }
                            if (typeof pairs_unique_specifics[pairs[p]['left_side']]=='undefined'){
                                pairs_unique_specifics[pairs[p]['left_side']]={};
                                pairs_unique_specifics[pairs[p]['left_side']]['values']=[];
                                pairs_unique_specifics[pairs[p]['left_side']]['values']=pairs_unique_specifics[pairs[p]['left_side']]['values'].concat(pairs[p]['right_side']);
                            } else {
                                pairs_unique_specifics[pairs[p]['left_side']]['values']=pairs_unique_specifics[pairs[p]['left_side']]['values'].concat(pairs[p]['right_side']);
                            }
                        }

                        var prior_size = 0;
                        if (typeof resp['specifics']!='undefined'){
                            var prior_item_specifics_array = resp['specifics'];
                        } else {
                            var prior_item_specifics_array = [];
                        }

                        prior_size=prior_item_specifics_array.length;

                        var unique_values = [];

                        for (var key in pairs_unique_specifics){
                            var values = pairs_unique_specifics[key].values;
                            unique_values=[];
                            for (var v=0;v<values.length;v+=1){
                                if (jQuery.inArray(values[v], unique_values) == -1){
                                    unique_values=unique_values.concat(values[v]);
                                }
                            }

                            try{
                                var unique_value=unique_values[0];
                            } catch(e){
                                var unique_value="";
                            }

                            prior_item_specifics_array=prior_item_specifics_array.concat({
                                "left_side":key,
                                "right_side":unique_value
                            });
                        }

                        //if (prior_size<prior_item_specifics_array.length){

                        //}

                        if (info_obj.save_content){
                            if (prior_size<prior_item_specifics_array.length){
                                resp['specifics']=prior_item_specifics_array;
                                //resp['specifics']=resp['specifics'].concat(prior_item_specifics_array);
                            } else {

                            }

                        }


                        //resp['specifics']=prior_item_specifics_array;

                        info_obj[info_obj.supplier_type+"_elements"][el_name].element_payload = prior_item_specifics_array.length;

                    } catch (e) {

                    }


                } else if (el_name=="Description"){

                    var pure_html = "<div>";
                    try{

                        for (var e=0;e<element_content.length;e+=1){
                            pure_html+=element_content[e].outerHTML;
                        }
                        pure_html+="</div>";
                    } catch(e){
                        pure_html="<div></div>";
                    }

                    try{

                        var desc_html =pure_html;

                        /*if (jQuery(element_content).parent().length==0){
                            var desc_html = jQuery(element_content).html();
                        } else {
                            var desc_html =jQuery(element_content).parent().html();
                        }*/

                    } catch (e){
                        var desc_html="";
                    }


                    if (info_obj.save_content){
                        if (typeof resp['description']!='undefined'){
                            resp['description']+="\n\n</br></br>"+desc_html;
                        } else {
                            resp['description']=desc_html;
                        }
                    }

                    info_obj[info_obj.supplier_type+"_elements"][el_name].element_payload = desc_html.length;


                    var desc_images = jQuery(element_content).find("img");
                    var desc_images_html = jQuery(pure_html).html();

                    var all_desc_images_html = desc_images_html.match(/(http|\/\/)[^\'\"]+\.(jpg|png|jpeg)/gi);
                    var all_desc_images = desc_images;

                    var array_desc_images=[];
                    var array_desc_titled_images=[];

                    jQuery(all_desc_images).each(function(index,element) {

                        try{
                            var img_title=jQuery(element).attr("alt").trim();
                            var img_src=jQuery(element).attr("src").split("?")[0].replace(/\.(jpg|png|jpeg)_\d+x\d+\.(jpg|png|jpeg)/i,".$1").replace(/\.(jpg|png|jpeg)_.*/i,".$1").replace(/^\/\//,"https://");
                            console.log({"title":img_title,"src":img_src});
                            array_desc_titled_images=array_desc_titled_images.concat({"title":img_title,"src":img_src});
                            array_desc_images=array_desc_images.concat(img_src);
                            jQuery.each(element.attributes, function (index,attribute) {
                                if (attribute.textContent.match(/(http|\/\/)[^\'\"]+\.(jpg|png|jpeg)/gi)){

                                    if (jQuery(element).attr("alt")!='undefined'){
                                        var img_title=jQuery(element).attr("alt");
                                    } else if (jQuery(element).attr("title")!='undefined'){
                                        var img_title=jQuery(element).attr("title");
                                    } else if (jQuery(element).attr("label")!='undefined'){
                                        var img_title=jQuery(element).attr("label");
                                    } else {
                                        var img_title="";
                                    }
                                    img_title=img_title.trim();
                                    var img_src = attribute.textContent.split("?")[0].replace(/\.(jpg|png|jpeg)_\d+x\d+\.(jpg|png|jpeg)/i,".$1").replace(/\.(jpg|png|jpeg)_.*/i,".$1").replace(/^\/\//,"https://").trim();;
                                    //console.log({"title":img_title,"src":img_src});
                                    array_desc_titled_images=array_desc_titled_images.concat({"title":img_title,"src":img_src});
                                    array_desc_images=array_desc_images.concat(img_src);

                                }
                            });
                        } catch(e){

                        }

                    });

                    jQuery(all_desc_images_html).each(function(index,element) {

                        var img_src = element.split("?")[0].replace(/\.(jpg|png|jpeg)_\d+x\d+\.(jpg|png|jpeg)/i,".$1").replace(/\.(jpg|png|jpeg)_.*/i,".$1").replace(/^\/\//,"https://").trim();
                        var img_title="";
                        array_desc_titled_images=array_desc_titled_images.concat({"title":img_title,"src":img_src});
                        array_desc_images=array_desc_images.concat(img_src);
                    });

                    var unique_images = [];
                    for (var i=0;i<array_desc_images.length;i+=1){
                        var already_exists=false;
                        for (var u=0;u<unique_images.length;u+=1){
                            if (unique_images[u]==array_desc_images[i]){
                                already_exists=true;
                                break;
                            }
                        }
                        if (!already_exists){
                            unique_images=unique_images.concat(array_desc_images[i]);
                        }
                    }

                    var unique_titled_images = [];
                    for (var i=0;i<array_desc_titled_images.length;i+=1){
                        var already_exists=false;
                        for (var u=0;u<unique_titled_images.length;u+=1){
                            if (unique_titled_images[u].title==array_desc_titled_images[i].title &&
                                unique_titled_images[u].src==array_desc_titled_images[i].src){
                                already_exists=true;
                                break;
                            }
                        }
                        if (!already_exists){
                            unique_titled_images=unique_titled_images.concat(array_desc_titled_images[i]);
                        }
                    }

                    var json_desc_images=JSON.stringify(unique_images);
                    var json_desc_titled_images=JSON.stringify(unique_titled_images);

                    if (info_obj.save_content){
                        resp['desc_images']=json_desc_images;
                        resp['desc_titled_images']=json_desc_titled_images;
                    }



                    //info_obj[info_obj.supplier_type+"_elements"][el_name].element_payload = unique_images.length;


                } else if (el_name=="Price"){
                    try{
                        try{
                            var parsedPrice=jQuery(element_content).text().trim().match(/([\d\.\,]+)/)[0];
                        } catch(e){
                            var parsedPrice="0.0";
                        }

                        if (info_obj.save_content){
                            resp['price']=parsedPrice;
                        }

                        info_obj[info_obj.supplier_type+"_elements"][el_name].element_payload = parsedPrice;

                    } catch (e) {

                    }


                } else if (el_name=="Summary"){

                    try{
                        var bullet_points = [];
                        try {

                            var pure_html = "<div>";
                            for (var e=0;e<element_single.length;e+=1){
                                pure_html+=element_single[e].outerHTML;
                            }
                            pure_html+="</div";

                            var summary_html = jQuery(pure_html).html();
                            summary_html=summary_html.replace(/<script[^>]+>[^>]+script>/gim, "");

                            var prior_size = 0;
                            if (typeof resp['specifics']!='undefined'){
                                var prior_item_specifics_array = resp['specifics'];
                            } else {
                                var prior_item_specifics_array = [];
                            }

                            prior_size=prior_item_specifics_array.length;

                            var bullets = jQuery(pure_html).find("li");

                            for (var s = 0; s < bullets.length; s++) {
                                var left_side = "";
                                var right_side = "";
                                try {
                                    var left_side = jQuery(bullets[s])
                                        .text()
                                        .trim()
                                        .split(":")[0]
                                        .trim();
                                    var right_side = jQuery(bullets[s])
                                        .text()
                                        .trim()
                                        .split(":")[1]
                                        .trim();

                                    try {
                                        prior_item_specifics_array = prior_item_specifics_array.concat([
                                            {
                                                left_side: left_side,
                                                right_side: right_side
                                            }
                                        ]);
                                    } catch (e) {}
                                } catch (e) {
                                    console.log(e);
                                }
                                try {
                                    var bullet = jQuery(bullets[s])
                                        .text()
                                        .trim();

                                    bullet_points.push(bullet.trim());
                                } catch (e) {}
                            }


                        } catch (e) {}



                        if (info_obj.save_content){
                            if (prior_size<prior_item_specifics_array.length){
                                //resp['specifics']=resp['specifics'].concat(prior_item_specifics_array);
                                resp['specifics']=prior_item_specifics_array;
                            } else {

                            }

                            resp['bullet_points']= bullet_points;
                            resp['bullet_points_html']=summary_html;

                            resp['summary']=summary_html;


                            if (typeof resp['description']!='undefined'){
                                resp['description']+="\n\n</br></br>"+summary_html;
                            } else {
                                resp['description']=summary_html;
                            }
                        }


                        info_obj[info_obj.supplier_type+"_elements"][el_name].element_payload = summary_html.length;
                    } catch(e){

                    }


                } else if (el_name=="Variations") {

                    try {

                        var commonTags = {};

                        commonTags['li'] = jQuery(element_content).find("li");
                        commonTags['dl'] = jQuery(element_content).find("dl");
                        //commonTags['dt'] = jQuery(element_content).find("dt");
                        //commonTags['dd'] = jQuery(element_content).find("dd");
                        commonTags['div'] = jQuery(element_content).find("div");
                        commonTags['input'] = jQuery(element_content).find("input");
                        commonTags['img'] = jQuery(element_content).find("img");
                        commonTags['label'] = jQuery(element_content).find("label");


                        var pairs = [];

                        for (var tag in commonTags) {
                            var tagArray = commonTags[tag];
                            tagArray.each(function (index, element) {
                                temp_info_obj['element']=jQuery(element).html();
                                jQuery(element).each(function () {
                                    jQuery.each(element.attributes, function () {
                                        // this.attributes is not a plain object, but an array
                                        // of attribute nodes, which contain both the name and value
                                        // if(this.specified) {
                                        //console.log(this.name);

                                        /*if (this.name=='id' || this.name=="ID"){
                                            return true;
                                        }
                                        if (this.name=='href' || this.name=="href"){
                                            return true;
                                        }
                                        if (this.name=='src' || this.name=="src"){
                                            return true;
                                        }
                                        if (this.name=='class' || this.name=="class"){
                                            return true;
                                        }*/

                                        var labels = [];
                                        var values = [];
                                        var temp_label="";


                                        try {

                                            temp_label = jQuery(element).text().trim().match(/^(\w[^\.:,]+\s{0,3})/i)[0].replace(":","").trim();
                                            if (temp_label.match(/\d/)==null) {
                                                labels = labels.concat(temp_label);
                                            }
                                        } catch (e) {
                                        }

                                        for (var i = 0; i < 5; i += 1) {
                                            try{
                                                temp_label = jQuery(element).parents().eq(i).text().trim().match(/^(\w[^\.:,]+\s{0,3})/i)[0].replace(":","").replace(String.fromCharCode(8629),"").trim();
                                                if (temp_label.match(/\d/)==null){
                                                    labels = labels.concat(temp_label);
                                                    break;
                                                }

                                            } catch(e){

                                            }
                                        }


                                        /*try {
                                            labels = labels.concat(jQuery(element).parents().eq(1).text().trim().match(/^([\w\s]+)/)[0]);
                                        } catch (e) {
                                        }
                                        try {
                                            labels = labels.concat(jQuery(element).parents().eq(2).text().trim().match(/^([\w\s]+)/)[0]);
                                        } catch (e) {
                                        }
                                        try {
                                            labels = labels.concat(jQuery(element).parent().text().trim().match(/^([\w\s]+)/)[0]);
                                        } catch (e) {
                                        }
                                        try {
                                            labels = labels.concat(jQuery(element).parent().parent().parent().text().trim().match(/^([\w\s]+)/)[0]);
                                        } catch (e) {
                                        }*/



                                        try {
                                            var potential_value = jQuery(element).text();
                                            for (var i = 0; i < labels.length; i += 1) {

                                                try {
                                                    values = values.concat(jQuery(element).text().replace(new RegExp(labels[i], "gi"), "").replace(/:|\.|\,/g, "").trim().trim());
                                                } catch (e) {
                                                }

                                                potential_value = potential_value.replace(new RegExp(labels[i], "gi"), "").replace(/:|\.|\,/g, "").trim();

                                            }
                                            potential_value = potential_value.replace(/:|\.|\,/g, "").trim().trim();
                                            values = values.concat(potential_value);
                                        } catch(e){

                                        }

                                        try {
                                            if (this.name.toLowerCase()=='title' && element.tagName.toLowerCase()=="img"){
                                                values = values.concat(toTitleCase(jQuery(element).attr(this.name)));
                                            }
                                        } catch (e) {
                                        }

                                        try {
                                            if (this.name.toLowerCase()=='alt' && element.tagName.toLowerCase()=="img"){
                                                values = values.concat(toTitleCase(jQuery(element).attr(this.name)));
                                            }
                                        } catch (e) {
                                        }


                                        try {
                                            values = values.concat(jQuery(element).attr(this.name));
                                        } catch (e) {
                                        }

                                        try{
                                            var potential_values = temp_info_obj['element'].match(/\w+=(\"|\')[^\"\']+(\"|\')/g);
                                            for (var v=0;v<potential_values.length;v+=1){
                                                try {
                                                    values = values.concat(potential_values[v].split("=")[1].replace(/"|'/g,"").trim());
                                                } catch (e) {
                                                }
                                            }
                                        } catch(e){

                                        }

                                        try{
                                            var potential_values = temp_info_obj['element'].match(/<[^<>]+>([^<>]+)<\/[^<>]+>/g);
                                            for (var v=0;v<potential_values.length;v+=1){
                                                try {
                                                    values = values.concat(potential_values[v].match(/<[^<>]+>([^<>]+)<\/[^<>]+>/)[1].trim());
                                                } catch (e) {
                                                }
                                            }
                                        } catch(e){

                                        }


                                        try {
                                            values = values.concat(jQuery(element).text.trim());
                                        } catch (e) {
                                        }
                                        /*
                                        try {
                                            values = values.concat(jQuery(element).html().trim());
                                        } catch (e) {
                                        }*/



                                        var extended_values = [];
                                        for (var v in values) {
                                            var value = values[v];

                                            if (typeof (value)=='undefined'){
                                                continue;
                                            }
                                            if (value==""){
                                                continue;
                                            }

                                            if (value.length>10){
                                                continue;
                                            }

                                            if (value.match(/\d.*\d.*\d.*\d/i)){
                                                continue;
                                            }

                                            if (value.match(/img|select|swatch|stock|option|choose|show|more|object|&nbsp;/i)){
                                                continue;
                                            }
                                            if (value.match(/[\{!@#$%^&*:;\\\/]/i)){
                                                continue;
                                            }
                                            if (value.match(/_.+_/i)){
                                                continue;
                                            }
                                            if (value.match(/\-.+\-/i)){
                                                continue;
                                            }

                                            value = value.replace(/Select/i,"").trim();
                                            value = value.replace(/color|colour|size/i,"").trim();

                                            value = value.replace(new RegExp(label,"i"),"").trim();
                                            value = value.replace(/:|,|\.|;|\n/i,"").trim();
                                            value = value.replace(String.fromCharCode(8629),"");
                                            value = value.replace(/\r?\n|\r/g," ");

                                            extended_values = extended_values.concat(value.replace(/\s\s+/g,",").split(","));
                                            extended_values = extended_values.concat(value.replace(/\s+/g,",").split(","));
                                            extended_values = extended_values.concat(value);
                                        }

                                        var unique_values = [];

                                        for (var v = 0; v < extended_values.length; v += 1) {

                                            var found = false;
                                            for (var uv = 0; uv < unique_values.length; uv += 1) {
                                                if (unique_values[uv].toLowerCase().trim()==extended_values[v].toLowerCase().trim()){
                                                    found = true;
                                                    break;
                                                }
                                            }

                                            if (!found){
                                                unique_values=unique_values.concat(extended_values[v]);
                                            }

                                        }



                                        for (var l in labels) {
                                            var label = labels[l].replace("\n"," ").trim().replace(":","");
                                            if (label.match(/size|color|colour/i)==null){
                                                continue;
                                            }

                                            label = label.replace(/.+(color|colour).+/gi,"$1").toUpperCase();
                                            label = label.replace(/.+(size).+/gi,"Size").toUpperCase();
                                            for (var v in unique_values) {
                                                var value = unique_values[v];

                                                if (value.toLowerCase().trim()==label.toLowerCase().trim()) {
                                                    continue;
                                                }


                                                if (((value.toLowerCase()!=value || value.match(/\d/)!=null) &&
                                                    label.toLowerCase()!=label) && (value.match(/\/\/.+\//)==null)){
                                                    pairs = pairs.concat({"label": label, "value": value});
                                                }

                                            }
                                        }

                                        //}
                                    });
                                });

                            });
                        }

                        var pairs_unique_labels = [];

                        for (var p = 0; p < pairs.length; p += 1) {

                            if (pairs[p]['label']==""){
                                continue;
                            }
                            if (pairs[p]['value']==""){
                                continue;
                            }

                            if (typeof pairs_unique_labels[pairs[p]['label']] == 'undefined') {
                                pairs_unique_labels[pairs[p]['label']] = {};
                                pairs_unique_labels[pairs[p]['label']]['values'] = [];
                                pairs_unique_labels[pairs[p]['label']]['values'] = pairs_unique_labels[pairs[p]['label']]['values'].concat(pairs[p]['value']);
                            } else {
                                pairs_unique_labels[pairs[p]['label']]['values'] = pairs_unique_labels[pairs[p]['label']]['values'].concat(pairs[p]['value']);
                            }
                        }

                        var unique_values = [];
                        var parsed_pairs = [];

                        for (var key in pairs_unique_labels) {



                            var values = pairs_unique_labels[key].values;

                            key = toTitleCase(key);

                            unique_values = [];
                            for (var v = 0; v < values.length; v += 1) {

                                if (key.toLowerCase().indexOf("size")!=-1) {
                                    values[v]=values[v].toUpperCase();

                                    if (jQuery.inArray(values[v], unique_values) == -1) {
                                        unique_values = unique_values.concat(values[v].toUpperCase());
                                    }
                                } else {
                                    if (jQuery.inArray(values[v], unique_values) == -1) {
                                        unique_values = unique_values.concat(toTitleCase(values[v]));
                                    }
                                }

                            }


                            parsed_pairs = parsed_pairs.concat({
                                "label": key,
                                "values": unique_values
                            });

                        }

                        var cleaned_parsed_pairs = [];

                        for (var p=0;p<parsed_pairs.length;p+=1){

                            var current_label = parsed_pairs[p]['label'];
                            var current_values = parsed_pairs[p]['values'];

                            var unique_values = [];
                            for (var v=0;v<current_values.length;v+=1){
                                var already_exists=false;
                                for (var uv=0;uv<unique_values.length;uv+=1){
                                    if ( unique_values[uv].toLowerCase().trim()==current_values[v].toLowerCase().trim()){
                                        already_exists=true;
                                        break;
                                    }

                                }
                                if (!already_exists){
                                    unique_values=unique_values.concat(current_values[v]);
                                }
                            }

                            cleaned_parsed_pairs=cleaned_parsed_pairs.concat({"label":current_label,"values":unique_values});

                        }
                        /*for (var p=parsed_pairs.length-1;p>0;p-=1){

                           var current_values =  parsed_pairs[p]['values'];
                           var previous_values =  parsed_pairs[p-1]['values'];
                            var cleaned_previous_values = [];
                            for (var pr_v=0;pr_v<previous_values.length;pr_v+=1){
                                var already_exists=false;
                                for (var c_v=0;c_v<current_values.length;c_v+=1){
                                    if ( current_values[c_v].toLowerCase()== previous_values[pr_v].toLowerCase()){
                                        already_exists=true;
                                    }
                                }
                               if (!already_exists){
                                   cleaned_previous_values=cleaned_previous_values.concat(previous_values[pr_v]);
                               }
                            }

                            for (var pp=0;pp<cleaned_parsed_pairs.length;pp+=1){
                                if (cleaned_parsed_pairs[pp]['label']==parsed_pairs[p-1]['label']){
                                    cleaned_parsed_pairs[pp]['values']=cleaned_previous_values;
                                }
                            }
                        }*/


                        if (info_obj.save_content){
                            resp['variations']={};
                            for (var pp=0;pp<cleaned_parsed_pairs.length;pp+=1){
                                resp['variations'][cleaned_parsed_pairs[pp]['label']]=cleaned_parsed_pairs[pp]['values'];
                            }
                            //resp['variations']=parsed_pairs;
                        }


                    } catch (e) {

                        if (info_obj.save_content){
                            resp['variations']={};
                        }

                    }

                    info_obj[info_obj.supplier_type+"_elements"][el_name].element_payload = Object.keys(resp['variations']).length;

                    var var_images = jQuery(element_content).find("img");
                    var var_images_obj={};
                    var array_var_images=[];

                    jQuery(resp['variations']).each(function(variation_index,variation_element) {

                        array_var_images=[];

                        jQuery(var_images).each(function (image_index, image_element) {
                            try {

                                if (typeof jQuery(image_element).attr("alt") != 'undefined') {
                                    var img_title = jQuery(image_element).attr("alt").trim();
                                } else if (typeof jQuery(image_element).attr("title") != 'undefined') {
                                    var img_title = jQuery(image_element).attr("title").trim();
                                } else if (typeof jQuery(image_element).attr("label") != 'undefined') {
                                    var img_title = jQuery(image_element).attr("label").trim();
                                } else {
                                    var img_title = "";
                                }

                                var img_src = jQuery(image_element).attr("src").split("?")[0].replace(/\.(jpg|png|jpeg)_\d+x\d+\.(jpg|png|jpeg)/i, ".$1").replace(/\.(jpg|png|jpeg)_.*/i, ".$1").replace(/^\/\//, "https://");
                                var img_obj = {};
                                img_obj[img_title]=img_src;
                                array_var_images = array_var_images.concat(img_obj);

                            } catch (e) {

                            }

                        });

                        var_images_obj[Object.keys(variation_element)[0]] = array_var_images;
                    });


                    //var json_var_images=JSON.stringify(var_images_obj);

                    if (info_obj.save_content){

                        resp['var_images']=JSON.stringify(var_images_obj);

                    }


                }

            }

            try{
                for (var el_name in info_obj["stor_elements"]){
                    if (typeof resp['stor_elements']=='undefined'){
                        resp['stor_elements']={};
                    }
                    if (typeof resp['stor_elements'][el_name]=='undefined'){
                        resp['stor_elements'][el_name]={};
                    }

                    //resp['stor_elements'][el_name].element_payload=info_obj["stor_elements"][el_name].element_payload;
                    resp['stor_elements'][el_name]=info_obj["stor_elements"][el_name];

                }
            } catch(e){

            }


            //var temp_resp = resp;
            //temp_info_obj=info_obj;

            try{
                var source =info_obj.vendor_link.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img)[0].replace(/http:\/\/|https:\/\/|www\./g,"");//.match(/(wwww\.)?(.+)\./)[2].replace("www.","").replace(/https?:\/\//,"");
                //source=source.match(/([^\/]+)/)[1];
            } catch(e){
                var source="";
            }

            info_obj.saved_listing = {
                source: source,
                title: resp['title'],
                description: resp['description'],
                specifics: resp['specifics'],
                variations: resp['variations'],
                main_images: resp['main_images'],
                var_images: resp['var_images'],
                desc_images: resp['desc_images'],
                summary: resp['summary'],
                price: resp['price'],
                vendor_link: info_obj.vendor_link,
            };

            temp_info_obj=info_obj;

            updateListingCache(info_obj);

            chrome.storage.local.set(resp,function(){

                var info_obj = temp_info_obj;

                try{
                    //if (temp_resp['main_images'].length){
                    try{
                        info_obj.saved_listing.btn_clicked=info_obj.btn_clicked;

                        try{
                            info_obj.saved_listing.sender=info_obj.sender;
                            info_obj.saved_listing.tab_id=info_obj.tab_id;
                            info_obj.saved_listing.frameId=info_obj.frameId;
                        } catch(e){

                        }

                        if (typeof temp_info_obj.copy_button_clicked!='undefined' && temp_info_obj.copy_button_clicked){
                            uploadImages(info_obj.saved_listing);
                        }

                    } catch(e){

                    }

                    //}
                    if (typeof temp_info_obj.copy_button_clicked!='undefined' && temp_info_obj.copy_button_clicked){
                        chrome.storage.local.get(['auto_download_images'],function(resp){
                            if (resp.auto_download_images==true){
                                directDownloadImages(info_obj.saved_listing);
                            }
                        });
                    }


                } catch(e){

                }

                if (typeof temp_info_obj.copy_button_clicked!='undefined' && temp_info_obj.copy_button_clicked){
                    if (resp['redirect_ebay']){
                        chrome.storage.local.set({"auto_listing":true},function(){
                            var newURL =
                                "http://bulksell.ebay" +
                                info_obj.main_domain +
                                "/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem";
                            chrome.tabs.create({ url: newURL, active: true });
                        });


                    }
                }


                chrome.runtime.sendMessage({type:"dom_elements_parsed", "info_obj":temp_info_obj});


            });

        });

    }


    chrome.runtime.onMessage.addListener(function(msg, sender) {
        if (msg.type == "signin_attempt") {
            popupSignin(msg);
        } else if (msg.type == "periodic_signin_attempt") {
            backgroundSignin();
        } else if (msg.type=="debug_action"){

            msg.info_obj.tab_id = sender.tab.id;
            msg.info_obj.frameId=sender.frameId;
            info_obj=msg.info_obj;
            debugAction(info_obj);

        }else if (msg.type == "create_listing") {

                chrome.storage.local.get(function(resp) {
                    if (resp['redirect_ebay']){
                        chrome.storage.local.set({"auto_listing":true},function(){
                            var newURL =
                                "http://bulksell.ebay" +
                                resp.main_domain +
                                "/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem";
                            chrome.tabs.create({ url: newURL, active: true });
                        });



                    }


                });

        } else if (msg.type=="new_listing"){

            sendListingInfo(msg.info_obj);

        }else if (msg.type=="extract_compat_vehicles"){
            var ebay_item_id = msg.ebay_item_id;
            extractAjaxCompatVehicles(ebay_item_id,"",0);

        } else if (msg.type=="activate_dom_selector"){

            chrome.tabs.query(
                { active : true },
                function(tabArray){
                    chrome.tabs.sendMessage(tabArray[0].id, { type: "activate_dom_selector", "info_obj":msg.info_obj });
                }
            );

        } else if (msg.type == "parse_listing") {

            msg.info_obj.sender=sender;
            msg.info_obj.tab_id = sender.tab.id;
            msg.info_obj.frameId=sender.frameId;
            parseListing(msg.info_obj);

        } else if (msg.type == "update_listing_cache"){

            var info_obj=msg.info_obj;

            if (typeof info_obj.saved_listing.source=='undefined' || info_obj.saved_listing.source==''){
                try{
                    info_obj.saved_listing.source =info_obj.vendor_link.match(/(wwww\.)?(.+)\./)[2].replace("www.","").replace(/https?:\/\//,"");
                } catch(e){
                    info_obj.saved_listing.source="";
                }
            }


            updateListingCache(info_obj);

        } else if (msg.type == "upload_images") {

            if (typeof msg.info_obj!='undefined'){
                var info_obj = msg.info_obj;

            } else {
                var info_obj = msg;
            }

            if (typeof info_obj.btn_clicked=='undefined'){
                info_obj.btn_clicked="normal";
            }

            info_obj.sender = sender;

            uploadImages(info_obj);

            chrome.storage.local.get(['auto_download_images'],function(resp){
                if (resp.auto_download_images==true){
                    directDownloadImages(info_obj);
                }
            })

        } else if (msg.type == "listings_csv_url") {
            var x = new XMLHttpRequest();
            x.onload = function() {
                var result = x.response;
                var arr = new Uint8Array(result);
                var str = String.fromCharCode.apply(String, arr);

                var csv_listings = [];

                var csv_array_semi = $.csv.toArrays(str, { separator: ";" });

                for (var a = 0; a < csv_array_semi.length; a++) {
                    try {

                        /*if (csv_array_semi[a][0].search(/,|;|\|/g)>0){
                            continue;
                        }*/
                        csv_listings.push(csv_array_semi[a]);
                    } catch (e) {
                        console.log(e);
                    }
                }

                try {
                    chrome.runtime.sendMessage(
                        { type: "listings_csv_parsed",parsed_listings:csv_listings },
                        function(response) {
                            console.log(response);
                        }
                    );
                } catch (e) {}

                return true;
            };
            x.open("GET", msg.csvUrl);
            x.responseType = "arraybuffer";
            x.send();
        } else if (msg.type == "open_dash") {
            var dash_link = chrome.extension.getURL("dist/dash.html");
            chrome.tabs.create({ url: dash_link, active: true }, function(tab) {});
        }
    });


    chrome.runtime.onMessage.addListener(function(message, sender) {
        if (message.msg == "fixed_price") {
            chrome.tabs.sendMessage(sender.tab.id, message.msg);
        }
    });

    chrome["runtime"]["onInstalled"]["addListener"](function(param) {
        chrome.runtime.setUninstallURL("https://dropshiplister.com/uninstall", function() {});
    });

    chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            var domain = ".com";
            if (details.url.indexOf(".com.au") != -1) {
                domain = ".com.au";
            } else if (details.url.indexOf(".com") != -1) {
                domain = ".com";
            } else if (details.url.indexOf(".co.uk") != -1) {
                domain = ".co.uk";
            } else if (details.url.indexOf(".de") != -1) {
                domain = ".de";
            } else if (details.url.indexOf(".fr") != -1) {
                domain = ".fr";
            } else if (details.url.indexOf(".ca") != -1) {
                domain = ".ca";
            } else if (details.url.indexOf(".es") != -1) {
                domain = ".es";
            }else if (details.url.indexOf(".it") != -1) {
                domain = ".it";
            }


            if (
                details.method == "GET" &&
                details.url.indexOf("ebay") != -1 &&
                details.url.indexOf("parts_compatibility") != -1
            ) {

                var authorization_set = false;
                var host_set=false;
                var referer_set = false;
                var origin_set = false;
                var xreq_set = false;
                var encoding_set=false;
                var language_set=false;
                var accept_set = false;
                var content_set = false;
                var xebaycorrelation_set = false;
                var xebaymarketplace = false;
                var xebaytracking = false;

                for (var i = 0; i < details.requestHeaders.length; ++i) {

                    if (
                        details.requestHeaders[i].name === "Authorization" ||
                        details.requestHeaders[i].name === "authorization"
                    ) {
                        gl_info_obj.ebay_token=details.requestHeaders[i].value;
                        authorization_set = true;
                    }

                    if (
                        details.requestHeaders[i].name === "X-EBAY-C-CORRELATION-SESSION" ||
                        details.requestHeaders[i].name === "x-ebay-c-correlation-session"
                    ) {
                        gl_info_obj.ebay_xebaycorrelation=details.requestHeaders[i].value;
                        xebaycorrelation_set = true;
                    }
                    if (
                        details.requestHeaders[i].name === "X-EBAY-C-MARKETPLACE-ID" ||
                        details.requestHeaders[i].name === "x-ebay-c-marketplace-id"
                    ) {
                        gl_info_obj.ebay_xebaymarketplace=details.requestHeaders[i].value;
                        xebaymarketplace = true;
                    }
                    if (
                        details.requestHeaders[i].name === "X-EBAY-C-TRACKING" ||
                        details.requestHeaders[i].name === "x-ebay-c-tracking"
                    ) {
                        gl_info_obj.ebay_xebaytracking=details.requestHeaders[i].value;
                        xebaytracking = true;
                    }
                    if (
                        details.requestHeaders[i].name === "Host" ||
                        details.requestHeaders[i].name === "host"
                    ) {
                        details.requestHeaders[i].value = "api.ebay.com";
                        host_set = true;
                    }
                    if (
                        details.requestHeaders[i].name === "Referer" ||
                        details.requestHeaders[i].name === "referer"
                    ) {
                        gl_info_obj.ebay_referer=details.requestHeaders[i].value;
                        //details.requestHeaders[i].value = gl_info_obj.ebay_referer;
                        referer_set = true;
                    }
                    if (
                        details.requestHeaders[i].name === "Origin" ||
                        details.requestHeaders[i].name === "origin"
                    ) {
                        // details.requestHeaders.splice(i, 1);
                        details.requestHeaders[i].value = "https://www.ebay" + domain;
                        origin_set = true;
                    }
                    if (
                        details.requestHeaders[i].name === "X-Requested-With" ||
                        details.requestHeaders[i].name === "x-requested-with"
                    ) {
                        // details.requestHeaders.splice(i, 1);
                        details.requestHeaders[i].value = "XMLHttpRequest";
                        xreq_set = true;
                    }

                    if (
                        details.requestHeaders[i].name === "Accept-Encoding" ||
                        details.requestHeaders[i].name === "accept-encoding"
                    ) {
                        details.requestHeaders[i].value = "gzip, deflate, br";
                        encoding_set = true;
                    }

                    if (
                        details.requestHeaders[i].name === "Accept-Language" ||
                        details.requestHeaders[i].name === "accept-language"
                    ) {
                        details.requestHeaders[i].value = "bg,en;q=0.9,de;q=0.8";
                        language_set = true;
                    }

                    if (
                        details.requestHeaders[i].name === "Accept" ||
                        details.requestHeaders[i].name === "accept"
                    ) {
                        // details.requestHeaders.splice(i, 1);
                        details.requestHeaders[i].value = "application/json";
                        accept_set = true;
                    }
                    if (
                        details.requestHeaders[i].name === "Content-Type" ||
                        details.requestHeaders[i].name === "content-type"
                    ) {
                        // details.requestHeaders.splice(i, 1);
                        details.requestHeaders[i].value = "application/json";
                        content_set = true;
                    }
                }
                if (gl_info_obj.ebay_custom_request){
                    if (!authorization_set) {
                        details.requestHeaders = details.requestHeaders.concat({
                            name: "Authorization",
                            value: gl_info_obj.ebay_token
                        });
                    }
                }
                gl_info_obj.ebay_custom_request=false;

                /*if (!authorization_set) {
                      details.requestHeaders = details.requestHeaders.concat({
                        name: "Authorization",
                        value: gl_info_obj.ebay_token
                      });
                    }


                 if (!host_set) {
                      details.requestHeaders = details.requestHeaders.concat({
                        name: "Host",
                        value: "api.ebay.com"
                      });
                    }

                if (!origin_set) {
                  details.requestHeaders = details.requestHeaders.concat({
                    name: "Origin",
                    value: "https://www.ebay" + domain
                  });
                }
                 */


                if (!xreq_set) {
                    details.requestHeaders = details.requestHeaders.concat({
                        name: "X-Requested-With",
                        value: "XMLHttpRequest"
                    });
                }
                if (!encoding_set) {
                    details.requestHeaders = details.requestHeaders.concat({
                        name: "Accept-Encoding",
                        value: "gzip, deflate, br"
                    });
                }
                if (!language_set) {
                    details.requestHeaders = details.requestHeaders.concat({
                        name: "Accept-Language",
                        value: "bg,en;q=0.9,de;q=0.8"
                    });
                }

                if (!accept_set) {
                    details.requestHeaders = details.requestHeaders.concat({
                        name: "Accept",
                        value: "application/json"
                    });
                }
                if (!content_set) {
                    details.requestHeaders = details.requestHeaders.concat({
                        name: "Content-Type",
                        value: "application/json"
                    });
                }

                if (!xebaycorrelation_set) {
                    details.requestHeaders = details.requestHeaders.concat({
                        name: "X-EBAY-C-CORRELATION-SESSION",
                        value: gl_info_obj.ebay_xebaycorrelation
                    });
                }
                if (!xebaymarketplace) {
                    details.requestHeaders = details.requestHeaders.concat({
                        name: "X-EBAY-C-MARKETPLACE-ID",
                        value: gl_info_obj.ebay_xebaymarketplace
                    });
                }
                if (!xebaytracking) {
                    details.requestHeaders = details.requestHeaders.concat({
                        name: "X-EBAY-C-TRACKING",
                        value: gl_info_obj.ebay_xebaytracking
                    });
                }
            }


            return { requestHeaders: details.requestHeaders };
        },
        { urls: ["<all_urls>"] },
        ["blocking", "requestHeaders"]
    );

})(document, window, jQuery);
