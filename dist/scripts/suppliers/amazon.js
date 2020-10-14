
function copyAmazon() {
    jQuery("#amazonCopy").val("Working...");
    //document.getElementsByTagName("head")[0].appendChild(script);

    var main_img_src = [];

    var all_imgs = jQuery("#imageBlock").find("img");

    for (var r = 0; r < all_imgs.length; r += 1) {
      var current_img_src = all_imgs.eq(r).attr("src");
      try {
        if (current_img_src.split(/(I|G)\//g)[2].indexOf("/") != -1) {
          continue;
        }
      } catch (e) {
        continue;
      }

      try {
        //current_img_src = current_img_src.replace(
       //   /(?<bullshit>\._[^(jpg|png|jpeg)]+_)\.(?<extension>(jpg|png|jpeg))$/g,
        //  ".$2"
       // );
        
    	  current_img_src = current_img_src.replace(
                /(?<bullshit>\._[^(jpg|png|jpeg)]+_)\.(?<extension>(jpg|png|jpeg))$/g,
                "\._UL1500_.$2"
              );
      } catch (e) {
        continue;
      }

      main_img_src = main_img_src.concat(current_img_src);
    }
    
    try {
      //var gallery_html = jQuery("div#imageBlock_feature_div").html();
      //var main_imgs = gallery_html.match(/http.+?ssl\-images\-amazon\.com\/images\/I\/.+\.jpg/g);
      var main_imgs = jQuery("script:contains('_SL1500_')")
        .html()
        .match(/http[^jS]+?ssl\-images\-amazon[^\/]+\/images\/I\/[^",]+_SL1500_\.jpg/g);
      for (var i = 0; i < main_imgs.length; i++) {
        //var main_src = main_imgs[i].replace(/_S.+_.jpg/,"_SL1500_.jpg");
        var main_src = main_imgs[i];
        main_img_src = main_img_src.concat(main_src);
      }
    } catch (e) {
      //console.log(e);
    }

    try {
      var main_imgs = jQuery("div#imageBlockThumbs").find("img");
      for (var i = 0; i < main_imgs.length; i++) {
        try {
          var main_src = jQuery(main_imgs[i]).attr("src");
          if (main_src.indexOf(".png") != -1) {
            main_src = main_src.split("._")[0] + ".png";
          } else if (main_src.indexOf(".jpg") != -1) {
            main_src = main_src.split("._")[0] + ".jpg";
          }
          main_img_src = main_img_src.concat(main_src);
        } catch (e) {}
      }
    } catch (e) {}
    try {
      var main_imgs = jQuery("#imgTagWrapperId")
        .html()
        .match(/http[^"\s']+?amazon[^\/]+\/images\/I\/[^\s]+\.(jpg|png)/g);
      for (var i = 0; i < main_imgs.length; i++) {
        if (main_imgs[i].indexOf(".png") != -1) {
          var main_src = main_imgs[i].split(".png")[0] + ".png";
        } else if (main_imgs[i].indexOf(".jpg") != -1) {
          var main_src = main_imgs[i].split(".jpg")[0] + ".jpg";
        }

        if (main_src.toLowerCase().indexOf("data-src") != -1) {
          continue;
        }

        main_img_src = main_img_src.concat(
          main_src.replace(/\._[^_\.]+_.jp/, ".jp").replace(/\._[^_\.]+_.png/, ".png")
        );
      }
    } catch (e) {}

    try {
      //var gallery_html = jQuery("div#imageBlock_feature_div").html();
      //var main_imgs = gallery_html.match(/http.+?ssl\-images\-amazon\.com\/images\/I\/.+\.jpg/g);
      var main_imgs = jQuery("script:contains('_UL1500_')")
        .html()
        .match(/http[^jS]+?ssl\-images\-amazon[^\/]+\/images\/I\/[^",]+_UL1500_\.(jpg|png)/g);
      for (var i = 0; i < main_imgs.length; i++) {
        //var main_src = main_imgs[i].replace(/_S.+_.jpg/,"_SL1500_.jpg");
        var main_src = main_imgs[i];
        main_img_src = main_img_src.concat(main_src);
      }
    } catch (e) {}
    /*try{
                  var main_imgs = jQuery("img[data-old-hires]");
                  for (var i=0;i<main_imgs.length;i++){
                      try{
                      var main_src = jQuery(main_imgs[i]).attr("data-old-hires");
                      main_img_src =main_img_src.concat(main_src);
                      } catch (e){

                      }
                  }
                  } catch(e){
                      console.log(e);
                  }*/

    try {
      var large_imgs = jQuery("body")
        .html()
        .match(/"large":"http.+?ssl\-images\-amazon[^\/]+\/images\/I\/[^"]+\.(jpg|png)/g);
      var main_imgs = large_imgs;
      //	var main_imgs = jQuery("script:contains('_SL1500_')").html().match(/http[^jS]+?ssl\-images\-amazon\.com\/images\/I\/[^",]+_SL1500_\.jpg/g);
      for (var i = 0; i < main_imgs.length; i++) {
        //var main_src = main_imgs[i].replace(/_S.+_.jpg/,"_SL1500_.jpg");
        var main_src = main_imgs[i].replace('"large":"', "");
        main_img_src = main_img_src.concat(main_src);
      }
    } catch (e) {
      //console.log(e);
    }

    try {
      var main_imgs = jQuery("div#imageBlockThumbs").find("img");
      for (var i = 0; i < main_imgs.length; i++) {
        try {
          var main_src = jQuery(main_imgs[i]).attr("src");
          if (main_src.indexOf(".png") != -1) {
            main_src = main_src.split("._")[0] + ".png";
          } else if (main_src.indexOf(".jpg") != -1) {
            main_src = main_src.split("._")[0] + ".jpg";
          }
          main_img_src = main_img_src.concat(main_src);
        } catch (e) {}
      }
    } catch (e) {}

    try {
      var main_imgs = jQuery("div#centerCol").find("img");
      for (var i = 0; i < main_imgs.length; i++) {
        try {
          var main_src = jQuery(main_imgs[i]).attr("src");
          if (main_src.indexOf(".png") != -1) {
            main_src = main_src.split("._")[0] + ".png";
          } else if (main_src.indexOf(".jpg") != -1) {
            main_src = main_src.split("._")[0] + ".jpg";
          }

          main_img_src = main_img_src.concat(main_src);
        } catch (e) {}
      }
    } catch (e) {}

    try {
      var main_imgs = jQuery("div#centerCol").find("img");
      for (var i = 0; i < main_imgs.length; i++) {
        try {
          var main_src = jQuery(main_imgs[i]).attr("src");
          if (main_src.indexOf(".png") != -1) {
            main_src = main_src.split("._")[0] + ".png";
          } else if (main_src.indexOf(".jpg") != -1) {
            main_src = main_src.split("._")[0] + ".jpg";
          }
          main_img_src = main_img_src.concat(main_src);
        } catch (e) {}
      }
    } catch (e) {}
    try {
      var main_imgs = jQuery("#centerCol")
        .html()
        .match(/http[^"\s']+?amazon[^\/]+\/images\/I\/[^\s]+\.(jpg|png)/g);
      for (var i = 0; i < main_imgs.length; i++) {
        if (main_imgs[i].indexOf(".png") != -1) {
          var main_src = main_imgs[i].split(".png")[0] + ".png";
        } else if (main_imgs[i].indexOf(".jpg") != -1) {
          var main_src = main_imgs[i].split(".jpg")[0] + ".jpg";
        }

        if (main_src.toLowerCase().indexOf("data-src") != -1) {
          continue;
        }

        main_img_src = main_img_src.concat(
          main_src.replace(/\._[^_\.]+_.jp/, ".jp").replace(/\._[^_\.]+_.png/, ".png")
        );
      }
    } catch (e) {}

    var unique_images = [];
    for (var i = 0; i < main_img_src.length; i++) {
      var unique_img = main_img_src[i];
      var has_it = false;
      for (var i2 = 0; i2 < unique_images.length; i2++) {
        if (unique_images[i2] == unique_img) {
          has_it = true;
        }
      }
      if (has_it == false) {
        unique_images.push(unique_img);
      }
    }

    var json_main_images = JSON.stringify(unique_images);

    var all_dpx_desc_images_src = [];
    if (jQuery("#dpx-aplus-product-description_feature_div").length) {
      var all_dpx_desc_images = jQuery("#dpx-aplus-product-description_feature_div").find("img");
      var all_dpx_desc_images_src = [];
      for (var i = 0; i < all_dpx_desc_images.length; i++) {
        all_dpx_desc_images_src = all_dpx_desc_images_src.concat(all_dpx_desc_images[i].src);
      }
    }
    var json_dpx_desc_images = JSON.stringify(all_dpx_desc_images_src);

    var all_desc_images_src = [];
    if (jQuery("#productDescription_feature_div").length) {
      var all_desc_images = jQuery("#productDescription_feature_div").find("img");
      for (var i = 0; i < all_desc_images.length; i++) {
        all_desc_images_src = all_desc_images_src.concat(all_desc_images[i].src);
      }
    }
    var json_desc_images = JSON.stringify(all_desc_images_src);

    var json_all_desc_images = JSON.stringify(all_desc_images_src.concat(all_dpx_desc_images_src));

    var desc_html = "";
    if (jQuery("#dpx-aplus-product-description_feature_div").length) {
      try {
        desc_html += jQuery("#dpx-aplus-product-description_feature_div").html();
      } catch (e) {}
    }  if (jQuery("#aplus_feature_div").length) {
      try {
        desc_html += jQuery("#aplus_feature_div").html();
      } catch (e) {}
    } if (jQuery("#aplus").length) {
      try {
        desc_html += jQuery("#aplus").html();
      } catch (e) {}
    } if (jQuery("[id^='aplus']").length) {
      try {
        desc_html += jQuery("[id^='aplus']").html();
      } catch (e) {}
    }  if (jQuery("[id$='_feature_div']").length) {
        try {
            desc_html += jQuery("[id$='_feature_div']").html();
          } catch (e) {}
    } if (jQuery("#descriptionAndDetails").length) {
        try {
            desc_html += jQuery("#descriptionAndDetails").html();
          } catch (e) {}
    }
    
    else {
      try {
        if (jQuery("#bookDesc_iframe").length) {
          desc_html += jQuery("#bookDesc_iframe")
            .contents()
            .find("#iframeContent")
            .html();
        }
      } catch (e) {}

      try {
        if (jQuery("#detail-bullets").length) {
          desc_html += jQuery("#detail-bullets").html();
        }
      } catch (e) {}
      try {
        if (jQuery("#featurebullets_feature_div").length) {
          desc_html += jQuery("#featurebullets_feature_div").html();
        }
      } catch (e) {}

      try {
        if (jQuery("#productDescription_feature_div").length) {
          desc_html += jQuery("#productDescription_feature_div").html();
        }
      } catch (e) {}
    }

    //desc_html.replace(/(<script.|\s*script>)/gmi,"");
    //desc_html = desc_html.replace(/<script[\s\S]+script>/gim, "");

    desc_html = desc_html.replace(/<script[^>]+>[^>]+script>/gim, "");

    //desc_html = desc_html.replace(/<style[\s\S]+style>/gim, "");

    var title = "";
    if (jQuery("#ebooksProductTitle").length) {
      var title = jQuery("#ebooksProductTitle")
        .text()
        .trim();
    }
    if (jQuery("h1.product-name").length) {
      var title = jQuery("h1.product-name")
        .text()
        .trim();
    }
    if (jQuery("#productTitle").length) {
      var title = jQuery("#productTitle")
        .text()
        .trim();
    }

    var weight = "";
    var dimension = "";
    var pck_width_in = "";
    var pck_weight_lb = "";
    var pck_length_in = "";
    var pck_height_in = "";
    var item_specifics_array = [];
    if (jQuery("table#productDetailsTable").length) {
      var li_specifications = jQuery("table#productDetailsTable")
        .find("ul")
        .not(".zg_hrsr")
        .find("li");
      for (var s = 0; s < li_specifications.length; s++) {
        try {
          var left_side = jQuery(li_specifications[s])
            .find("b")
            .text()
            .trim();
          var right_side = jQuery(li_specifications[s])
            .text()
            .split(":")[1]
            .trim();

          if (left_side.toLowerCase().indexOf("this fits") != -1) {
            continue;
          }

          item_specifics_array = item_specifics_array.concat([
            {
              left_side: left_side,
              right_side: right_side
            }
          ]);

          try {
            if (left_side.indexOf("Shipping Weight") != -1) {
              weight = right_side.replace(/\(.+\)/, "").trim();
              if (weight.indexOf("pounds") != -1) {
                pck_weight_lb = weight.match(/[0-9]*[.]?[0-9]+/)[0];
              } else if (weight.indexOf("ounces") != -1) {
                pck_weight_lb = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]) * 0.06;
              }
            } else if (left_side.indexOf("Item Weight") != -1) {
              weight = right_side.replace(/\(.+\)/, "").trim();
              if (weight.indexOf("pounds") != -1) {
                pck_weight_lb = weight.match(/[0-9]*[.]?[0-9]+/)[0];
              } else if (weight.indexOf("ounces") != -1) {
                pck_weight_lb = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]) * 0.06;
              }
            }
          } catch (e) {}

          try {
            if (left_side.indexOf("Product Dimensions") != -1) {
              dimension = right_side;
              var dim_text = dimension
                .trim()
                .match(
                  /([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)/g
                )[0];
              pck_width_in = dim_text
                .split("x")[0]
                .trim()
                .match(/[0-9]*[.]?[0-9]+/)[0];
              pck_length_in = dim_text
                .split("x")[1]
                .trim()
                .match(/[0-9]*[.]?[0-9]+/)[0];
              pck_height_in = dim_text
                .split("x")[2]
                .trim()
                .match(/[0-9]*[.]?[0-9]+/)[0];
            }
          } catch (e) {}
        } catch (e) {
          console.log(e);
        }
      }
    }

    if (jQuery("#detail_bullets_id").length) {
      try {
        var li_specifications = jQuery("#detail_bullets_id")
          .find("ul")
          .not(".zg_hrsr")
          .find("li");
        for (var s = 0; s < li_specifications.length; s++) {
          try {
            var left_side = jQuery(li_specifications[s])
              .find("b")
              .text()
              .trim();
            var right_side = jQuery(li_specifications[s])
              .text()
              .split(":")[1]
              .trim();

            if (left_side.toLowerCase().indexOf("this fits") != -1) {
              continue;
            }
            item_specifics_array = item_specifics_array.concat([
              {
                left_side: left_side,
                right_side: right_side
              }
            ]);

            try {
              if (left_side.indexOf("Shipping Weight") != -1) {
                weight = right_side.replace(/\(.+\)/, "").trim();
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/[0-9]*[.]?[0-9]+/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]) * 0.06;
                }
              } else if (left_side.indexOf("Item Weight") != -1) {
                weight = right_side.replace(/\(.+\)/, "").trim();
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/[0-9]*[.]?[0-9]+/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]) * 0.06;
                }
              }
            } catch (e) {}

            try {
              if (left_side.indexOf("Product Dimensions") != -1) {
                dimension = right_side;
                var dim_text = dimension
                  .trim()
                  .match(
                    /([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)/g
                  )[0];
                pck_width_in = dim_text
                  .split("x")[0]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_length_in = dim_text
                  .split("x")[1]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_height_in = dim_text
                  .split("x")[2]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
              }
            } catch (e) {}
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {}
    }
    if (jQuery("#detail-bullets_feature_div").length) {
      try {
        var li_specifications = jQuery("#detail-bullets_feature_div")
          .find("ul")
          .not(".zg_hrsr")
          .find("li");
        for (var s = 0; s < li_specifications.length; s++) {
          try {
            var left_side = jQuery(li_specifications[s])
              .find("b")
              .text()
              .trim();
            var right_side = jQuery(li_specifications[s])
              .text()
              .split(":")[1]
              .trim();

            if (left_side.toLowerCase().indexOf("this fits") != -1) {
              continue;
            }
            item_specifics_array = item_specifics_array.concat([
              {
                left_side: left_side,
                right_side: right_side
              }
            ]);

            try {
              if (left_side.indexOf("Shipping Weight") != -1) {
                weight = right_side.replace(/\(.+\)/, "").trim();
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/[0-9]*[.]?[0-9]+/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]) * 0.06;
                }
              } else if (left_side.indexOf("Item Weight") != -1) {
                weight = right_side.replace(/\(.+\)/, "").trim();
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/[0-9]*[.]?[0-9]+/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]) * 0.06;
                }
              }
            } catch (e) {}

            try {
              if (left_side.indexOf("Product Dimensions") != -1) {
                dimension = right_side;
                var dim_text = dimension
                  .trim()
                  .match(
                    /([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)/g
                  )[0];
                pck_width_in = dim_text
                  .split("x")[0]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_length_in = dim_text
                  .split("x")[1]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_height_in = dim_text
                  .split("x")[2]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
              }
            } catch (e) {}
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {}
    }

    if (jQuery("#prodDetails").length) {
      try {
        var prod_details = jQuery("#prodDetails").find("tr");
        for (var s = 0; s < prod_details.length; s++) {
          try {
            var left_side = jQuery(prod_details[s])
              .find("th")
              .text()
              .trim();
            var right_side = jQuery(prod_details[s])
              .find("td")
              .text()
              .trim();

            if (left_side.toLowerCase().indexOf("this fits") != -1) {
              continue;
            }

            item_specifics_array = item_specifics_array.concat([
              {
                left_side: left_side,
                right_side: right_side
              }
            ]);

            try {
              if (left_side.indexOf("Shipping Weight") != -1) {
                weight = right_side.replace(/\(.+\)/, "").trim();
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/[0-9]*[.]?[0-9]+/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]) * 0.06;
                }
              } else if (left_side.indexOf("Item Weight") != -1) {
                weight = right_side.replace(/\(.+\)/, "").trim();
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/[0-9]*[.]?[0-9]+/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/[0-9]*[.]?[0-9]+/)[0]) * 0.06;
                }
              }
            } catch (e) {}
            try {
              if (left_side.indexOf("Product Dimensions") != -1) {
                dimension = right_side;
                var dim_text = dimension
                  .trim()
                  .match(
                    /([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)/g
                  )[0];
                pck_width_in = dim_text
                  .split("x")[0]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_length_in = dim_text
                  .split("x")[1]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_height_in = dim_text
                  .split("x")[2]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
              }
            } catch (e) {}
          } catch (e) {
            console.log(e);
          }
        }
        if (jQuery("#prodDetails").find("span:contains(Color)").length) {
          try {
            var color = jQuery("#prodDetails")
              .find("span:contains(Color)")
              .text()
              .trim()
              .split(":")[1];
            item_specifics_array = item_specifics_array.concat([
              {
                left_side: "Color",
                right_side: color
              }
            ]);
          } catch (e) {}
        }
      } catch (e) {}
    }

    if (jQuery("#prodDetails").length) {
      try {
        var prod_details = jQuery("#prodDetails").find("tr");
        for (var s = 0; s < prod_details.length; s++) {
          try {
            var left_side = jQuery(prod_details[s])
              .find("td.label")
              .text()
              .trim();
            var right_side = jQuery(prod_details[s])
              .find("td.value")
              .text()
              .trim();

            if (left_side.toLowerCase().indexOf("this fits") != -1) {
              continue;
            }

            item_specifics_array = item_specifics_array.concat([
              {
                left_side: left_side,
                right_side: right_side
              }
            ]);

            try {
              if (left_side.indexOf("Shipping Weight") != -1) {
                weight = right_side;
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/\d+\.?\d+?/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/\d+\.?\d+?/)[0]) * 0.06;
                }
              } else if (left_side.indexOf("Item Weight") != -1) {
                weight = right_side;
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/\d+\.?\d+?/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/\d+\.?\d+?/)[0]) * 0.06;
                }
              }
            } catch (e) {}
            try {
              if (left_side.indexOf("Product Dimensions") != -1) {
                dimension = right_side;
                var dim_text = dimension
                  .trim()
                  .match(
                    /([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)/g
                  )[0];
                pck_width_in = dim_text
                  .split("x")[0]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_length_in = dim_text
                  .split("x")[1]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_height_in = dim_text
                  .split("x")[2]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
              }
            } catch (e) {}
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {}
    }

    if (jQuery("#product-specification-table").length){
      try {
        var prod_details = jQuery("#product-specification-table").find("tr");
        for (var s = 0; s < prod_details.length; s++) {
          try {
            var left_side = jQuery(prod_details[s])
                .find("th")
                .text()
                .trim();
            var right_side = jQuery(prod_details[s])
                .find("td")
                .text()
                .trim();

            if (left_side.toLowerCase().indexOf("this fits") != -1) {
              continue;
            }

            item_specifics_array = item_specifics_array.concat([
              {
                left_side: left_side,
                right_side: right_side
              }
            ]);

            try {
              if (left_side.indexOf("Shipping Weight") != -1) {
                weight = right_side;
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/\d+\.?\d+?/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/\d+\.?\d+?/)[0]) * 0.06;
                }
              } else if (left_side.indexOf("Item Weight") != -1) {
                weight = right_side;
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/\d+\.?\d+?/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/\d+\.?\d+?/)[0]) * 0.06;
                }
              }
            } catch (e) {}
            try {
              if (left_side.indexOf("Product Dimensions") != -1) {
                dimension = right_side;
                var dim_text = dimension
                    .trim()
                    .match(
                        /([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)/g
                    )[0];
                pck_width_in = dim_text
                    .split("x")[0]
                    .trim()
                    .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_length_in = dim_text
                    .split("x")[1]
                    .trim()
                    .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_height_in = dim_text
                    .split("x")[2]
                    .trim()
                    .match(/[0-9]*[.]?[0-9]+/)[0];
              }
            } catch (e) {}
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {}
    }

    if (jQuery("#technicalSpecifications_feature_div").length) {
      try {
        var prod_details = jQuery("#technicalSpecifications_feature_div").find("tr");
        for (var s = 0; s < prod_details.length; s++) {
          try {
            var left_side = jQuery(prod_details[s])
              .find("th")
              .text()
              .trim();
            var right_side = jQuery(prod_details[s])
              .find("td")
              .text()
              .trim();

            if (left_side.toLowerCase().indexOf("this fits") != -1) {
              continue;
            }

            item_specifics_array = item_specifics_array.concat([
              {
                left_side: left_side,
                right_side: right_side
              }
            ]);

            try {
              if (left_side.indexOf("Shipping Weight") != -1) {
                weight = right_side;
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/\d+\.?\d+?/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/\d+\.?\d+?/)[0]) * 0.06;
                }
              } else if (left_side.indexOf("Item Weight") != -1) {
                weight = right_side;
                if (weight.indexOf("pounds") != -1) {
                  pck_weight_lb = weight.match(/\d+\.?\d+?/)[0];
                } else if (weight.indexOf("ounces") != -1) {
                  pck_weight_lb = parseFloat(weight.match(/\d+\.?\d+?/)[0]) * 0.06;
                }
              }
            } catch (e) {}
            try {
              if (left_side.indexOf("Product Dimensions") != -1) {
                dimension = right_side;
                var dim_text = dimension
                  .trim()
                  .match(
                    /([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)\s+?x\s+?([0-9]*[.]?[0-9]+)/g
                  )[0];
                pck_width_in = dim_text
                  .split("x")[0]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_length_in = dim_text
                  .split("x")[1]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
                pck_height_in = dim_text
                  .split("x")[2]
                  .trim()
                  .match(/[0-9]*[.]?[0-9]+/)[0];
              }
            } catch (e) {}
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {}
    }

    if (weight == "") {
      try {
        weight = dimension.split(";")[1].match(/[0-9]*[.]?[0-9]+/)[0];

        if (dimension.toLowerCase().indexOf("kg") != -1) {
          pck_weight_lb = weight * 2.2;
        } else if (
          dimension.toLowerCase().indexOf("lb") != -1 ||
          dimension.toLowerCase().indexOf("pounds") != -1
        ) {
          pck_weight_lb = weight;
        } else if (dimension.toLowerCase().indexOf("g") != -1) {
          pck_weight_lb = (weight / 1000) * 2.2;
        } else {
          pck_weight_lb = weight;
        }
      } catch (e) {}
    }

    var bullet_points = [];
    var bullet_points_html = "";
    if (jQuery("#feature-bullets").length) {
      try {
        bullet_points_html = jQuery("#feature-bullets").html();
        var bullets = jQuery("#feature-bullets")
          .find("li")
          .not("#replacementPartsFitmentBullet")
          .not("[id*='MoreButton']")
          .find("span.a-list-item");
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

            if (left_side.toLowerCase().indexOf("this fits") != -1) {
              continue;
            }

            try {
              item_specifics_array = item_specifics_array.concat([
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
    }

    bullet_points_html = bullet_points_html.replace(/<script[^>]+>[^>]+script>/gim, "");

    var bullet_points_html_real = "";

    bullet_points_html_lis = jQuery(bullet_points_html).find("li");
    for (var b = 0; b < bullet_points_html_lis.length; b += 1) {
      if (
        jQuery(bullet_points_html_lis[b])
          .html()
          .toLowerCase()
          .indexOf("this fits") != -1
      ) {
        continue;
      }
      bullet_points_html_real += "<li>" + jQuery(bullet_points_html_lis[b]).html() + "</li>";
    }

    bullet_points_html = bullet_points_html_real;

   var var_images={};

    var variations = {};

    if (jQuery("#twister").length) {
      var variations_dl = jQuery("#twister").find(
        ".a-section.a-spacing-small.twisterShelf_container"
      );
      for (var v = 0; v < variations_dl.length; v++) {
        try {
          var variation_text = jQuery(variations_dl[v])
            .find("span[class*='twisterShelf'][class*='label']")
            .text()
            .split(":")[0]
            .trim()
            .match(/([^0-9]+)/g)[0]
            .trim();


          var variation_vars = jQuery(variations_dl[v]).find("img.twisterShelf_swatch_img");
          var var_title="";

          temp_vars = [];
          for (var tv = 0; tv < variation_vars.length; tv++) {
            temp_vars = temp_vars.concat(jQuery(variation_vars[tv]).attr("alt"));

            try{
              var_title=jQuery(variation_vars[tv])
                  .attr("alt");
              if (typeof var_images[variation_text]=='undefined'){
                var_images[variation_text]=[];
              }
              var var_obj = {};
              var_obj[var_title]=jQuery(variation_vars[tv]).attr("src").replace(/\._[^_\.]+_.jp/, ".jp").replace(/\._[^_\.]+_.png/, ".png");
              var_images[variation_text]=var_images[variation_text].concat(var_obj);
            } catch(e){

            }


          }
          variations[variation_text] = temp_vars;
        } catch (e) {}
      }
    }
    if (jQuery("#twister").length) {
      var variations_dl = jQuery("#twister").find(".a-section.a-spacing-small");
      for (var v = 0; v < variations_dl.length; v++) {
        try {
          var variation_text = jQuery(variations_dl[v])
            .find("label")
            .text()
            .trim()
            .replace(/:/g, "");

          if (variation_text.indexOf("Colo") != -1) {
            var variation_vars = jQuery(variations_dl[v]).find("li");
            temp_vars = [];
            for (var tv = 0; tv < variation_vars.length; tv++) {
              temp_vars = temp_vars.concat(
                jQuery(variation_vars[tv])
                  .find("img")
                  .attr("alt")
              );


              try{
                var_title= jQuery(variation_vars[tv])
                    .find("img")
                    .attr("alt");
                if (typeof var_images[variation_text]=='undefined'){
                  var_images[variation_text]=[];
                }
                var var_obj = {};
                var_obj[var_title]= jQuery(variation_vars[tv])
                    .find("img").attr("src").replace(/\._[^_\.]+_.jp/, ".jp").replace(/\._[^_\.]+_.png/, ".png");
                var_images[variation_text]=var_images[variation_text].concat(var_obj);
              } catch(e){

              }


            }
            variations[variation_text] = temp_vars;
          } else {
            var variation_vars = jQuery(variations_dl[v]).find("li");
            temp_vars = [];
            for (var tv = 0; tv < variation_vars.length; tv++) {
              if (jQuery(variation_vars[tv]).find(".twisterTextDiv").length) {
                temp_vars = temp_vars.concat(
                  jQuery(variation_vars[tv])
                    .find(".twisterTextDiv")
                    .text()
                    .trim()
                );
              } else {
                temp_vars = temp_vars.concat(
                  jQuery(variation_vars[tv])
                    .text()
                    .trim()
                );
              }
            }
            variations[variation_text] = temp_vars;
          }
        } catch (e) {}
      }
    }

    if (jQuery("#twister").length) {
      var variations_dl = jQuery("#twister").find(".a-row.a-spacing-micro");
      for (var v = 0; v < variations_dl.length; v++) {
        try {
          var variation_text = jQuery(variations_dl[v])
            .find("label")
            .text()
            .trim()
            .replace(/:/g, "");

          var variation_vars = jQuery(variations_dl[v])
            .parent()
            .find("option[data-a-html-content]");
          temp_vars = [];
          for (var tv = 0; tv < variation_vars.length; tv++) {
            temp_vars = temp_vars.concat(jQuery(variation_vars[tv]).attr("data-a-html-content"));
          }
          variations[variation_text] = temp_vars;
        } catch (e) {}
      }
    }

    if (jQuery("#twister").find("[id*='label'][id*='name']").length) {
      var variations_dl = jQuery("#twister").find("[id*='label'][id*='name']");
      for (var v = 0; v < variations_dl.length; v++) {
        try {
          var variation_text = jQuery(variations_dl[v])
            .attr("id")
            .match(/label-(\w+)_name/)[1];
          variation_text = toTitleCase(variation_text);
          //var variation_vars = jQuery(variations_dl[v]).find("[id^='shelfSwatchSection'][id*='name']").find("div[id*='name']");
          //.next().find("div[id*='name']")
          var variation_vars = jQuery(variations_dl[v])
            .next()
            .find("div[id*='name']");
          temp_vars = [];
          for (var tv = 0; tv < variation_vars.length; tv++) {
            temp_vars = temp_vars.concat(
              jQuery(variation_vars[tv])
                .find("span.twisterShelf_swatch_text")
                .text()
                .trim()
            );
          }
          variations[variation_text] = temp_vars;
        } catch (e) {}
      }
    }

    /*try{
					if (jQuery("#twister").length){
						jQuery("#twister").find("[id*='label'][id*='color'][id*='name']").find(".a-text-bold").not(".selection").html().replace(/<span.*span>/,"").trim().replace(":","").match(/[^\d]+/)[0].trim()

					}

				} catch (e){

				}*/

    var json_var_images = JSON.stringify(var_images);

    var brand = "";
    if (jQuery("#bylineInfo").length) {
      brand = jQuery("#bylineInfo")
        .text()
        .trim();
    } else if (jQuery("#brand").length) {
      brand = jQuery("#brand")
        .text()
        .trim();
    }

   try{
     brand=brand.replace("Brand:","").trim();
   } catch(e){

   }

    try {
      item_specifics_array = item_specifics_array.concat([
        {
          left_side: "Brand",
          right_side: brand
        }
      ]);
    } catch (e) {}

    try {
      var asin = window.location.href.match(/(B[a-zA-Z0-9]{8,12})/)[0];
      var convert_to = window.location.href.indexOf(".com") != -1 ? "UPC" : "EAN";
    } catch (e) {
      var asin = "";
      var convert_to = "UPC";
    }

  if (jQuery("#priceblock_saleprice").length){
    try{
      var ourprice = jQuery("#priceblock_saleprice").text().trim().replace(/[^\d\.\,]+/g,"");
    } catch(e){
      var ourprice = "0.00";
    }
  } else if (jQuery("#priceblock_ourprice").length){
    try{
      var ourprice = jQuery("#priceblock_ourprice").text().trim().replace(/[^\d\.\,]+/g,"");
    } catch(e){
      var ourprice = "0.00";
    }
  } else {
    var ourprice = "0.00";
  }

  if (typeof info_obj=='undefined'){
    var info_obj={};
  }
  if (typeof stor_obj=='undefined'){
    var stor_obj={};
  }

    stor_obj={
      source: "amazon",
      brand: brand,
      title: title,
      bullet_points: bullet_points,
      bullet_points_html: bullet_points_html,
      description: desc_html,
      weight: pck_weight_lb,
      length: pck_length_in,
      height: pck_height_in,
      width: pck_width_in,
      specifics: item_specifics_array,
      variations: variations,
      var_images: json_var_images,
      main_images: json_main_images,
      desc_images: json_all_desc_images,
      price: ourprice,
      vendor_link:window.location.href
    };

    var listing =  stor_obj;

    info_obj.saved_listing = listing;

    chrome.runtime.sendMessage({
      type: "update_listing_cache",
      info_obj: info_obj
    });

    
    //item_specifics_array = item_specifics_array.concat([{"Country/Region of Manufacture","China"}]);
    chrome.storage.local.set(stor_obj,function() {});

    /*var copy_offset = jQuery("#aliexpressCopy").offset();
	            copy_offset.left -= 20;
	            copy_offset.top -= 20;
	            jQuery('html, body').animate({
	                scrollTop: copy_offset.top,
	                scrollLeft: copy_offset.left
	            });*/

    jQuery("#amazonCopy").val("Working...");

    chrome.runtime.sendMessage(
      {
        type: "upload_images",
        title: title,
        main_images: json_main_images,
        var_images:json_var_images,
        desc_images: json_all_desc_images
      },
      function() {
        chrome.runtime.sendMessage(
          {
            type: "grab_asin",
            asin: asin,
            convert_to: convert_to
          },
          function() {
            chrome.runtime.sendMessage({
              type: "create_listing"
            });
          }
        );
      }
    );
  }

