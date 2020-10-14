var global_suppliers={};
var stor_suppliers={};

global_suppliers["alibaba.com"] = {
	title : [ "h1.ma-title" ],
    gallery : [ "div[data-role=\"widget-detail-booth-image\"]" ],
    summary : [ "div.ma-main" ],
	price : [ "div.ma-price-wrap" ],
	variations : [ "div.good_main" ],
	specifics : [ "div.do-entry-list" ],
	description : [ "div#J-rich-text-description" ]
}
/*
global_suppliers["aliexpress.com"] = {
	title : [ "h1.product-name" ],
	gallery : [ "div#j-detail-gallery-main","div#j-product-info-sku","div.product-main-wrap" ],
	summary : [ "" ],
	price : [ "#priceblock_ourprice" ],
	variations : [ "div.product-sku" ],
	specifics : [ "#j-product-info-sku" ],
	description : [ "div#j-product-description","div.description-content","div#product-description" ]
}
global_suppliers["amazon.com"] = {
	title : [ "h1.product-name","#productTitle","#ebooksProductTitle" ],
	gallery : [ "#imageBlock","div#imageBlockThumbs","#imgTagWrapperId","div#centerCol" ],
	summary : [ "#detail_bullets_id","#detail-bullets_feature_div","#feature-bullets" ],
	price : [ "#priceblock_ourprice" ],
	variations : [ "#twister" ],
	specifics : [ "table#productDetailsTable","#detail_bullets_id","#detail-bullets_feature_div","#prodDetails","#technicalSpecifications_feature_div" ],
	description : [ "#dpx-aplus-product-description_feature_div","#productDescription_feature_div","#dpx-aplus-product-description_feature_div","#bookDesc_iframe","#detail-bullets","#featurebullets_feature_div","#productDescription_feature_div" ]
}*/

global_suppliers["banggood.com"] = {
	title : [ "h1[itemprop=name]" ],
	gallery : [ "div.image_additional","div.pro_detail_wrap box","div.image_additional","div.pro_detail_wrap box","div.good_tabs_box:last","div.good_photo" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "div.item_box.attr","div.good_main","div.pro_attr_box" ],
	specifics : [ "" ],
	description : [ "div.good_tabs_box","#tab-description","#tab-description" ]
}
global_suppliers["beautify.com"] = {
	title : [ "h1.page-title" ],
	gallery : [ "div.fotorama__stage__frame" ],
	summary : [ "div.product.attribute.overview" ],
	price : [ "" ],
	variations : [ "" ],
	specifics : [ "" ],
	description : [ "div.product.attribute.description" ]
}
global_suppliers["bedbathandbeyond.com"] = {
	title : [ "h1#productTitle" ],
	gallery : [ "div[id$='ProductImageWrapper']" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "div.swatchPickers" ],
	specifics : [ "" ],
	description : [ "div#productInfoWrapper" ]
}
global_suppliers["bestbuy.com"] = {
	title : [ "div[itemprop='name'] h1" ],
	gallery : [ "div.shop-media-gallery" ],
	summary : [ "div.features-list" ],
	price : [ "div.price-box div.priceView-customer-price" ],
	variations : [ "div.product-variations","div.shop-variation-wrapper" ],
	specifics : [ "div.spec-categories" ],
	description : [ "div.shop-product-description","div.pdp_copy_change","div.features-list","div#long-description","div.shop-whats-included" ]
}
global_suppliers["bonanza.com"] = { //---- !
	title : [ "h2 span[itemprop='name']" ],
	gallery : [ "div.main_image_container","div.image_thumbnail_container" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "" ],
	specifics : [ "tr[class='extended_info_row']" ],
	description : [ "#item_description_iframe" ]
}
global_suppliers["costco.com"] = {
	title : [ "h1" ],
	gallery : [ "div.product-gallery" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "#j-product-info-sku" ],
	specifics : [ "div.product-classifications" ],
	description : [ "#heading-PRODUCT_DETAILS" ]
}
global_suppliers["dhgate.com"] = {
	title : [ "h1","h2.fn" ],
	gallery : [ "#simgList" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "ul.color-list","#customSizeWarp" ],
	specifics : [ "#itemDescription" ],
	description : [ "div.description-content","div#itemDescription" ]
}
global_suppliers["gearbest.com"] = {
	title : [ "h1:first" ],
	gallery : [ "div[data-role=\"widget-detail-booth-image\"]" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "[id^='spec']" ],
	specifics : [ "div.product_pz_info" ],
	description : [ "div#anchorGoodsDesc" ]
}
global_suppliers["harborfreight.com"] = {
	title : [ "div.product-information-title","[class^='product__info--'] h4" ],
	gallery : [ "div[class^='product__media--']" ],
	summary : [ "" ],
	price : [ "[class^='styled-price__styledPrice']" ],
	variations : [ "#j-product-info-sku" ],
	specifics : [ "div.overview-specifications","div[name='specifications']" ],
	description : [ "div.overview-description","div[name='product-overview']" ]
}
global_suppliers["hayneedle.com"] = {
	title : [ "row.title-container h1" ],
	gallery : [ "div.product-image-album" ],
	summary : [ "" ],
	price : [ "p" ],
	variations : [ "" ],
	specifics : [ "table.specs-table" ],
	description : [ "div.desc-section" ]
}
global_suppliers["homedepot.com"] = {
	title : [ "h1.product-title__title","h1.product-details__title","h1.product-title" ],
	gallery : [ "#media-gallery","div#mediaPlayer","div#mediaPlayerContainer","div.product-gallery" ],
	summary : [ "[data-lg-name='Salient Points']" ],
	price : [ "#priceblock_ourprice" ],
	variations : [ ".product-variant__wrapper" ],
	specifics : [ "#specsContainer","div.product-spec" ],
	description : [ "div.product-accordion-content","div#product_description" ]
}
global_suppliers["iherb.com"] = {
	title : [ "h1#name" ],
	gallery : [ "div.image-container" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "div.product-grouping-row" ],
	specifics : [ "ul#product-specs-list" ],
	description : [ "div.inner-content" ]
}
global_suppliers["kmart.com"] = {
	title : [ "header.product-header h1" ],
	gallery : [ "#overview" ],
	summary : [ "div.key-features-single" ],
	price : [ "" ],
	variations : [ ".variant-attr-group" ],
	specifics : [ "#specificationsSummary" ],
	description : [ "#description" ]
}
global_suppliers["llbean.com"] = { //--- !
	title : [ "h1.product-name[itemprop='name']:first" ],
	gallery : [ "img[src*='llbean.net']" ],
	summary : [ "" ],
	price : [ "div.ma-price-wrap" ],
	variations : [ "div.product-variations" ],
	specifics : [ "" ],
	description : [ "div.pdp_copy_change" ]
}
global_suppliers["lowes.com"] = {
	title : [ "meta[itemprop='brand']","h1.h3" ],
	gallery : [ "div.gallery-section","#mainContent" ],
	summary : [ "ul.bullets" ],
	price : [ ".finalPrice" ],
	variations : [ "strong.variant-name" ],
	specifics : [ "#Specifications-section","#collapseSpecs" ],
	description : [ "div.content","div#collapseDesc" ]
}
global_suppliers["newchic.com"] = {
	title : [ ".pro-buy-container h1" ],
	gallery : [ "ul.img-list" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "div.goods_main_list" ],
	specifics : [ "div.do-entry-list" ],
	description : [ "#description-container","div.prod-desc-wrap","div.detail_content.description" ]
}
global_suppliers["overstock.com"] = {
	title : [ "[data-cy='product-title']","div.product-title" ],
	gallery : [ "#image-gallery","#mainContent" ],
	summary : [ "" ],
	price : [ "#product-price" ],
	variations : [ "div.controls-section","select.options-dropdown","#optionSelection" ],
	specifics : [ "h2:contains('Specifications')","h2:contains('Specs')" ],
	description : [ "div.description","section#details" ]
}
global_suppliers["petco.com"] = {
	title : [ "span[data-test='product-title']" ],
	gallery : [ ".pdp-product-images" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "" ],
	specifics : [ "ul.product-attributes-table" ],
	description : [ "div.product-description" ]
}
global_suppliers["rakuten.com"] = {  // -- !
	title : [ "h1.title[itemprop='name']:first" ],
	gallery : [ "a[data-href*='vdxl.im'][data-href*='hd']" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "#j-product-info-sku" ],
	specifics : [ "div.product-specifications-box" ],
	description : [ "div.product-description-box" ]
}

global_suppliers["robertdyas.com"] = {
	title : [ "h1.product-name" ],
	gallery : [ ".product-image-gallery" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "" ],
	specifics : [ "ul.product-attributes-table" ],
	description : [ "div.tab-content" ]
}
global_suppliers["samsclub.com"] = {
	title : [ "h1:first","span[itemprop='name']:first" ],
	gallery : [ "li.thumbs" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "#j-product-info-sku" ],
	specifics : [ ".product_pz" ],
	description : [ "div#full-description","div.itemDescription","div.sc-short-description","div.itemBullets","div.why-we-love","div.itemFeatures" ]
}
global_suppliers["sears.com"] = {
	title : [ "header.product-header h1" ],
	gallery : [ "#overview" ],
	summary : [ "div.key-features-single" ],
	price : [ "" ],
	variations : [ ".variant-attr-group" ],
	specifics : [ "#specificationsSummary" ],
	description : [ "#description" ]
}
global_suppliers["smythstoys.com"] = {
	title : [ "h1[itemprop='name']" ],
	gallery : [ "div.image-gallery-container" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "" ],
	specifics : [ "div.do-entry-list" ],
	description : [ "div[class^='flix-image']","div.flix-background-image","div.product-classifications" ]
}
global_suppliers["target.com"] = {
	title : [ "span[data-test='product-title']" ],
	gallery : [ "div[class^='CarouselWrapper']" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "" ],
	specifics : [ "div.h-padding-b-tight" ],
	description : [ "div#tabContent-tab-details" ]
}
global_suppliers["vonhaus.com"] = {
	title : [ "h1.page-title" ],
	gallery : [ "div.fotorama__stage__frame" ],
	summary : [ "div.product.attribute.overview" ],
	price : [ "" ],
	variations : [ "" ],
	specifics : [ "" ],
	description : [ "div.product.attribute.description" ]
}
global_suppliers["vonshef.com"] = {
	title : [ "h1.page-title" ],
	gallery : [ "div.fotorama__stage__frame" ],
	summary : [ "div.product.attribute.overview" ],
	price : [ "" ],
	variations : [ "" ],
	specifics : [ "" ],
	description : [ "div.product.attribute.description" ]
}
global_suppliers["wayfair.com"] = {
	title : [ "h1.pl-PageTitle-header" ],
	gallery : [ "div.ProductDetailImagesBlock" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "div.ProductDetailOptions","div.SkusOptions" ],
	specifics : [ "tr.ProductDetailSpecifications-table-row","tr.Specifications-table-row" ],
	description : [ "#information","div.ProductOverviewInformation-content" ]
}
global_suppliers["zooplus.com"] = {
	title : [ "h1.producttitle.ui-h1" ],
	gallery : [ "div.media__gallery" ],
	summary : [ "" ],
	price : [ "" ],
	variations : [ "" ],
	specifics : [ "" ],
	description : [ "#description-panel" ]
}