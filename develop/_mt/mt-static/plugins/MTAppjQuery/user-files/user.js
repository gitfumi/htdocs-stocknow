!function(e){if(e(function(){e.getJSON("http://stocknow.dev.localhost/_mt/mt-data-api.cgi/v3/sites",function(e){})}),e.ajax({type:"get",url:"/_mt/mt-data-api.cgi/v3/sites",dataType:"json",success:function(e,t){}}),console.log(mtappVars),e("body#edit-category").length){e("#category-outbound-ping").next().hide(),e("#description-field, #category-inbound-ping, #category-outbound-ping").hide(),e.MTAppFieldSort({sort:"label,basename,c:categorybrandlogo,c:categorystate,c:categoryonlinepay,c:categoryonlineurl,c:categoryshopname1,c:categoryshopaddress1,c:categoryshopoverview1,c:categoryshopname2,c:categoryshopaddress2,c:categoryshopoverview2,c:categoryshopname3,c:categoryshopaddress3,c:categoryshopoverview3,c:categoryshopname4,c:categoryshopaddress4,c:categoryshopoverview4,c:categoryshopurl",insertID:"category-meta"}),e.MTAppMultiCheckbox({basename:"categorystate",label:"常温,冷蔵,冷凍",custom:1,skin:"tags",debug:0}),e.MTAppMultiCheckbox({basename:"categoryonlinepay",label:"銀行振込,代金引換,クレジットカード,コンビニ決済",skin:"tags",custom:1,debug:0});for(var t=1;t<=4;t++){var i;i="#customfield_categoryshopname"+t+"-field",i+=", #customfield_categoryshopaddress"+t+"-field",e(i+=", #customfield_categoryshopoverview"+t+"-field").wrapAll("<section class='mtapp-shopBlock'></section>")}e(".mtapp-shopBlock").wrapAll("<div class='mtapp-shop'></div>")}e("body#edit-entry").length&&(e("#text-field, #tags-field, #feedback-field").hide(),e.MTAppFieldSort({sort:"title,c:entryimage,c:entryimagesub1,c:entryimagesub2,c:entryprice,c:entrylimitdate,c:entryiconnew,c:entrydetails,c:entryvariationtext1,c:entryvariationimage1,c:entryvariationtext2,c:entryvariationimage2,c:entryvariationtext3,c:entryvariationimage3"}),e("#customfield_entryimage-field, #customfield_entryimagesub1-field, #customfield_entryimagesub2-field").wrapAll("<div class='mtapp-vertical is-picture'></div>"),e("#customfield_entryimage-field").wrapAll("<section class='mtapp-verticalBlock'></section>"),e("#customfield_entryimagesub1-field").wrapAll("<section class='mtapp-verticalBlock'></section>"),e("#customfield_entryimagesub2-field").wrapAll("<section class='mtapp-verticalBlock'></section>"),e("#customfield_entryprice-field, #customfield_entrylimitdate-field, #customfield_entryiconnew-field").wrapAll("<div class='mtapp-vertical is-pli'></div>"),e("#customfield_entryprice-field").wrapAll("<section class='mtapp-verticalBlock'></section>"),e("#customfield_entrylimitdate-field").wrapAll("<section class='mtapp-verticalBlock'></section>"),e("#customfield_entryiconnew-field").wrapAll("<section class='mtapp-verticalBlock'></section>"),e("#customfield_entryvariationtext1-field, #customfield_entryvariationimage1-field, #customfield_entryvariationtext2-field, #customfield_entryvariationimage2-field,  #customfield_entryvariationtext3-field, #customfield_entryvariationimage3-field").wrapAll("<div class='mtapp-vertical is-variation'></div>"),e("#customfield_entryvariationtext1-field, #customfield_entryvariationimage1-field").wrapAll("<section class='mtapp-verticalBlock'></section>"),e("#customfield_entryvariationtext2-field, #customfield_entryvariationimage2-field").wrapAll("<section class='mtapp-verticalBlock'></section>"),e("#customfield_entryvariationtext3-field, #customfield_entryvariationimage3-field").wrapAll("<section class='mtapp-verticalBlock'></section>"))}(jQuery);