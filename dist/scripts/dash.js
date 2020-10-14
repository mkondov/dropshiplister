(function(document, window, $) {
  "use strict";

  Config.set('assets', 'assets');
  Breakpoints();

  var gl_listings = [];
  var gl_parsed_listings=[];

  var ft_listings = null;

  function initListingsTable() {

    ft_listings = FooTable.init('#listingsTable');

    ft_listings.rows.load([]);
    
    chrome.storage.local.get(function(resp) {

      if (typeof resp.saved_listings=='undefined'){
        resp.saved_listings=[];
      }

      for (var a=0;a<resp.saved_listings.length;a+=1){

        try{


          if (typeof resp.saved_listings[a].source=='undefined'){
            resp.saved_listings[a].source="";
          }
          if (typeof resp.saved_listings[a].title=='undefined'){
            resp.saved_listings[a].title="";
          }
          if (typeof resp.saved_listings[a].summary=='undefined'){
            resp.saved_listings[a].summary="";
          }
          if (typeof resp.saved_listings[a].description=='undefined'){
            resp.saved_listings[a].description="";
          }
          if (typeof resp.saved_listings[a].variations=='undefined'){
            resp.saved_listings[a].variations=JSON.parse("{}");
          }
          if (typeof resp.saved_listings[a].specifics=='undefined'){
            resp.saved_listings[a].specifics=JSON.parse("[]");
          }
          if (typeof resp.saved_listings[a].price=='undefined'){
            resp.saved_listings[a].price="0.00";
          }
          if (typeof resp.saved_listings[a].main_images=='undefined'){
            resp.saved_listings[a].main_images="[]";
          }
          if (typeof resp.saved_listings[a].var_images=='undefined'){
            resp.saved_listings[a].var_images="{}";
          }
          if (typeof resp.saved_listings[a].desc_images=='undefined'){
            resp.saved_listings[a].desc_images="[]";
          }


          var actionCopy = "<button class='btn btn-icon btn-info btn-outline copy-listing' data-json='"
              + escape(JSON.stringify(resp.saved_listings[a]))
              + "'><i class='icon wb-copy' aria-hidden='true'></i></button>";

          try{
            resp.saved_listings[a].main_images=resp.saved_listings[a].main_images;
          } catch(e){
            continue;
          }

          try{
            var image = "<img width='100px' src='"+JSON.parse(resp.saved_listings[a].main_images)[0]+"'></img>";
          } catch(e){
            var image = "<img width='100px' src=''></img>";
          }

          ft_listings.rows.add({
            source: resp.saved_listings[a].source,
            title: "<a target='_blank' href='"+resp.saved_listings[a].vendor_link+"'>"+resp.saved_listings[a].title+"</a>",
            images: "<img width='100px' src='"+JSON.parse(resp.saved_listings[a].main_images)[0]+"'></img>",
            price: resp.saved_listings[a].price,
            summary: resp.saved_listings[a].summary.length + " (Length)",
            variations: Object.keys(resp.saved_listings[a].variations).length + " (Length)",
            specifics: resp.saved_listings[a].specifics.length + " (Length)",
            description: resp.saved_listings[a].description.length + " (Length)",
            time_created: resp.saved_listings[a].time_created,
            action: actionCopy
          });

        } catch(e){
          console.log(e);
        }


      }


    });

    jQuery("input[placeholder='Search']").parent().css("width","70%");
    
  }

  initListingsTable();

  jQuery("button#clear-table-btn").on("click",function (event) {

    chrome.storage.local.set({saved_listings:[]},function(resp) {
      ft_listings.rows.load([]);
    });
  });




  jQuery("#listings-upload-csv-file").fileupload({
    url: "https://dropshiphelper.net/app/csv_upload_listings",
    type: "POST",
    dropZone: null,
    pasteZone: null,
    singleFileUploads: false,
    sequentialUploads: false,
    multipart: true,
    formAcceptCharset: "utf-8",
    limitConcurrentUploads: 9,
    autoUpload: false,
    maxFileSize: 10000000,
    acceptFileTypes: /(\.|\/)(csv)jQuery/i,
    add: function(e, data) {
      var url = URL.createObjectURL(data.files[0]);
      chrome.runtime.sendMessage({ type: "listings_csv_url", csvUrl: url });
    },
    done: function(e, data) {},
    submit: function(e, data) {
      return true;
    },
    fail: function(e, data) {
      console.log(e);
      console.log(data);
    }
  });

  jQuery("button#csv-cancel-btn").on("click",function (event) {
    event.preventDefault();


    jQuery("#csv-column-mapping").hide();
    jQuery("#csv-upload-button").show();
    jQuery("#clear-table-btn").show();
    jQuery("#listingsTable").show();

    jQuery(".column-mapping-selector:first").find(".column-select").html("");
    jQuery(".column-mapping-selector:first").find(".column-example").html("");
    jQuery(".column-mapping-selector").not(jQuery(".column-mapping-selector:first")).remove();


  });
  jQuery("button#csv-import-btn").on("click",function (event) {
    event.preventDefault();

    jQuery("#csv-column-mapping").hide();
    jQuery("#csv-upload-button").show();
    jQuery("#clear-table-btn").show();
    jQuery("#listingsTable").show();
    
    var gl_parsed_listing_data=[];
    var gl_parsed_listing={};
    for (var g=0;g<gl_parsed_listings.length;g+=1){
      if (gl_parsed_listings[g][0].toLowerCase()=='source'){
        continue;
      }
      gl_parsed_listing={};
      for (var s=0;s<jQuery(".column-mapping-selector").length;s+=1){
        var c_index=jQuery(".column-mapping-selector").eq(s).attr("column_index");
        var key_name = jQuery(".column-mapping-selector").eq(s).find(".column-select").val();
        try{
          gl_parsed_listing[key_name]=gl_parsed_listings[g][c_index].trim();
        } catch(e){
          gl_parsed_listing[key_name]="";
        }

      }

      try{
        var specifics = gl_parsed_listing['specifics'].split("|");

        var parsed_specifics=[];
        for (var index in specifics){
          try{
            var left_side = specifics[index].split(":")[0];
            var right_side = specifics[index].split(":")[1];
            parsed_specifics=parsed_specifics.concat({"left_side":left_side,"right_side":right_side});
          } catch(e){

          }

        }

        gl_parsed_listing['specifics']=specifics;
      } catch(e){
        gl_parsed_listing['specifics']=[];
      }

      try{
        var main_images = gl_parsed_listing['main_images'].split("|");
        gl_parsed_listing['main_images']=JSON.stringify(main_images);
      } catch(e){
        gl_parsed_listing['main_images']=JSON.stringify("[]");
      }

      try{
        var desc_images = gl_parsed_listing['desc_images'].split("|");
        gl_parsed_listing['desc_images']=JSON.stringify(desc_images);
      } catch(e){
        gl_parsed_listing['desc_images']=JSON.stringify("[]");
      }

      try{
        var parsed_variations = {};
        var regex = /\w+:\[([^\]]+)\]/g;
        var string = gl_parsed_listing['variations'];
        var matches = string.matchAll(regex);
        for (const match of matches) {
          console.log(match);
          var main_title = match[0].split(":")[0]; // Color
          parsed_variations[main_title]=[];
          var inner_values = match[0].match(/\[([^\]]+)\]/)[1].split(",");
          parsed_variations[main_title]=inner_values;

        }

        gl_parsed_listing['variations']=parsed_variations;
      } catch(e){
        gl_parsed_listing['variations']={};
      }

      try{
        var parsed_var_images = {};
        regex = /(\w|\s)+:\[(\w+:{[^}]+},?)+[^\]]+\]/g;
        string = gl_parsed_listing['var_images'];
        matches = string.matchAll(regex);
        for (const match of matches) {
          console.log(match);
          var main_title = match[0].split(":")[0]; // Color
          parsed_var_images[main_title]={};
          var inner_values =  match[0].matchAll(/((\w|\s)+:{[^}]+},?)/g);
          for (const value of inner_values) {
            var var_title=value.toString().split(":")[0]; // Red
            var var_src = value.toString().match(/(\w|\s)+:{([^\}]+)}/)[2]; // {}
            var_src=var_src.split(",");
            parsed_var_images[main_title][var_title]=[];
            for (var s in var_src){
              parsed_var_images[main_title][var_title]=parsed_var_images[main_title][var_title].concat(var_src[s]);
            }

          }
        }

        gl_parsed_listing['var_images']=JSON.stringify(parsed_var_images);
      } catch(e){
        gl_parsed_listing['var_images']=JSON.stringify("{}");
      }


      gl_parsed_listing_data=gl_parsed_listing_data.concat(gl_parsed_listing);
    }


    chrome.storage.local.get(function(resp) {

      if (typeof resp.saved_listings=='undefined'){
        resp.saved_listings=[];
      }

      var new_listings=[];
     // resp.saved_listings=resp.saved_listings.concat(gl_parsed_listing_data);

      for (var parsed_listing in gl_parsed_listing_data){


        if (typeof gl_parsed_listing_data[parsed_listing].source=='undefined'){
          gl_parsed_listing_data[parsed_listing].source="";
        }
        if (typeof gl_parsed_listing_data[parsed_listing].title=='undefined'){
          gl_parsed_listing_data[parsed_listing].title="";
        }
        if (typeof gl_parsed_listing_data[parsed_listing].summary=='undefined'){
          gl_parsed_listing_data[parsed_listing].summary="";
        }
        if (typeof gl_parsed_listing_data[parsed_listing].description=='undefined'){
          gl_parsed_listing_data[parsed_listing].description="";
        }
        if (typeof gl_parsed_listing_data[parsed_listing].variations=='undefined'){
          gl_parsed_listing_data[parsed_listing].variations=JSON.parse("{}");
        }

        if (typeof gl_parsed_listing_data[parsed_listing].specifics=='undefined'){
          gl_parsed_listing_data[parsed_listing].specifics=JSON.parse("[]");
        }
        if (typeof gl_parsed_listing_data[parsed_listing].price=='undefined'){
          gl_parsed_listing_data[parsed_listing].price="0.00";
        }
        if (typeof gl_parsed_listing_data[parsed_listing].main_images=='undefined'){
          gl_parsed_listing_data[parsed_listing].main_images="[]";
        }

        if (typeof gl_parsed_listing_data[parsed_listing].var_images=='undefined'){
          gl_parsed_listing_data[parsed_listing].var_images="{}";
        }
        if (typeof gl_parsed_listing_data[parsed_listing].desc_images=='undefined'){
          gl_parsed_listing_data[parsed_listing].desc_images="[]";
        }

        if (typeof gl_parsed_listing_data[parsed_listing].time_created=='undefined'){
          gl_parsed_listing_data[parsed_listing].time_created=new Date().toISOString();
        }


        var exists=false;
        for (var c=0;c<resp.saved_listings.length;c+=1){


          if (gl_parsed_listing_data[parsed_listing].title.toLowerCase().replace(/\s+/,"") == resp.saved_listings[c].title.toLowerCase().replace(/\s+/,"")){
            exists=true;
            for (var key in gl_parsed_listing_data[parsed_listing]){
              if (typeof resp.saved_listings[c][key]=='undefined'){
                resp.saved_listings[c][key]=gl_parsed_listing_data[parsed_listing][key];
              } else if (typeof gl_parsed_listing_data[parsed_listing][key]!='undefined') {
                resp.saved_listings[c][key]=gl_parsed_listing_data[parsed_listing][key];
              }
            }
          }
        }

        if (!exists){
          //resp.saved_listings=resp.saved_listings.concat(gl_parsed_listing_data[parsed_listing]);
          new_listings=new_listings.concat(gl_parsed_listing_data[parsed_listing]);
        }

      }

      var temp_saved_listings=resp.saved_listings.concat(new_listings);

      chrome.storage.local.set({saved_listings:temp_saved_listings},function() {

        gl_parsed_listings=[];

        resp={};
        resp.saved_listings=temp_saved_listings;

        for (var a=0;a<resp.saved_listings.length;a+=1) {

          try{

            if (typeof resp.saved_listings[a].source=='undefined'){
              resp.saved_listings[a].source="";
            }
            if (typeof resp.saved_listings[a].title=='undefined'){
              resp.saved_listings[a].title="";
            }
            if (typeof resp.saved_listings[a].summary=='undefined'){
              resp.saved_listings[a].summary="";
            }
            if (typeof resp.saved_listings[a].description=='undefined'){
              resp.saved_listings[a].description="";
            }
            if (typeof resp.saved_listings[a].variations=='undefined'){
              resp.saved_listings[a].variations=JSON.parse("{}");
            }
            if (typeof resp.saved_listings[a].specifics=='undefined'){
              resp.saved_listings[a].specifics=JSON.parse("[]");
            }
            if (typeof resp.saved_listings[a].price=='undefined'){
              resp.saved_listings[a].price="0.00";
            }
            if (typeof resp.saved_listings[a].main_images=='undefined'){
              resp.saved_listings[a].main_images="[]";
            }
            if (typeof resp.saved_listings[a].var_images=='undefined'){
              resp.saved_listings[a].var_images="{}";
            }
            if (typeof resp.saved_listings[a].desc_images=='undefined'){
              resp.saved_listings[a].desc_images=JSON.parse("[]");
            }

            if (typeof resp.saved_listings[a].time_created=='undefined'){
              resp.saved_listings[a].time_created=new Date().toISOString();
            }

            var actionCopy = "<button class='btn btn-icon btn-info btn-outline copy-listing' data-json='"
                + escape(JSON.stringify(resp.saved_listings[a]))
                + "'><i class='icon wb-copy' aria-hidden='true'></i></button>";


            ft_listings.rows.add({
              source:resp.saved_listings[a].source,
              title: "<a target='_blank' href='"+resp.saved_listings[a].vendor_link+"'>"+resp.saved_listings[a].title+"</a>",
              images: "<img width='150px' src='"+JSON.parse(resp.saved_listings[a].main_images)[0]+"'></img>",
              price: resp.saved_listings[a].price,
              summary: resp.saved_listings[a].summary.length+" (Length)",
              variations: Object.keys(resp.saved_listings[a].variations).length+" (Length)",
              specifics: resp.saved_listings[a].specifics.length+" (Length)",
              description: resp.saved_listings[a].description.length+" (Length)",
              time_created: resp.saved_listings[a].time_created,
              action: actionCopy
            });
          } catch(e){
            console.log(e);
          }

        }




      });

    });

  });

  jQuery("button#csv-export-btn").on("click",function (event) {
    event.preventDefault();


    chrome.storage.local.get(function(resp) {


      if (typeof resp.saved_listings=='undefined'){
        resp.saved_listings=[];
      }

      var content = "Source;Title;Price;Main Images;Description Images;Variation Images;Variations;Specifics;Product URL;Copied On"+"\r\n";

      for (var a=0;a<resp.saved_listings.length;a+=1){

        var csv_row=[];
        try{
          csv_row=csv_row.concat(resp.saved_listings[a]['source'].replace(/;/gi,"."));
        } catch(e){
          csv_row=csv_row.concat("");
        }
        
        try{
          csv_row=csv_row.concat(resp.saved_listings[a]['title'].replace(/;/gi,"."));
        } catch(e){
          csv_row=csv_row.concat("");
        }

        try{
          csv_row=csv_row.concat(resp.saved_listings[a]['price'].replace(/;/gi,"."));
        } catch(e){
          csv_row=csv_row.concat("");
        }
        
        try{
          csv_row=csv_row.concat(JSON.parse(resp.saved_listings[a]['main_images']).join("|").replace(/;/gi,"."));
        } catch(e){
          csv_row=csv_row.concat("");
        }
        
        try{
          csv_row=csv_row.concat(JSON.parse(resp.saved_listings[a]['desc_images']).join("|").replace(/;/gi,"."));
        } catch(e){
          csv_row=csv_row.concat("");
        }
        

        var var_images = JSON.parse(resp['var_images']);

        var var_images_array=[];
        var variation_values = [];
        for (var title in var_images){
          for (var vv=0;vv<var_images[title].length;vv+=1){
            for (var key in var_images[title][vv]){
              try{
                var label = key;
                try{
                  var values = var_images[title][vv][key].join(",");
                } catch(e){
                  var values = var_images[title][vv][key];
                }

                variation_values=variation_values.concat(label+":"+"{"+values.replace(/;/gi,".")+"}");
              } catch(e){

              }

            }
          }


          var_images_array=var_images_array.concat(title+":"+"["+variation_values.concat(",")+"]");
        }
        var_images=var_images_array.join("|");
        
        try{
          csv_row=csv_row.concat(var_images.replace(/;/gi,"."));
        } catch(e){
          csv_row=csv_row.concat("");
        }

        //csv_row=csv_row.concat(var_images);

        var variations = [];
        for (var key in resp['variations']){
          try{
            var label = key;
            var values = resp['variations'][key].join(",");
            variations=variations.concat(label+":"+"["+values.replace(/;/gi,".")+"]");
          } catch(e){

          }

        }
        variations = variations.join("|");
         
        try{
          csv_row=csv_row.concat(variations.replace(/;/gi,"."));
        } catch(e){
          csv_row=csv_row.concat("");
        }
       
        
        
        //csv_row=csv_row.concat(variations.join("|"));

        var specifics = resp['specifics'];

        var specifics_array=[];
        for (var s=0;s<specifics.length;s+=1){
          specifics_array=specifics_array.concat(specifics[s]['left_side']+":"+specifics[s]['right_side']);
        }
        specifics=specifics_array.join("|");
        
        try{
          csv_row=csv_row.concat(specifics.replace(/;/gi,"."));
        } catch(e){
          csv_row=csv_row.concat("");
        }

        //csv_row=csv_row.concat(specifics.replace(/;/gi,"."));
        //csv_row=csv_row.concat(jQuery("<span>"+resp['summary']+"</span>").text().trim().replace(/;/gi,"."));
        //csv_row=csv_row.concat(jQuery("<span>"+resp['description']+"</span>").text().trim().replace(/;/gi,"."));
        
        try{
          csv_row=csv_row.concat(resp.saved_listings[a]['vendor_link'].replace(/;/gi,"."));
        } catch(e){
          csv_row=csv_row.concat("");
        }

        try{
          csv_row=csv_row.concat(resp.saved_listings[a]['time_created'].replace(/;/gi,"."));
        } catch(e){
          csv_row=csv_row.concat("");
        }
        
        //csv_row=csv_row.concat(resp['vendor_link'].replace(/;/gi,"."));

        content+=csv_row.join(";");
        content+="\n";

      }

      // any kind of extension (.txt,.cpp,.cs,.bat)
      var filename = "listings.csv";

      var blob = new Blob([content], {
        type: "text/csv;charset=utf-8"
      });

      saveAs(blob, filename);


    });

  });
  function initListingButtons(){
    jQuery("button.copy-listing").off();
    jQuery("button.copy-listing").on("click", function(event) {
      event.preventDefault();
      var that = this;
      chrome.storage.local.get(function(resp){
      //var id = jQuery(this).attr("data-id");
      var listingJson = jQuery(that).attr("data-json");


      var listing = JSON.parse(unescape(listingJson));

       for (var key in listing) {
          resp[key]=listing[key];
       }


      chrome.storage.local.set(listing,
          function() {}
      );

      chrome.runtime.sendMessage(
          {
            type: "upload_images",
            title: listing.title,
            main_images: listing.main_images,
            var_images: listing.var_images,
            desc_images: listing.desc_images
          },
          function() {

            chrome.runtime.sendMessage({
              type: "create_listing"
            });
          }
      );
      jQuery(that).notify("Copied!", {
        className: "success",
        position: "top center"
      });

      });
    });
  }
  setInterval(initListingButtons,3000);



  function periodicStatusCheck() {
    chrome.storage.local.get(function(resp) {
      if (typeof resp["status"] != "undefined" && (resp["status"] == 1 || resp["status"] == 2)) {
        login();
      } else {
        
        if (resp["status"] == 6) {
  		   logout();
            var content =
              '<div class="example">\n' +
              '                    <blockquote class="blockquote blockquote-warning">\n' +
              "                       <p style=\"font-size: 20px;\">You haven't subscribed. Go to the <a  target='_blank' href='https://dropshiplister.com/#pricing'>HERE</a> to subscribe.</p>\n" +
              "                    </blockquote>\n" +
              "                </div>";

            jQuery("span#accountInfo").html(content);
          } else if (resp["status"] == 5) {
          	 logout();
            var content =
              '<div class="example">\n' +
              '                    <blockquote class="blockquote blockquote-warning">\n' +
              "                       <p style=\"font-size: 20px;\">Your trial has expired. Go to the <a  target='_blank' href='https://dropshiplister.com/my-account'>Dashboard</a> for more info.</p>\n" +
              "                    </blockquote>\n" +
              "                </div>";
            jQuery("span#accountInfo").html(content);
          } else if (resp["status"] == 4) {
            logout();
            var content =
              '<div class="example">\n' +
              '                    <blockquote class="blockquote blockquote-warning">\n' +
              "                       <p style=\"font-size: 20px;\">Your subscription has been cancelled. Your results will be limited to 10 shirts. Go to the <a  target='_blank' href='https://dropshiplister.com/my-account'>Dashboard</a> for more info.</p>\n" +
              "                    </blockquote>\n" +
              "                </div>";

            jQuery("span#accountInfo").html(content);
          } else if (resp["status"] == 2) {
            logout();
            var content =
              '<div class="example">\n' +
              '                    <blockquote class="blockquote blockquote-warning">\n' +
              "                       <p style=\"font-size: 20px;\">Your subscription is on hold. Go to the <a  target='_blank' href='https://dropshiplister.com/my-account'>Dashboard</a> for more info.</p>\n" +
              "                    </blockquote>\n" +
              "                </div>";

            jQuery("span#accountInfo").html(content);
          } else {
            logout();
            var content =
              '<div class="example">\n' +
              '                    <blockquote class="blockquote blockquote-warning">\n' +
              '                       <p style="font-size: 20px;">You need to be logged into <a target="_blank" href="https://dropshiplister.com">dropshiplister.com</a></p>\n' +
              "                    </blockquote>\n" +
              "                </div>";
            jQuery("span#accountInfo").html(content);
          }
      }
    });
  }

  function login() {
    $("#pageAuth").hide();
    $("#pageDashboard").show();
  }

  function logout() {
    $("#pageAuth").show();
    $("#pageDashboard").hide();
  }

  chrome.runtime.onMessage.addListener(function(msg) {
    if (msg.type == "signed_in") {
      login();
    } else if (msg.type == "signed_out") {
      logout();
    } else if (msg.type == "listings_csv_parsed") {

      var info_obj=msg;
      gl_parsed_listings=info_obj.parsed_listings;

      jQuery("#csv-column-mapping").show();
      jQuery("#csv-upload-button").hide();
      jQuery("#clear-table-btn").hide();
      jQuery("#listingsTable").hide();


      jQuery(".column-mapping-selector").last().find(".column-select").find("option").remove();


      jQuery(".column-mapping-selector:first").find(".column-select").html("");
      jQuery(".column-mapping-selector:first").find(".column-example").html("");
      jQuery(".column-mapping-selector").not(jQuery(".column-mapping-selector:first")).remove();


      var selector_html = jQuery(".column-mapping-selector").eq(0)[0].outerHTML;

      var mapped_columns=[];
      var total_columns=['Source','Title','Main Images','Description Images','Variation Images','Variations','Specifics','Price','Product URL','Copied On'];

      for (var i=0;i<info_obj.parsed_listings[0].length;i+=1){

        var options="";
        options+="<option class='column-option' value='ignore'>Ignore</option>";
        for (var t=0;t<total_columns.length;t+=1){
          var already_mapped=false;
          for (var m=0;m<mapped_columns.length;m+=1){
            if (mapped_columns[m]==total_columns[t]){
              already_mapped=true;
            }
          }
          if (!already_mapped){
          
        	  if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='source'){
                  var column_value = "source";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='name'){
                  var column_value = "name";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='title'){
                  var column_value = "title";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='mainimages'){
                  var column_value = "main_images";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='descriptionimages'){
                  var column_value = "desc_images";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='variationimages'){
                  var column_value = "var_images";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='variations'){
                  var column_value = "variations";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='specifics'){
                  var column_value = "specifics";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='producturl'){
                  var column_value = "vendor_link";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='copiedon'){
                  var column_value = "time_created";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='price'){
                  var column_value = "price";
                }
                if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='timecreated'){
                  var column_value = "time_created";
                }
          
            options += "<option class='column-option' value='"+column_value+"'>"+total_columns[t]+"</option>";
          }

        }

        if (i!=0){
          jQuery(".column-mapping-selector").last().after(selector_html);
        }


        //select.html(options);
        jQuery(".column-mapping-selector").last().find(".column-select").html(options);
        jQuery(".column-mapping-selector").last().find(".column-example").html(info_obj.parsed_listings[0][i]);
        jQuery(".column-mapping-selector").last().attr("column_index",i);
        jQuery(".column-mapping-selector").last().show();

      }

      for (var i=0;i<info_obj.parsed_listings[0].length;i+=1){

        var examples = jQuery(".column-example");

        for (var t=0;t<total_columns.length;t+=1){
          for (var e=0;e<examples.length;e+=1){
            if (examples[e].textContent.toLowerCase().replace(/\s+/g,"")==total_columns[t].toLowerCase().replace(/\s+/g,"")){
              
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='source'){
                var option_value = "source";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='name'){
                var option_value = "name";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='title'){
                var option_value = "title";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='mainimages'){
                var option_value = "main_images";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='descriptionimages'){
                var option_value = "desc_images";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='variationimages'){
                var option_value = "var_images";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='variations'){
                var option_value = "variations";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='specifics'){
                var option_value = "specifics";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='producturl'){
                var option_value = "vendor_link";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='copiedon'){
                var option_value = "time_created";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='price'){
                var option_value = "price";
              }
              if (total_columns[t].toLowerCase().replace(/\s|\/|_|\-/gi,"")=='timecreated'){
                var option_value = "time_created";
              }
              
              jQuery(examples[e]).parent().parent().find(".column-select").eq(0).val(option_value);
            }
          }

        }

      }

    }
  });

  function periodicLoginCheck() {
    chrome.runtime.sendMessage({ type: "dash.periodicLoginCheck" });
  }

  var LOGGED_IN = false;
  $.ajaxSetup({ cache: false });

  var gl_domain = false;

  chrome.storage.local.get(function(resp) {
    if (typeof resp.settings == "undefined") {
      resp.settings = {};
    }
    if (typeof resp.main_domain == "undefined") {
      resp.main_domain = ".com";
    }
    if (typeof resp.codes == "undefined") {
      resp.codes = [];
    }

    gl_domain = resp.main_domain;

    chrome.storage.local.set(resp, function() {
      setInterval(periodicStatusCheck, 500);
      setInterval(periodicLoginCheck, 1000 * 60 * 60 * 1);
      periodicStatusCheck();
      periodicLoginCheck();
      initListingsTable();
    });
  });
})(document, window, jQuery);
