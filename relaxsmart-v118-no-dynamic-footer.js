/* RELAX SMART V100 | Complete unified JS for Salla custom JavaScript field.
   DO NOT paste CSS inspector output after this file. Replace the old JS entirely.
   Apple Pay and direct checkout are only used when Salla renders official eligible widgets. */
(function(){document.documentElement.dataset.relaxSmartPurchase='100';document.documentElement.dataset.relaxSmartPurchaseStatus='loaded';})();

/* RELAX SMART V95 — BUY NOW INTENT: official Salla checkout only. */
(function(){
  'use strict';
  if(window.__rs95CheckoutIntent)return;
  var key='relaxsmart:v95:checkout-intent';
  window.__rs95CheckoutIntent={
    arm:function(id){
      id=Number(id);
      if(!Number.isSafeInteger(id)||id<=0)return;
      try{sessionStorage.setItem(key,JSON.stringify({id:id,at:Date.now()}));}catch(_e){}
    },
    read:function(){
      try{
        var x=JSON.parse(sessionStorage.getItem(key)||'null');
        if(!x||!Number.isSafeInteger(Number(x.id))||Date.now()-Number(x.at)>120000){
          sessionStorage.removeItem(key);return null;
        }
        return x;
      }catch(_e){return null;}
    },
    clear:function(){try{sessionStorage.removeItem(key);}catch(_e){}}
  };
})();


/* RELAX SMART V98 — separate Buy Now / Add to Cart flows.
   BUY NOW: native product add success -> resolve selected extras in-place ->
   Salla.cart.submit() straight from the product page. No intermediate /ar/cart.
   ADD TO CART: preserve the Salla add-to-cart operation and cart behavior.
   Never reuse a checkout session URL from a different visitor. */
(function(){
  'use strict';
  if(window.__rs96Checkout)return;
  let checkoutInProgress=false;
  window.__rs95CheckoutIntent?.clear(); // V97's cart-page intent is now obsolete.
  const selectedExtras=()=>!!document.querySelector(
    '.rs60-gift-item.is-selected, .rs60-paid-section input[data-kind="paid"]:checked'
  );
  function notify(text){
    const node=document.querySelector('.container--product-single .rs86-action-note')||
      document.querySelector('.container--product-single .rs60-live');
    if(node){node.textContent=text;node.dataset.kind='warn';node.setAttribute('role','status');}
  }
  window.__rs96Checkout={
    afterAdded:async function(id){
      id=Number(id);
      if(!Number.isSafeInteger(id)||id<=0 || checkoutInProgress)return false;
      checkoutInProgress=true;
      try{
        // A gift or additional product must be confirmed BEFORE leaving the
        // product page. V97 sent customers to /ar/cart first even on Buy Now.
        if(selectedExtras()){
          const finalize=window.__rs98FinalizeExtras;
          if(typeof finalize!=='function'){
            notify('تمت إضافة المنتج الأساسي، لكن لا يمكن التحقق من الهدية الآن. راجعي السلة قبل الدفع.');
            return false;
          }
          const result=await finalize(id);
          if(!result?.ok){
            notify(result?.message||'تمت إضافة المنتج الأساسي، لكن تعذّر تأكيد الهدية أو الإضافات. راجعي السلة قبل الدفع.');
            return false;
          }
        }
        const cart=(window.salla||window.Salla)?.cart;
        if(typeof cart?.submit!=='function'){
          notify('تمت إضافة المنتج، لكن خدمة إتمام الطلب غير جاهزة. يمكنك فتح السلة يدويًا.');
          return false;
        }
        // This supported SDK call creates the current visitor's checkout URL.
        // Do not assign /ar/cart and do not hardcode /ar/checkout/{token}.
        const result=await cart.submit();
        if(result?.success===false||result?.status===false||result?.error){
          throw new Error('سلة لم تقبل بدء إتمام الطلب');
        }
        return true;
      }catch(e){
        console.warn('[Relax Smart V98] Direct checkout did not complete:',e?.message||e);
        notify('تمت إضافة المنتج، لكن تعذّر الانتقال تلقائيًا لإتمام الطلب. يمكنك فتح السلة يدويًا.');
        return false;
      }finally{checkoutInProgress=false;}
    }
  };
})();

/* RELAX SMART V83 — COMPACT NATIVE PURCHASE BAR — 9 NOV 2026
   Replace the ENTIRE existing custom JavaScript; do NOT append to V68.
   Prices and installment eligibility are supplied by Salla, never recalculated here.
   Quick "Buy Now" uses the REAL native add button, then opens cart only on success.
*/

/* RELAX SMART V71 — NATIVE SALLA CHECKOUT + PRODUCT CONTENT + V65 CART LOGIC | 9 NOV 2026
   Replace the COMPLETE V61 script with this ENTIRE file.
   Remove any separate custom CSS left from V47–V61; styles are embedded.
   Gift price is server-authoritative: the Salla offer must apply 100% off.
*/
(function(){
  'use strict';
  if(window.__relaxSmartV65Styles)return;
  window.__relaxSmartV65Styles=true;
  const old=document.getElementById('relax-smart-v61-styles');if(old)old.remove();
  const style=document.createElement('style');style.id='relax-smart-v65-styles';
  style.textContent="/* RELAX SMART V61: light-only design on ALL store pages. Replace old custom CSS. */\n:root,html,body,body.color-mode-dark,body.color-mode-light{color-scheme:light!important}\nhtml,body,body.color-mode-dark,body.color-mode-light,\nbody #app,body .app-inner,body main,body .store-footer,\nbody footer,body .s-blocks-wrapper,body .product-details-wrapper,\nbody .container--products-list,body .container--cart,\nbody .cart-page-wrapper,body .cart-wrapper {\n  background-color:#fff!important;background:#fff!important;color:#253342!important;\n}\n/* Header, search, navigation: never dark. Promotional red and menu orange remain branded. */\nhtml body .store-header,html body header.store-header,\nhtml body #main-nav,html body .main-nav,html body #main-nav>.inner,\nhtml body #main-nav .inner,html body .main-nav__content,\nhtml body .main-nav .mobile-main-nav,html body .header__search,\nhtml body .header__icons,html body .mobile-icons,\nhtml body .mobile-main-nav,html body .s-header,\nhtml body .header--full,html body .s-menu-wrap {\n  background:#fff!important;background-color:#fff!important;color:#253342!important;\n}\nhtml body .store-header button,html body .store-header .icon,\nhtml body .store-header svg,html body .store-header i,\nhtml body .store-header .sicon-search,html body .store-header .mburger {\n  color:#273441!important;stroke:currentColor;\n}\nhtml body .store-header svg path{fill:currentColor}\nhtml body .store-header .mburger span{background-color:#273441!important}\nhtml body .store-header .header__search .s-search-placeholder-wrapper,\nhtml body .store-header .header__search .s-search-input-wrapper,\nhtml body .store-header .header__search .s-search-input,\nhtml body .store-header salla-search .s-search-placeholder-wrapper,\nhtml body .store-header salla-search input,\nhtml body .store-header .s-search-inline {\n  background:#f7f8fa!important;background-color:#f7f8fa!important;\n  color:#1f2937!important;border-color:#e5e7eb!important;\n}\nhtml body .store-header salla-search input::placeholder{color:#667085!important;opacity:1}\nhtml body .store-header .theme-mode-btn{display:none!important}\n/* Keep the promotion / branded category bar colored, not black. */\nhtml body .s-promotion-banner,html body .above-header,\nhtml body .s-promotion-banner .container,\nhtml body .above-header .container {background:#953636!important;color:#fff!important}\nhtml body .s-promotion-banner *,html body .above-header *{color:#fff!important}\nhtml body .quicklinks,html body .quicklinks::before,\nhtml body .quicklinks__inner,html body .quicklinks .container {\n  background:#d67027!important;color:#fff!important;\n}\n/* The menu itself (#mobile-menu) lives inside .quicklinks on this theme.\n   V61 incorrectly made .mobile-menu white, hiding its white links. */\nhtml body .quicklinks #mobile-menu,\nhtml body .quicklinks nav#mobile-menu.mobile-menu,\nhtml body .quicklinks .main-menu,\nhtml body .quicklinks .mainmenu__default,\nhtml body .quicklinks .quicklinks__inner.container,\nhtml body .quicklinks .quicklinks__inner.container > div,\nhtml body .quicklinks .quicklinks__inner.container > nav,\nhtml body .quicklinks .main-menu-item,\nhtml body .quicklinks .main-menu-item > a,\nhtml body .quicklinks .main-menu-item > span {\n  background-color:#d67027!important;\n  background:#d67027!important;\n  color:#fff!important;\n}\nhtml body .quicklinks .main-menu,\nhtml body .quicklinks #mobile-menu {min-height:60px;display:flex!important;align-items:center!important;flex-wrap:wrap}\nhtml body .quicklinks .main-menu-item > a {display:flex!important;align-items:center;min-height:52px;padding:10px 12px!important;font-weight:700}\nhtml body .quicklinks *:not(.sub-menu *),html body .quicklinks a {color:#fff!important}\nhtml body .quicklinks .sub-menu {background:#fff!important;color:#243343!important;min-height:0!important}\nhtml body .quicklinks .sub-menu a,html body .quicklinks .sub-menu span {color:#243343!important;background:#fff!important}\n@media(max-width:991px){html body .quicklinks{display:none!important}}\n\n/* Store banner separators & dark-mode utility classes that made the home page black. */\nhtml body .s-block,html body .s-block--fixed-banner,\nhtml body .s-blocks-wrapper,html body .s-block__container,\nhtml body .section,html body .s-block--categories {\n  background-color:#fff!important;\n}\nhtml body .bg-black,html body .bg-gray-950,html body .bg-gray-900,\nhtml body .bg-slate-900,html body .bg-zinc-900,\nhtml body [class*=\"dark:bg-black\"],html body [class*=\"dark:bg-gray-900\"] {\n  background-color:#fff!important;color:#253342!important;\n}\n/* Cart page: keep the line items, coupon and totals readable. */\nhtml body :is(.cart-item,.cart-items,.cart-page,.cart-summary,.cart-details,.cart-totals,.cart-widget,\n.s-cart-item,.s-cart-items,.s-cart-summary,.cart-coupon,.cart-summary-wrapper,\n.cart-total,.cart__item,.cart-content,.cart-page-content,.cart-actions) {\n  background:#fff!important;background-color:#fff!important;color:#263442!important;\n  border-color:#e6e9ee!important;\n}\nhtml body .cart-page :is(h1,h2,h3,h4,p,strong,span,label),\nhtml body .cart-wrapper :is(h1,h2,h3,h4,p,strong,span,label),\nhtml body .cart-summary :is(h1,h2,h3,h4,p,strong,span,label) {color:#263442!important}\nhtml body .cart-page input,html body .cart-wrapper input,\nhtml body input[type=\"text\"],html body input[type=\"search\"],html body textarea,html body select{\n  background:#fff!important;color:#273441!important;border-color:#dce3ea!important;\n}\nhtml body input::placeholder,html body textarea::placeholder {color:#7b8796!important;opacity:1}\n/* Only labels/icons in cart header; preserve add-to-cart/checkout colored buttons. */\nhtml body .s-cart-summary-wrapper{background:transparent!important;color:#263442!important}\nhtml body .s-cart-summary-wrapper :is(i,svg,span,b,p){color:#263442!important}\nhtml body .rs60-cart-notice{background:#fff7eb!important;color:#805326!important}\nhtml body .rs60-cart-notice[data-status=\"ok\"]{background:#edf9f1!important;color:#166438!important}\n/* Product images on small screens remain full size. Never set height:60% or width:64%. */\n@media(max-width:767px){\n  html body :is(custom-salla-product-card,.product-entry,.s-product-card){min-width:0!important}\n  html body .product-entry__image,html body .s-product-card-image-wrapper {width:100%!important;max-width:100%!important}\n  html body .product-entry__image img,html body .s-product-card-image-wrapper img {\n    display:block!important;visibility:visible!important;opacity:1!important;\n    width:100%!important;max-width:100%!important;height:auto!important;object-fit:contain!important;\n  }\n  html body .header__search {padding:0 12px!important}\n}\n\n/* RELAX SMART V60 — product detail design (scoped to product pages only) */\nbody.rs60-product {\n  --rs60-ink:#1e293b;\n  --rs60-muted:#64748b;\n  --rs60-line:#e8edf3;\n  --rs60-paper:#ffffff;\n  --rs60-bg:#f7f9fc;\n  --rs60-accent:#ba4f21;\n  --rs60-accent-deep:#8e3519;\n  --rs60-green:#16764c;\n  background:var(--rs60-bg)!important;\n}\nbody.rs60-product .container--product-single,\nbody.rs60-product .rs60-after-main {max-width:1280px!important;margin-left:auto;margin-right:auto}\nbody.rs60-product .container--product-single{margin-top:16px!important}\nbody.rs60-product .rs60-layout{display:grid!important;grid-template-columns:minmax(0,1.07fr) minmax(350px,.93fr);gap:26px!important;align-items:start!important}\nbody.rs60-product .rs60-layout>.main-content,\nbody.rs60-product .rs60-layout>.product-details-col {position:static!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow:visible!important;top:auto!important}\nbody.rs60-product .rs60-layout>.product-details-col{\n  color:var(--rs60-ink)!important;background:var(--rs60-paper)!important;border:1px solid var(--rs60-line);\n  border-radius:22px;box-shadow:0 10px 38px rgba(22,37,54,.055);padding:clamp(18px,2.4vw,30px)\n}\nbody.rs60-product .rs60-layout>.product-details-col>h1{font-size:clamp(21px,2.2vw,30px)!important;line-height:1.65!important;font-weight:800!important;letter-spacing:-.35px;margin:0 0 16px!important;color:var(--rs60-ink)!important}\nbody.rs60-product .rs60-layout>.main-content>.images-wrapper{background:#fff;border:1px solid var(--rs60-line);border-radius:24px;overflow:hidden;padding:clamp(10px,2vw,22px);box-shadow:0 12px 36px rgba(20,34,51,.05)}\nbody.rs60-product .rs60-layout .images-wrapper .details-slider{border-radius:16px!important;overflow:hidden;margin-bottom:0!important}\nbody.rs60-product .rs60-layout .images-wrapper .s-slider-thumbs{margin-top:12px}\nbody.rs60-product .rs60-layout .images-wrapper .s-slider-thumbs .swiper-slide{overflow:hidden;border-radius:12px;border:2px solid transparent;background:#f7f8fa;cursor:pointer}\nbody.rs60-product .rs60-layout .images-wrapper .s-slider-thumbs .swiper-slide-thumb-active{border-color:var(--rs60-accent)}\nbody.rs60-product .rs60-layout .images-wrapper .promotion-title{z-index:5;border-radius:0 0 0 12px}\nbody.rs60-product .rs60-layout>.product-details-col>.flex.whitespace-nowrap{flex-wrap:wrap!important;align-items:center;gap:12px!important;margin:0 0 12px!important;padding:14px 0;border-top:1px solid var(--rs60-line);border-bottom:1px solid var(--rs60-line)}\nbody.rs60-product .product-details-col .sale-price,\nbody.rs60-product .product-details-col .starting-or-normal-price .total-price{font-size:clamp(27px,3vw,35px)!important;font-weight:850!important;color:#d62d20!important;line-height:1.4!important}\nbody.rs60-product .product-details-col .regular-price{text-decoration:line-through;color:#94a3b8!important;font-size:17px!important}\nbody.rs60-product .rs60-discount{background:#fff2e9;border:1px solid #ffd9bd;color:#a33f13;font-weight:800;font-size:12px;padding:6px 10px;border-radius:999px;white-space:nowrap}\nbody.rs60-product .rs60-price-note{font-size:12px;font-weight:600;color:var(--rs60-muted);margin:0 0 12px}\nbody.rs60-product .product-details-col .product-metadata{margin-bottom:16px!important}\nbody.rs60-product .product-details-col .product-metadata strong,\nbody.rs60-product .product-details-col .product-metadata span{font-size:13px}\nbody.rs60-product .product-details-col .product-form{margin:0!important}\nbody.rs60-product .product-details-col .product-form>.bg-white,\nbody.rs60-product .product-details-col .product-form>.product-details__item{background:#fbfcfe!important;color:var(--rs60-ink)!important;border:1px solid var(--rs60-line);border-radius:12px;padding:12px!important;margin:0 0 12px!important}\nbody.rs60-product .rs60-section{margin:16px 0 0;border:1px solid var(--rs60-line);border-radius:18px;background:linear-gradient(145deg,#fff,#fcfdff);padding:16px}\nbody.rs60-product .rs60-section-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 6px}\nbody.rs60-product .rs60-section-title{font-size:17px!important;font-weight:850!important;color:var(--rs60-ink)!important;margin:0;line-height:1.6}\nbody.rs60-product .rs60-section-flag{font-size:11px;color:var(--rs60-green);background:#edf9f2;border-radius:99px;padding:5px 9px;font-weight:800}\nbody.rs60-product .rs60-section-desc{font-size:12px;color:var(--rs60-muted);line-height:1.9;margin:0 0 12px}\nbody.rs60-product .rs60-products{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\nbody.rs60-product .rs60-item{position:relative;display:flex;gap:9px;align-items:center;background:#fff;border:1.5px solid #e3e8ef;border-radius:13px;padding:9px;min-height:106px;transition:border-color .17s,background .17s,box-shadow .17s}\nbody.rs60-product .rs60-item:focus-within{outline:2px solid #f5bf97;outline-offset:1px}\nbody.rs60-product .rs60-item.is-selected{background:#fff8f3;border-color:var(--rs60-accent);box-shadow:0 0 0 2px rgba(186,79,33,.09)}\nbody.rs60-product .rs60-item-photo{flex:0 0 74px;width:74px;height:78px;border-radius:10px;background:#f8fafc;display:flex;align-items:center;justify-content:center;overflow:hidden}\nbody.rs60-product .rs60-item-photo img{width:100%;height:100%;object-fit:contain}\nbody.rs60-product .rs60-item-info{min-width:0;flex:1;display:flex;flex-direction:column;gap:5px;align-items:flex-start}\nbody.rs60-product .rs60-item-name{font-size:12px;font-weight:750;line-height:1.55;color:var(--rs60-ink);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-decoration:none}\nbody.rs60-product .rs60-item-name:hover{color:var(--rs60-accent)}\nbody.rs60-product .rs60-item-price{color:var(--rs60-accent-deep);font-size:13px;font-weight:850;line-height:1.3}\nbody.rs60-product .rs60-item-price small{font-size:10px;font-weight:600;color:var(--rs60-muted)}\nbody.rs60-product .rs60-item-price del{font-size:10px;font-weight:500;color:#94a3b8;margin-inline-start:5px}\nbody.rs60-product .rs60-pick{border:1px solid #d4dce7;border-radius:8px;background:#fff;font-weight:800;color:#344256;padding:5px 9px;font-size:11px;line-height:1.6;cursor:pointer}\nbody.rs60-product .rs60-item.is-selected .rs60-pick{background:var(--rs60-accent);border-color:var(--rs60-accent);color:#fff}\nbody.rs60-product .rs60-paid-check{display:inline-flex;gap:6px;align-items:center;font-weight:750;font-size:11px;cursor:pointer;color:#334155}\nbody.rs60-product .rs60-paid-check input{width:16px;height:16px;accent-color:var(--rs60-accent);cursor:pointer}\nbody.rs60-product .rs60-small-link{font-size:12px;color:var(--rs60-accent-deep);font-weight:800;text-decoration:underline;text-underline-offset:2px}\nbody.rs60-product .rs60-total{display:flex;justify-content:space-between;align-items:center;gap:6px;padding:12px 4px 0;font-size:12px;color:var(--rs60-muted);border-top:1px dashed var(--rs60-line);margin-top:12px}\nbody.rs60-product .rs60-total strong{font-size:14px;font-weight:850;color:var(--rs60-ink)}\nbody.rs60-product .rs60-live{font-size:12px;line-height:1.7;border-radius:10px;margin:10px 0 0;padding:0;color:var(--rs60-muted)}\nbody.rs60-product .rs60-live:not(:empty){background:#f3f7fc;border:1px solid #e0eaf6;padding:9px}\nbody.rs60-product .rs60-live[data-status=ok]{background:#eaf9ee;border-color:#c1e8cc;color:#166438}\nbody.rs60-product .rs60-live[data-status=warn]{background:#fff5ec;border-color:#f1d4b9;color:#91501d}\nbody.rs60-product .rs60-layout .addtocart-bar{margin:18px 0 12px!important;padding:0!important;align-items:stretch!important;gap:11px!important;display:flex!important}\nbody.rs60-product .rs60-layout .addtocart-bar>div.center-between{border:1px solid #dbe2eb;border-radius:13px;min-width:116px;justify-content:center;padding:4px;background:#fff}\nbody.rs60-product .rs60-layout .addtocart-bar salla-add-product-button{flex:1!important;min-width:0!important}\nbody.rs60-product .rs60-layout .addtocart-bar salla-add-product-button button{min-height:55px!important;border-radius:13px!important;background:var(--rs60-accent)!important;border:none!important;color:#fff!important;font-size:16px!important;font-weight:900!important;box-shadow:0 7px 17px rgba(186,79,33,.22)}\nbody.rs60-product .rs60-layout .addtocart-bar salla-add-product-button button:hover{background:var(--rs60-accent-deep)!important}\nbody.rs60-product .rs60-trust{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:12px}\nbody.rs60-product .rs60-trust-item{border:1px solid var(--rs60-line);background:#fbfcff;border-radius:12px;padding:10px 7px;text-align:center}\nbody.rs60-product .rs60-trust-emoji{display:block;font-size:22px;margin-bottom:4px}\nbody.rs60-product .rs60-trust-item strong{font-size:11px;color:var(--rs60-ink);font-weight:850;display:block;line-height:1.5}\nbody.rs60-product .rs60-trust-item span:last-child{display:block;font-size:10px;color:var(--rs60-muted);margin-top:2px}\nbody.rs60-product .rs60-after-main{margin-top:24px;margin-bottom:32px;display:grid;gap:16px}\nbody.rs60-product .rs60-native-offers,\nbody.rs60-product .rs60-description-panel{background:#fff;border:1px solid var(--rs60-line);border-radius:20px;padding:clamp(15px,2.5vw,26px);box-shadow:0 9px 26px rgba(20,34,51,.04)}\nbody.rs60-product .rs60-after-heading{margin:0 0 14px;font-size:19px;font-weight:900;color:var(--rs60-ink)}\nbody.rs60-product .rs60-description-tabs{display:flex;gap:12px;border-bottom:1px solid var(--rs60-line);padding-bottom:13px;margin-bottom:20px}\nbody.rs60-product .rs60-tab{display:inline-flex;padding:9px 14px;border-radius:9px;font-weight:800;font-size:13px;color:var(--rs60-ink);text-decoration:none}\nbody.rs60-product .rs60-tab.is-current{background:#fff1e7;color:var(--rs60-accent-deep)}\nbody.rs60-product .rs60-description-source,\nbody.rs60-product .rs60-description-source .rs56-content{color:#364152!important;font-size:15px!important;line-height:2.05!important;max-width:100%!important}\nbody.rs60-product .rs60-description-source h2{font-size:21px!important;margin:19px 0 10px!important;font-weight:900!important;line-height:1.6;color:var(--rs60-ink)!important}\nbody.rs60-product .rs60-description-source h3{font-size:17px!important;margin:16px 0 7px!important;font-weight:850!important;color:var(--rs60-ink)!important}\nbody.rs60-product .rs60-description-source p{margin:8px 0!important}\nbody.rs60-product .rs60-description-source ul,\nbody.rs60-product .rs60-description-source ol{padding-right:23px;list-style:revert;margin:10px 0}\nbody.rs60-product .rs60-description-source img{height:auto!important;max-width:100%!important;border-radius:12px}\nbody.rs60-product .rs60-description-source table{max-width:100%;display:block;overflow-x:auto}\nbody.rs60-product .rs60-description-source .rs56-tabs{display:none!important}\nbody.rs60-product .rs60-gift-category-banner{max-width:1280px;margin:22px auto;background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;padding:17px;color:#8a4c18;font-size:14px;font-weight:750}\nbody.rs60-product .rs60-empty{grid-column:1/-1;color:var(--rs60-muted);font-size:12px;background:#f8fafc;border-radius:10px;padding:15px}\nbody.rs60-product .rs60-cart-notice{max-width:1100px;margin:16px auto;padding:13px;border:1px solid #d9e4f0;border-radius:12px;background:#f7faff;font-size:14px;color:#344256}\n@media (min-width:1000px){body.rs60-product .rs60-layout>.main-content{position:sticky!important;top:90px!important}}\n@media(max-width:960px){\n  body.rs60-product .rs60-layout{grid-template-columns:minmax(0,1fr)!important;gap:15px!important}\n  body.rs60-product .rs60-layout>.main-content{position:static!important}\n  body.rs60-product .rs60-layout>.product-details-col{padding:17px}\n  body.rs60-product .rs60-products{grid-template-columns:repeat(2,minmax(0,1fr))}\n  body.rs60-product .rs60-after-main{padding:0 15px}\n}\n@media(max-width:560px){\n  body.rs60-product .rs60-layout>.product-details-col{border-radius:16px;padding:14px!important}\n  body.rs60-product .rs60-layout>.main-content>.images-wrapper{border-radius:16px;padding:8px}\n  body.rs60-product .rs60-products{grid-template-columns:1fr}\n  body.rs60-product .rs60-item{min-height:94px}\n  body.rs60-product .rs60-item-photo{flex-basis:70px;width:70px;height:70px}\n  body.rs60-product .rs60-section{padding:12px}\n  body.rs60-product .rs60-trust-item{padding:9px 4px}\n  body.rs60-product .rs60-trust-item strong{font-size:10px}\n  body.rs60-product .rs60-layout .addtocart-bar>div.center-between{min-width:90px}\n  body.rs60-product .rs60-layout .addtocart-bar salla-add-product-button button{font-size:14px!important}\n}\n\n\n/* V61 Mobile: gift & paid recommendations are ALWAYS shown, not an unopened accordion. */\nbody.rs60-product .rs60-gift-section,\nbody.rs60-product .rs60-paid-section {display:block!important;visibility:visible!important;opacity:1!important;height:auto!important;max-height:none!important;overflow:visible!important}\nbody.rs60-product .rs60-gift-section .rs60-products,\nbody.rs60-product .rs60-paid-section .rs60-products {display:grid!important;visibility:visible!important;opacity:1!important;max-height:none!important;height:auto!important;overflow:visible!important}\nbody.rs60-product .rs60-section{background:#fff!important;box-shadow:none!important;border-color:#eadfd9!important}\nbody.rs60-product .rs60-section-desc{display:block!important}\nbody.rs60-product .rs60-gift-section{border-color:#efcbae!important}\nbody.rs60-product .rs60-paid-section{border-color:#d6e4dc!important}\nbody.rs60-product .rs60-item{background:#fff!important;min-width:0!important;min-height:100px}\nbody.rs60-product .rs60-item-info{min-width:0!important}\nbody.rs60-product .rs60-item-photo{flex-shrink:0!important}\nbody.rs60-product .rs60-item-photo img {width:100%!important;height:100%!important;max-width:100%!important;object-fit:contain!important;visibility:visible!important}\nbody.rs60-product .rs60-pick{background:#fff!important;color:#8e3519!important}\nbody.rs60-product .rs60-item.is-selected .rs60-pick{background:#ba4f21!important;color:#fff!important}\nbody.rs60-product .rs60-fallback-note{color:#697586;font-size:12px;margin:7px 0}\nbody.rs60-product .rs60-layout .addtocart-bar>div.center-between{\n  height:auto!important;min-height:52px!important;max-width:136px!important;\n}\nbody.rs60-product .rs60-layout salla-quantity-input input{background:#fff!important;color:#1f2937!important}\nbody.rs60-product .rs60-layout .product-form{padding-bottom:15px!important}\n@media(max-width:767px){\n  body.rs60-product .rs60-layout>.product-details-col{max-width:100%!important;overflow:visible!important}\n  body.rs60-product .rs60-products{grid-template-columns:1fr!important;gap:10px!important}\n  body.rs60-product .rs60-item{display:flex!important;flex-direction:row!important;padding:10px!important}\n  body.rs60-product .rs60-item-photo{flex-basis:78px!important;width:78px!important;height:78px!important}\n  body.rs60-product .rs60-item-info{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:6px!important}\n  body.rs60-product .rs60-item-name{font-size:13px!important;line-height:1.6!important}\n  body.rs60-product .rs60-pick{font-size:12px!important;min-height:40px!important}\n  body.rs60-product .rs60-section-title{font-size:16px!important}\n  body.rs60-product .rs60-layout .addtocart-bar{display:flex!important;flex-wrap:nowrap!important;width:100%!important}\n}\n/* WARRANTY: keeps old gold badge styling for approved massage chairs only. */\n\n/* RELAX SMART V54 — selected massage-chair two-year golden seal.\n   Install INSTEAD of the older warranty badge patches, not alongside them.\n   Does not modify product price, discounts, cart or gift choices. */\n\n/* Hide badges generated by older warranty scripts; leave sale/model ribbons untouched. */\n.rs54-warranty-active .rs20-warranty,\n.rs54-warranty-active .rs48-proof,\n.rs54-warranty-active .rs46-card-badge--warranty,\n.rs54-warranty-active .rs46-gallery-badge--warranty,\n.rs54-warranty-active .rs46-guarantee,\n.rs54-warranty-active .rs45-guarantee { display: none !important; }\n\n.rs54-warranty-host { position: relative !important; }\n.rs54-gold-seal, .rs54-gold-seal * { box-sizing: border-box; }\n.rs54-gold-seal {\n  position: absolute;\n  inset: auto auto 9px 9px;\n  z-index: 8;\n  width: 76px;\n  height: 76px;\n  border-radius: 50%;\n  border: 3px solid #a56b15;\n  background: radial-gradient(circle at 29% 17%, #fffbe6 0%, #ffe8a0 24%, #e8b84f 52%, #ba801d 80%, #925c0f 100%);\n  color: #65410e !important;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 1px;\n  text-align: center;\n  line-height: 1.16;\n  font-family: inherit;\n  box-shadow: 0 7px 20px rgba(103,65,7,.31), inset 0 2px 5px rgba(255,255,255,.78), inset 0 -3px 7px rgba(94,56,4,.28);\n  pointer-events: none;\n  user-select: none;\n  direction: rtl;\n}\n.rs54-gold-seal::before {\n  content: '';\n  position: absolute;\n  inset: 5px;\n  border-radius: 50%;\n  border: 1.5px solid rgba(255,248,208,.92);\n  box-shadow: inset 0 0 0 1px rgba(137,87,8,.34);\n}\n.rs54-gold-seal::after {\n  content: '';\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  width: 25px;\n  height: 10px;\n  border-radius: 50%;\n  transform: rotate(-21deg);\n  background: rgba(255,255,255,.38);\n}\n.rs54-seal-small, .rs54-seal-years, .rs54-seal-note {\n  position: relative;\n  z-index: 1;\n  color: #65410e !important;\n  display: block;\n  text-shadow: 0 1px 0 rgba(255,255,255,.65);\n}\n.rs54-seal-small { font-size: 10px; font-weight: 900; }\n.rs54-seal-years { font-size: 17px; font-weight: 950; }\n.rs54-seal-note { font-size: 9px; font-weight: 800; }\n\n/* On detail pages the seal is placed BELOW the gallery, never over the sale ribbon. */\n.rs54-detail-proof {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  direction: rtl;\n  background: linear-gradient(110deg,#fff9e9,#fff4cf);\n  border: 1px solid #e0bd6c;\n  border-radius: 16px;\n  padding: 12px;\n  margin: 14px 0;\n  max-width: 100%;\n  box-shadow: 0 7px 22px rgba(119,77,12,.08);\n}\n.rs54-detail-proof .rs54-gold-seal {\n  position: relative;\n  inset: auto;\n  flex: 0 0 88px;\n  width: 88px;\n  height: 88px;\n}\n.rs54-detail-proof .rs54-seal-small { font-size: 12px; }\n.rs54-detail-proof .rs54-seal-years { font-size: 20px; }\n.rs54-detail-proof .rs54-seal-note { font-size: 10px; }\n.rs54-detail-copy { min-width: 0; display: flex; flex-direction: column; gap: 5px; }\n.rs54-detail-copy strong { color: #79521a !important; font-size: 16px; font-weight: 900; }\n.rs54-detail-copy span { color: #876d44 !important; font-size: 12px; line-height: 1.6; }\n\n@media (max-width: 640px) {\n  .rs54-gold-seal { width: 59px; height: 59px; border-width: 2px; inset: auto auto 6px 6px; }\n  .rs54-gold-seal::before { inset: 4px; }\n  .rs54-gold-seal::after { top: 7px; left: 8px; width: 18px; height: 7px; }\n  .rs54-seal-small { font-size: 8px; }\n  .rs54-seal-years { font-size: 13px; }\n  .rs54-seal-note { font-size: 7px; }\n  .rs54-detail-proof { gap: 10px; padding: 9px; }\n  .rs54-detail-proof .rs54-gold-seal { flex-basis: 72px; width: 72px; height: 72px; }\n  .rs54-detail-proof .rs54-seal-years { font-size: 17px; }\n  .rs54-detail-copy strong { font-size: 14px; }\n  .rs54-detail-copy span { font-size: 11px; }\n}\n\n\n/* V62: visible retry only for a pending cart selection. */\nhtml body .rs62-retry{display:block!important;margin:4px auto 15px;padding:10px 18px;border-radius:10px;\n background:#d67027!important;color:#fff!important;border:0;font-weight:800;cursor:pointer}\nhtml body .rs62-retry[hidden]{display:none!important}\nbody.rs60-product .rs60-fire{display:inline-flex!important;align-items:center!important;gap:6px!important;background:linear-gradient(135deg,#ff8b37,#ef3a2c)!important;color:#fff!important;border:0!important;border-radius:999px!important;padding:7px 12px!important;font-size:12px!important;font-weight:900!important;box-shadow:0 8px 18px rgba(239,58,44,.18)!important;white-space:nowrap!important;margin-inline-end:6px!important}\nbody.rs60-product .rs60-native-offers{margin-top:18px!important;background:#fff!important;border:1px solid var(--rs60-line)!important;border-radius:20px!important;padding:18px!important;box-shadow:0 10px 28px rgba(20,34,51,.05)!important}\nbody.rs60-product .rs60-native-offers .rs60-after-heading{margin:0 0 12px!important;font-size:24px!important;font-weight:900!important;color:var(--rs60-ink)!important}\nbody.rs60-product .rs60-native-offers :is(salla-offer,.s-offer-wrapper,.s-offer-list,.s-offer-container,.s-offer-cards,.s-slider-block,.s-slider-block__content){background:#fff!important;background-color:#fff!important;border:0!important;box-shadow:none!important}\nbody.rs60-product .rs60-native-offers :is(.bg-rose-50,.bg-pink-50,.bg-red-50,[class*=\"bg-rose-\"],[class*=\"bg-pink-\"],[class*=\"bg-red-\"]) {background:#fff!important}\nbody.rs60-product .rs60-native-offers :is(.s-offer-card,.offer-card,.offer-item,.s-block-card){background:#fff!important;border:1px solid #e8edf3!important;border-radius:14px!important;box-shadow:none!important;padding:16px!important}\nbody.rs60-product .rs60-native-offers :is(.s-offer-card-title,.offer-title,h3,h4){color:var(--rs60-ink)!important}\nbody.rs60-product .rs60-native-offers :is(p,span,a,li,strong){color:#475569!important}\n@media(min-width:1000px){body.rs60-product .rs60-layout>.main-content .rs60-native-offers{margin-top:16px!important}}\nhtml body .rs60-cart-notice{max-width:1100px;width:calc(100% - 28px);direction:rtl;line-height:1.8}\n";
  (document.head||document.documentElement).appendChild(style);
  function preferLight(){
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme='light';
    if(document.body){
      document.body.classList.remove('dark','color-mode-dark');
      document.body.classList.add('color-mode-light');
      if(/\/p\d+(?:\/|$)/.test(location.pathname)&&window.innerWidth<=767)
        document.body.classList.remove('fixed-add-to-cart-bar');
    }
  }
  preferLight();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',preferLight,{once:true});
  document.addEventListener('theme::ready',preferLight,{once:true});
  [500,1800].forEach(ms=>setTimeout(preferLight,ms));
})();

/*
 * RELAX SMART V65 (Salla Twilight)
 * Product pages: premium layout + real category gifts + paid product recommendations.
 * Gift discount is awarded ONLY by the Salla server-side "Buy 1 Get 1 Free" offer.
 * No code here changes checkout totals, product prices or tax.
 * Install once, replacing ALL older custom JS product/gift snippets (V35–V59).
 */
(() => {
  'use strict';
  if (window.__relaxSmartV65) return;
  window.__relaxSmartV65 = true;
  window.__relaxSmartV64 = true;
  window.__relaxSmartV63 = true;
  window.__relaxSmartV62 = true;
  window.__relaxSmartV61 = true;
  window.__relaxSmartV60 = true;
  // Inhibit previously referenced scripts if they are loaded later by mistake.
  ['__relaxSmartV53','__relaxSmartV52','__relaxSmartV51','__relaxSmartV49',
   '__relaxSmartV47','__relaxSmartV46','__rs50Gifts','__relaxSmartNativeGift'
  ].forEach(k => {window[k]=true;});

  const GIFT_PATH = '/ar/piece-plus-piece/c544380334';
  const STORAGE = 'relaxsmart:v65:pending';
  const V92_FALLBACK_STORAGE = 'relaxsmart:v92:pending';
  const LEGACY_STORAGE = 'relaxsmart:v64:pending';
  const LEGACY_STORAGE_2 = 'relaxsmart:v63:pending';
  const PRODUCT_RE = /\/p(\d+)(?:\/|$)/i;
  const isProductPage = PRODUCT_RE.test(location.pathname);
  const isCartPage = /\/(?:ar\/)?(?:cart|shopping-cart)(?:\/|$)/i.test(location.pathname);
  const $ = (s, scope=document) => scope.querySelector(s);
  const $$ = (s, scope=document) => Array.from(scope.querySelectorAll(s));
  const clean = s => String(s||'').replace(/\s+/g,' ').trim();
  const wait = t => new Promise(resolve => setTimeout(resolve,t));
  const make = (tag, cls='', text) => {
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  const skuOf = url => Number(String(url||'').match(PRODUCT_RE)?.[1]||0);
  const currentId = () => Number($('[name="id"]', $('.container--product-single .product-details-col .product-form')||document)?.value||
                  $('.container--product-single [id^="product-"]')?.id.match(/product-(\d+)/)?.[1]||skuOf(location.pathname));
  const normalizeArabic = s => clean(String(s||'')).replace(/[ً-ٰٟ]/g,'').replace(/[أإآ]/g,'ا').replace(/[ى]/g,'ي').replace(/[ؤ]/g,'و').replace(/[ئ]/g,'ي').replace(/ة/g,'ه').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  function pathOf(value){
    if(!value) return '';
    if(typeof value==='string'){
      try{return new URL(value,location.origin).pathname.replace(/\/+$/,'')||'';}catch{return String(value).replace(/[?#].*$/,'').replace(/\/+$/,'');}
    }
    return pathOf(value.url||value.href||value.path||value.permalink||value.slug||value.link||value.product_url);
  }
  function lineName(it){return clean(it?.name||it?.product_name||it?.product?.name||it?.title||it?.product?.title||'');}
  function itemIds(it){
    return [it?.product_id,it?.product?.id,it?.product?.product_id,it?.id].map(x=>Number(x)).filter(Number.isSafeInteger);
  }
  function isKnownGiftLine(it){
    return itemIds(it).some(id=>knownGiftIDs.has(id)) || knownGiftIDs.has(Number(it?.product_id));
  }
  function mainLineMatches(it,q){
    if(!it||isKnownGiftLine(it)||isFreeLine(it)) return false;
    if(itemIds(it).includes(Number(q.main))) return true;
    const mainPath = pathOf(q.mainPath);
    const linePath = pathOf(it?.product?.url||it?.product_url||it?.url||it?.path||it?.href);
    if(mainPath && linePath && (mainPath===linePath || (skuOf(mainPath) && skuOf(mainPath)===skuOf(linePath)))) return true;
    const a = normalizeArabic(q.mainName);
    const b = normalizeArabic(lineName(it));
    if(a && b && (a===b || b.includes(a) || a.includes(b))) return true;
    return false;
  }
  function findMainLine(cart,q){
    if(!cart?.items?.length) return null;
    const lines = cart.items.filter(it=>!isKnownGiftLine(it) && !isFreeLine(it));
    // Never assume that the only SDK line is the selected main product:
    // product ids and item ids are different in Salla.
    return lines.find(it=>mainLineMatches(it,q)) || null;
  }
  const numberArabic = s => String(s||'').replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)))
      .replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/٫/g,'.').replace(/٬/g,',');
  function moneyNumber(x){
    if(x && typeof x==='object') return moneyNumber(x.amount??x.value??x.price);
    if(typeof x==='number')return Number.isFinite(x)?x:null;
    const t=numberArabic(x).replace(/\s/g,'');
    const m=t.match(/(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?/);
    if(!m)return null;
    const n=Number(m[0].replace(/,/g,''));return Number.isFinite(n)?n:null;
  }
  const SAR = n => new Intl.NumberFormat('ar-SA',{maximumFractionDigits:2}).format(n)+' ر.س';
  function safeProductLink(href){
    try{const u=new URL(href,location.origin);return u.origin===location.origin&&PRODUCT_RE.test(u.pathname)?u.href:'';}
    catch{return '';}
  }
  function safeImage(href){
    try{const u=new URL(href,location.origin);return /^https?:$/.test(u.protocol)?u.href:'';}catch{return '';}
  }
  function fromCard(card){
    const dataRoot=card.shadowRoot||card;
    const a=$('.product-entry__title a[href],.s-product-card-content-title a[href],a[href*="/p"]',dataRoot);
    const href=safeProductLink(a?.getAttribute('href')||$('.product-entry__image-wrap[href]',dataRoot)?.getAttribute('href'));
    const id=Number(card.id?.match(/product_(\d+)/)?.[1]||card.getAttribute('product-id')||skuOf(href));
    const name=clean(a?.textContent||$('.product-entry__title,.s-product-card-content-title',dataRoot)?.textContent);
    const button=$('salla-add-product-button',dataRoot);
    const status=button?.getAttribute('product-status')||'';
    const out=$('.out-of-stock',dataRoot);
    // DOMParser returns detached documents: computedStyle on them is unreliable.
    if(!id||!href||!name||/out|unavailable/i.test(status)||
      (out&&!out.classList.contains('hidden')&&out.getAttribute('aria-hidden')!=='true'))return null;
    const im=$('.product-entry__image img,.s-product-card-image img,img',dataRoot);
    const img=safeImage(im?.getAttribute('data-src')||im?.getAttribute('src'));
    const currentEl=$('.price_is_on_sale:not(.hidden) .total-price',dataRoot)||
      $('.starting-or-normal-price:not(.hidden) .total-price',dataRoot)||
      $('.s-product-card-price,.total-price',dataRoot);
    const current=moneyNumber(currentEl?.textContent);
    const original=moneyNumber($('.before-price,.regular-price',dataRoot)?.textContent);
    return {id,name,href,image:img,current,original};
  }
  function catalogCards(root,max=12){
    const seen=new Set(),result=[];
    $$('custom-salla-product-card,salla-product-card,.s-product-card-entry',root).forEach(card=>{
      if(result.length>=max)return;
      const p=fromCard(card);
      if(p && !seen.has(p.id) && p.id!==currentId()){seen.add(p.id);result.push(p);}
    });
    return result;
  }
  // These six items are from the supplied Relax Smart category snapshot, used only
  // if its category HTML does not expose cards (e.g. client-rendered catalog).
  const KNOWN_GIFTS = [
    {id:751657958,name:'أداة ديرما رولر 6 في 1 للعناية بالبشرة',url:'/ar/أداة-ديرما-رولر-6-في-1-للعناية-الكاملة-بالبشرة-أحمرأبيض/p751657958',img:'658a27ed-f8f2-4aa5-ba04-a11163bf93d2-500x500-A4aytUq3CvXt9ohtkzXlrEF9PsA5nVWtRgtmRBJe.png'},
    {id:1609638591,name:'ديرما رول للعناية بالوجه',url:'/ar/ديرما-رول-مفرد-للعناية-بالوجه/p1609638591',img:'ce16eb2b-eab4-4abd-ad68-ef9bc8662708-365.08753861998x500-3ZxAlGi26D23aUTSA8vTd3iivUIvGtFVrgqcUJRX.jpg'},
    {id:692508165,name:'واقي دعم الركبة',url:'/ar/واقي-دعم-الركبة-وحمايتها-من-البرد/p692508165',img:'8800f7b8-c3d6-4b7d-87d1-1020b64e350c-500x500-LymDZDc10ip48NDJ0q3KaAuWoZC7K45oMWMI0IRl.png'},
    {id:525100787,name:'دعامة مزدوجة للركبة',url:'/ar/دعامة-مزدوجة-للركبة-لدعم-الحركة/p525100787',img:'e60554ce-fc0c-4334-9a2a-c27cafdde1e3-500x500-HmgLpaRRA56jvOQm7QUF3x3hfDhZv8ojayCcP2Rd.png'},
    {id:381876381,name:'وسادة دعم الرقبة للسيارة',url:'/ar/وسادة-دعم-الرقبة-لمقعد-السيارة-أثناء-الجلوس/p381876381',img:'48baff76-40c2-475b-9a4e-c092d83252c2-500x500-2xrnwZHRsOVWGclY62Rz8dAQxWWycGuU8w32QYFp.png'},
    {id:1918852576,name:'نعل داخلي لدعم القدم',url:'/ar/نعل-داخلي-لدعم-القدم-وامتصاص-الصدمات/p1918852576',img:'e2f0a6da-88a0-4050-93a6-ef0fb9d9116a-364.96694995279x500-P6GcQGv8ZVOlztcmmnhpYMsNGqpLhJDmGdJaRVGH.jpg'}
  ].map(p=>({id:p.id,name:p.name,href:new URL(p.url,location.origin).href,
      image:'https://cdn.salla.sa/OqbzvY/'+p.img,current:null,original:null}));

  // Confirmed examples from the owner's uploaded product HTML, NOT fabricated products.
  // Current prices are fetched from product pages before display (not hardcoded).
  const CURATED_ADDONS = [
    {id:1182125663,name:'وسادة ميموري فوم مع جل للنوم مقاس 60×40 سم',href:'/ar/a204/p1182125663',image:'https://cdn.files.salla.network/products/138831996/51c2abf6-1d71-41b8-9ac8-0d7b1df6b727-original.webp'},
    {id:315536769,name:'وسادة إسفينية قابلة للنفخ لدعم الظهر والساق',href:'/ar/a178/p315536769',image:'https://cdn.files.salla.network/products/138831996/18000a8d-f620-43a8-931c-abf767472a3f-original.webp'},
    {id:663667699,name:'وسادة مقعد إسفنجية رمادية للجلوس',href:'/ar/a193/p663667699',image:'https://cdn.files.salla.network/products/138831996/db899d40-8dc1-4d31-ab03-127db095fa9d-original.webp'},
    {id:622042676,name:'كمادة تدفئة للظهر حجم كبير',href:'/ar/كمادة-ظهر/p622042676',image:'https://cdn.salla.sa/OqbzvY/EOJqRxmsxcrLQHvVjDC4rvJA8v8W3pbjyRuD9nXN.jpg'},
    {id:740212206,name:'مقعد سيارة للأطفال مع وسادة ودعم للجسم',href:'/ar/baby-car-seat-body-support/p740212206',image:'https://cdn.files.salla.network/products/138831996/4052d670-3bb5-4355-b1e5-5ab7c14e45c2-original.webp'}
  ];
  const knownGiftIDs=new Set(KNOWN_GIFTS.map(x=>x.id));
  let processing=false,ui=null;

  async function fetchCardPage(path){
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),6000);
    try{
      const res=await fetch(path,{credentials:'same-origin',signal:controller.signal});
      if(!res.ok)return null;
      const raw=await res.text();return new DOMParser().parseFromString(raw,'text/html');
    }catch{return null;}finally{clearTimeout(timer);}
  }
  // V91: use only option values actually selected on the gift product page.
  // Never invent a color, size, or 100% discount on behalf of the customer.
  const rs91GiftChecks=new Map();
  async function inspectGift(giftId, suppliedHref){
    const path=safeProductLink(suppliedHref||'') || KNOWN_GIFTS.find(p=>p.id===Number(giftId))?.href || '';
    if(!path)return {ok:false,needsChoice:true,reason:'لا يوجد رابط موثوق لصفحة الهدية'};
    const key=String(giftId)+':'+path;
    if(rs91GiftChecks.has(key))return rs91GiftChecks.get(key);
    const task=(async()=>{
      const productDoc=await fetchCardPage(path);
      if(!productDoc)return {ok:false,needsChoice:true,reason:'تعذر فتح صفحة الهدية للتحقق من بيانات المنتج؛ افتحي صفحتها أولًا'};
      const form=$('.container--product-single .product-details-col form.product-form,form.product-form',productDoc);
      // In Salla some full product forms hydrate only on the client; a missing
      // static form does not prove required options. Make ONE backend-validated
      // SDK request, then surface the real rejection if it fails.
      if(!form)return {ok:true,options:{},unverified:true};
      const formId=Number($('input[name="id"]',form)?.value||0);
      if(formId&&formId!==Number(giftId))return {ok:false,needsChoice:true,reason:'رابط الهدية لم يعُد يشير للمنتج المختار'};
      const button=$('salla-add-product-button',form);
      if(button&&/out|unavailable|sold|disabled/i.test(button.getAttribute('product-status')||''))
        return {ok:false,needsChoice:true,reason:'الهدية غير متاحة للشراء حاليًا'};
      const options={};const fields=$$('[name^="options["]',form).filter(el=>!el.disabled);
      const groups=new Map();
      fields.forEach(el=>{
        const match=(el.name||'').match(/^options\[(\d+)\](?:\[\])?$/);
        if(match){if(!groups.has(match[1]))groups.set(match[1],[]);groups.get(match[1]).push(el);}
      });
      let missing=false;
      for(const [id,controls] of groups){
        const typ=(controls[0]?.type||'').toLowerCase();
        const choice=controls.find(el=>{
          if(el.type==='radio'||el.type==='checkbox')return el.checked;
          return String(el.value||'').trim()!=='';
        });
        if(choice){
          const values=controls.filter(el=>el.type==='checkbox'&&el.checked).map(el=>el.value);
          options[id]=values.length>1?values:String(choice.value);
        }else if(controls.some(el=>el.required)||typ==='radio')missing=true;
      }
      // Some stores hydrate option controls inside a custom element after load;
      // static HTML is insufficient to determine its required values.
      const optionHost=$('salla-product-options',form);
      // An empty, unhydrated custom element is not evidence of a required
      // selection. Salla's backend will validate the one full add request.
      if(optionHost&&!fields.length){
        const config=optionHost.getAttribute('options')||'';
        try {
          const listed=JSON.parse(config);
          if(Array.isArray(listed) && listed.some(x=>x && x.required))missing=true;
        }catch(_error){}
      }
      if(missing)return {ok:false,needsChoice:true,reason:'الهدية لها خيارات مطلوبة. افتحي صفحة الهدية وحددي المقاس أو اللون قبل الإضافة'};
      return {ok:true,options};
    })();
    rs91GiftChecks.set(key,task);
    return task;
  }
  function giftDetailLink(q,show){
    const notice=$('.rs60-cart-notice');if(!notice)return;
    $('.rs91-gift-details',notice)?.remove();
    if(!show||!q?.gift)return;
    const href=safeProductLink(q.giftHref||'')||KNOWN_GIFTS.find(p=>p.id===q.gift)?.href;
    if(!href)return;
    const a=make('a','rs91-gift-details','افتحي صفحة الهدية لاستكمال الخيارات والتحقق من أهليتها للعرض');
    a.href=href;a.style.cssText='display:block;margin:7px 0 0;color:#165d96;text-decoration:underline;font-weight:800';
    notice.append(a);
  }
  async function availableGifts(){
    const doc=await fetchCardPage(GIFT_PATH);
    const live=doc?catalogCards(doc,32):[];
    const items=live.length?live:KNOWN_GIFTS;
    items.forEach(p=>knownGiftIDs.add(p.id));
    return items.filter(p=>p.id!==currentId());
  }
  function sdk(){return window.salla||window.Salla;}
  function itemsOf(res){
    // The response nesting differs across Twilight and theme generations.
    // Do not serialise Salla's event Proxies: they may contain cycles.
    const options=[res?.data?.cart,res?.data?.data?.cart,res?.data?.data,
      res?.data?.result?.cart,res?.data?.result,res?.data,res?.cart,
      res?.result?.cart,res?.result?.data?.cart,res?.result?.data,
      res?.result,res];
    for(const c of options){
      if(Array.isArray(c?.items))return c;
      if(Array.isArray(c?.cart?.items))return c.cart;
    }
    return null;
  }
  function domCartSnapshot(){
    // Fallback is exclusively for detecting the paid/main item. It does NOT
    // assert a zero-price gift without the server's offer information.
    if(!isCartPage)return null;
    const roots=$$('main .cart-item,main .cart__item,main .s-cart-item,main .cart-product,main [data-cart-item-id],main [data-testid="cart-item"],main salla-cart-item');
    const items=[];const found=new Set();
    const take=(el)=>{
      const a=$('a[href*="/p"]',el);
      const id=Number(a&&skuOf(a.getAttribute('href'))||el?.getAttribute('data-product-id')||0);
      const title=clean($('h2,h3,.cart-item__name,.cart-product__title,.product-name',el)?.textContent||a?.textContent||'');
      if(id>0&&!found.has(id)){
        found.add(id);items.push({product_id:id,product_name:title,url:a?.href||'',quantity:1,source:'dom'});
      }
    };
    roots.forEach(take);
    // Some Salla cart themes have no stable row class. Restrict to main and
    // add product links only; no heading-only guesses are counted as items.
    if(!roots.length){
      $$('main a[href*="/p"]:not([href*="/piece-plus-piece/"])').slice(0,35).forEach(a=>take(a.parentElement||a));
    }
    return items.length?{items,source:'dom'}:null;
  }
  function visibleMainLine(q){
    // Independent DOM proof: the browser's live cart contains real product links.
    // Do not rely solely on Salla.cart.details() object shape or stale cached data.
    const snap=domCartSnapshot();
    return snap?.items?.find(it=>mainLineMatches(it,q)) || null;
  }
  function visibleCartIds(){
    return (domCartSnapshot()?.items||[]).map(it=>it.product_id).filter(Boolean);
  }
  async function getCart(){
    const cart=sdk()?.cart;
    if(cart){
      for(const method of ['details','latest']){
        if(typeof cart[method]!=='function')continue;
        try{const data=itemsOf(await cart[method]());if(data){
        const visible=domCartSnapshot();
        if(!data.items.length&&visible?.items.length)return visible;
        return data;
      }}catch(_error){}
      }
    }
    return domCartSnapshot();
  }
  const hasItem=(it,id)=>itemIds(it).includes(Number(id))&&Number(it.quantity??1)>0;
  function isFreeLine(it){
    if(it?.offer?.is_free===true)return true;
    // Treat as free only if the server confirms zero payable AND a genuine discount.
    const total=moneyNumber(it?.total_special_price??it?.total);
    const prior=moneyNumber(it?.product_price??it?.original_price);
    return total===0 && prior!==null && prior>0 &&
      (Number(it?.offer?.discount)>0 || it?.has_discount===true ||
       Array.isArray(it?.detailed_offers)&&it.detailed_offers.length>0);
  }
  function readPending(){
    try{
      const candidates=[
        sessionStorage.getItem(STORAGE),localStorage.getItem(V92_FALLBACK_STORAGE),
        sessionStorage.getItem(LEGACY_STORAGE),sessionStorage.getItem(LEGACY_STORAGE_2)
      ].filter(Boolean).map(raw=>{try{return JSON.parse(raw)}catch{return null}})
        .filter(q=>q&&Number.isSafeInteger(q.main)&&Number.isSafeInteger(q.gift)
          &&Number.isFinite(Number(q.at))&&Date.now()-Number(q.at)<30*60*1000);
      if(!candidates.length)return null;
      // Prefer the newest valid selection from this browser, never a stale old
      // session. The main product must still be present in the live cart.
      const q=candidates.sort((a,b)=>Number(b.at)-Number(a.at))[0];
      if(!q.rs92Migrated){
        // Old V91 could record attemptedGift BEFORE the request was cancelled
        // during navigation. Check the real cart first in V92 and try once.
        q.attemptedGift=false;q.rs92Migrated=true;savePending(q);
      }else if(!sessionStorage.getItem(STORAGE))savePending(q);
      return q;
    }catch{return null;}
  }
  function savePending(q){
    try{sessionStorage.setItem(STORAGE,JSON.stringify(q))}catch{}
    try{localStorage.setItem(V92_FALLBACK_STORAGE,JSON.stringify(q))}catch{}
  }
  function clearPending(){
    try{[STORAGE,LEGACY_STORAGE,LEGACY_STORAGE_2].forEach(k=>sessionStorage.removeItem(k))}catch{}
    try{localStorage.removeItem(V92_FALLBACK_STORAGE)}catch{}
  }
  function status(text,tone='info'){
    const live=ui?.live||$('.rs60-cart-notice');
    if(live){live.textContent=text;live.dataset.status=tone;}
    const giftLive=ui?.gift?.wrap?.querySelector('.rs100-gift-feedback');
    if(giftLive){giftLive.textContent=text;giftLive.dataset.status=tone;}
    try{sessionStorage.setItem('relaxsmart:v65:last-status',JSON.stringify({text,tone,at:Date.now()}));}catch{}
  }
  // V96: Salla.cart.submit() is the supported checkout entry. It creates
  // the session-specific URL, unlike the sample checkout link in the brief.
  let rs95CheckoutBusy=false,rs95CheckoutTries=0;
  async function rs95ContinueToCheckout(){
    if(!isCartPage||processing||rs95CheckoutBusy)return;
    const intent=window.__rs95CheckoutIntent?.read();
    if(!intent)return;
    const pending=readPending();
    // Do not send the buyer to payment before a selected gift/add-on is resolved.
    if(pending&&(pending.gift||(pending.paid||[]).length))return;
    rs95CheckoutBusy=true;
    try{
      const cart=await getCart();
      const line=cart?.items?.find(x=>hasItem(x,intent.id)) ||
        domCartSnapshot()?.items?.find(x=>hasItem(x,intent.id));
      if(!line){
        if(++rs95CheckoutTries<=8)setTimeout(()=>void rs95ContinueToCheckout(),600);
        else status('لم نتمكن من تأكيد وجود المنتج بالسلة. راجعيها قبل إتمام الطلب.','warn');
        return;
      }
      const cartApi=sdk()?.cart;
      if(typeof cartApi?.submit!=='function'){
        if(++rs95CheckoutTries<=8)setTimeout(()=>void rs95ContinueToCheckout(),600);
        else status('خدمة إتمام الطلب غير جاهزة. استخدمي زر إتمام الطلب الأصلي.','warn');
        return;
      }
      // Clearing the intent avoids a loop when the checkout navigates back.
      window.__rs95CheckoutIntent?.clear();
      try{
        await cartApi.submit();
      }catch(error){
        window.__rs95CheckoutIntent?.arm(intent.id);
        status('تعذّر فتح صفحة إتمام الطلب تلقائيًا. استخدمي زر «إتمام الطلب» الأصلي في السلة.','warn');
      }
    }catch(_error){
      status('راجعي وجود المنتج واختياراته في السلة، ثم اضغطي «إتمام الطلب».','warn');
    }finally{rs95CheckoutBusy=false;}
  }

  function section(title,desc,flag){
    const wrap=make('section','rs60-section');wrap.dir='rtl';
    const heading=make('div','rs60-section-heading');
    heading.append(make('h3','rs60-section-title',title));
    if(flag)heading.append(make('span','rs60-section-flag',flag));
    wrap.append(heading,make('p','rs60-section-desc',desc));
    const grid=make('div','rs60-products');wrap.append(grid);
    return {wrap,grid};
  }
  function itemCard(p,kind){
    const article=make('article','rs60-item');article.dataset.productId=String(p.id);
    const photo=make('a','rs60-item-photo');photo.href=p.href;photo.title=p.name;
    if(p.image){const img=make('img');img.src=p.image;img.alt=p.name;img.loading='lazy';photo.append(img);}
    const info=make('div','rs60-item-info');
    const name=make('a','rs60-item-name',p.name);name.href=p.href;info.append(name);
    const price=make('div','rs60-item-price');
    if(kind==='gift'){
      price.textContent='🎁 هدية مشروطة';
      const small=make('small','', ' (0 ر.س بعد تطبيق العرض)');price.append(small);
    }else{
      price.textContent=p.current===null?'السعر داخل صفحة المنتج':SAR(p.current);
      if(p.current!==null&&p.original!==null&&p.original>p.current)
        price.append(make('del','',SAR(p.original)));
    }
    info.append(price);
    if(kind==='gift'){
      const button=make('button','rs60-pick','اختار الهدية');button.type='button';
      button.dataset.giftId=String(p.id);info.append(button);
    }else{
      const label=make('label','rs60-paid-check');const input=make('input');
      input.type='checkbox';input.value=String(p.id);input.dataset.kind='paid';
      label.append(input,make('span','','أضيفه مع الطلب'));info.append(label);
    }
    article.append(photo,info);
    return article;
  }
  function updateSummary(){
    if(!ui)return;
    const selected=$$('input[data-kind="paid"]:checked',ui.paid.grid).map(x=>ui.paidItems.get(Number(x.value))).filter(Boolean);
    const total=selected.reduce((sum,x)=>sum+(x.current||0),0);
    const unknown=selected.some(x=>x.current===null);
    ui.total.textContent=selected.length?`${selected.length} منتج إضافي • ${unknown?'السعر النهائي في السلة':SAR(total)+' تقريبًا'}`:'لم تُختَر إضافات مدفوعة';
    const giftId=Number($('.rs60-gift-item.is-selected',ui.gift?.grid)?.dataset.productId||0);
    if(ui.giftHint){
      ui.giftHint.textContent=giftId?'تم اختيار الهدية. إن كانت تحتاج مقاسًا أو خيارًا، حدديه من صفحة الهدية. والخصم يُحتسب في سلة عند استيفاء شروط العرض.':'اختار هدية واحدة عند رغبتك.';
      if(giftId){
        const item=$('.rs60-gift-item.is-selected',ui.gift?.grid);
        const href=safeProductLink($('.rs60-item-name',item||document)?.href||'');
        if(href){const a=make('a','rs91-gift-details','فتح صفحة الهدية');a.href=href;
          a.style.cssText='display:inline-block;margin-inline-start:7px;text-decoration:underline;color:#145c88;font-weight:800';
          ui.giftHint.append(document.createTextNode(' '),a);}
      }
    }
  }
  function createPending(extraOnly=false){
    if(!ui)return null;
    const paid=$$('input[data-kind="paid"]:checked',ui.paid.grid)
      .map(x=>Number(x.value)).filter(id=>Number.isSafeInteger(id)&&id!==ui.id);
    // The customer cannot deselect a gift in this UI; rehydration may remove
    // .is-selected between tapping it and submitting the native form.
    const previous=readPending();
    const visibleGift=extraOnly?0:Number($('.rs60-gift-item.is-selected',ui.gift?.grid)?.dataset.productId||0);
    const gift=extraOnly?0:(visibleGift || (previous?.main===ui.id?previous.gift:0));
    if(!paid.length&&!gift){clearPending();return null;}
    const selectedGift=visibleGift?$('.rs60-gift-item.is-selected',ui.gift?.grid):null;
    const giftHref=selectedGift?safeProductLink($('.rs60-item-name',selectedGift)?.href||''):(previous?.main===ui.id?previous.giftHref||'':'');
    const q={main:ui.id,gift,giftHref,paid,at:Date.now(),state:'selected',mainPath:pathOf(location.pathname),mainName:clean($('.product-details-col h1', ui.L?.info || document)?.textContent||document.title),
      donePaid:previous?.main===ui.id ? previous.donePaid||[] : [],
      attemptedPaid:previous?.main===ui.id ? previous.attemptedPaid||[] : [],
      attemptedGift:previous?.main===ui.id && previous.gift===gift ? !!previous.attemptedGift : false,
      confirmedMain:previous?.main===ui.id ? !!previous.confirmedMain : false,
      rs92Migrated:true};
    savePending(q);return q;
  }
  // Preserve the backend's outcome independently from analytics errors.
  // On this store the native pre-add event has triggered a third-party
  // JSON.stringify(Proxy) exception. Never stringify those event payloads.
  async function addAndConfirm(id,kind,attempted,selectedOptions){
    const before=await getCart();
    const existing=before?.items?.find(it=>hasItem(it,id)) ||
      domCartSnapshot()?.items?.find(it=>hasItem(it,id));
    if(existing)return {ok:true,line:existing,existing:true,source:before.source||'sdk'};
    if(attempted)return {ok:false,uncertain:true,reason:'تمت محاولة الإضافة سابقًا؛ راجعي السلة قبل تكرارها'};
    const api=sdk()?.cart;
    if(typeof api?.addItem!=='function')return {ok:false,reason:'خدمة سلة غير جاهزة'};
    let response=null,error=null;
    try{
      // Use the full add-item payload supported by the store's classic SDK.
      // V64 used the numeric quick-add endpoint, which isn't equivalent for
      // all Salla product types or older customized themes.
      const request={id:Number(id),quantity:1};
      if(selectedOptions&&Object.keys(selectedOptions).length)request.options=selectedOptions;
      response=await api.addItem(request);
    }catch(e){error=e;}
    const responseCart=itemsOf(response);
    const responseLine=responseCart?.items?.find(it=>hasItem(it,id));
    if(responseLine)return {ok:true,line:responseLine,existing:false,source:'sdk'};
    // Fast polling on the same product page; do not wait for a cart-page reload.
    for(const delay of [0,240,520]){
      if(delay)await wait(delay);
      const updated=await getCart();
      const line=updated?.items?.find(it=>hasItem(it,id)) ||
        domCartSnapshot()?.items?.find(it=>hasItem(it,id));
      if(line)return {ok:true,line,existing:false,source:line.source==='dom'?'dom':updated?.source||'sdk'};
    }
    let reason='لم يظهر المنتج في السلة بعد المحاولة';
    let rejected422=false;
    if(error){
      const code=Number(error?.response?.status||error?.status||0);
      rejected422=code===422;
      const data=error?.response?.data;
      const raw=clean(data?.message||data?.error?.message||error?.message||'');
      const validation=data?.errors;
      const firstValidation=validation&&typeof validation==='object'
        ?clean(Object.values(validation).flat().filter(x=>typeof x==='string').join('، ')):'';
      const msg=(firstValidation||raw).slice(0,190);
      reason=rejected422
        ? 'سلة رفضت إضافة المنتج (422)'+(msg?': '+msg:'؛ افحصي خيارات المنتج وأهليته في العرض من لوحة سلة')
        : (/(options?|خيارات|مقاس|لون|required)/i.test(msg)
          ? 'المنتج يحتاج اختيار لون أو مقاس من صفحته أولًا'
          : 'رفضت سلة الإضافة أو تعذّر تأكيدها');
    }
    return {ok:false,uncertain:!error||!!response,needsChoice:rejected422,reason};
  }
  async function addGiftOnce(q){
    if(!q.gift)return {ok:true,finished:true,msg:'لم تختاري هدية.'};
    const before=await getCart();
    const oldLine=before?.items?.find(it=>hasItem(it,q.gift)) ||
      domCartSnapshot()?.items?.find(it=>hasItem(it,q.gift));
    if(oldLine){
      if(before?.source==='dom'||oldLine.source==='dom')return {ok:false,uncertain:true,msg:'الهدية ظاهرة بالسلة؛ تأكدي أنها بسعر 0 ر.س.'};
      return isFreeLine(oldLine)
        ? {ok:true,finished:true,msg:'✅ الهدية موجودة بالسلة مجانًا.'}
        : {ok:false,msg:'⚠️ الهدية موجودة ولكن لم يتأكد خصم 100%.'};
    }
    const otherFree=before?.items?.find(it=>isKnownGiftLine(it)&&isFreeLine(it));
    if(otherFree)return {ok:false,msg:'توجد هدية أخرى مجانية بالسلة.'};
    // No blind quick-add for a gift with unchosen color/size. The customer's
    // selections must come from their real product page, never fabricated.
    const verified=await inspectGift(q.gift,q.giftHref);
    if(!verified.ok)return {ok:false,needsChoice:true,msg:'⚠️ '+verified.reason};
    const previouslyAttempted=!!q.attemptedGift;
    q.attemptedGift=true;savePending(q);
    const attempt=await addAndConfirm(q.gift,'gift',previouslyAttempted,verified.options);
    if(!attempt.ok)return {ok:false,needsChoice:attempt.needsChoice,uncertain:attempt.uncertain,msg:'⚠️ تعذرت إضافة الهدية: '+attempt.reason};
    if(attempt.source==='dom')return {ok:false,uncertain:true,msg:'الهدية ظهرت، لكن لا يمكن تأكيد سعر 0 ر.س من الواجهة فقط.'};
    if(isFreeLine(attempt.line))return {ok:true,finished:true,msg:'✅ الهدية أضيفت مجانًا (0 ر.س).'};
    await wait(250);
    const refreshed=await getCart();
    const line=refreshed?.items?.find(it=>hasItem(it,q.gift));
    if(refreshed?.source!=='dom' && line&&isFreeLine(line))
      return {ok:true,finished:true,msg:'✅ الهدية أضيفت مجانًا (0 ر.س).'};
    // Never silently delete items if no trustworthy server confirmation.
    if(refreshed?.source==='dom'||!refreshed)
      return {ok:false,uncertain:true,msg:'⚠️ راجعي سعر الهدية في السلة؛ لم نتمكن من إثبات المجانية.'};
    // Don't auto-remove anything from a customer's cart when the discount is uncertain.
    return {ok:false,msg:'⚠️ لم يتم إثبات مجانية الهدية؛ راجعي سعرها في السلة قبل الدفع.'};
  }
  // Both native add-to-cart and direct checkout await ONE operation.
  // Prevent a second handler treating an in-flight gift add as a failure.
  let rs100InFlight=null;
  async function runAfterMain(trigger){
    if(rs100InFlight)return rs100InFlight;
    const task=runAfterMainImpl(trigger);
    rs100InFlight=task;
    try{return await task;}finally{if(rs100InFlight===task)rs100InFlight=null;}
  }
  async function runAfterMainImpl(trigger){
    const pending=readPending();if(!pending||processing)return;
    // Avoid multiple automatic retries on page transitions and tracking errors.
    if(trigger!=='manual'&&pending.lastAttemptAt&&Date.now()-pending.lastAttemptAt<25000
      &&(pending.paid||[]).every(id=>(pending.attemptedPaid||[]).includes(id))
      &&(!pending.gift||pending.attemptedGift)){
      giftDetailLink(pending,!!pending.gift);
      return;
    }
    processing=true;
    try{
      let cart=await getCart();
      let found=visibleMainLine(pending) || findMainLine(cart,pending);
      if(!found && trigger==='native-main-added' && pending.confirmedMain){
        // This is an official success event for this exact product; the cart
        // details endpoint is allowed to be delayed/unavailable.
        found={product_id:pending.main};
      }
      if(!found && pending.confirmedMain && !cart){found={product_id:pending.main};}
      if(!found){
        await wait(450);
        cart=await getCart();found=visibleMainLine(pending) || findMainLine(cart,pending);
      }
      if(!found){
        // Show exact product ids instead of silently blocking the gift.
        // Avoid trusting a cart row without a matching product id or URL.
        const shown=visibleCartIds().slice(0,8);
        status('⚠️ تعذر مطابقة المنتج الأساسي المختار ('+pending.main+') مع منتجات السلة '+(shown.length?'('+shown.join('، ')+')':'(لم تظهر صفوف المنتجات بعد)')+'. لن نضيف هدية عشوائية؛ راجعي اختيار الهدية وجربي بعد تحديث السلة.', 'warn');
        return;
      }
      const q={...pending,state:'working',lastAttemptAt:Date.now(),donePaid:Array.isArray(pending.donePaid)?pending.donePaid:[],attemptedPaid:Array.isArray(pending.attemptedPaid)?pending.attemptedPaid:[]};
      savePending(q);
      const errors=[];let success=0;
      const paidIds=[...new Set((q.paid||[]).map(Number))].filter(id=>Number.isSafeInteger(id)&&id>0&&id!==q.main&&id!==q.gift);
      for(const id of paidIds){
        const previouslyAttempted=q.attemptedPaid.includes(id);
        if(!previouslyAttempted){q.attemptedPaid.push(id);savePending(q);}
        const result=await addAndConfirm(id,'paid',previouslyAttempted);
        if(result.ok){
          success++;
          if(!q.donePaid.includes(id))q.donePaid.push(id);
        }else errors.push({id,reason:result.reason});
        savePending(q);
      }
      const giftResult=await addGiftOnce(q);
      const summary=paidIds.length?`الإضافات المدفوعة: تم تأكيد ${success} من ${paidIds.length}. `:'';
      const issues=errors.length?`الباقي: ${errors.map(x=>x.reason).join('، ')}. `:'';
      status(summary+issues+giftResult.msg,errors.length||!giftResult.ok?'warn':'ok');
      giftDetailLink(q,!giftResult.ok);
      if(!errors.length&&giftResult.ok){clearPending();}
      else {q.state='selected';savePending(q);}
      const retry=$('.rs62-retry');if(retry)retry.hidden=!readPending()||!!giftResult.needsChoice;
    }catch(_e){
      const q=readPending();if(q){q.state='selected';savePending(q);}
      status('⚠️ تعذر استكمال الإضافات. تأكدي من السلة قبل إعادة المحاولة.','warn');
    }finally{
      processing=false;
      if(!readPending() && window.__rs95CheckoutIntent?.read())
        setTimeout(()=>void rs95ContinueToCheckout(),350);
    }
  }
  // V98: the Buy Now button can complete a selected gift while still on the
  // product page. This reuses the existing Salla-verified add/discount logic.
  window.__rs98FinalizeExtras=async function(productId){
    const current=Number(productId);
    // Refresh the choice snapshot on this very page; do not trust stale localStorage.
    const visibleGift=!!$('.rs60-gift-item.is-selected',document);
    const visiblePaid=!!$('.rs60-paid-section input[data-kind="paid"]:checked',document);
    if(!visibleGift&&!visiblePaid)return {ok:true};
    if(ui?.id!==current)return {ok:false,message:'تعذر مطابقة المنتج الحالي مع اختيارات الهدية.'};
    const pending=createPending();
    if(!pending||Number(pending.main)!==current)
      return {ok:false,message:'لم يتم حفظ الهدية أو الإضافات المختارة؛ راجعي الاختيارات قبل الدفع.'};
    pending.confirmedMain=true; // invoked only AFTER Salla reports a successful add
    pending.lastAttemptAt=0;
    savePending(pending);
    await runAfterMain('native-main-added');
    const remaining=readPending();
    if(!remaining||Number(remaining.main)!==current)return {ok:true};
    const warning=$('.rs60-live')?.textContent||$('.rs60-cart-notice')?.textContent||'';
    return {ok:false,message:warning||'تمت إضافة المنتج، لكن الهدية أو الإضافات لم تتأكد بعد. راجعي السلة قبل الدفع.'};
  };

  function bindCartEvents(){
    let bound=false;
    const bind=()=>{
      const event=sdk()?.cart?.event;
      if(bound||typeof event?.onItemAdded!=='function')return;
      event.onItemAdded((_response,id)=>{
        const q=readPending();
        if(q&&Number(id)===q.main){
          q.confirmedMain=true;savePending(q);
          // V100: add selected gift on THIS product page immediately after
          // Salla reports successful main-product addition; never redirect.
          status('🎁 المنتج اتضاف. جارٍ إضافة الهدية والتحقق من العرض…');
          void runAfterMain('native-main-added');
        }
      });
      if(typeof event?.onItemAddedFailed==='function'){
        event.onItemAddedFailed((_error,id)=>{
          const q=readPending();if(q&&Number(id)===q.main){status('سلة أبلغت عن فشل إضافة المنتج الأساسي؛ احتفظنا بالاختيارات حتى يتم التحقق من السلة.', 'warn');}
        });
      }
      bound=true;
    };
    bind();document.addEventListener('theme::ready',bind,{once:true});
    const s=sdk();if(typeof s?.onReady==='function'){
      try{Promise.resolve(s.onReady()).then(bind).catch(()=>{});}catch{}
    }
    [500,1400,2800,5000].forEach(ms=>setTimeout(bind,ms));
  }
  function layoutOf(){
    const wrapper=$('.container--product-single');
    const row=wrapper?.querySelector('[id^="product-"]');
    const gallery=row?.querySelector('.main-content');
    const info=row?.querySelector('.product-details-col');
    const form=info?.querySelector('.product-form');
    const purchase=form?.querySelector('.addtocart-bar');
    return wrapper&&row&&gallery&&info&&form&&purchase?{wrapper,row,gallery,info,form,purchase}:null;
  }
  function upgradePrice(L){
    const current=moneyNumber($('.sale-price',L.info)?.textContent);
    const original=moneyNumber($('.regular-price,.before-price',L.info)?.textContent);
    $('.rs60-discount',L.info)?.remove();
    $('.rs60-fire',L.info)?.remove();
    const strip=$('.flex.whitespace-nowrap',L.info) || $('.sale-price',L.info)?.parentElement;
    if(current!==null&&original!==null&&original>current){
      const percentage=Math.round((1-current/original)*100);
      const old=$('.regular-price,.before-price',L.info);
      if(old&&percentage>0&&percentage<100) old.insertAdjacentElement('afterend',make('span','rs60-discount',`خصم ${percentage}٪`));
      if(strip && percentage>=5){
        const fire=make('span','rs60-fire','عرض مميز');
        strip.insertAdjacentElement('afterbegin',fire);
      }
    }
  }
  function addTrust(L){
    if($('.rs60-trust',L.info))return;
    const wrap=make('div','rs60-trust');
    [['🔒','تسوق آمن','الدفع عبر سلة'],['📦','تجهيز الطلب','وفق سياسة المتجر'],['🤝','خدمة العملاء','متابعة ما بعد الشراء']]
      .forEach(([emoji,title,desc])=>{
        const card=make('div','rs60-trust-item');
        card.append(make('span','rs60-trust-emoji',emoji),make('strong','',title),make('span','',desc));wrap.append(card);
      });
    L.form.insertAdjacentElement('afterend',wrap);
  }
   function moveDescriptionAndOffers(L){
     // Keep Salla's original, long description intact. V70 positions it below
     // the product and preserves its existing HTML, images and tables verbatim.
     let after=$('.rs60-after-main');
     if(!after){after=make('div','rs60-after-main');L.wrapper.insertAdjacentElement('afterend',after);}
     const offer=$('main salla-offer');
     if(offer&&!$('.rs60-native-offers',after)){
       const panel=make('section','rs60-native-offers');panel.dir='rtl';
       panel.append(make('h2','rs60-after-heading','عروض المنتج'));
       panel.append(offer);after.append(panel);
       const orphan=$('.rs46-offers');if(orphan&&!orphan.contains(offer))orphan.remove();
     }
   }

  function giftCategoryProduct(L){
    return knownGiftIDs.has(currentId()) ||
      !!$('.container--breadcrumbs a[href*="c544380334"]');
  }
  function makeGiftPicker(L){
    if(giftCategoryProduct(L))return null;
    const result=section('🎁 اشتري منتج واحصل على هدية من المتجر',
      'اختاري هديتك، وهتضاف تلقائيًا بعد إضافة المنتج للسلة، بدون فتح صفحة أخرى. المجانية حسب شروط العرض.',
      '🎁 قطعة + قطعة');
    result.wrap.classList.add('rs60-gift-section');
    const label=make('div','rs60-total');
    const hint=make('span','','اختاري هدية واحدة مع المنتج.');
    const link=make('a','rs60-small-link','🎁 كل الهدايا');link.href=GIFT_PATH;
    label.append(hint,link);result.wrap.append(label);result.hint=hint;
    result.grid.append(make('p','rs60-empty','جارٍ عرض الهدايا…'));
    const live=make('p','rs100-gift-feedback','');live.setAttribute('role','status');
    result.wrap.append(live);
    L.purchase.insertAdjacentElement('beforebegin',result.wrap);
    let visibleIds='';
    function draw(gifts){
      if(!result.wrap.isConnected)return;
      const list=gifts.filter(p=>p&&p.id!==currentId()).slice(0,4);
      if(!list.length){
        if(!result.grid.querySelector('.rs60-gift-item'))
          result.grid.replaceChildren(make('p','rs60-empty','لا توجد هدايا متاحة حاليًا.'));
        return;
      }
      const fingerprint=list.map(x=>x.id).join(',');
      if(fingerprint===visibleIds)return;
      visibleIds=fingerprint;
      const selectedId=Number($('.rs60-gift-item.is-selected',result.grid)?.dataset.productId||0)||
        (readPending()?.main===currentId()?readPending()?.gift:0);
      result.grid.replaceChildren(...list.map(p=>{
        knownGiftIDs.add(p.id);
        const card=itemCard(p,'gift');card.classList.add('rs60-gift-item');
        const button=$('button.rs60-pick',card);
        if(p.id===selectedId){card.classList.add('is-selected');button.textContent='✓ الهدية المختارة';}
        button.addEventListener('click',()=>{
          if(processing){
            live.dataset.status='info';
            live.textContent='🎁 جارٍ تأكيد الهدية السابقة، ما نقدرش نغيّرها أثناء الإضافة.';
            return;
          }
          $$('.rs60-gift-item',result.grid).forEach(row=>{
            row.classList.remove('is-selected');
            const b=$('.rs60-pick',row);if(b)b.textContent='اختار الهدية';
          });
          card.classList.add('is-selected');button.textContent='✓ الهدية المختارة';
          const prev=readPending();
          if(prev?.main===currentId()){
            prev.attemptedGift=false;prev.lastAttemptAt=0;prev.at=Date.now();
            savePending(prev);
          }
          if(ui)createPending();
          updateSummary();
          live.dataset.status='info';
          live.textContent='🎁 تم اختيار الهدية. جارٍ تجهيزها؛ ستُضاف تلقائيًا بعد المنتج الأساسي.';
          // Start loading THIS gift's options while the customer is still browsing.
          // Never pick a required color/size on their behalf.
          void inspectGift(p.id,p.href);
          // If the paid product is already in the current cart, add immediately.
          void (async()=>{
            const pending=readPending();
            if(!pending||pending.main!==currentId()||pending.gift!==p.id)return;
            const cart=await getCart();
            if(!findMainLine(cart,pending))return;
            pending.confirmedMain=true;savePending(pending);
            await runAfterMain('gift-selection');
          })();
        });
        return card;
      }));
      if(ui)updateSummary();
    }
    // Display cached store-category products immediately (no mobile network wait).
    // Silently refresh them using the actual Salla category afterwards.
    const cached=(()=>{try{
      const x=JSON.parse(sessionStorage.getItem('relaxsmart:v100:gifts')||'null');
      return x&&Date.now()-x.at<15*60*1000&&Array.isArray(x.items)?x.items:null;
    }catch{return null;}})();
    draw(cached||KNOWN_GIFTS);
    void availableGifts().then(gifts=>{
      if(!gifts.length)return;
      try{sessionStorage.setItem('relaxsmart:v100:gifts',JSON.stringify({at:Date.now(),items:gifts}));}catch{}
      // Keep the selected card visible even if the refreshed category order changed.
      const selected=Number($('.rs60-gift-item.is-selected',result.grid)?.dataset.productId||0);
      const same=gifts.find(x=>x.id===selected);
      const four=gifts.slice(0,4);
      if(same&&!four.some(x=>x.id===selected)){four.pop();four.push(same);}
      draw(four);
    }).catch(()=>{});
    return result;
  }

  function makePaidPicker(L){
    const result=section('🛍️ أضف منتجات مع طلبك','منتجات مقترحة بأسعارها الحالية؛ حددي الإضافات التي تريد إضافتها للسلة مع المنتج الأساسي.');
    result.wrap.classList.add('rs60-paid-section');
    const line=make('div','rs60-total');line.append(make('span','','الإضافات المختارة'));
    const total=make('strong','', 'لم تُختَر إضافات مدفوعة');line.append(total);
    result.wrap.append(line);result.total=total;
    result.grid.append(make('p','rs60-empty','جارٍ تحميل المنتجات المقترحة…'));
    L.purchase.insertAdjacentElement('beforebegin',result.wrap);
    return result;
  }
  function renderPaidCards(products){
    if(!ui?.paid||!products.length)return false;
    const unique=new Map();products.forEach(p=>{
      if(p&&p.id!==ui.id&&!knownGiftIDs.has(p.id)&&!unique.has(p.id))unique.set(p.id,p);
    });
    const items=[...unique.values()].slice(0,4);if(!items.length)return false;
    ui.paidItems=new Map(items.map(x=>[x.id,x]));
    ui.paid.grid.replaceChildren(...items.map(p=>{
      const row=itemCard(p,'paid');
      const input=$('input[data-kind="paid"]',row);
      input.addEventListener('change',()=>{row.classList.toggle('is-selected',input.checked);updateSummary();createPending();});
      return row;
    }));
    return true;
  }
  function suggestionContainer(){
    return $('.similar-products__container,.container--product-recommendations,.s-block--bundle-similar-products');
  }
  async function freshCuratedAddons(){
    const eligible=CURATED_ADDONS.filter(p=>p.id!==currentId()&&!knownGiftIDs.has(p.id));
    const hydrated=await Promise.all(eligible.map(async p=>{
      const doc=await fetchCardPage(p.href);
      if(!doc)return null;
      const buyButton=$('salla-add-product-button[product-status]',doc);
      if(buyButton && /out|unavailable/i.test(buyButton.getAttribute('product-status')||''))return null;
      const priceNode=$('.container--product-single .product-details-col .sale-price',doc)||
        $('.container--product-single .product-details-col .starting-or-normal-price .total-price',doc)||
        $('.container--product-single .product-details-col .total-price',doc);
      const current=moneyNumber(priceNode?.textContent??$('meta[itemprop="price"]',doc)?.content??
        $('meta[property="product:price:amount"]',doc)?.content);
      // If current price isn't readable, do NOT invent a price or conceal uncertainty.
      if(current===null)return null;
      const original=moneyNumber($('.container--product-single .regular-price',doc)?.textContent);
      const title=clean($('.container--product-single .product-details-col h1',doc)?.textContent)||p.name;
      return {...p,href:new URL(p.href,location.origin).href,name:title,current,original};
    }));
    return hydrated.filter(Boolean);
  }
  async function populateSuggestions(){
    if(!ui)return;
    // Recommendations may be below the fold and never hydrated on phones.
    for(const ms of [100,350,650,900]){
      await wait(ms);
      const source=suggestionContainer();
      const cards=source?catalogCards(source,12):[];
      if(renderPaidCards(cards))return;
    }
    const links=$$('.container--breadcrumbs a[href*="/c"]');
    const category=[...links].reverse().map(a=>a.getAttribute('href')).find(h=>h&&!h.includes('c544380334'));
    if(category){
      const doc=await fetchCardPage(category);
      if(doc && renderPaidCards(catalogCards(doc,12)))return;
    }
    const fallback=await freshCuratedAddons();
    if(fallback.length){
      renderPaidCards(fallback);
      const note=make('p','rs60-fallback-note','اقتراحات من المتجر بأسعارها الحالية.');
      ui.paid.wrap.append(note);
    }else if(ui?.paid){
      ui.paid.grid.replaceChildren(make('p','rs60-empty',
        'تعذّر تحميل أسعار المنتجات المقترحة الآن. يمكنك تصفح باقي منتجات المتجر.'));
    }
  }
  function initProduct(){
    if(!isProductPage||ui)return;
    const L=layoutOf();if(!L)return;
    const id=currentId();if(!id)return;
    document.body.classList.add('rs60-product');L.row.classList.add('rs60-layout');
    document.documentElement.dataset.relaxSmartVersion='65';
    // Remove earlier versions' visual elements only; never remove native Salla fields.
    $$('.rs51-picker,.rs46-paid,.rs46-cart-message,.rs46-selection-hint,.rs46-fire,.rs43-gifts,.rs44-gifts,.rs45-gifts,.rs50-gifts,.rs-gift-native',L.info)
      .forEach(x=>x.remove());
    upgradePrice(L);
    const price=$('.sale-price,.starting-or-normal-price .total-price',L.info);
    if(price&&!$('.rs60-price-note',L.info)){
      const note=make('p','rs60-price-note','السعر الفعلي والعروض النهائية يُحددان داخل سلة المشتريات.');
      price.closest('.flex.whitespace-nowrap')?.insertAdjacentElement('afterend',note);
    }
    const gift=makeGiftPicker(L);
    const paid=makePaidPicker(L);
    ui={id, L, paid, gift, paidItems:new Map(),total:paid.total,giftHint:gift?.hint,live:null};
    const live=make('p','rs60-live');live.setAttribute('role','status');
    L.purchase.insertAdjacentElement('afterend',live);ui.live=live;
    addTrust(L);moveDescriptionAndOffers(L);
    const saveChoices=()=>{
      const q=createPending();
      if(q)status('🎁 تم حفظ الهدية؛ هتتضاف تلقائيًا بعد إضافة المنتج الأساسي من نفس الصفحة.');
    };
    L.form.addEventListener('submit',saveChoices,true);
    // Some themes handle product actions through a component click without a form submit.
    L.purchase.addEventListener('click',event=>{
      if(event.target.closest('salla-add-product-button,button[type=submit]')) saveChoices();
    },true);
    L.info.addEventListener('change',()=>setTimeout(()=>upgradePrice(L),300));
    bindCartEvents();void populateSuggestions();
  }
  function initCart(){
    if(!isCartPage)return;
    let q=readPending();
    if(!q){
      if(window.__rs95CheckoutIntent?.read())
        setTimeout(()=>void rs95ContinueToCheckout(),900);
      return;
    }
    let notice=$('.rs60-cart-notice');
    if(!notice){notice=make('div','rs60-cart-notice','جارٍ التحقق من اختيار الهدية…');notice.setAttribute('role','status');
      ($('main')||document.body).prepend(notice);}
    if(!$('.rs62-retry')){
      const retry=make('button','rs62-retry','إعادة محاولة استكمال الهدية والإضافات');retry.type='button';
      retry.addEventListener('click',()=>{if(!processing)void runAfterMain('manual');});
      notice.insertAdjacentElement('afterend',retry);
    }
    try{
      const last=JSON.parse(sessionStorage.getItem('relaxsmart:v65:last-status')||sessionStorage.getItem('relaxsmart:v63:last-status')||'null');
      if(last?.text&&Date.now()-last.at<60000){notice.textContent=last.text;notice.dataset.status=last.tone;}
    }catch{}
    // The cart can still show the manual gift link while duplicate-request
    // prevention temporarily suppresses further SDK calls.
    giftDetailLink(q,!!q.gift);
    const chosenName=KNOWN_GIFTS.find(x=>x.id===q.gift)?.name|| (q.gift?'المنتج رقم '+q.gift:'');
    notice.textContent=q.gift
      ? 'جارٍ مطابقة المنتج الأساسي وإضافة الهدية المختارة: '+chosenName+'…'
      : 'لم يتم حفظ اختيار هدية مع المنتج الأساسي. اختاري الهدية من صفحة المنتج أولًا.';
    giftDetailLink(q,!!q.gift);
    // The gift is processed once the buyer lands on the cart with the main
    // item already present, avoiding requests cancelled by the success modal.
    setTimeout(()=>void runAfterMain('cart'),1350);
  }
  function init(){initProduct();initCart();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  [550,1600,3000].forEach(ms=>setTimeout(init,ms));
})();

/* Preserve original wheelchair-first catalog ordering */

(function () {
  const keywords = ['كرسي متحرك', 'كراسي متحركة', 'كراسي متحركه', 'كرسي متحركة'];
  const observerTarget = document.querySelector('.s-products-list-wrapper');
  if (!observerTarget) return;

  let observer;

  function moveWheelchairsFirst() {
    if (observer) observer.disconnect();

    const cards = Array.from(observerTarget.querySelectorAll(':scope > custom-salla-product-card'));
    const matched = cards.filter(card => {
      const title = card.querySelector('.product-entry__title')?.textContent || '';
      const alt = card.querySelector('img')?.alt || '';
      const text = title + ' ' + alt;
      return keywords.some(k => text.includes(k));
    });

    matched.reverse().forEach(card => observerTarget.prepend(card));

    observer.observe(observerTarget, { childList: true });
  }

  observer = new MutationObserver(moveWheelchairsFirst);
  moveWheelchairsFirst();
})();

/* Preserve original conditional warranty badges (V54) */

/* RELAX SMART V54 — Selected two-year warranty seal
   Independent of the V53 gift/cart scripts. Do not change product pricing.
   Restore ORIGINAL eligibility: massage chairs > SAR 400, plus explicitly approved IDs.
   Only display the two-year claim where the store's written warranty confirms it.
*/
(() => {
  'use strict';
  if (window.__relaxSmartWarrantyV54) return;
  window.__relaxSmartWarrantyV54 = true;

  // Add other approved product IDs here after checking their two-year warranty.
  // Example: new Set(['123456789', '987654321'])
  const EXTRA_APPROVED_PRODUCT_IDS = new Set([]);
  const MIN_CHAIR_PRICE_SAR = 400;

  // Previously listed massage chairs priced above SAR 400. Used as fallback
  // only when the theme hasn't populated the price element yet.
  const KNOWN_MASSAGE_CHAIR_IDS = new Set([
    '2024072696', '801667276', '926228977',
    '2139079090', '972889452'
  ]);

  const CARD_SELECTOR = [
    'custom-salla-product-card.product-entry',
    'salla-product-card', '.s-product-card-entry',
    '.s-product-card', '.rs18-card', '.rs16-card', '.rs11-product'
  ].join(',');

  const MEDIA_SELECTOR = [
    '.rs18-card__image', '.rs16-card__photo', '.rs11-product__image',
    '.product-entry__image-wrap', '.product-entry__image',
    '.s-product-card-image-wrapper', '.s-product-card-image',
    '.s-product-card-image-container'
  ].join(',');

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const compact = s => String(s || '').replace(/\s+/g, ' ').trim();

  function parsePrice(value) {
    if (value && typeof value === 'object')
      return parsePrice(value.amount ?? value.value ?? value.price);
    const raw = String(value ?? '').replace(/[٠-٩]/g, x => String('٠١٢٣٤٥٦٧٨٩'.indexOf(x)))
      .replace(/[۰-۹]/g, x => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(x)))
      .replace(/٫/g, '.').replace(/٬/g, ',');
    const m = raw.match(/\d[\d,.]*/);
    if (!m) return null;
    const n = Number(m[0].replace(/,/g, ''));
    return Number.isFinite(n) && n >= 0 ? n : null;
  }

  function productInfo(card) {
    let data = {};
    try { data = JSON.parse(card.getAttribute('product') || '{}') || {}; } catch (_) {}
    const dom = card.shadowRoot || card;
    const id = String(data.id || card.getAttribute('product-id') ||
      card.getAttribute('data-product-id') ||
      card.id?.match(/product_(\d+)/)?.[1] ||
      $('a[href*="/p"]', dom)?.getAttribute('href')?.match(/\/p(\d+)/)?.[1] || '');
    const name = compact(data.name || $(
      '.rs18-card__name,.rs16-card__name,.rs11-product__name,' +
      '.product-entry__title,.s-product-card-content-title,.s-product-card-title', dom
    )?.textContent || card.getAttribute('title'));
    const priceText = $(
      '.price_is_on_sale .total-price,.starting-or-normal-price .total-price,' +
      '.price-wrapper .total-price,.s-product-card-price,.sale-price,.total-price', dom
    )?.textContent;
    const price = parsePrice(data.sale_price ?? data.price ?? priceText)
      ?? parsePrice(priceText);
    return { id, name, price, dom };
  }

  function isMassageChair(name) {
    return /(?:كرسي|كراسي).{0,75}(?:مساج|تدليك)|massage\s*chair/i.test(name);
  }

  function eligible(info, inChairSection = false) {
    if (EXTRA_APPROVED_PRODUCT_IDS.has(info.id)) return true;
    if (!isMassageChair(info.name) && !inChairSection) return false;
    return (info.price !== null && info.price > MIN_CHAIR_PRICE_SAR) ||
      KNOWN_MASSAGE_CHAIR_IDS.has(info.id);
  }

  function seal(detail = false) {
    const badge = document.createElement('div');
    badge.className = detail ? 'rs54-gold-seal rs54-gold-seal--detail' : 'rs54-gold-seal';
    badge.setAttribute('role', 'img');
    badge.setAttribute('aria-label', 'ضمان ذهبي لمدة سنتين، وفق شروط ضمان المنتج');
    badge.title = 'ضمان سنتين وفق الشروط المعتمدة للمنتج';
    const first = document.createElement('span');
    first.className = 'rs54-seal-small'; first.textContent = 'ضمان ذهبي';
    const years = document.createElement('strong');
    years.className = 'rs54-seal-years'; years.textContent = 'سنتين';
    const note = document.createElement('small');
    note.className = 'rs54-seal-note'; note.textContent = 'وفق الشروط';
    badge.append(first, years, note);
    return badge;
  }

  function decorateCard(card) {
    if (!card.isConnected) return;
    // If custom card contains nested cards, decorate outer card once only.
    if (card.parentElement?.closest(CARD_SELECTOR)) return;
    const info = productInfo(card);
    const inChairSection = !!card.closest('.rs12-chair');
    if (!eligible(info, inChairSection)) return;
    const host = $(MEDIA_SELECTOR, info.dom);
    if (!host || !host.isConnected) return;
    if ($('.rs54-gold-seal', host)) return;
    host.classList.add('rs54-warranty-host');
    host.append(seal());
  }

  function decorateDetail() {
    const match = location.pathname.match(/\/p(\d+)(?:\/|$)/);
    if (!match) return;
    const root = $('.container--product-single');
    const gallery = root && $('.main-content', root);
    const info = root && $('.product-details-col', root);
    if (!gallery || !info || $('.rs54-detail-proof', gallery)) return;
    const name = compact($('h1', info)?.textContent);
    const priceEl = $('.price_is_on_sale .total-price,.sale-price,.starting-or-normal-price .total-price,.total-price', info);
    const price = parsePrice(priceEl?.textContent) ?? parsePrice($('meta[itemprop="price"]')?.content);
    const matchInfo = { id: match[1], name, price };
    const breadcrumbs = compact($('.container--breadcrumbs')?.textContent || $('.breadcrumb')?.textContent);
    if (!eligible(matchInfo, /كراسي المساج/.test(breadcrumbs))) return;
    const anchor = $('.images-wrapper', gallery) || $('.details-slider', gallery);
    if (!anchor) return;
    const proof = document.createElement('div');
    proof.className = 'rs54-detail-proof';
    const label = document.createElement('div');
    label.className = 'rs54-detail-copy';
    const title = document.createElement('strong'); title.textContent = 'ضمان ذهبي لمدة سنتين';
    const hint = document.createElement('span'); hint.textContent = 'على هذا المنتج وفق شروط الضمان المعتمدة';
    label.append(title, hint);
    proof.append(seal(true), label);
    anchor.insertAdjacentElement('afterend', proof);
  }

  let pending = false;
  function scan() {
    pending = false;
    $$(CARD_SELECTOR).forEach(decorateCard);
    decorateDetail();
  }
  function scheduleScan() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(scan);
  }
  function init() {
    document.body.classList.add('rs54-warranty-active');
    scheduleScan();
    // Product cards may be rendered after hydration or while scrolling.
    const observer = new MutationObserver(records => {
      const meaningful = records.some(record => [...record.addedNodes].some(node =>
        node.nodeType === 1 &&
        !node.matches?.('.rs54-gold-seal,.rs54-detail-proof') &&
        !node.closest?.('.rs54-gold-seal,.rs54-detail-proof')
      ));
      if (meaningful) scheduleScan();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    [900, 2200].forEach(delay => setTimeout(scheduleScan, delay));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();




/* V71: The duplicate mobile-only sticky buy bar was removed; the original Salla control is now sticky on both screen sizes. */

/* V69: Both duplicate description collapsers removed; full description stays below product in #rs60-description. */

/* RELAX SMART - MOBILE BANNERS & PRODUCTS FIX */
(function () {
  "use strict";

  if (!/^\/(?:ar\/?)?$/.test(location.pathname)) return;
  if (window.__relaxMobileHomeCompact1) return;

  window.__relaxMobileHomeCompact1 = true;

  const IMG_HEIGHT = 170;
  const SHADOW_ID = "rs-mobile-home-compact-shadow";

  /* تنسيق البنرات والأقسام الخارجية */
  const css = document.createElement("style");
  css.id = "rs-mobile-home-compact-css";

  css.textContent = `
    @media (max-width:767px) {

      body.index main.app-inner >
      section.s-block--fixed-banner,

      body.index main.app-inner >
      section.s-block--bundle-products-slider {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        min-height: 0 !important;
        height: auto !important;
      }

      /* مسافات البنرات */
      body.index main.app-inner >
      section.s-block--fixed-banner {
        padding-top: 4px !important;
        padding-bottom: 4px !important;
      }

      body.index .s-block--fixed-banner
      > .container {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        min-height: 0 !important;
        height: auto !important;
      }

      body.index .s-block--fixed-banner
      :is(.banner--fixed, picture) {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        min-height: 0 !important;
        height: auto !important;
      }

      /* الحفاظ على أبعاد صور البنرات */
      body.index .s-block--fixed-banner
      picture img {
        display: block !important;
        max-width: 100% !important;
        height: auto !important;
        max-height: none !important;
        margin: 0 !important;
        object-fit: contain !important;
      }

      /* تقريب سلايدر المنتجات من البنر */
      body.index main.app-inner >
      section.s-block--bundle-products-slider {
        padding-top: 2px !important;
        padding-bottom: 8px !important;
      }

      body.index
      section.s-block--bundle-products-slider
      > [component-name="products-slider"] {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        min-height: 0 !important;
        height: auto !important;
      }
    }
  `;

  document.head.appendChild(css);

  /* تصغير الصور داخل كروت المنتجات */
  const cardCSS = `
    @media (max-width:767px) {

      .product-entry,
      .s-product-card,
      .s-product-card-entry,
      .product-card,
      .product-entry__content,
      .s-product-card-content {
        min-height: 0 !important;
      }

      :is(
        .product-entry__image-wrap,
        .product-entry__image,
        .product-entry__image-wrapper,
        .s-product-card-image,
        .s-product-card-image-container,
        .s-product-card-image-wrapper,
        .s-product-card-entry__image,
        .product-card__image
      ) {
        height: ${IMG_HEIGHT}px !important;
        max-height: ${IMG_HEIGHT}px !important;
        min-height: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        aspect-ratio: auto !important;
        overflow: hidden !important;
      }

      :is(
        .product-entry__image-wrap,
        .product-entry__image,
        .product-entry__image-wrapper,
        .s-product-card-image,
        .s-product-card-image-container,
        .s-product-card-image-wrapper,
        .s-product-card-entry__image,
        .product-card__image
      ) img {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        max-height: ${IMG_HEIGHT}px !important;
        object-fit: contain !important;
        object-position: center !important;
      }

      /* أسماء المنتجات */
      :is(
        .product-entry__title,
        .s-product-card-content-title,
        .s-product-card-title,
        .product-card__title
      ) {
        font-size: 13px !important;
        line-height: 1.6 !important;
        max-height: 3.2em !important;
        overflow: hidden !important;
        color: #253344 !important;
      }
    }
  `;

  /* إزالة فراغات Shadow DOM */
  const sliderCSS = `
    @media (max-width:767px) {

      :host {
        display: block !important;
        min-height: 0 !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .container,
      .slider-wrapper,
      .s-slider-container,
      .swiper,
      .swiper-container {
        min-height: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }

      .header {
        min-height: 0 !important;
        margin: 0 0 6px !important;
        padding: 0 !important;
      }

      /* العناوين الفارغة فقط */
      :host(.rs-blank-title) .header {
        display: none !important;
      }

      .swiper-slide {
        height: auto !important;
      }
    }
  `;

  function injectStyle(root, styles) {
    if (!root || root.querySelector("#" + SHADOW_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = SHADOW_ID;
    style.textContent = styles;
    root.appendChild(style);
  }

  function fixSection(section) {
    const host = section.querySelector(
      '[component-name="products-slider"]'
    );

    if (!host || !host.shadowRoot) return;

    let config = {};

    try {
      config = JSON.parse(
        host.getAttribute("config") || "{}"
      );
    } catch (e) {}

    const title = String(
      config.headline ||
      config.ar?.headline ||
      config.title ||
      ""
    ).trim();

    const subtitle = String(
      config.subtitle ||
      config.ar?.subtitle ||
      ""
    ).trim();

    host.classList.toggle(
      "rs-blank-title",
      !title && !subtitle
    );

    const root = host.shadowRoot;

    injectStyle(root, sliderCSS + cardCSS);

    /* التعامل مع مكونات سلة الداخلية */
    root.querySelectorAll(
      "custom-salla-product-card," +
      "salla-product-card,salla-slider"
    ).forEach(function (node) {

      if (!node.shadowRoot) return;

      injectStyle(
        node.shadowRoot,
        sliderCSS + cardCSS
      );

      node.shadowRoot.querySelectorAll(
        "custom-salla-product-card,salla-product-card"
      ).forEach(function (card) {

        if (card.shadowRoot) {
          injectStyle(card.shadowRoot, cardCSS);
        }

      });
    });
  }

  function start() {
    const sections = Array.from(
      document.querySelectorAll(
        "main.app-inner > " +
        "section.s-block--bundle-products-slider"
      )
    );

    if (!sections.length) return;

    sections.forEach(fixSection);

    /* معالجة السلايدرات عند وصول العميل إليها */
    if ("IntersectionObserver" in window) {

      const observer = new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            fixSection(entry.target);

            setTimeout(
              () => fixSection(entry.target),
              400
            );

            setTimeout(
              () => fixSection(entry.target),
              1300
            );
          });

        },
        { rootMargin: "350px 0px" }
      );

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }

    [800, 2500, 5000].forEach(function (delay) {
      setTimeout(function () {
        sections.forEach(fixSection);
      }, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      { once: true }
    );
  } else {
    start();
  }

})();


/* ======================================================================
   RELAX SMART V70 | Product description preserved / product-specific media
   Changes presentation ONLY. No manufactured specs, financing, discounts,
   reviews, shipping terms, FAQ, or structured product prices.
   ====================================================================== */
(function(){
  'use strict';
  if(window.__relaxProductV70)return;
  window.__relaxProductV70=true;
  const $=(q,root=document)=>root.querySelector(q);
  const $$=(q,root=document)=>Array.from(root.querySelectorAll(q));
  const isProduct=/\/p\d+(?:\/|$)/i.test(location.pathname);
  const style=document.createElement('style');
  style.id='relax-smart-v70-style';
  style.textContent=`
  /* Price typography: red current, BLUE crossed-out genuine old price */
  body.rs60-product .product-details-col :is(.sale-price,.price_is_on_sale .total-price,.starting-or-normal-price:not(.hidden) .total-price){
    color:#c9162a!important;font-weight:900!important;font-size:clamp(25px,3vw,34px)!important;
  }
  body.rs60-product .product-details-col :is(.sale-price,.price_is_on_sale .total-price,.starting-or-normal-price:not(.hidden) .total-price) i{color:#c9162a!important}
  body.rs60-product .product-details-col :is(.regular-price,.before-price),
  body.rs60-product .rs60-item-price del{
    color:#1e40af!important;opacity:1!important;visibility:visible!important;
    font-weight:800!important;text-decoration:line-through!important;
    text-decoration-thickness:1.6px!important;text-decoration-color:#1e40af!important;
  }
  body.rs60-product .product-details-col :is(.regular-price,.before-price) i,
  body.rs60-product .rs60-item-price del i{color:#1e40af!important;opacity:1!important}
  body.rs60-product .rs60-fire{
    background:#e8f0ff!important;color:#173d85!important;border:1px solid #bbcef2!important;
    border-radius:999px!important;box-shadow:none!important;font-size:11px!important;
    padding:5px 10px!important;white-space:nowrap!important;
  }
  /* Keep gift and add-on area short on mobile, 4 per category max. */
  body.rs70-product .rs60-gift-section .rs60-products>.rs60-item:nth-of-type(n+5),
  body.rs70-product .rs60-paid-section .rs60-products>.rs60-item:nth-of-type(n+5){display:none!important}
  body.rs70-product .rs60-gift-section,body.rs70-product .rs60-paid-section{
    background:#fff!important;border:1px solid #e7eaf0!important;border-radius:13px!important;
    padding:11px!important;margin:11px 0!important;
  }
  body.rs70-product .rs60-section-title{font-size:15px!important}
  body.rs70-product .rs60-section-desc{font-size:11px!important;line-height:1.7!important;margin-bottom:7px!important}
  body.rs70-product .rs60-gift-section .rs60-small-link{
    display:inline-flex!important;align-items:center!important;justify-content:center!important;
    background:#b91c2b!important;border-radius:8px!important;color:#fff!important;
    padding:8px 12px!important;text-decoration:none!important;font-weight:800!important;
  }
  body.rs70-product .rs60-gift-section .rs60-small-link:hover{background:#90121f!important}
  body.rs70-product .rs60-gift-section .rs60-item-price,body.rs70-product .rs60-paid-section .rs60-item-price{color:#c9162a!important}
  body.rs70-product .rs60-gift-section .rs60-products,body.rs70-product .rs60-paid-section .rs60-products{
    display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important;
  }
  body.rs70-product .rs60-gift-section .rs60-item,body.rs70-product .rs60-paid-section .rs60-item{
    display:flex!important;min-height:0!important;flex-direction:column!important;gap:5px!important;
    align-items:stretch!important;padding:7px!important;
  }
  body.rs70-product .rs60-gift-section .rs60-item-photo,body.rs70-product .rs60-paid-section .rs60-item-photo{
    width:100%!important;min-width:0!important;height:75px!important;flex:0 0 75px!important;
    background:#f9fafb!important;max-width:100%!important;
  }
  body.rs70-product .rs60-gift-section .rs60-item-photo img,body.rs70-product .rs60-paid-section .rs60-item-photo img{
    height:100%!important;width:100%!important;object-fit:contain!important;
  }
  body.rs70-product .rs60-gift-section .rs60-item-info,body.rs70-product .rs60-paid-section .rs60-item-info{
    min-width:0!important;width:100%!important;display:flex!important;flex:1!important;flex-direction:column!important;
  }
  body.rs70-product .rs60-gift-section .rs60-item-name,body.rs70-product .rs60-paid-section .rs60-item-name{
    font-size:11px!important;line-height:1.45!important;display:-webkit-box!important;
    -webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;min-height:2.9em!important;
    overflow:hidden!important;
  }
  body.rs70-product .rs60-gift-section .rs60-pick,body.rs70-product .rs60-paid-section .rs60-paid-check{
    margin-top:auto!important;min-height:31px!important;font-size:11px!important;
  }
  /* Complete long description under the main product — preserve original markup. */
  body.rs70-product .rs60-after-main{width:100%;max-width:1280px!important;margin-inline:auto!important;}
  body.rs70-product .rs60-description-panel{
    background:#fff!important;border:1px solid #e5eaf0!important;border-radius:18px!important;
    padding:clamp(16px,3vw,32px)!important;box-shadow:0 8px 30px rgba(16,33,58,.035)!important;
  }
  body.rs70-product .rs60-description-panel .rs60-description-tabs{margin-bottom:18px!important;padding-bottom:11px!important}
  body.rs70-product #rs60-description .rs70-full-original,
  body.rs70-product #rs60-description .rs70-full-original :is(p,li,td,th){
    font-size:clamp(14px,1.5vw,16px)!important;line-height:2!important;color:#334155!important;
  }
  body.rs70-product #rs60-description .rs70-full-original :is(h2,h3,h4){
    color:#15375c!important;line-height:1.6!important;letter-spacing:normal!important;
    font-weight:900!important;scroll-margin-top:115px;
  }
  body.rs70-product #rs60-description .rs70-full-original h2{
    font-size:clamp(19px,2vw,23px)!important;border-right:4px solid #c9162a;
    padding:8px 12px!important;margin:24px 0 12px!important;background:#f8faff;border-radius:5px;
  }
  body.rs70-product #rs60-description .rs70-full-original h3{
    font-size:clamp(17px,1.7vw,20px)!important;margin:22px 0 10px!important;
  }
  body.rs70-product #rs60-description .rs70-full-original h4{font-size:16px!important;margin:18px 0 7px!important}
  body.rs70-product #rs60-description .rs70-full-original ul,
  body.rs70-product #rs60-description .rs70-full-original ol{list-style:revert!important;padding-inline-start:25px!important;margin:9px 0 17px!important}
  body.rs70-product #rs60-description .rs70-full-original li{margin:5px 0!important;line-height:1.9!important}
  body.rs70-product #rs60-description .rs70-full-original :is(table,.ql-table){
    width:100%!important;max-width:100%!important;overflow-x:auto!important;
    border-collapse:collapse!important;margin:14px 0!important;background:#fff;
  }
  body.rs70-product #rs60-description .rs70-full-original :is(td,th){
    padding:11px!important;border:1px solid #dce4ef!important;background:#f8fafc!important;
    overflow-wrap:anywhere;
  }
  body.rs70-product #rs60-description .rs70-full-original :is(a){color:#1557ad!important;text-decoration:underline!important;text-underline-offset:3px}
  body.rs70-product #rs60-description .rs70-full-original img{
    width:auto!important;max-width:100%!important;height:auto!important;object-fit:contain!important;
    display:block;border-radius:13px;margin:14px auto;
  }
  body.rs70-product #rs60-description .rs70-full-original>*{max-width:100%}
  body.rs70-product .rs70-overview{border:1px solid #e3eaf5;background:#f8fbff;border-radius:12px;
    padding:12px 14px;margin:0 0 16px;line-height:1.8}
  body.rs70-product .rs70-overview strong{color:#17395c;font-size:14px;font-weight:900;display:block;margin-bottom:5px}
  body.rs70-product .rs70-overview a{display:inline-block;color:#1654a2!important;font-size:12px;
    text-decoration:none!important;margin:2px 0 2px 9px;font-weight:700}
  body.rs70-product .rs70-teaser{padding:10px 12px;border:1px solid #e5eaf0;
    border-radius:12px;background:#f9fbfe;margin:11px 0 12px;line-height:1.7}
  body.rs70-product .rs70-teaser p{font-size:13px;color:#36475d!important;line-height:1.85;margin:0 0 6px}
  body.rs70-product .rs70-teaser a{font-size:12px;font-weight:900;color:#b91c2b!important;text-decoration:underline}
  body.rs70-product .rs70-media-strip{margin:16px 0 22px;background:linear-gradient(115deg,#f6f9fe,#fff9f6);
    border:1px solid #e5eaf0;border-radius:15px;padding:12px;}
  body.rs70-product .rs70-media-strip figcaption{font-size:13px;font-weight:900;color:#223f62;margin-bottom:9px}
  body.rs70-product .rs70-media-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
  body.rs70-product .rs70-media-grid a{display:block;background:#fff;border:1px solid #e1e7ef;border-radius:11px;
    overflow:hidden;min-width:0;text-decoration:none!important}
  body.rs70-product .rs70-media-grid img{width:100%!important;height:200px!important;max-width:100%!important;
    object-fit:contain!important;margin:0!important;display:block;background:#fff}
  body.rs70-product .rs70-media-grid .rs70-img-label{font-size:11px;color:#475569;line-height:1.5;
    display:block;padding:7px 8px;max-height:3.4em;overflow:hidden}
  /* Branded native offers without duplicating Salla's carousel title */
  body.rs70-product .rs60-native-offers{border-radius:17px!important;padding:clamp(14px,2vw,20px)!important}
  body.rs70-product .rs60-native-offers .rs60-after-heading{font-size:19px!important;margin-bottom:10px!important}
  body.rs70-product .rs60-native-offers .s-slider-block__title-right{display:none!important}
  body.rs70-product .rs60-native-offers .s-offer-card{border:1px solid #e4eaf2!important;
    background:#fff!important;border-radius:12px!important;padding:12px!important}
  /* Only banner IDs 0 and 2 full bleed on mobile homepage; no other banner modified. */
  @media(max-width:767px){
    body.index main.app-inner>section.s-block--fixed-banner:is(.s-block--0,.s-block--2){
      width:100vw!important;max-width:100vw!important;margin-inline:calc(50% - 50vw)!important;
      padding:0!important;border-radius:0!important;overflow:hidden!important;
    }
    body.index main.app-inner>section.s-block--fixed-banner:is(.s-block--0,.s-block--2)>.container{
      width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;
    }
    body.index main.app-inner>section.s-block--fixed-banner:is(.s-block--0,.s-block--2) :is(a,picture,img){
      width:100%!important;max-width:100%!important;border-radius:0!important;
    }
    body.rs70-product .rs60-gift-section .rs60-products,
    body.rs70-product .rs60-paid-section .rs60-products{
      display:grid!important;grid-auto-flow:column!important;grid-auto-columns:124px!important;
      grid-template-columns:none!important;overflow-x:auto!important;overscroll-behavior-inline:contain;
      scroll-snap-type:x proximity;gap:8px!important;padding:1px 2px 9px!important;
    }
    body.rs70-product .rs60-gift-section .rs60-item,body.rs70-product .rs60-paid-section .rs60-item{
      width:124px!important;scroll-snap-align:start;padding:6px!important;border-radius:9px!important;
    }
    body.rs70-product .rs60-gift-section .rs60-item-photo,body.rs70-product .rs60-paid-section .rs60-item-photo{
      height:70px!important;flex:0 0 70px!important;min-height:70px!important;
    }
    body.rs70-product .rs60-gift-section .rs60-item-name,body.rs70-product .rs60-paid-section .rs60-item-name{
      font-size:10px!important;min-height:2.9em!important
    }
    body.rs70-product .rs60-section-desc{max-height:3.4em;overflow:hidden}
    body.rs70-product .rs70-media-grid img{height:135px!important}
    body.rs70-product .rs60-description-panel{padding:14px!important;border-radius:13px!important}
  }
  @media(prefers-reduced-motion:reduce){.s-promotion-banner .content-wrap{animation:none!important}}
  `;
  (document.head||document.documentElement).appendChild(style);
  if(!isProduct)return;

  function ensureAfter(info){
    let after=$('.rs60-after-main');
    if(after)return after;
    const wrapper=$('.container--product-single');if(!wrapper)return null;
    after=document.createElement('div');after.className='rs60-after-main';wrapper.insertAdjacentElement('afterend',after);
    return after;
  }
  function getRichOriginal(info,panel){
    // A decorated subtitle is NOT the long merchant-written description.
    const candidates=[
      ...$$(':scope > .leading-6,:scope > .product-description,:scope > .description,:scope > .rs46-description,:scope > .rs56-description,:scope > [data-testid="product-description"],:scope > #product-description',info),
      ...$$('.rs60-description-source',panel||document.createDocumentFragment())
    ];
    const valid=candidates.filter(el=>el && !el.matches('.product-entry__sub-title,.rs70-teaser') &&
      !el.closest('.rs60-gift-section,.rs60-paid-section') && (el.textContent.trim().length>0 || !!el.querySelector('img,iframe,video,table')));
    return valid.sort((a,b)=>{
      const score=el=>el.textContent.trim().length+30*el.querySelectorAll('h2,h3,h4,li,table,img').length;
      return score(b)-score(a);
    })[0]||null;
  }
  function ensurePanel(info){
    const after=ensureAfter(info);if(!after)return null;
    let panel=$('.rs60-description-panel',after);
    if(!panel){
      panel=document.createElement('section');panel.className='rs60-description-panel';
      panel.dir='rtl';panel.id='rs60-description';
      const tabs=document.createElement('div');tabs.className='rs60-description-tabs';
      const tab=document.createElement('strong');tab.className='rs60-tab is-current';tab.textContent='تفاصيل المنتج';
      tabs.append(tab);
      const reviews=$('.container--product-reviews,salla-comments');
      if(reviews){if(!reviews.id)reviews.id='rs60-reviews';
        const link=document.createElement('a');link.href='#'+reviews.id;link.className='rs60-tab';link.textContent='تقييمات المنتج';tabs.append(link);
      }
      panel.append(tabs);after.append(panel);
    }
    return panel;
  }
  function summarize(info,source){
    if($('.rs70-teaser',info))return;
    const paras=$$('p',source).map(x=>x.textContent.trim()).filter(x=>x.length>30);
    const lead=(paras[0]||'').slice(0,215).trim();
    const box=document.createElement('div');box.className='rs70-teaser';
    if(lead){const p=document.createElement('p');p.textContent=lead+(paras[0].length>215?'…':'');box.append(p);}
    const a=document.createElement('a');a.href='#rs60-description';a.textContent='اقرأ الوصف الكامل والمواصفات ↓';box.append(a);
    const anchor=$(':scope > salla-installment',info)||$(':scope > .rs60-price-note',info)||$(':scope > .flex.whitespace-nowrap',info);
    if(anchor)anchor.insertAdjacentElement('afterend',box);
    else $('form.product-form',info)?.insertAdjacentElement('beforebegin',box);
  }
  function makeContents(panel,source){
    if($('.rs70-overview',panel))return;
    const headings=$$('h2,h3',source).filter(x=>x.textContent.trim().length>4 && x.textContent.trim().length<110);
    if(headings.length<3)return;
    const nav=document.createElement('nav');nav.className='rs70-overview';nav.setAttribute('aria-label','أقسام تفاصيل المنتج');
    const name=document.createElement('strong');name.textContent='في تفاصيل المنتج';nav.append(name);
    headings.slice(0,8).forEach((h,i)=>{
      if(!h.id)h.id='rs70-detail-'+i;
      const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent.trim();nav.append(a);
    });
    source.insertAdjacentElement('beforebegin',nav);
  }
  function validPhoto(url){
    try{const u=new URL(url,location.origin);return /^https?:$/.test(u.protocol)&&/\.(?:png|jpe?g|webp|avif)(?:$|[?])/i.test(u.href)?u.href:'';}
    catch{return '';}
  }
  function internalGallery(source){
    if(source.querySelector('img,figure,.rs70-media-strip'))return;
    const gallery=$('.container--product-single .details-slider');
    if(!gallery)return;
    const seen=new Set();const pics=[];
    $$('a[data-fslightbox] img,a.swiper-slide img',gallery).forEach(img=>{
      const href=validPhoto(img.closest('a')?.getAttribute('href')||img.currentSrc||img.src);
      if(!href||seen.has(href))return;seen.add(href);
      pics.push({href,alt:img.getAttribute('alt')||''});
    });
    // These are *existing photos* attached to this exact product, never a random banner.
    const selected=[pics[1],pics[3]||pics[2]].filter(Boolean);
    if(!selected.length)return;
    const figure=document.createElement('figure');figure.className='rs70-media-strip';
    const title=document.createElement('figcaption');title.textContent='صور إضافية من المنتج';figure.append(title);
    const grid=document.createElement('div');grid.className='rs70-media-grid';
    selected.forEach((entry,i)=>{
      const link=document.createElement('a');link.href=entry.href;link.target='_blank';link.rel='noopener noreferrer';
      const img=document.createElement('img');img.src=entry.href;img.loading='lazy';img.decoding='async';
      img.alt=entry.alt||'صورة إضافية للمنتج';
      const caption=document.createElement('span');caption.className='rs70-img-label';
      caption.textContent=entry.alt||'صورة '+(i+2)+' للمنتج';
      link.append(img,caption);grid.append(link);
    });
    figure.append(grid);
    const headings=$$('h2,h3',source);
    const place=headings.length>=3?headings[2]:null;
    if(place)place.insertAdjacentElement('beforebegin',figure);
    else source.append(figure);
  }
  function preserveDescription(info){
    const panel=ensurePanel(info);if(!panel)return;
    const original=getRichOriginal(info,panel);
    if(!original)return; // New product without merchant text: do not fabricate facts.
    if(original.dataset.rs70FullReady==='1')return;
    const old=$('.rs60-description-source',panel);
    if(old && old!==original){
      // Keep the merchant's original one-line subtitle visible near the product, not as a fake long description.
      old.classList.remove('rs60-description-source');old.classList.add('rs70-product-subtitle');
      const form=$('form.product-form',info);
      if(form)form.insertAdjacentElement('beforebegin',old);
    }
    original.classList.add('rs60-description-source','rs70-full-original');
    original.classList.remove('rs69-short-summary','rs-original-desc','rs-short-desc');
    $$('.rs-desc-hidden,.rs-desc-first,[data-rs-desc-extra],[data-rs-desc-first]',original).forEach(el=>{
      el.classList.remove('rs-desc-hidden','rs-desc-first');
      el.removeAttribute('data-rs-desc-extra');el.removeAttribute('data-rs-desc-first');
    });
    $$('.rs-original-more,.rs-short-more',original).forEach(el=>el.remove());
    original.dataset.rs70FullReady='1';
    panel.append(original); // MOVE rather than clone: headings, links, lists, media and tables stay original.
    summarize(info,original);
    makeContents(panel,original);
    internalGallery(original);
    $$('.rs69-more-link',info).forEach(el=>el.remove());
  }
  function priceBadge(info){
    $$('.rs60-fire',info).forEach(el=>{el.textContent='عرض مميز';});
  }
  function nativeInstallment(info){
    const el=$('salla-installment',info);if(!el)return;
    // Do not create a fake provider logo or fake installments. V69's native component remains.
    const anchor=$(':scope > .rs60-price-note',info)||$(':scope > .flex.whitespace-nowrap',info);
    if(anchor&&el.parentElement===info&&anchor.nextElementSibling!==el){anchor.insertAdjacentElement('afterend',el);}
  }
  function init(){
    const info=$('.container--product-single .product-details-col');
    if(!info)return;
    document.body.classList.add('rs70-product','rs69-product');
    priceBadge(info);nativeInstallment(info);preserveDescription(info);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  document.addEventListener('theme::ready',init,{once:true});
  [400,1100,2300,4200].forEach(ms=>setTimeout(init,ms));
})();

/* =====================================================================
   RELAX SMART V71 - DESKTOP AND MOBILE NATIVE SALLA PURCHASE BAR
   Keeps the ONE ORIGINAL Salla add-to-cart element inside its form.
   Salla owns and renders Quick Buy / Apple Pay when merchant & browser allow.
   If Quick Buy is disabled, a labeled cart-first fallback is used.
   ===================================================================== */
(function(){
  'use strict';
  if(window.__rs71Commerce)return;window.__rs71Commerce=true;
  if(!/\/p\d+(?:\/|$)/i.test(location.pathname))return;

  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  let binding=null;
  // V78: only installment and offer presentation retained from V71. No legacy sticky styles.
  const style=document.createElement('style');
  style.id='rs78-installments-offers-style';
  style.textContent=`
  body.rs71-product .rs69-installments{display:block!important;visibility:visible!important;
    background:#fff!important;border:1px solid #dfe6ee!important;border-radius:12px!important;
    padding:11px!important;margin:10px 0 13px!important;overflow:visible!important;height:auto!important;}
  body.rs71-product .rs69-payment-title{font-size:13px;color:#273449;font-weight:900;margin-bottom:7px}
  body.rs71-product .rs69-payment-brands{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}
  body.rs71-product .rs69-payment-brand{display:inline-flex;border:1px solid #e0e4eb;
    border-radius:7px;padding:3px 9px;background:#fff;font-size:12px;font-weight:850}
  body.rs71-product .rs69-payment-brand[data-name=tabby]{background:#e6f6ee;color:#166a50}
  body.rs71-product .rs69-payment-brand[data-name=tamara]{background:#f2edff;color:#4f438d}
  body.rs71-product .rs69-payment-caption{font-size:11px;color:#657387;line-height:1.6;margin:2px 0 7px}
  body.rs71-product .rs69-installments>.mb-5{margin:6px 0!important}
  body.rs71-product .rs69-installments :is(#tabbyPromoWrapper,tamara-widget,mispay-widget){max-width:100%;height:auto;}
  body.rs71-product .rs69-offers-toggle{display:block;border:1px solid #d6e2f0;border-radius:9px;
    padding:9px 13px;margin:12px 0 0;color:#1e4a7b;background:#f1f7ff;font-weight:800;cursor:pointer}
  body.rs71-product .rs60-native-offers:not(.rs69-offers-open) .s-offer-categories{display:none!important}
  body.rs71-product .rs60-native-offers .s-offer-card-description{display:-webkit-box;-webkit-box-orient:vertical;
    -webkit-line-clamp:3;overflow:hidden;font-size:13px;line-height:1.7}
  body.rs71-product .rs60-native-offers.rs69-offers-open .s-offer-card-description{
    display:block;-webkit-line-clamp:unset;overflow:visible}

  `;
  (document.head||document.documentElement).append(style);

  function setupOffers(){
    const panel=$('.rs60-native-offers');
    if(!panel)return;
    const wrapper=$('.container--product-single');
    let after=$('.rs60-after-main');
    if(!after&&wrapper){after=document.createElement('div');after.className='rs60-after-main';wrapper.insertAdjacentElement('afterend',after);}
    if(after&&panel.parentElement!==after)after.prepend(panel);
    if(panel.dataset.rs71OffersReady)return;
    const titles=$$('.s-offer-card-title',panel);
    if(!titles.length)return;
    panel.dataset.rs71OffersReady='1';
    let toggle=$('.rs69-offers-toggle',panel);
    if(!toggle){toggle=document.createElement('button');toggle.type='button';toggle.className='rs69-offers-toggle';panel.append(toggle);}
    toggle.textContent='عرض شروط العروض كاملة';toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',()=>{
      const open=panel.classList.toggle('rs69-offers-open');
      toggle.textContent=open?'إخفاء شروط العروض':'عرض شروط العروض كاملة';
      toggle.setAttribute('aria-expanded',String(open));
    });
  }

  function installmentNearPrice(info){
    const inst=$('salla-installment',info);if(!inst)return;
    const enabled={tabby:!!$('#tabbyPromoWrapper,#tabbyPromo',inst),
      tamara:!!$('tamara-widget',inst),mispay:!!$('mispay-widget',inst)};
    if(!Object.values(enabled).some(Boolean))return;
    inst.classList.add('rs69-installments');
    if(!$('.rs69-payment-title',inst)){
      const head=document.createElement('div');head.className='rs69-payment-title';head.textContent='خيارات الدفع بالتقسيط';
      const brands=document.createElement('div');brands.className='rs69-payment-brands';
      Object.entries({tabby:'تابي',tamara:'تمارا',mispay:'مِس باي'}).forEach(([k,label])=>{
        if(!enabled[k])return;
        const chip=document.createElement('span');chip.className='rs69-payment-brand';chip.dataset.name=k;chip.textContent=label;brands.append(chip);
      });
      const note=document.createElement('p');note.className='rs69-payment-caption';
      note.textContent='التقسيط حسب الأهلية وشروط مزوّد الخدمة عند الدفع.';
      inst.prepend(head,brands,note);
    }
    if(inst.parentElement===info){
      const anchor=info.querySelector(':scope > .rs60-price-note')||info.querySelector(':scope > .flex.whitespace-nowrap');
      if(anchor&&anchor.nextElementSibling!==inst)anchor.insertAdjacentElement('afterend',inst);
    }
  }

  // V78: old summary/fallback-buy routines removed (native Salla controls remain).

  /* Legacy rs71 sticky routine removed to prevent reactivation. */
  function init(){
    const info=$('.container--product-single .product-details-col');if(!info)return;
    const form=$('form.product-form',info);const bar=form&&$('.addtocart-bar',form);
    const host=bar&&$('salla-add-product-button',bar);
    if(!bar||!host)return;
    document.body.classList.add('rs71-product','rs70-product');
    // Older visual buy-now controls are not native quick-checkout and caused duplication.
    $$('.rs69-buy-now,#rs-sticky-buy',document).forEach(el=>el.remove());
    /* Native sticky is managed only by V80. No support-sticky-bar mutation. */
    /* V88: don't mutate Salla quick-buy after hydration; official component owns it. */
    installmentNearPrice(info);setupOffers(); /* V77 replaces the old summary */
    /* V76 controls purchase actions without inserting fake payment processors. */
    if(host.dataset.rs71NativeWatch!=='1'){
      host.dataset.rs71NativeWatch='1';
      /* V76 checks late native payment hydration. */
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  document.addEventListener('theme::ready',init,{once:true});
  [300,900,1900,3400,5400].forEach(ms=>setTimeout(init,ms));
})();


/* ====================================================================
   RELAX SMART V72 — Gentle announcement ticker + fact-based excerpts.
   Storefront PRESENTATION only; does not modify Salla product records.
   Use the separate authorized Merchant API tool to update actual fields.
   ==================================================================== */
(() => {
  'use strict';
  if (window.__relaxSmartV72) return;
  window.__relaxSmartV72 = true;
  const style = document.createElement('style');
  style.id = 'rs72-marquee-product-style';
  style.textContent = `
    /* Theme already has a moving track; change speed, not animation name.
       Default v71 was 16s; 13.5s is slightly faster with constant velocity. */
    .s-promotion-banner { overflow: hidden; }
    .s-promotion-banner .content-wrap,
    .s-promotion-banner .content-wrap > .st-banner-bar__content {
      animation-duration: 13.5s !important;
      animation-timing-function: linear !important;
    }
    .s-promotion-banner .content-wrap { backface-visibility: hidden; }
    .s-promotion-banner .st-banner-bar__content { flex-shrink: 0; }
    @media (prefers-reduced-motion: reduce) {
      .s-promotion-banner .content-wrap,
      .s-promotion-banner .content-wrap > .st-banner-bar__content {
        animation: none !important;
        transform: none !important;
      }
      .s-promotion-banner .st-banner-bar__content.md\\:hidden { display:none !important; }
    }
    /* A concise fact-based short intro without hiding the saved full text. */
    body.rs72-product .rs72-auto-subtitle {
      font-size: 13px !important;
      font-weight: 600 !important;
      line-height: 1.85 !important;
      color: #50627a !important;
      margin: 8px 0 13px !important;
      padding: 0 3px !important;
    }
    body.rs72-product .rs72-auto-subtitle a { color:#17549c !important; }
    body.rs72-product .rs60-description-panel .rs70-full-original img {
      display:block;max-width:100% !important;height:auto !important;
      object-fit:contain !important;margin:14px auto !important;
    }
    body.rs72-product .rs60-description-panel .rs70-full-original figure {
      max-width:100% !important;overflow:hidden;
    }
  `;
  (document.head || document.documentElement).append(style);
  function short(text,limit=145) {
    const normalized = (text || '').replace(/\s+/g,' ').trim();
    if(normalized.length<=limit) return normalized;
    const portion=normalized.slice(0,limit);
    return portion.slice(0,portion.lastIndexOf(' ')>65?portion.lastIndexOf(' '):limit).replace(/[،؛,؛\s.]+$/,'')+'…';
  }
  function apply() {
    if(!/\/p\d+(?:\/|$)/.test(location.pathname)) return;
    const info=document.querySelector('.container--product-single .product-details-col');
    const panel=document.querySelector('.rs60-description-panel');
    const original=panel?.querySelector('.rs70-full-original');
    if(!info || !original || !original.textContent?.trim()) return;
    document.body.classList.add('rs72-product');
    /* This fallback ONLY shows merchant-written facts when there isn't a
       populated native subtitle. Do not duplicate existing Salla metadata. */
    if(info.querySelector('.rs70-product-subtitle,.product-entry__sub-title,.rs72-auto-subtitle')) return;
    const first=[...original.querySelectorAll('p')].find(el=>el.textContent.trim().length>=35);
    if(!first) return;
    const note=document.createElement('p');
    note.className='rs72-auto-subtitle';
    note.textContent=short(first.textContent,142);
    const form=info.querySelector('form.product-form');
    if(form)form.insertAdjacentElement('beforebegin',note);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  document.addEventListener('theme::ready',apply,{once:true});
  [750,1800,3200].forEach(ms=>setTimeout(apply,ms));
})();


/* =====================================================================
   RELAX SMART V73 - Clean specifications (sticky V73 superseded by V74)
   The native Salla purchase form NEVER becomes fixed or moves in the DOM.
   The 2 floating actions call its existing controls, and thus keep product
   variants, quantity, gifts and discounts under Salla's actual checkout.
   There is no simulated Apple Pay / checkout payment button.
   ===================================================================== */
(function () {
  'use strict';
  if (!/\/p\d+(?:\/|$)/i.test(location.pathname)) return;
  if (window.__relaxSmartV73) return;
  window.__relaxSmartV73 = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const css=document.createElement('style');
  css.id='rs73-compact-purchase-specs-style';
  css.textContent=`
    /* V78: specifications-only CSS. Legacy sticky bar styles removed. */
    /* Do not make a giant black/empty HTML table out of a one-cell spec list. */
    body.rs73-product #rs60-description .rs70-full-original .rs73-spec-grid{
      width:100%!important;max-width:100%!important;display:grid!important;
      grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;
      margin:12px 0 22px!important;padding:0!important;
      border:0!important;background:transparent!important;border-radius:0!important;
      box-shadow:none!important;direction:rtl!important;
    }
    body.rs73-product #rs60-description .rs70-full-original .rs73-spec-card{
      min-width:0!important;min-height:58px!important;max-width:100%!important;
      display:flex!important;flex-direction:column!important;gap:5px!important;
      padding:11px 13px!important;border-radius:11px!important;
      border:1px solid #e1e8f1!important;background:#f8fbff!important;
      box-shadow:none!important;color:#263950!important;white-space:normal!important;
      overflow-wrap:anywhere!important;text-align:right!important;
      font-size:13px!important;line-height:1.7!important;
    }
    body.rs73-product #rs60-description .rs70-full-original .rs73-spec-label{
      color:#5b7189!important;font-size:11px!important;font-weight:800!important;
      line-height:1.5!important}
    body.rs73-product #rs60-description .rs70-full-original .rs73-spec-value{
      color:#1f354f!important;font-size:13px!important;font-weight:800!important;
      line-height:1.6!important}
    body.rs73-product #rs60-description .rs70-full-original table:not(.rs73-skip){
      width:100%!important;max-width:100%!important;height:auto!important;
      min-height:0!important;border:1px solid #e0e8f0!important;
      border-radius:10px!important;overflow:hidden!important;
      background:#fff!important;box-shadow:none!important;
      border-collapse:separate!important;border-spacing:0!important;table-layout:auto!important;
      margin:12px 0 19px!important;
    }
    body.rs73-product #rs60-description .rs70-full-original table:not(.rs73-skip) :is(th,td){
      width:auto!important;height:auto!important;min-height:0!important;
      background:#fff!important;color:#2f4055!important;
      border:0!important;border-bottom:1px solid #e7edf4!important;
      padding:11px 12px!important;text-align:right!important;
      vertical-align:middle!important;overflow-wrap:anywhere!important;
    }
    body.rs73-product #rs60-description .rs70-full-original table:not(.rs73-skip) tr:nth-child(even) td{
      background:#f8fbff!important}
    body.rs73-product #rs60-description .rs70-full-original table:not(.rs73-skip) tr:last-child :is(td,th){border-bottom:0!important}
    @media(max-width:767px){
      body.rs73-product #rs60-description .rs70-full-original .rs73-spec-grid{
        grid-template-columns:1fr!important;gap:6px!important}
      body.rs73-product #rs60-description .rs70-full-original .rs73-spec-card{
        min-height:0!important;padding:9px 11px!important}
    }
  `;
  (document.head||document.documentElement).append(css);

  // V78: the unused old sticky purchase functions are gone.

  const specLabels=[
    'وزن الشحن المسجل','العجلات الأمامية','العجلات الخلفية','العجلات الامامية','العجلات الخلفيه',
    'مساعدات الحركة','مواصفات المنتج','نوع المنتج','نوع الكرسي','رمز المنتج','لون المنتج',
    'مسند الذراع','مسند الرأس','مسند القدم','مساند الذراع','مسند الظهر','مدة الضمان',
    'بلد الصنع','عرض المقعد','ارتفاع المقعد','وزن المنتج','وزن الشحن','قدرة التحمل',
    'حجم المنتج','محتويات العبوة','طريقة الاستخدام','الخامة','الخامات','الألوان','اللون',
    'المقاس','الأبعاد','الوزن','النوع','المادة','الموديل','التصميم','الهيكل','الضمان',
    'الشركة المصنعة','الاسم','السعة','الطول','العرض','الارتفاع'
  ].sort((a,b)=>b.length-a.length);
  function textOf(el){return (el?.textContent||'').replace(/\s+/g,' ').trim();}
  function hasComplexMarkup(cell){return !!cell.querySelector('img,figure,table,iframe,video,ul,ol,a,br');}
  function pushCellContent(el,cell){while(cell.firstChild)el.append(cell.firstChild);}
  function makeSpecCard(cells){
    const card=document.createElement('div');card.className='rs73-spec-card';
    if(cells.length===1){
      const cell=cells[0],raw=textOf(cell);
      const key=!hasComplexMarkup(cell)?specLabels.find(v=>raw.startsWith(v)&&raw.slice(v.length).trim().length>1):null;
      if(key){
        const a=document.createElement('span');a.className='rs73-spec-label';a.textContent=key;
        const b=document.createElement('span');b.className='rs73-spec-value';b.textContent=raw.slice(key.length).replace(/^[\s:：،-]+/,'').trim();
        card.append(a,b);
      }else{const val=document.createElement('span');val.className='rs73-spec-value';pushCellContent(val,cell);card.append(val);}
    }else{
      const a=document.createElement('span');a.className='rs73-spec-label';pushCellContent(a,cells[0]);
      const b=document.createElement('span');b.className='rs73-spec-value';
      for(let j=1;j<cells.length;j++){if(j>1)b.append(document.createTextNode(' · '));pushCellContent(b,cells[j]);}
      card.append(a,b);
    }
    return card;
  }
  function normalizeSpecifications(){
    const wrap=$('#rs60-description .rs70-full-original');if(!wrap)return;
    document.body.classList.add('rs73-product');
    $$('.rs70-full-original table',document).forEach(table=>{
      if(!table.isConnected||table.dataset.rs73Processed)return;
      table.dataset.rs73Processed='1';
      const rows=$$('tr',table);
      if(rows.length<3||rows.length>70)return;
      const cells=rows.map(r=>Array.from(r.children).filter(el=>el.matches('td,th')&&textOf(el)));
      // Only transform malformed 1-column/empty-column spec tables.
      // Preserve genuine multi-column specification and comparison tables semantically.
      if(cells.some(x=>x.length<1)||cells.some(x=>x.length>2))return;
      if(!cells.some(x=>x.length===1))return;
      if(cells.filter(x=>x.length===1).length<Math.ceil(cells.length*.65))return;
      const previous=table.previousElementSibling;
      const near=(textOf(previous)||textOf(table.parentElement?.previousElementSibling)).slice(0,90);
      const recognized=cells.filter(arr=>specLabels.some(k=>textOf(arr[0]).startsWith(k))).length;
      if(!/مواصفات|خصائص|تفاصيل|الأساسية|الاساسية/.test(near)&&recognized<2)return;
      const grid=document.createElement('div');grid.className='rs73-spec-grid';grid.setAttribute('role','group');
      grid.setAttribute('aria-label','مواصفات المنتج');
      cells.forEach(row=>grid.append(makeSpecCard(row)));
      table.replaceWith(grid);
    });
  }
  function init(){normalizeSpecifications();} /* V74 original Salla purchase bar handles sticky actions */
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  document.addEventListener('theme::ready',init,{once:true});
  [550,1300,2500,4200].forEach(ms=>setTimeout(init,ms));
})();

/* ============================================================================
   RELAX SMART V86 — PRODUCT PURCHASE / OFFERS / RESPONSIVE DESCRIPTION ONLY
   Features / gift / paid add-on logic before this module are byte-for-byte unchanged.
   The original Salla <salla-add-product-button> owns cart actions and validation.
   Never create a second native component, payment processor or WhatsApp button.
   ============================================================================ */
(() => {
  'use strict';
  const version='86';
  if (!/\/p\d+(?:\/|$)/i.test(location.pathname) || window.__relaxSmartV86) return;
  window.__relaxSmartV86=true;
  const doc=document, root=doc.documentElement;
  root.dataset.relaxSmartPurchase=version;
  root.dataset.relaxSmartPurchaseStatus='waiting-for-product';
  const $=(s,r=doc)=>r.querySelector(s);
  const $$=(s,r=doc)=>Array.from(r.querySelectorAll(s));
  const label=el=>(el?.textContent||'').replace(/\s+/g,' ').trim();
  const OLD_CSS_IDS=['rs85-purchase-only-style','rs84-purchase-style','rs83-compact-purchase-style','rs82-purchase-style','rs81-purchase-style','rs80-one-purchase-style','rs79-native-purchase-style','rs78-native-purchase-style','rs77-native-purchase-style','rs76-native-purchase-style','rs75-native-purchase-style','rs74-native-style','rs71-commerce-styles'];
  const obsolete='.rs71-purchase-anchor,.rs74-purchase-anchor,.rs75-anchor,.rs76-purchase-anchor,.rs80-placeholder,.rs81-spacer,.rs82-spacer,.rs83-spacer,.rs84-spacer,.rs85-spacer,#rs73-sticky-purchase,#rs-sticky-buy';
  const extraBarElements='.rs71-purchase-summary,.rs71-buy-now-fallback,.rs80-product-info,.rs81-product-info,.rs82-summary,.rs83-summary,.rs84-info,.rs85-info,.rs82-buy,.rs83-buy,.rs84-buy,.rs85-buy,.rs82-apple,.rs83-apple-info,.rs84-apple-help,.rs85-apple-help,.rs82-paypal,.rs83-paypal';
  let bar,form,host,info,main,spacer,sentinel,mini,apple,btnBuy,btnApple,modal,flash,summary;
  let initDone=false,scrollBound=false,frame=0,waiting=false,sourceHeight=58,offerMode='',busy=false;
  let paymentWatcher=null,successSeen=false,failedSeen=false,watchClickTimer=0;

  const css=doc.createElement('style');css.id='rs86-product-experience-style';
  css.textContent=`
   /* Main product CTA stays available below the add-on cards. The SAME DOM node
      becomes floating only while its natural location is off-screen. */
   html body.rs86-product form.product-form .rs86-purchase-spacer{display:block!important;height:0;min-height:0!important;width:100%!important;visibility:hidden!important;pointer-events:none!important;border:0!important;padding:0!important;margin:0!important}
   html body.rs86-product .rs86-source-anchor{display:block!important;height:0!important;width:100%!important;visibility:hidden!important;border:0!important;padding:0!important;margin:0!important}
   html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready{
     box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;align-items:center!important;
     justify-content:flex-start!important;position:relative!important;inset:auto!important;transform:none!important;
     min-height:58px!important;max-height:none!important;height:auto!important;min-width:0!important;
     width:100%!important;max-width:100%!important;padding:7px 8px!important;margin:12px 0 8px!important;
     gap:7px!important;direction:rtl!important;opacity:1!important;visibility:visible!important;
     pointer-events:auto!important;overflow:visible!important;background:#fff!important;
     border:1px solid #dfe7ef!important;border-radius:12px!important;
     box-shadow:0 3px 14px rgba(30,42,62,.07)!important;
   }
   html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready.rs86-floating{
     position:fixed!important;top:auto!important;inset:auto!important;left:50%!important;right:auto!important;
     transform:translateX(-50%)!important;bottom:8px!important;z-index:7000!important;
     display:flex!important;flex-flow:row nowrap!important;align-items:center!important;
     height:60px!important;max-height:60px!important;min-height:60px!important;
     width:min(1100px,calc(100vw - 20px))!important;max-width:calc(100vw - 20px)!important;
     padding:7px 9px!important;margin:0!important;gap:7px!important;
     border:1px solid #dfe7ef!important;border-radius:13px!important;
     box-shadow:0 5px 24px rgba(22,32,50,.17)!important;background:#fff!important;
   }
   html body.rs86-product .rs86-ready,html body.rs86-product .rs86-ready *{box-sizing:border-box!important}
   html body.rs86-product .rs86-summary{display:none!important;align-items:center!important;gap:8px!important;flex:0 1 270px!important;min-width:0!important;max-width:270px!important;overflow:hidden!important}
   html body.rs86-product .rs86-floating>.rs86-summary{display:flex!important}
   html body.rs86-product .rs86-summary img{width:43px!important;height:43px!important;flex:0 0 43px!important;object-fit:contain!important;border-radius:8px!important;border:1px solid #e4eaf2!important}
   html body.rs86-product .rs86-summary-caption{display:flex!important;flex-direction:column!important;min-width:0!important;gap:3px!important;overflow:hidden!important}
   html body.rs86-product .rs86-summary-title{font-size:12px!important;line-height:1.3!important;font-weight:800!important;color:#26364c!important;overflow:hidden!important;white-space:nowrap!important;text-overflow:ellipsis!important}
   html body.rs86-product .rs86-summary-prices{display:flex!important;gap:8px!important;align-items:baseline!important;white-space:nowrap!important}
   html body.rs86-product .rs86-summary-now{font-size:15px!important;color:#c51e35!important;font-weight:900!important}
   html body.rs86-product .rs86-summary-was{font-size:11px!important;color:#1c5fac!important;text-decoration:line-through!important}
   html body.rs86-product .rs86-summary-was[hidden]{display:none!important}
   /* Original quantity widget, including real Salla increment / decrement. */
   html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready>.center-between{
     display:flex!important;flex:0 0 80px!important;width:80px!important;min-width:80px!important;max-width:80px!important;
     height:44px!important;max-height:44px!important;min-height:44px!important;
     align-items:center!important;justify-content:center!important;border:1px solid #dbe5ee!important;
     border-radius:9px!important;background:#f8fafb!important;padding:0!important;margin:0!important;box-shadow:none!important;
   }
   html body.rs86-product .rs86-ready>.center-between :is(salla-quantity-input,.s-quantity-input-container){display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:100%!important;max-width:100%!important;height:100%!important;gap:0!important}
   html body.rs86-product .rs86-ready>.center-between .s-quantity-input-container button{display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 23px!important;width:23px!important;height:35px!important;min-height:35px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;color:#354559!important;box-shadow:none!important;pointer-events:auto!important}
   html body.rs86-product .rs86-ready>.center-between .s-quantity-input-container button svg{width:14px!important;height:14px!important}
   html body.rs86-product .rs86-ready>.center-between .s-quantity-input-container input{width:30px!important;min-width:0!important;max-width:30px!important;height:36px!important;padding:0!important;margin:0!important;text-align:center!important;font-size:13px!important;font-weight:800!important;border:0!important;background:transparent!important;color:#263a50!important;box-shadow:none!important}
   /* The real Salla host MUST remain inside its original product form. */
   html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready>salla-add-product-button{
     display:flex!important;flex-direction:row!important;align-items:stretch!important;
     flex:var(--rs86-native-units,1) 1 0%!important;min-width:0!important;max-width:none!important;width:auto!important;
     height:44px!important;min-height:44px!important;max-height:44px!important;
     margin:0!important;padding:0!important;gap:6px!important;pointer-events:auto!important;
     background:transparent!important;border:0!important;box-shadow:none!important;
   }
   html body.rs86-product .rs86-ready>salla-add-product-button>div,
   html body.rs86-product .rs86-ready>salla-add-product-button>.s-add-product-button-main{
     display:flex!important;flex-direction:row!important;align-items:stretch!important;
     flex:var(--rs86-main-units,1) 1 0%!important;gap:6px!important;
     width:auto!important;min-width:0!important;max-width:none!important;height:44px!important;max-height:44px!important;margin:0!important;padding:0!important;
   }
   html body.rs86-product .rs86-ready>salla-add-product-button :is(salla-button,.s-button-wrap){display:flex!important;align-items:stretch!important;flex:1 1 0%!important;min-width:0!important;width:auto!important;height:44px!important;max-height:44px!important;margin:0!important;pointer-events:auto!important}
   /* GREEN functional add-to-cart button: no overlay/transparent labels. */
   html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready>salla-add-product-button :is(button[type=submit],.s-button-element){
     display:flex!important;flex-flow:row nowrap!important;justify-content:center!important;align-items:center!important;
     width:100%!important;max-width:100%!important;min-width:0!important;height:44px!important;
     max-height:44px!important;min-height:44px!important;padding:4px 8px!important;margin:0!important;
     border-radius:9px!important;border:1px solid #148b4e!important;background:#148b4e!important;
     color:#fff!important;font-size:13px!important;font-weight:850!important;line-height:1.25!important;
     box-shadow:none!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;cursor:pointer!important;
   }
   html body.rs86-product .rs86-ready>salla-add-product-button :is(button[type=submit],.s-button-element):hover{background:#0f7140!important;border-color:#0f7140!important}
   html body.rs86-product .rs86-ready>salla-add-product-button .s-button-text{color:#fff!important;font-size:inherit!important;font-weight:850!important;white-space:nowrap!important;opacity:1!important;visibility:visible!important}
   html body.rs86-product .rs86-ready>salla-add-product-button salla-mini-checkout-widget{
     display:flex!important;flex:1 1 0%!important;min-width:0!important;width:auto!important;
     height:44px!important;max-height:44px!important;min-height:44px!important;border-radius:9px!important;
     align-items:center!important;justify-content:center!important;background:#c9273e!important;color:#fff!important;
     font-size:13px!important;font-weight:850!important;--salla-fast-checkout-button-height:44px;
     --salla-fast-checkout-button-border-radius:9px;--salla-fast-checkout-button-width:100%;
   }
   html body.rs86-product .rs86-ready.rs86-no-mini>salla-add-product-button salla-mini-checkout-widget{display:none!important}
   html body.rs86-product .rs86-ready>salla-add-product-button salla-mini-checkout-widget :is([slot=widget-label],.s-add-product-button-mini-checkout-content){display:flex!important;align-items:center!important;justify-content:center!important;height:44px!important;width:100%!important;min-width:0!important;padding:4px!important;border-radius:9px!important;background:#c9273e!important;color:#fff!important}
   html body.rs86-product .rs86-ready>salla-add-product-button salla-quick-buy{display:flex!important;align-items:stretch!important;flex:1 1 0%!important;min-width:0!important;height:44px!important;width:auto!important}
   html body.rs86-product .rs86-ready.rs86-no-apple>salla-add-product-button salla-quick-buy{display:none!important}
   html body.rs86-product .rs86-ready>salla-add-product-button apple-pay-button{display:block!important;min-width:0!important;width:100%!important;height:44px!important;max-height:44px!important;border-radius:9px!important;overflow:hidden!important}
   html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready>.rs86-buy,
   html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready>.rs86-apple-info{
     display:flex!important;flex-flow:row nowrap!important;align-items:center!important;justify-content:center!important;
     flex:1 1 0%!important;min-width:0!important;width:auto!important;height:44px!important;min-height:44px!important;max-height:44px!important;
     padding:4px 9px!important;margin:0!important;border-radius:9px!important;border:1px solid transparent!important;
     color:#fff!important;font-family:inherit!important;font-size:13px!important;font-weight:850!important;
     white-space:nowrap!important;cursor:pointer!important;box-shadow:none!important;pointer-events:auto!important;
   }
   html body.rs86-product .rs86-ready>.rs86-buy{background:#c9273e!important;border-color:#c9273e!important}
   html body.rs86-product .rs86-ready>.rs86-apple-info{background:#111!important;border-color:#111!important;direction:ltr!important}
   html body.rs86-product .rs86-ready button:disabled{cursor:not-allowed!important;opacity:.55!important}
   html body.rs86-product .rs86-ready button:focus-visible{outline:2px solid #7fc1ff!important;outline-offset:2px!important}
   html body.rs86-product .rs86-action-note{display:block!important;min-height:0!important;max-width:100%!important;color:#9c2738!important;font-size:12px!important;line-height:1.6!important;margin:2px 0 9px!important;padding:0!important}
   html body.rs86-product .rs86-action-note:empty{display:none!important}
   @media(max-width:980px){html body.rs86-product .rs86-floating>.rs86-summary{display:none!important}}
   /* Mobile: an in-page purchase section below add-ons WITH the quantity widget.
      While floating: one 3-action row, no quantity or product thumbnail. */
   @media(max-width:600px){
     html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready:not(.rs86-floating){
       display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:40px 44px!important;
       gap:6px!important;min-height:100px!important;padding:6px!important;
     }
     html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready:not(.rs86-floating)>.center-between{
       grid-row:1!important;grid-column:1/4!important;width:85px!important;min-width:85px!important;max-width:85px!important;height:40px!important;min-height:40px!important;max-height:40px!important;justify-self:start!important;
     }
     html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready:not(.rs86-floating)>salla-add-product-button{
       grid-row:2!important;grid-column:auto!important;min-height:44px!important;max-height:44px!important;height:44px!important;
     }
     /* Native checkout components are nested INSIDE the host. Give that host
        as many grid columns as its genuine payment buttons require. */
     html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready:not(.rs86-floating).rs86-has-mini.rs86-has-apple>salla-add-product-button{grid-column:1/4!important}
     html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready:not(.rs86-floating).rs86-has-mini.rs86-no-apple>salla-add-product-button,
     html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready:not(.rs86-floating).rs86-no-mini.rs86-has-apple>salla-add-product-button{grid-column:1/3!important}
     html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready:not(.rs86-floating)>.rs86-buy,
     html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready:not(.rs86-floating)>.rs86-apple-info{
       grid-row:2!important;grid-column:auto!important;
     }
     html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready.rs86-floating{
       width:calc(100vw - 12px)!important;max-width:calc(100vw - 12px)!important;
       height:54px!important;min-height:54px!important;max-height:54px!important;
       bottom:6px!important;padding:5px!important;gap:5px!important;border-radius:10px!important;
     }
     html body.rs86-product .container--product-single form.product-form section.addtocart-bar.rs86-ready.rs86-floating>.center-between{display:none!important}
     html body.rs86-product .rs86-ready.rs86-floating>salla-add-product-button,
     html body.rs86-product .rs86-floating>salla-add-product-button>div,
     html body.rs86-product .rs86-floating>salla-add-product-button>.s-add-product-button-main,
     html body.rs86-product .rs86-floating>salla-add-product-button :is(salla-button,.s-button-wrap),
     html body.rs86-product .rs86-floating>salla-add-product-button :is(button[type=submit],.s-button-element),
     html body.rs86-product .rs86-floating>salla-add-product-button salla-mini-checkout-widget,
     html body.rs86-product .rs86-floating>salla-add-product-button salla-quick-buy,
     html body.rs86-product .rs86-floating>salla-add-product-button apple-pay-button,
     html body.rs86-product .rs86-floating>.rs86-buy,
     html body.rs86-product .rs86-floating>.rs86-apple-info{
       height:42px!important;min-height:42px!important;max-height:42px!important;
       font-size:11px!important;
     }
     html body.rs86-product .rs86-floating>salla-add-product-button .s-button-text{font-size:11px!important}
     html body.rs86-product .rs86-floating>.rs86-buy,html body.rs86-product .rs86-floating>.rs86-apple-info{padding:2px 3px!important}
   }
   @media(max-width:360px){html body.rs86-product .rs86-ready :is(.s-button-text,.rs86-buy,.rs86-apple-info){font-size:10px!important}}
   /* DESKTOP: real Salla offer cards under the product gallery, not in details sidebar. */
   @media(min-width:961px){
     html body.rs86-product .rs60-layout>.main-content.rs86-offers-gallery{position:static!important;top:auto!important;overflow:visible!important}
     html body.rs86-product .rs60-layout>.main-content.rs86-offers-gallery>.rs60-native-offers{margin:16px 0 0!important;width:100%!important;min-width:0!important;max-width:100%!important}
   }
   /* Description component and all its media/tables never exceed viewport. */
   html body.rs86-product .rs60-after-main{box-sizing:border-box!important;width:min(1280px,calc(100% - 24px))!important;max-width:1280px!important;min-width:0!important;margin-inline:auto!important}
   html body.rs86-product #rs60-description.rs60-description-panel{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important;overflow-wrap:anywhere!important;padding:clamp(13px,2.6vw,28px)!important}
   html body.rs86-product #rs60-description :is(.rs60-description-tabs,.rs60-description-source,.rs70-full-original,figure,figcaption,ul,ol,p,blockquote){min-width:0!important;max-width:100%!important;box-sizing:border-box!important;overflow-wrap:anywhere!important}
   html body.rs86-product #rs60-description .rs60-description-tabs{display:flex!important;flex-flow:row wrap!important;gap:7px!important;align-items:center!important;overflow-x:auto!important}
   html body.rs86-product #rs60-description .rs60-tab{display:inline-flex!important;max-width:100%!important;white-space:nowrap!important;font-size:clamp(12px,1.15vw,14px)!important;padding:8px 10px!important}
   html body.rs86-product #rs60-description img{display:block!important;max-width:100%!important;height:auto!important;object-fit:contain!important}
   html body.rs86-product #rs60-description :is(iframe,video,embed,object){max-width:100%!important}
   html body.rs86-product #rs60-description .rs70-media-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;min-width:0!important;width:100%!important;max-width:100%!important}
   html body.rs86-product #rs60-description .rs70-media-grid a{display:block!important;min-width:0!important;max-width:100%!important;overflow:hidden!important}
   html body.rs86-product #rs60-description .rs70-media-grid img{display:block!important;width:100%!important;max-width:100%!important;height:clamp(135px,17vw,220px)!important;object-fit:contain!important;margin:0!important}
   html body.rs86-product #rs60-description .rs70-media-grid .rs70-img-label{display:block!important;max-width:100%!important;overflow-wrap:anywhere!important}
   html body.rs86-product #rs60-description :is(table,.ql-table){width:100%!important;max-width:100%!important;overflow-x:auto!important;display:block!important}
   html body.rs86-product #rs60-description .rs70-full-original{font-size:clamp(13px,1.45vw,16px)!important;line-height:1.9!important}
   @media(max-width:600px){
      html body.rs86-product .rs60-after-main{width:calc(100% - 16px)!important;padding:0!important}
      html body.rs86-product #rs60-description.rs60-description-panel{padding:12px!important;border-radius:12px!important}
      html body.rs86-product #rs60-description .rs70-media-grid{gap:7px!important}
      html body.rs86-product #rs60-description .rs70-media-grid img{height:145px!important}
      html body.rs86-product #rs60-description .rs60-description-tabs{gap:5px!important}
      html body.rs86-product #rs60-description .rs60-tab{font-size:12px!important;padding:7px 8px!important}
   }
   @media(max-width:349px){html body.rs86-product #rs60-description .rs70-media-grid{grid-template-columns:1fr!important}html body.rs86-product #rs60-description .rs70-media-grid img{height:185px!important}}
   html body .rs86-pay-modal[hidden]{display:none!important}
   html body .rs86-pay-modal{position:fixed!important;inset:0!important;z-index:99999!important;display:grid!important;place-items:center!important;padding:16px!important;background:rgba(15,23,42,.62)!important;direction:rtl!important}
   html body .rs86-pay-dialog{width:min(410px,100%)!important;border-radius:15px!important;padding:25px 20px!important;background:#fff!important;color:#28394c!important;text-align:center!important;box-shadow:0 18px 52px rgba(0,0,0,.23)!important}
   html body .rs86-pay-dialog strong{display:block!important;font-size:19px!important;font-weight:900!important;margin:0 0 9px!important;color:#1e293b!important}
   html body .rs86-pay-dialog p{margin:0 0 14px!important;line-height:1.9!important;color:#5d6f85!important;font-size:14px!important}
   html body .rs86-pay-dialog button{background:#c9273e!important;color:#fff!important;border:0!important;border-radius:9px!important;padding:10px 27px!important;font-size:13px!important;font-weight:850!important}
  `;
  (doc.head||root).appendChild(css);

  function detachOldPurchaseUI(){
    OLD_CSS_IDS.forEach(id=>doc.getElementById(id)?.remove());
    $$(obsolete).forEach(el=>el.remove());
    if(!bar)return;
    [...bar.classList].forEach(name=>{if(/^rs(?:71|73|74|75|76|77|78|79|80|81|82|83|84|85)-(fixed|ready|no-|has-|hide-)/.test(name)||name==='sticky-product-bar')bar.classList.remove(name)});
    $$(extraBarElements,bar).forEach(el=>el.remove());
    doc.body?.classList.remove('fixed-add-to-cart-bar','rs85-sticky-visible','rs84-sticky-visible','rs83-sticky-visible');
    // Old inline CSS togglers were hiding the user's *real* original purchase section.
    ['display','flex-direction','visibility','opacity','pointer-events','position','transform','bottom','top','left','right','height','min-height','max-height'].forEach(prop=>bar.style.removeProperty(prop));
  }
  function insideHost(s){return host?.querySelector(s)||host?.shadowRoot?.querySelector(s)||null}
  function visible(el){if(!el||el.hidden||el.getAttribute('aria-hidden')==='true')return false;const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'}
  function appleEligible(){try{return !!(window.ApplePaySession&&typeof window.ApplePaySession.canMakePayments==='function'&&window.ApplePaySession.canMakePayments())}catch{return false}}
  function makeSummary(){
    summary=doc.createElement('div');summary.className='rs86-summary';summary.setAttribute('aria-hidden','true');
    const original=$('.container--product-single .details-slider img')||$('.container--product-single .images-wrapper img');
    const url=original?.currentSrc||original?.getAttribute('src')||original?.getAttribute('data-src');
    if(url){const img=doc.createElement('img');img.alt='';img.loading='lazy';img.src=url;summary.append(img)}
    const wrap=doc.createElement('div');wrap.className='rs86-summary-caption';
    const title=doc.createElement('span');title.className='rs86-summary-title';title.textContent=label(info.querySelector('h1'));
    const prices=doc.createElement('span');prices.className='rs86-summary-prices';
    const current=doc.createElement('strong');current.className='rs86-summary-now';
    const old=doc.createElement('del');old.className='rs86-summary-was';
    prices.append(current,old);wrap.append(title,prices);summary.append(wrap);bar.prepend(summary);
    function refresh(){const n=label(info.querySelector('.sale-price,.price_is_on_sale .total-price,.starting-or-normal-price .total-price'));const o=label(info.querySelector('.regular-price,.before-price'));current.textContent=n;old.textContent=o;old.hidden=!o}
    refresh();info.addEventListener('change',()=>setTimeout(refresh,150));
  }
  function makeModal(trigger){
    if(!modal){
      modal=doc.createElement('div');modal.className='rs86-pay-modal';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
      const dialog=doc.createElement('div');dialog.className='rs86-pay-dialog';
      const heading=doc.createElement('strong');heading.textContent='Apple Pay غير متاح على هذا الجهاز';
      const explanation=doc.createElement('p');explanation.textContent='توافر Apple Pay يعتمد على الجهاز والمتصفح وإعدادات المتجر. يمكنك إتمام الشراء بوسيلة أخرى عند الدفع.';
      const close=doc.createElement('button');close.type='button';close.textContent='حسنًا';
      dialog.append(heading,explanation,close);modal.append(dialog);doc.body.append(modal);
      const hide=()=>{modal.hidden=true;trigger?.focus()};close.addEventListener('click',hide);modal.addEventListener('click',e=>{if(e.target===modal)hide()});doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)hide()});
    }
    modal.hidden=false;modal.querySelector('button').focus();
  }
  function note(message){if(!flash)return;flash.textContent=message;flash.dataset.kind=message?'warn':''}
  function statusWatch(){
    // Native component owns add; explicit feedback when it rejects or validation fails.
    host.addEventListener('success',()=>{successSeen=true;failedSeen=false;note('')});
    host.addEventListener('failed',()=>{failedSeen=true;note('تعذرت إضافة المنتج للسلة. تأكدي من اختيار الخيارات المطلوبة أو راجعي رسالة سلة.')});
    host.addEventListener('click',e=>{
      const target=e.target?.closest?.('button[type="submit"],salla-button');
      if(!target)return;
      successSeen=false;failedSeen=false;clearTimeout(watchClickTimer);
      watchClickTimer=setTimeout(()=>{
        if(successSeen||failedSeen)return;
        const invalid=form?.querySelector(':invalid');
        if(invalid){note('اختاري الخيارات المطلوبة قبل الإضافة للسلة.');return}
        // Non-invasive diagnostic only; never retry the SDK automatically (risk of double charges/additions).
        note('لو المنتج ما اتضافش، راجعي رسالة سلة واختيارات المنتج وحالة الاتصال.');
      },2200);
    });
  }
  function fallbackBuy(btn){
    if(busy||!host?.isConnected)return;
    const real=insideHost('salla-button button[type="submit"]:not(:disabled),button[type="submit"]:not(:disabled)');
    if(!real){note('اختاري الخيارات المطلوبة أولًا، ثم اضغطي أضف إلى السلة.');return}
    busy=true;btn.disabled=true;const original=btn.textContent;btn.textContent='جارٍ الإضافة…';
    let finished=false,timer;
    const cleanup=()=>{clearTimeout(timer);host.removeEventListener('success',yes);host.removeEventListener('failed',no)};
    const no=()=>{if(finished)return;finished=true;cleanup();busy=false;btn.disabled=false;btn.textContent=original;note('تعذرت الإضافة. راجعي خيارات المنتج أو رسالة سلة.')};
    const yes=async()=>{
      if(finished)return;finished=true;cleanup();
      const id=Number(host.getAttribute('product-id')||form?.querySelector('input[name="id"]')?.value||0);
      try{
        const ok=await window.__rs96Checkout?.afterAdded(id);
        if(!ok)note('المنتج اتضاف، لكن إتمام الطلب تلقائيًا لم يكتمل. راجعي رسالة التحقق قبل المحاولة.');
      }finally{
        busy=false;btn.disabled=false;btn.textContent=original;
      }
    };
    host.addEventListener('success',yes,{once:true});host.addEventListener('failed',no,{once:true});
    timer=setTimeout(no,13000);try{real.click()}catch{no()}
  }
  function payments(){
    if(!bar?.isConnected||!host?.isConnected)return;
    mini=insideHost('salla-mini-checkout-widget');apple=insideHost('salla-quick-buy apple-pay-button');
    const hasMini=visible(mini),hasApple=visible(apple)&&appleEligible();
    bar.classList.toggle('rs86-no-mini',!hasMini);bar.classList.toggle('rs86-no-apple',!hasApple);
    bar.classList.toggle('rs86-has-mini',hasMini);bar.classList.toggle('rs86-has-apple',hasApple);
    if(hasMini){btnBuy?.remove();btnBuy=null}
    else if(!btnBuy){btnBuy=doc.createElement('button');btnBuy.type='button';btnBuy.className='rs86-buy';btnBuy.textContent='اشترِ الآن';btnBuy.title='إضافة المنتج ثم متابعة الدفع عن طريق سلة بعد التحقق من الإضافة والهدايا';btnBuy.addEventListener('click',()=>fallbackBuy(btnBuy));bar.append(btnBuy)}
    if(hasApple){btnApple?.remove();btnApple=null}
    else if(!btnApple){btnApple=doc.createElement('button');btnApple.type='button';btnApple.className='rs86-apple-info';btnApple.textContent='Apple Pay';btnApple.title='تفاصيل توافر Apple Pay';btnApple.addEventListener('click',()=>makeModal(btnApple));bar.append(btnApple)}
    host.style.setProperty('--rs86-native-units',String(1+Number(hasMini)+Number(hasApple)));
    host.style.setProperty('--rs86-main-units',String(1+Number(hasMini)));
  }
  function moveOffers(){
    if(!doc.body?.classList.contains('rs60-product'))return;
    const offer=$('.rs60-native-offers');if(!offer)return;
    const desktop=window.innerWidth>=961;
    if(desktop){
      const target=main||$('.container--product-single .rs60-layout>.main-content');if(!target)return;
      if(offer.parentElement!==target)target.appendChild(offer);
      target.classList.add('rs86-offers-gallery');offerMode='desktop';
    }else{
      const area=$('.rs60-after-main');if(!area)return;
      if(offer.parentElement!==area)area.prepend(offer);
      main?.classList.remove('rs86-offers-gallery');offerMode='mobile';
    }
  }
  function setInlineProps(){
    // Prior externally-pasted JS can set inline visibility/display to hidden;
    // our component does not use hidden states and has independent CSS classes.
    for(const key of ['display','visibility','opacity','pointer-events','flex-direction'])bar.style.removeProperty(key);
  }
  function update(){
    frame=0;if(!bar?.isConnected)return;
    const pos=sentinel.getBoundingClientRect();
    const inNaturalZone=pos.top<window.innerHeight-90 && pos.bottom>90;
    // Use a broad 100px range around the original position, even while fixed,
    // to prevent flicker during scroll. Keep the 3 CTAs below add-ons on arrival.
    const zone=pos.top<window.innerHeight-85 && pos.top>-Math.max(110,sourceHeight+45);
    const fixed=window.scrollY>3&&!zone;
    if(!bar.classList.contains('rs86-floating')){
      const h=bar.getBoundingClientRect().height;
      if(h>40&&h<200)sourceHeight=Math.ceil(h);
    }
    if(bar.classList.contains('rs86-floating')!==fixed){
      bar.classList.toggle('rs86-floating',fixed);
      spacer.style.height=fixed?Math.min(155,Math.max(55,sourceHeight))+'px':'0px';
      doc.body.classList.toggle('rs86-purchase-floating',fixed);
    }
    setInlineProps();
    root.dataset.relaxSmartPurchaseStatus=fixed?'floating':'inline';
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update)}
  function initialize(){
    if(initDone&&bar?.isConnected){moveOffers();schedule();return}
    info=$('.container--product-single .product-details-col');
    form=info?.querySelector('form.product-form');bar=form?.querySelector('section.addtocart-bar');
    host=bar?.querySelector('salla-add-product-button');
    main=$('.container--product-single .rs60-layout>.main-content')||$('.container--product-single .main-content');
    if(!bar||!host){root.dataset.relaxSmartPurchaseStatus='waiting-for-product';return}
    initDone=true;doc.body.classList.add('rs86-product');
    detachOldPurchaseUI();
    bar.classList.add('rs86-ready');
    // The support-sticky-bar attribute can collapse the native cart label to an icon on mobile;
    // our own sticky CSS already handles positioning, and we preserve all original product attrs.
    host.removeAttribute('support-sticky-bar');
    sentinel=doc.createElement('span');sentinel.className='rs86-source-anchor';sentinel.setAttribute('aria-hidden','true');bar.before(sentinel);
    spacer=doc.createElement('span');spacer.className='rs86-purchase-spacer';spacer.setAttribute('aria-hidden','true');bar.before(spacer);
    flash=doc.createElement('p');flash.className='rs86-action-note';flash.setAttribute('role','status');bar.after(flash);
    makeSummary();payments();statusWatch();
    paymentWatcher=new MutationObserver(()=>{payments();schedule()});
    paymentWatcher.observe(host,{subtree:true,childList:true,attributes:true,attributeFilter:['product-status']});
    if(!scrollBound){scrollBound=true;window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',()=>{moveOffers();schedule()},{passive:true})}
    moveOffers();
    [200,850,1650,3200,5200].forEach(ms=>setTimeout(()=>{payments();moveOffers();schedule()},ms));
    root.dataset.relaxSmartPurchaseStatus='inline';schedule();
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
  doc.addEventListener('theme::ready',initialize,{once:true});
  [350,900,2200,4000].forEach(ms=>setTimeout(initialize,ms));
})();


/* ============================================================================
   RELAX SMART V87 — PRICE, REAL OFFERS & CONTEXTUAL ICONS UNDER PRODUCT TITLE
   - Presentation only. Preserves the existing V86 native purchase and add-on code.
   - MOVES the genuine Salla price DOM node; never clones prices or H1s.
   - Shows offer names only if actually rendered in this product's Salla offer widget.
   - Shows stock / installment indicators only from the current product DOM.
   ============================================================================ */
(() => {
  'use strict';
  if (!/\/p\d+(?:\/|$)/i.test(location.pathname) || window.__relaxSmartV87Hero) return;
  window.__relaxSmartV87Hero = true;
  const doc=document;
  const root=doc.documentElement;
  root.dataset.relaxSmartPurchase='87';
  root.dataset.relaxSmartHeroStatus='waiting';
  const $=(s,r=doc)=>r.querySelector(s);
  const $$=(s,r=doc)=>Array.from(r.querySelectorAll(s));
  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();
  const style=doc.createElement('style');
  style.id='relax-smart-v87-verified-product-hero';
  style.textContent=`
  /* Scoped to the single product hero. Never modify purchase buttons or add-ons. */
  html body.rs87-product .product-details-col>.rs87-product-hero{
    display:flex!important;flex-direction:column!important;gap:11px!important;
    width:100%!important;max-width:100%!important;min-width:0!important;
    box-sizing:border-box!important;direction:rtl!important;
    margin:8px 0 14px!important;padding:14px 15px!important;
    background:linear-gradient(135deg,#fff 0%,#fffafa 100%)!important;
    border:1px solid #efdee1!important;border-inline-start:1px solid #efdee1!important;
    border-right:4px solid #c92539!important;border-radius:14px!important;
    box-shadow:0 5px 22px rgba(42,30,45,.045)!important;
    overflow:hidden!important;
  }
  html body.rs87-product .product-details-col>.rs87-product-hero *{box-sizing:border-box!important}
  html body.rs87-product .rs87-product-hero>.rs87-product-price{
    display:flex!important;flex-direction:row!important;justify-content:flex-start!important;
    align-items:center!important;flex-wrap:wrap!important;gap:8px 13px!important;
    width:100%!important;max-width:100%!important;min-width:0!important;
    margin:0!important;padding:0!important;border:0!important;background:transparent!important;
    box-shadow:none!important;white-space:normal!important;line-height:1.35!important;
  }
  html body.rs87-product .rs87-product-hero>.rs87-product-price :is(.sale-price,.price_is_on_sale .total-price,.starting-or-normal-price .total-price){
    display:inline-flex!important;align-items:center!important;gap:4px!important;margin:0!important;
    font-size:clamp(23px,2.55vw,32px)!important;line-height:1.35!important;
    font-weight:900!important;color:#c71e32!important;white-space:nowrap!important;
  }
  html body.rs87-product .rs87-product-hero>.rs87-product-price :is(.sale-price,.total-price) i{
    color:#c71e32!important;font-size:.65em!important;
  }
  html body.rs87-product .rs87-product-hero>.rs87-product-price :is(.regular-price,.before-price){
    display:inline-flex!important;align-items:center!important;margin:0!important;
    color:#205ca4!important;font-size:clamp(13px,1.4vw,16px)!important;
    font-weight:750!important;text-decoration:line-through!important;text-decoration-color:#205ca4!important;
    text-decoration-thickness:1.6px!important;white-space:nowrap!important;
  }
  html body.rs87-product .rs87-product-hero>.rs87-product-price :is(.regular-price,.before-price) i{color:#205ca4!important}
  html body.rs87-product .rs87-product-hero>.rs87-product-price>.rs60-fire{
    display:inline-flex!important;align-items:center!important;gap:5px!important;order:-1!important;
    width:auto!important;height:auto!important;min-height:26px!important;margin:0!important;
    padding:4px 9px!important;border-radius:999px!important;
    border:1px solid #ffd4dc!important;background:#fff0f2!important;
    color:#b91631!important;font-size:12px!important;font-weight:900!important;
    line-height:1.4!important;white-space:nowrap!important;box-shadow:none!important;
  }
  html body.rs87-product .rs87-product-hero .rs60-fire::before{
    content:'🔥';display:inline!important;font-size:14px!important;line-height:1!important;
  }
  html body.rs87-product .rs87-product-hero .rs60-discount{
    display:inline-flex!important;align-items:center!important;min-height:26px!important;
    background:#cf253a!important;color:#fff!important;border:1px solid #cf253a!important;
    border-radius:7px!important;padding:3px 8px!important;font-size:11px!important;
    font-weight:900!important;white-space:nowrap!important;line-height:1.5!important;
  }
  html body.rs87-product .rs87-product-hero .rs87-verified-pills,
  html body.rs87-product .rs87-product-hero .rs87-offer-tiles{
    display:flex!important;align-items:stretch!important;flex-wrap:wrap!important;
    gap:7px!important;width:100%!important;min-width:0!important;max-width:100%!important;
    margin:0!important;padding:0!important;list-style:none!important;
  }
  html body.rs87-product .rs87-product-hero .rs87-verified-pills:empty,
  html body.rs87-product .rs87-product-hero .rs87-offer-tiles:empty,
  html body.rs87-product .rs87-product-hero .rs87-offer-panel[hidden],
  html body.rs87-product .rs87-product-hero .rs87-verified-pills[hidden]{display:none!important}
  html body.rs87-product .rs87-product-hero .rs87-verified-chip{
    display:inline-flex!important;align-items:center!important;gap:6px!important;
    max-width:100%!important;min-width:0!important;padding:6px 10px!important;
    background:#f7fafc!important;color:#28415b!important;border:1px solid #e4ebf3!important;
    border-radius:9px!important;font-size:11px!important;font-weight:750!important;
    line-height:1.55!important;white-space:normal!important;overflow-wrap:anywhere!important;
  }
  html body.rs87-product .rs87-product-hero .rs87-verified-chip[data-kind=stock]{
    color:#166340!important;background:#edf9f1!important;border-color:#d8ecdf!important;
  }
  html body.rs87-product .rs87-product-hero .rs87-chip-icon{display:inline-flex!important;flex:0 0 auto!important;font-size:14px!important;line-height:1!important}
  html body.rs87-product .rs87-product-hero .rs87-offer-panel{
    display:flex!important;flex-direction:column!important;gap:8px!important;
    padding-top:10px!important;margin-top:0!important;
    border-top:1px solid #f0e4e5!important;
    min-width:0!important;max-width:100%!important;
  }
  html body.rs87-product .rs87-product-hero .rs87-offer-heading{
    display:flex!important;gap:7px!important;align-items:center!important;
    margin:0!important;color:#26394d!important;font-size:12px!important;
    font-weight:850!important;line-height:1.5!important;
  }
  html body.rs87-product .rs87-product-hero .rs87-offer-button{
    display:inline-flex!important;align-items:center!important;justify-content:flex-start!important;
    flex:1 1 170px!important;min-width:0!important;max-width:100%!important;
    gap:7px!important;padding:9px 10px!important;border-radius:10px!important;
    border:1px solid #f1dae0!important;background:#fff!important;color:#b5233a!important;
    font:inherit!important;font-size:12px!important;font-weight:800!important;line-height:1.5!important;
    text-align:right!important;white-space:normal!important;overflow-wrap:anywhere!important;
    cursor:pointer!important;box-shadow:0 1px 5px rgba(90,20,40,.03)!important;
  }
  html body.rs87-product .rs87-product-hero .rs87-offer-button:focus-visible{
    outline:2px solid #a7bdf2!important;outline-offset:2px!important;
  }
  html body.rs87-product .rs87-product-hero .rs87-offer-name{flex:1 1 auto!important;min-width:0!important;overflow-wrap:anywhere!important}
  html body.rs87-product .rs87-product-hero .rs87-offer-mark{color:#bd2338!important;font-size:15px!important;flex:0 0 auto!important}
  @media(max-width:767px){
    html body.rs87-product .product-details-col>.rs87-product-hero{padding:12px 10px!important;gap:9px!important;margin:8px 0 13px!important;border-radius:11px!important}
    html body.rs87-product .rs87-product-hero>.rs87-product-price{gap:7px 9px!important}
    html body.rs87-product .rs87-product-hero>.rs87-product-price :is(.sale-price,.price_is_on_sale .total-price,.starting-or-normal-price .total-price){font-size:clamp(22px,6vw,27px)!important}
    html body.rs87-product .rs87-product-hero>.rs87-product-price>.rs60-fire{font-size:11px!important;padding:3px 7px!important}
    html body.rs87-product .rs87-product-hero .rs87-offer-button{padding:8px!important;flex:1 1 135px!important}
    html body.rs87-product .rs87-product-hero .rs87-verified-chip{font-size:10.5px!important;padding:5px 7px!important}
  }
  @media(max-width:350px){
    html body.rs87-product .rs87-product-hero .rs87-offer-button{flex-basis:100%!important}
    html body.rs87-product .rs87-product-hero>.rs87-product-price :is(.sale-price,.price_is_on_sale .total-price,.starting-or-normal-price .total-price){font-size:22px!important}
  }
  `;
  (doc.head||root).appendChild(style);

  let hero,priceStrip,pills,offerPanel,offerTiles,info,offerObserver,priceObserver;
  let renderTimer=0,lastPills='',lastOffers='';
  const unique=arr=>[...new Set(arr.map(clean).filter(Boolean))];
  function chip(kind,symbol,text){
    const item=doc.createElement('li');item.className='rs87-verified-chip';item.dataset.kind=kind;
    const icon=doc.createElement('span');icon.className='rs87-chip-icon';icon.setAttribute('aria-hidden','true');icon.textContent=symbol;
    const name=doc.createElement('span');name.textContent=text;item.append(icon,name);return item;
  }
  function productPills(){
    if(!info)return [];
    const result=[];
    const stock=$('.product-metadata .text-green-500,.product-metadata [class*=text-green]',info);
    if(stock&&/متوفر|متاحة|in stock|available/i.test(clean(stock.textContent))){
      result.push({kind:'stock',icon:'●',text:clean(stock.textContent)});
    }
    // These names are taken from the product's native installment panel,
    // never from a global list or unrelated payment advertising.
    const nativeInstallment=$('salla-installment',info);
    if(nativeInstallment){
      const brands=unique($$('.rs69-payment-brand',nativeInstallment).map(x=>x.textContent));
      if(brands.length)result.push({kind:'installment',icon:'◈',text:'تقسيط: '+brands.join(' · ')+' (حسب الأهلية)'});
    }
    return result;
  }
  function updatePills(){
    if(!pills)return;
    const entries=productPills();
    const sig=JSON.stringify(entries);
    if(sig===lastPills)return;
    lastPills=sig;
    pills.replaceChildren(...entries.map(v=>chip(v.kind,v.icon,v.text)));
    pills.hidden=!entries.length;
  }
  function targetOffers(){return $('.rs60-native-offers salla-offer')||$('.rs60-native-offers')}
  function offerTitles(){
    const source=targetOffers();if(!source)return [];
    // Only cards rendered by Salla for THIS product; never assume category offers apply.
    return unique($$('.s-offer-card-title',source).map(x=>x.textContent)).slice(0,3);
  }
  function makeOfferButton(title){
    const btn=doc.createElement('button');btn.type='button';btn.className='rs87-offer-button';
    const mark=doc.createElement('span');mark.className='rs87-offer-mark';mark.setAttribute('aria-hidden','true');mark.textContent='🎁';
    const text=doc.createElement('span');text.className='rs87-offer-name';text.textContent=title;
    btn.append(mark,text);
    btn.title='عرض تفاصيل هذا العرض وشروطه';
    btn.addEventListener('click',()=>{
      const target=$('.rs60-native-offers');if(!target)return;
      const toggle=$('.rs69-offers-toggle',target);
      if(toggle&&toggle.getAttribute('aria-expanded')==='false')toggle.click();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    });
    return btn;
  }
  function updateOffers(){
    if(!offerPanel)return;
    const titles=offerTitles();const sig=JSON.stringify(titles);
    if(sig===lastOffers)return;
    lastOffers=sig;
    offerTiles.replaceChildren(...titles.map(makeOfferButton));
    offerPanel.hidden=!titles.length;
  }
  function render(){renderTimer=0;if(!hero?.isConnected)return;updatePills();updateOffers()}
  function queue(){if(renderTimer)return;renderTimer=setTimeout(render,70)}
  function watchOffers(){
    const source=targetOffers();if(!source||source===offerObserver?.source)return;
    offerObserver?.disconnect();
    offerObserver=new MutationObserver(queue);
    offerObserver.observe(source,{childList:true,subtree:true,characterData:true});
    offerObserver.source=source;
  }
  function start(){
    if(!doc.body)return;
    info=$('.container--product-single .product-details-col');
    const heading=info?.querySelector(':scope > h1');
    if(!heading){root.dataset.relaxSmartHeroStatus='waiting-for-title';return}
    priceStrip=info.querySelector(':scope > .flex.whitespace-nowrap')||info.querySelector('.rs87-product-price');
    if(!priceStrip){root.dataset.relaxSmartHeroStatus='waiting-for-price';return}
    if(!hero?.isConnected){
      doc.body.classList.add('rs87-product');
      hero=doc.createElement('section');hero.className='rs87-product-hero';hero.setAttribute('aria-label','السعر والعروض الحالية للمنتج');
      // Preserve and MOVE the original sale price; all Salla event handlers remain intact.
      priceStrip.classList.add('rs87-product-price');
      hero.append(priceStrip);
      pills=doc.createElement('ul');pills.className='rs87-verified-pills';pills.hidden=true;
      offerPanel=doc.createElement('div');offerPanel.className='rs87-offer-panel';offerPanel.hidden=true;
      const offerHeading=doc.createElement('h2');offerHeading.className='rs87-offer-heading';
      const giftMark=doc.createElement('span');giftMark.setAttribute('aria-hidden','true');giftMark.textContent='🏷️';
      const giftHeading=doc.createElement('span');giftHeading.textContent='العروض المتاحة على هذا المنتج';
      offerHeading.append(giftMark,giftHeading);
      offerTiles=doc.createElement('div');offerTiles.className='rs87-offer-tiles';
      offerPanel.append(offerHeading,offerTiles);
      hero.append(pills,offerPanel);
      heading.insertAdjacentElement('afterend',hero);
      priceObserver=new MutationObserver(queue);
      priceObserver.observe(priceStrip,{childList:true,subtree:true,characterData:true});
      info.addEventListener('change',queue,{passive:true});
    }
    watchOffers();queue();
    root.dataset.relaxSmartHeroStatus='ready';
    root.dataset.relaxSmartPurchase='87';
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start,{once:true});else start();
  doc.addEventListener('theme::ready',start);
  [250,900,1800,3300,5500].forEach(ms=>setTimeout(start,ms));
})();



/* ============================================================================
   RELAX SMART V89 — SALLA OPTIONS-SAFE PURCHASE + COMPLETE PRODUCT CONTENT
   Original native Salla add controls remain active. The recovery button is shown
   ONLY when the theme's original Salla button has not hydrated to a real button.
   In recovery mode, use Salla.form.submit('cart.addItem', native SubmitEvent)
   instead of cart.addItem({id, quantity}), which omits options and caused 422.
   No fake purchase success, no automatic retries or fabricated product copy.
   ============================================================================ */
(() => {
  'use strict';
  if (window.__relaxSmartV89) return;
  window.__relaxSmartV89 = true;
  const doc=document, root=doc.documentElement;
  const isProduct=/\/p\d+(?:\/|$)/i.test(location.pathname);
  const $=(s,r=doc)=>r.querySelector(s);
  const $$=(s,r=doc)=>Array.from(r.querySelectorAll(s));
  const css=doc.createElement('style');
  css.id='rs89-options-and-content-style';
  css.textContent=`
   /* Full original product titles: no clipping on the catalog or detail pages. */
   :is(custom-salla-product-card,salla-product-card,.s-product-card-entry,.s-product-card,.product-entry)
   :is(.product-entry__title,.product-entry__title a,.s-product-card-content-title,
       .s-product-card-content-title a,.s-product-card-title,.s-product-card-title a,
       .product-card__title,.product-card__title a),
   body .container--product-single .product-details-col h1{
      display:block!important;max-height:none!important;height:auto!important;
      min-height:0!important;white-space:normal!important;overflow:visible!important;
      text-overflow:clip!important;-webkit-line-clamp:unset!important;
      -webkit-box-orient:initial!important;overflow-wrap:anywhere!important;
      line-height:1.65!important;opacity:1!important;visibility:visible!important;
   }
   :is(custom-salla-product-card,salla-product-card,.s-product-card-entry,.s-product-card,.product-entry)
   :is(.product-entry__content,.s-product-card-content,.product-entry__title,.s-product-card-content-title){
      height:auto!important;max-height:none!important;min-height:0!important;
      overflow:visible!important;
   }
   /* Gift and add-on card names/descriptions must not be two-line clipped. */
   html body.rs70-product .rs60-gift-section .rs60-item-name,
   html body.rs70-product .rs60-paid-section .rs60-item-name{
      display:block!important;max-height:none!important;height:auto!important;
      -webkit-line-clamp:unset!important;overflow:visible!important;
      white-space:normal!important;overflow-wrap:anywhere!important;
   }
   html body.rs70-product .rs60-section-desc{max-height:none!important;overflow:visible!important}
   /* Product detail description is never replaced by the short teaser. */
   body.rs60-product #rs60-description,
   body.rs60-product #rs60-description .rs60-description-source,
   body.rs60-product #rs60-description .rs70-full-original{
      width:100%!important;max-width:100%!important;min-width:0!important;
      height:auto!important;max-height:none!important;min-height:0!important;
      white-space:normal!important;text-overflow:clip!important;
      overflow-wrap:anywhere!important;-webkit-line-clamp:unset!important;
      display:block!important;visibility:visible!important;opacity:1!important;
   }
   body.rs60-product #rs60-description :is(p,li,h1,h2,h3,h4,td,th,figcaption){
      white-space:normal!important;overflow-wrap:anywhere!important;
      -webkit-line-clamp:unset!important;max-height:none!important;
   }
   body.rs60-product #rs60-description .rs70-img-label{
      max-height:none!important;overflow:visible!important;
      white-space:normal!important;overflow-wrap:anywhere!important;
   }
   body.rs60-product #rs60-description .rs70-media-grid{min-width:0!important;max-width:100%!important}
   body.rs60-product #rs60-description .rs70-media-grid a{min-width:0!important;max-width:100%!important}
   body.rs60-product .rs89-benefits{
      display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
      gap:8px!important;direction:rtl!important;margin:10px 0 13px!important;
      width:100%!important;min-width:0!important;max-width:100%!important;
   }
   body.rs60-product .rs89-benefits .rs89-benefit{
      display:flex!important;flex-direction:row!important;align-items:center!important;
      gap:7px!important;border:1px solid #e2e8ef!important;
      border-radius:10px!important;background:#fff!important;padding:9px 8px!important;
      min-width:0!important;max-width:100%!important;text-align:right!important;
   }
   body.rs60-product .rs89-benefits .rs89-benefit-icon{
      width:30px!important;height:30px!important;flex:0 0 30px!important;
      border-radius:8px!important;display:grid!important;place-items:center!important;
      background:#e9f7f4!important;color:#19a997!important;font-size:16px!important;
   }
   body.rs60-product .rs89-benefits .rs89-benefit-copy{min-width:0!important;flex:1!important}
   body.rs60-product .rs89-benefits .rs89-benefit-copy strong{
      display:block!important;font-size:11px!important;line-height:1.5!important;
      color:#223145!important;font-weight:850!important;
   }
   body.rs60-product .rs89-benefits .rs89-benefit-copy span{
      display:block!important;font-size:10px!important;line-height:1.55!important;
      color:#697687!important;margin-top:2px!important;
   }
   body.rs86-product form.product-form section.addtocart-bar.rs86-ready.rs89-sdk-mode>salla-add-product-button{
      display:none!important;visibility:hidden!important;pointer-events:none!important;
      width:0!important;min-width:0!important;flex:0 0 0!important;margin:0!important;padding:0!important;
   }
   body.rs86-product form.product-form section.addtocart-bar.rs86-ready>.rs89-add{
      display:none!important;align-items:center!important;justify-content:center!important;
      flex:1 1 0%!important;min-width:0!important;max-width:100%!important;
      height:44px!important;min-height:44px!important;max-height:44px!important;
      margin:0!important;padding:4px 8px!important;background:#148b4e!important;color:#fff!important;
      font:inherit!important;font-size:13px!important;font-weight:900!important;
      border:1px solid #148b4e!important;border-radius:9px!important;
      cursor:pointer!important;opacity:1!important;visibility:visible!important;
      box-sizing:border-box!important;pointer-events:auto!important;
   }
   body.rs86-product form.product-form section.addtocart-bar.rs86-ready.rs89-sdk-mode>.rs89-add{display:flex!important}
   body.rs86-product form.product-form section.addtocart-bar.rs86-ready>.rs89-add:disabled{opacity:.58!important;cursor:wait!important}
   /* The V86 modal is not a genuine Apple Pay method. Don't show a fake Apple Pay
      payment choice on browsers where Apple Pay itself is unavailable. */
   body.rs86-product .rs86-ready>.rs86-apple-info{display:none!important}
   @media(max-width:600px){
     body.rs86-product form.product-form section.addtocart-bar.rs86-ready.rs89-sdk-mode:not(.rs86-floating){
        display:flex!important;flex-wrap:wrap!important;min-height:54px!important;height:auto!important;
     }
     body.rs86-product form.product-form section.addtocart-bar.rs86-ready.rs89-sdk-mode:not(.rs86-floating)>.center-between{
        display:flex!important;flex:0 0 100%!important;max-width:86px!important;
     }
     body.rs86-product form.product-form section.addtocart-bar.rs86-ready.rs89-sdk-mode>.rs89-add,
     body.rs86-product form.product-form section.addtocart-bar.rs86-ready.rs89-sdk-mode>.rs86-buy{
       display:flex!important;flex:1 1 0%!important;min-width:0!important;
       height:42px!important;min-height:42px!important;max-height:42px!important;
       padding:3px!important;font-size:12px!important;
     }
     body.rs86-product form.product-form section.addtocart-bar.rs86-ready.rs89-sdk-mode.rs86-floating>.center-between{display:none!important}
     body.rs60-product #rs60-description{box-sizing:border-box!important;width:100%!important;overflow:hidden!important}
     body.rs60-product #rs60-description :is(img,video,iframe,figure,table){max-width:100%!important}
     body.rs60-product .rs89-benefits{gap:6px!important}
     body.rs60-product .rs89-benefits .rs89-benefit{padding:7px 5px!important;gap:5px!important}
     body.rs60-product .rs89-benefits .rs89-benefit-icon{width:26px!important;height:26px!important;flex-basis:26px!important}
     body.rs60-product .rs89-benefits .rs89-benefit-copy strong{font-size:10px!important}
     body.rs60-product .rs89-benefits .rs89-benefit-copy span{font-size:9px!important}
   }
  `;
  (doc.head||root).append(css);

  // Some of the old mobile slider's CSS lives in open Shadow DOM. Override it
  // inside those product cards as well; plain stylesheet rules cannot reach it.
  const shadowCSS=`
   :is(.product-entry__title,.product-entry__title a,.s-product-card-content-title,
   .s-product-card-content-title a,.s-product-card-title,.s-product-card-title a,
   .product-card__title,.product-card__title a){
     display:block!important;height:auto!important;min-height:0!important;
     max-height:none!important;white-space:normal!important;overflow:visible!important;
     -webkit-line-clamp:unset!important;line-clamp:unset!important;
     text-overflow:clip!important;overflow-wrap:anywhere!important;line-height:1.6!important;
   }
   :is(.product-entry__content,.s-product-card-content){height:auto!important;max-height:none!important;overflow:visible!important}
  `;
  function injectShadow(rootNode){
    const r=rootNode?.shadowRoot;
    if(!r)return;
    if(!r.querySelector('#rs89-card-title-style')){
      const st=doc.createElement('style');st.id='rs89-card-title-style';st.textContent=shadowCSS;r.append(st);
    }
    r.querySelectorAll('custom-salla-product-card,salla-product-card,salla-slider,[component-name="products-slider"]').forEach(injectShadow);
  }
  function scanCards(rootNode=doc){
    rootNode.querySelectorAll?.('custom-salla-product-card,salla-product-card,salla-slider,[component-name="products-slider"]').forEach(injectShadow);
  }
  let scanQueued=false;
  function scheduleCards(){
    if(scanQueued)return;scanQueued=true;
    requestAnimationFrame(()=>{scanQueued=false;scanCards()});
  }
  function initCatalog(){
    scanCards();
    const observer=new MutationObserver(records=>{
      if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&
         (n.matches?.('custom-salla-product-card,salla-product-card,salla-slider,[component-name="products-slider"]')||
         n.querySelector?.('custom-salla-product-card,salla-product-card,salla-slider,[component-name="products-slider"]')))))scheduleCards();
    });
    observer.observe(doc.body,{childList:true,subtree:true});
    [900,2200,4800,6300,9000].forEach(ms=>setTimeout(scheduleCards,ms));
  }
  if(!isProduct){
    if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',initCatalog,{once:true});
    else initCatalog();
    return;
  }

  let form,bar,host,addBtn,busy=false,submitBound=false,barBound=false;
  let cartSuccessSeen=false,lastRequest=0;
  const message=txt=>{
    const note=$('.rs86-action-note',form||doc);
    if(note)note.textContent=txt||'';
  };
  function nativeButton(){
    if(!host?.isConnected)return null;
    return host.querySelector('salla-button button,button.s-button-element,button[type="submit"]') ||
      host.querySelector('salla-button')?.shadowRoot?.querySelector('button') ||
      host.shadowRoot?.querySelector('salla-button button,button[type="submit"]') || null;
  }
  const missingNative=()=>!!(host?.isConnected&&!nativeButton());
  function syncMode(){
    if(!form?.isConnected||!bar?.isConnected||!host?.isConnected)return;
    const fallback=missingNative();
    bar.classList.toggle('rs89-sdk-mode',fallback);
    root.dataset.relaxSmartCartFix=fallback?'form-fallback':'native-salla';
    if(addBtn)addBtn.disabled=busy||host.getAttribute('product-status')!=='sale';
    const buy=bar.querySelector('.rs86-buy');
    if(buy)buy.type='button';
  }
  // Genuine browser form submission with the chosen option fields is crucial.
  // This is an actual SubmitEvent from the fallback button, not a click event.
  function getPayload(){
    const fd=new FormData(form), options={}, other={};
    for(const [key,value] of fd.entries()){
      const match=key.match(/^options\[(\d+)\](?:\[\])?$/);
      if(match){
        const k=match[1];
        if(Object.prototype.hasOwnProperty.call(options,k)){
          options[k]=Array.isArray(options[k])?[...options[k],value]:[options[k],value];
        }else options[k]=value;
      }else if(key==='notes'||key==='note'){
        if(typeof value==='string'&&value.trim())other.notes=value;
      }
    }
    const quantityHost=$('salla-quantity-input',form);
    const q=Number(fd.get('quantity') || $('input[name="quantity"]',form)?.value || quantityHost?.value || 1);
    const id=Number(fd.get('id')||host.getAttribute('product-id')||0);
    return {id,quantity:Number.isSafeInteger(q)&&q>=1?q:1,options,...other};
  }
  function errorText(error){
    const raw=error?.response?.data?.message ||error?.data?.message||error?.message||'';
    const t=String(raw).replace(/\s+/g,' ').slice(0,170);
    return t||'تعذرت إضافة المنتج. راجعي خياراته أو رسالة سلة.';
  }
  async function handleFallbackSubmit(e){
    if(!missingNative()||e.submitter!==addBtn)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(busy)return;
    if(!form.reportValidity()){message('اختاري جميع الخيارات المطلوبة أولًا.');return;}
    const optionHost=$('salla-product-options',form);
    if(optionHost && typeof optionHost.validateAndScroll==='function'){
      try{
        const valid=optionHost.validateAndScroll();
        if(valid===false){message('اختاري جميع الخيارات المطلوبة أولًا.');return;}
      }catch{message('راجعي الخيارات المطلوبة قبل الشراء.');return;}
    }
    const s=window.salla||window.Salla;
    if(!s){message('خدمة سلة غير جاهزة. حدّثي الصفحة ثم جربي مرة أخرى.');return;}
    const payload=getPayload();
    if(!Number.isSafeInteger(payload.id)||payload.id<=0){message('لم يتم التعرف على رقم المنتج.');return;}
    // Uploaded files need Salla's native form upload flow. Do not silently
    // drop attachments when using an object payload.
    const uploadedFiles=Array.from(form.querySelectorAll('input[type="file"]'))
      .some(x=>x.files && x.files.length>0);
    if(uploadedFiles){
      message('المنتج يحتوي على ملف مرفق؛ استخدمي نموذج رفع الملفات الأصلي لإتمام الإضافة.');
      return;
    }
    const now=Date.now();if(now-lastRequest<1000)return;
    lastRequest=now;busy=true;cartSuccessSeen=false;
    const buy=bar.querySelector('.rs86-buy');
    if(buy)buy.disabled=true;
    addBtn.textContent='جارٍ الإضافة…';syncMode();
    const redirect=addBtn.dataset.goCart==='1';
    addBtn.dataset.goCart='0';
    try{
      // V97 FIX: do not pass an intercepted native SubmitEvent to the old
      // Salla.form.submit implementation: it produced `t.stop is not a function`
      // on this storefront. The documented Salla.cart.addItem accepts the full
      // {id, quantity, options, notes} payload from the REAL product form.
      if(typeof s.cart?.addItem!=='function'){
        throw new Error('خدمة إضافة المنتجات غير متوفرة حاليًا');
      }
      const result=await s.cart.addItem(payload);
      if(result?.success===false||result?.status===false||result?.error){
        throw new Error(errorText(result));
      }
      message(redirect?'تمت الإضافة، جارٍ الانتقال لإتمام الطلب…':'تمت إضافة المنتج إلى السلة.');
      root.dataset.relaxSmartCartFix='submitted';
      if(redirect){
        const completed=await window.__rs96Checkout?.afterAdded(payload.id);
        if(!completed) message('تمت إضافة المنتج، لكن تعذّر استكمال إتمام الطلب تلقائيًا؛ راجعي رسالة التحقق أو افتحي السلة.');
      }
    }catch(error){
      message('تعذرت الإضافة: '+errorText(error));
      root.dataset.relaxSmartCartFix='failed';
    }finally{
      busy=false;addBtn.textContent='أضف إلى السلة';if(buy)buy.disabled=false;syncMode();
    }
  }
  function initPurchase(){
    form=$('.container--product-single .product-details-col form.product-form');
    bar=form?.querySelector('section.addtocart-bar');
    host=bar?.querySelector('salla-add-product-button');
    if(!form||!bar||!host){root.dataset.relaxSmartCartFix='waiting-for-product';return;}
    if(!addBtn){
      addBtn=doc.createElement('button');addBtn.type='submit';
      addBtn.className='rs89-add';addBtn.textContent='أضف إلى السلة';
      host.insertAdjacentElement('afterend',addBtn);
    }
    if(!submitBound){
      submitBound=true;
      form.addEventListener('submit',e=>{void handleFallbackSubmit(e)},true);
    }
    if(!barBound){
      barBound=true;
      bar.addEventListener('click',e=>{
        if(!missingNative()||!e.target?.closest?.('.rs86-buy'))return;
        e.preventDefault();e.stopImmediatePropagation();
        if(busy)return;
        if(!form.reportValidity()){message('اختاري كل الخيارات المطلوبة قبل الشراء.');return;}
        addBtn.dataset.goCart='1';
        form.requestSubmit(addBtn);
      },true);
      const obs=new MutationObserver(syncMode);
      obs.observe(host,{childList:true,subtree:true});
    }
    const id=host.getAttribute('product-id');
    if(id&&!$('input[name="id"]',form)){
      const hidden=doc.createElement('input');hidden.type='hidden';hidden.name='id';hidden.value=id;
      form.append(hidden);
    }
    syncMode();
  }
  const svg={
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    wallet:'<rect x="2" y="5" width="20" height="15" rx="2"/><path d="M16 11h4"/>',
    truck:'<path d="M10 17h4V5H2v12h3"/><path d="M14 9h4l4 4v4h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>',
    back:'<path d="M3 11a9 9 0 1 1 2.5 6.2"/><path d="M3 4v7h7"/>'
  };
  function benefits(){
    const info=$('.container--product-single .product-details-col');
    const title=info?.querySelector(':scope > h1');
    if(!title)return;
    let wrap=$('.rs89-benefits',info);
    if(wrap)return;
    wrap=doc.createElement('div');wrap.className='rs89-benefits';wrap.dir='rtl';
    wrap.setAttribute('aria-label','مميزات التسوق من ريلاكس سمارت');
    const rows=[
      ['shield','طرق دفع آمنة','حسب الخيارات المتاحة عند الدفع'],
      ['wallet','خيارات تقسيط','حسب الأهلية ومزود الخدمة'],
      ['truck','شحن داخل المملكة','وفق سياسة الشحن بالمتجر'],
      ['back','استبدال واسترجاع','حسب سياسة المتجر']
    ];
    rows.forEach(([key,heading,sub])=>{
      const item=doc.createElement('div');item.className='rs89-benefit';
      const icon=doc.createElement('span');icon.className='rs89-benefit-icon';icon.setAttribute('aria-hidden','true');
      icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">'+svg[key]+'</svg>';
      const copy=doc.createElement('div');copy.className='rs89-benefit-copy';
      const strong=doc.createElement('strong');strong.textContent=heading;
      const span=doc.createElement('span');span.textContent=sub;
      copy.append(strong,span);item.append(icon,copy);wrap.append(item);
    });
    // Replace the old three-card trust footer rather than duplicate the labels.
    const old=$('.rs60-trust:not(.rs89-benefits)',info);
    old?.remove();
    const hero=info.querySelector(':scope > .rs87-product-hero');
    if(hero)hero.insertAdjacentElement('afterend',wrap);
    else title.insertAdjacentElement('afterend',wrap);
  }
  function init(){
    initPurchase();benefits();scanCards();
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',init,{once:true});else init();
  doc.addEventListener('theme::ready',init);
  [250,900,1800,3500].forEach(ms=>setTimeout(init,ms));
})();


/* RELAX SMART V66: Hide options and quick-add controls on listing cards ONLY.
   This is visual-only; it does NOT touch gift selections, product details, or cart SDK. */
(function(){
  'use strict';
  if(window.__relaxSmartV66Catalog) return;
  window.__relaxSmartV66Catalog=true;
  const style=document.createElement('style');
  style.id='relax-smart-v66-catalog-style';
  style.textContent=`/* RELAX SMART V90: hide listing-card quick-purchase CONTROLS, never a form. */
:is(custom-salla-product-card,salla-product-card,.s-product-card-entry,.s-product-card)
:is(salla-product-options,.product-entry__options,.product-entry__options-wrapper,
.product-entry__variants,.product-entry__variant-options,.s-product-card-options,
.s-product-card-variants,.product-variants,.variant-selector,.options-container,
.product-options,.product-options-wrapper,.product-entry__quick-buy,
.s-product-card-quick-buy,.product-entry__quick-add,.product-quick-add,
.quick-buy-options,.product-entry__add-to-cart,.s-product-card-add-btn,
.s-product-card-add-button,.product-entry__cart-controls,.s-product-card__actions),
:is(custom-salla-product-card,salla-product-card,.s-product-card-entry,.s-product-card)
:is(salla-add-product-button,salla-quick-buy,.s-product-card-button-add-to-cart){
 display:none!important;visibility:hidden!important;
}
/* Forms are NOT buttons: form.product-form contains title, subtitle and prices. */
html body custom-salla-product-card.product-entry > form.product-form,
html body custom-salla-product-card form.content-wrap.product-form,
html body salla-product-card form.product-form,
html body .s-product-card-entry form.product-form,
html body .s-product-card form.product-form{
 display:block!important;visibility:visible!important;opacity:1!important;
 height:auto!important;max-height:none!important;min-height:0!important;
 overflow:visible!important;margin-bottom:0!important;
}
html body custom-salla-product-card .product-entry__content,
html body .s-product-card-entry .product-entry__content{
 display:block!important;visibility:visible!important;opacity:1!important;
 height:auto!important;max-height:none!important;min-height:0!important;
 overflow:visible!important;
}
/* Preserve the actual merchant-authored names and price for variant products. */
html body custom-salla-product-card :is(.product-entry__title,.product-entry__title a,.s-product-card-content-title,.s-product-card-content-title a),
html body salla-product-card :is(.product-entry__title,.product-entry__title a,.s-product-card-content-title,.s-product-card-content-title a){
 display:block!important;visibility:visible!important;opacity:1!important;
 height:auto!important;max-height:none!important;white-space:normal!important;
 overflow:visible!important;color:#233449!important;-webkit-text-fill-color:#233449!important;
 font-size:14px!important;line-height:1.65!important;
}
`; 
  (document.head||document.documentElement).append(style);

  const selector='custom-salla-product-card,salla-product-card,.s-product-card-entry,.s-product-card';
  const shadowCSS=`/* RELAX SMART V90 Shadow DOM: ONLY the option and checkout controls */
salla-product-options,salla-add-product-button,salla-quick-buy,
.product-entry__options,.product-entry__options-wrapper,
.s-product-card-options,.product-variants,.variant-selector,
.product-entry__quick-buy,.product-entry__quick-add,
.product-entry__add-to-cart,.s-product-card-add-btn{display:none!important}
form.product-form,form.content-wrap,form:has(salla-product-options),form:has([name^="options["]){
 display:block!important;visibility:visible!important;opacity:1!important;
 max-height:none!important;height:auto!important;overflow:visible!important}
.product-entry__title,.product-entry__title a,.s-product-card-content-title,
.s-product-card-content-title a,.s-product-card-title,.s-product-card-title a{
 display:block!important;visibility:visible!important;opacity:1!important;
 max-height:none!important;height:auto!important;overflow:visible!important;
 white-space:normal!important;line-height:1.65!important;
 color:#233449!important;-webkit-text-fill-color:#233449!important}
`;
  function prepare(card){
    // This attribute is part of Salla's standard product card API.
    if(card.localName==='salla-product-card' && !card.hasAttribute('hide-add-btn')){
      card.setAttribute('hide-add-btn','');
    }
    const root=card.shadowRoot;
    if(root && !root.querySelector('#rs66-shadow-style')){
      const st=document.createElement('style');st.id='rs66-shadow-style';st.textContent=shadowCSS;
      root.append(st);
    }
  }
  function scan(root){
    if(!root || root.nodeType!==1 && root.nodeType!==9) return;
    if(root.matches?.(selector)) prepare(root);
    root.querySelectorAll?.(selector).forEach(prepare);
  }
  function start(){
    scan(document);
    const observer=new MutationObserver(records=>{
      for(const record of records){
        for(const node of record.addedNodes){if(node.nodeType===1)scan(node);}
      }
    });
    // Observe only newly created cards, not input changes or every style mutation.
    observer.observe(document.body,{childList:true,subtree:true});
    [800,2000].forEach(ms=>setTimeout(()=>scan(document),ms));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

/* ============================================================================
   RELAX SMART V90 — FIX MISSING CARD TITLES FOR PRODUCTS WITH OPTIONS
   The former V66 selector hid form:has(options), hiding titles AND prices.
   V90 keeps forms visible, hides only unnecessary controls, and restores a
   truly absent title from this exact product's Salla data or image alt.
   Does NOT touch product detail forms, cart add, checkout, offer or prices.
   ============================================================================ */
(() => {
  'use strict';
  if (window.__relaxSmartV90CatalogNames) return;
  window.__relaxSmartV90CatalogNames = true;
  document.documentElement.dataset.relaxSmartCatalogFix = '90';
  const doc=document;
  const CARDS='custom-salla-product-card,salla-product-card,.s-product-card-entry,.s-product-card,.product-entry';
  const TITLES='.product-entry__title,.s-product-card-content-title,.s-product-card-title,.product-card__title';
  const BODY='.product-entry__content,.s-product-card-content,.product-card__content,.product-card__details';
  const clean=t=>String(t||'').replace(/\s+/g,' ').trim();
  const acceptable=t=>t && t.length>=4 && t.length<350 &&
    !/^(?:صورة المنتج|صورة|منتج|عرض سريع|أضف إلى السلة|Add to cart|Product image|Loading)$/i.test(t);
  const mainStyle=doc.createElement('style');
  mainStyle.id='rs90-repair-card-titles';
  mainStyle.textContent=`
    html body :is(custom-salla-product-card,salla-product-card,.s-product-card,.s-product-card-entry,.product-entry)
    :is(.product-entry__title,.product-entry__title a,.s-product-card-content-title,.s-product-card-content-title a,
        .s-product-card-title,.s-product-card-title a,.product-card__title,.product-card__title a,.rs90-restored-title,.rs90-restored-title a){
      display:block!important;visibility:visible!important;opacity:1!important;
      max-height:none!important;min-height:0!important;height:auto!important;
      overflow:visible!important;white-space:normal!important;
      text-overflow:clip!important;-webkit-line-clamp:unset!important;
      font-size:14px!important;line-height:1.65!important;font-weight:750!important;
      color:#233449!important;-webkit-text-fill-color:#233449!important;
      overflow-wrap:anywhere!important;text-decoration:none!important;
    }
    html body .rs90-restored-title{margin:0 0 8px!important;padding:0!important}
    /* A variant form is also the container for title, price and subtitle. */
    html body custom-salla-product-card form.product-form,
    html body salla-product-card form.product-form,
    html body .s-product-card-entry form.product-form,
    html body .s-product-card form.product-form{
      display:block!important;visibility:visible!important;opacity:1!important;
      max-height:none!important;height:auto!important;overflow:visible!important;
    }
    @media(max-width:767px){
      html body :is(custom-salla-product-card,salla-product-card,.s-product-card,.s-product-card-entry,.product-entry)
      :is(.product-entry__title,.product-entry__title a,.s-product-card-content-title,.s-product-card-content-title a,
          .s-product-card-title,.s-product-card-title a,.rs90-restored-title,.rs90-restored-title a){
        font-size:13px!important;line-height:1.7!important;max-height:none!important;
      }
    }
  `;
  (doc.head||doc.documentElement).append(mainStyle);
  const shadowCss=`
    form.product-form,form.content-wrap,form:has(salla-product-options),form:has([name^="options["]){
      display:block!important;visibility:visible!important;opacity:1!important;
      height:auto!important;max-height:none!important;overflow:visible!important}
    .product-entry__content,.s-product-card-content{display:block!important;visibility:visible!important;opacity:1!important;max-height:none!important;height:auto!important}
    :is(.product-entry__title,.product-entry__title a,.s-product-card-content-title,.s-product-card-content-title a,
    .s-product-card-title,.s-product-card-title a,.rs90-restored-title,.rs90-restored-title a){
      display:block!important;visibility:visible!important;opacity:1!important;
      height:auto!important;max-height:none!important;white-space:normal!important;
      overflow:visible!important;color:#233449!important;-webkit-text-fill-color:#233449!important;
      font-size:14px!important;line-height:1.65!important}
  `;
  const observedRoots=new WeakSet();
  function watchShadow(root){
    if(!root||observedRoots.has(root))return;
    observedRoots.add(root);
    const st=doc.createElement('style');st.id='rs90-shadow-card-fix';st.textContent=shadowCss;
    root.append(st);
    const obs=new MutationObserver(schedule);
    obs.observe(root,{childList:true,subtree:true});
  }
  function productData(card){
    let p=card.product;
    if(typeof p==='string'){try{p=JSON.parse(p)}catch{p=null}}
    if(p&&typeof p==='object'&&typeof p.name==='string')return p;
    try{
      const raw=card.getAttribute('product');
      const parsed=raw?JSON.parse(raw):null;
      return parsed&&typeof parsed==='object'?parsed:{};
    }catch{return {}}
  }
  function productLink(root, card, product){
    const raw=root.querySelector('.product-entry__image-wrap[href],a[href*="/p"]')?.getAttribute('href') || product.url || card.getAttribute('data-product-url') || '';
    try{
      const url=new URL(raw,location.href);
      return url.origin===location.origin && /\/p\d+(?:\/|$)/.test(url.pathname)?url.href:'';
    }catch{return ''}
  }
  function ownName(card,body,product){
    const source=body.querySelector('.product-entry__title,.s-product-card-content-title,.s-product-card-title,.product-card__title');
    const native=clean(source?.textContent);
    if(acceptable(native))return native;
    const fields=[product.name,card.getAttribute('data-product-name'),card.getAttribute('data-name'),
      body.querySelector('meta[itemprop="name"]')?.getAttribute('content'),
      body.querySelector('.product-entry__image-wrap[aria-label],a.product-entry__image-wrap[aria-label]')?.getAttribute('aria-label'),
      card.querySelector('.product-entry__image-wrap[aria-label]')?.getAttribute('aria-label'),
      body.querySelector('img[alt]')?.getAttribute('alt'),card.querySelector('img[alt]')?.getAttribute('alt')];
    return fields.map(clean).find(acceptable)||'';
  }
  function apply(card){
    if(!card.isConnected||card.parentElement?.closest(CARDS))return;
    const ownRoot=card.shadowRoot||card;
    if(card.shadowRoot)watchShadow(card.shadowRoot);
    const content=ownRoot.querySelector(BODY);
    if(!content)return; // do not manufacture UI for an unhydrated/empty product card
    const title=content.querySelector(TITLES);
    const fallback=content.querySelector(':scope > .rs90-restored-title');
    if(title&&acceptable(clean(title.textContent))){
      if(fallback)fallback.remove(); // Salla rendered its genuine title later
      return;
    }
    const data=productData(card);
    const name=ownName(card,ownRoot,data);
    if(!name)return; // never guess or invent a product title
    if(title){
      if(!clean(title.textContent)){
        const existing=title.querySelector('a');
        if(existing)existing.textContent=name;
        else title.textContent=name;
      }
      fallback?.remove();return;
    }
    if(fallback){
      if(clean(fallback.textContent)!==name)fallback.querySelector('a')?.replaceChildren(doc.createTextNode(name));
      return;
    }
    const h=doc.createElement('h2');h.className='rs90-restored-title';
    const href=productLink(ownRoot,card,data);
    if(href){const a=doc.createElement('a');a.href=href;a.textContent=name;h.append(a)}
    else h.textContent=name;
    content.prepend(h);
  }
  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;scan()});
  }
  function scan(){
    const visited=new Set();
    function inspect(root,depth=0){
      if(depth>6||!root||visited.has(root))return;
      visited.add(root);
      root.querySelectorAll?.(CARDS).forEach(apply);
      root.querySelectorAll?.('custom-salla-product-card,salla-product-card,salla-slider,[component-name="products-slider"]').forEach(el=>{
        if(el.shadowRoot){watchShadow(el.shadowRoot);inspect(el.shadowRoot,depth+1)}
      });
    }
    inspect(doc);
  }
  function init(){
    scan();
    const observer=new MutationObserver(records=>{
      if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1)))schedule();
    });
    observer.observe(doc.body,{childList:true,subtree:true});
    doc.addEventListener('salla::product::loaded',schedule,{passive:true});
    [550,1400,2800,5000].forEach(ms=>setTimeout(schedule,ms));
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* V91: gift preflight and 422-safe fallback; Salla remains authoritative for offer discounts. */


/* ========================================================================
   RELAX SMART V97 — FIX NATIVE COLOR CHOICES WITH EMPTY IMAGE SOURCES
   Scoped to original Salla thumbnail option labels. Never changes option IDs.
   ======================================================================== */
(function(){
  'use strict';
  if(window.__rs97Swatches)return;
  window.__rs97Swatches=true;
  var palette={
    'اسود':'#25282f','احمر':'#ca3444','رمادي':'#969ca5',
    'ابيض':'#ffffff','بيج':'#dec9a5','وردي':'#eaa4b8',
    'ازرق':'#3380c7','اخضر':'#279567','بني':'#78503b','اصفر':'#f6c94b'
  };
  function normalize(s){return String(s||'').trim().replace(/[أإآ]/g,'ا').replace(/[ً-ْ]/g,'').replace(/\s+/g,' ');}
  var css=document.createElement('style');css.id='rs97-swatches-css';
  css.textContent=`
  html body.rs60-product .container--product-single salla-product-options
    .s-product-options-thumbnails-wrapper{
      display:flex!important;flex-wrap:wrap!important;gap:10px!important;
      align-items:flex-start!important;justify-content:flex-start!important;
    }
  html body.rs60-product .container--product-single salla-product-options
    .s-product-options-thumbnails-wrapper > div{
      flex:0 0 72px!important;width:72px!important;min-width:0!important;
      display:flex!important;flex-direction:column!important;align-items:center!important;
    }
  html body.rs60-product .container--product-single salla-product-options
    .s-product-options-thumbnails-wrapper label.go-to-slide[data-rs97-swatch]{
      display:flex!important;align-items:center!important;justify-content:center!important;
      position:relative!important;width:60px!important;height:60px!important;
      min-width:60px!important;min-height:60px!important;
      max-width:60px!important;max-height:60px!important;
      padding:4px!important;margin:0 auto!important;background:#fff!important;
      border:2px solid #dce3ea!important;border-radius:12px!important;
      cursor:pointer!important;overflow:hidden!important;opacity:1!important;
    }
  html body.rs60-product .container--product-single salla-product-options
    label.go-to-slide[data-rs97-swatch] img{
      display:none!important;visibility:hidden!important;width:0!important;height:0!important;
    }
  html body.rs60-product .container--product-single salla-product-options
    label.go-to-slide[data-rs97-swatch]::before{
      content:""!important;display:block!important;width:42px!important;height:42px!important;
      border-radius:50%!important;border:1px solid #c4ccd5!important;
      background:var(--rs97-swatch-color,#bbc3cc)!important;
      box-shadow:inset 0 1px 2px rgba(255,255,255,.35)!important;
    }
  html body.rs60-product .container--product-single salla-product-options
    .s-product-options-thumbnails-wrapper input[type=radio]:checked + label.go-to-slide[data-rs97-swatch]{
      border-color:#f77170!important;box-shadow:0 0 0 2px #f7717040!important;
    }
  html body.rs60-product .container--product-single salla-product-options
    .s-product-options-thumbnails-wrapper > div > p{
      display:block!important;margin:7px 0 0!important;text-align:center!important;
      font-size:13px!important;font-weight:750!important;color:#233449!important;
    }
  `;
  (document.head||document.documentElement).appendChild(css);
  function scan(){
    var root=document.querySelector('.container--product-single salla-product-options');
    if(!root)return;
    root.querySelectorAll('.s-product-options-thumbnails-wrapper label.go-to-slide').forEach(function(label){
      var img=label.querySelector('img');
      if(!img)return;
      var src=String(img.getAttribute('src')||'').trim();
      var missing=!src || src==='null'||src==='undefined'||src==='#' || (img.complete && img.naturalWidth===0);
      if(!missing){
        label.removeAttribute('data-rs97-swatch');
        label.style.removeProperty('--rs97-swatch-color');
        return;
      }
      var name=normalize(img.getAttribute('alt')||img.getAttribute('title')||
        label.parentElement?.querySelector('p')?.textContent);
      label.dataset.rs97Swatch=name||'color';
      label.style.setProperty('--rs97-swatch-color',palette[name]||'#b7c0ca');
      img.setAttribute('aria-hidden','true');
    });
  }
  function start(){
    scan();
    var root=document.querySelector('.container--product-single');
    if(root){
      var observer=new MutationObserver(function(list){
        if(list.some(function(rec){return rec.addedNodes.length>0;}))scan();
      });
      observer.observe(root,{childList:true,subtree:true});
    }
    [450,1100,2500,4500].forEach(function(ms){setTimeout(scan,ms);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  document.addEventListener('theme::ready',scan);
})();


/* RELAX SMART V100 — succinct gift offer wording and mobile feedback.
   Purely storefront presentation: offer terms / discount remain owned by Salla. */
(function(){
  'use strict';
  if(window.__rs100OfferUi)return;window.__rs100OfferUi=true;
  const css=document.createElement('style');css.id='rs100-gift-feedback-style';
  css.textContent=`
  body.rs60-product .rs60-gift-section .rs100-gift-feedback{
    display:block;margin:6px 0 0;padding:0;font-size:12px;line-height:1.6;
    color:#45566e;font-weight:700;
  }
  body.rs60-product .rs60-gift-section .rs100-gift-feedback:not(:empty){
    padding:9px;border-radius:9px;background:#eef8f5;border:1px solid #cce9de;
  }
  body.rs60-product .rs60-gift-section .rs100-gift-feedback[data-status=warn]{
    color:#8f461c;background:#fff5ec;border-color:#f4d5b6;
  }
  body.rs60-product .rs60-gift-section .rs60-section-title{
    display:flex!important;align-items:center!important;gap:8px!important;
  }
  @media(max-width:767px){body.rs60-product .rs60-gift-section .rs60-section-desc{
    max-height:none!important;overflow:visible!important;line-height:1.6!important;
  }}
  `;
  (document.head||document.documentElement).append(css);
  const SHORT='🎁 اشتري منتج واحصل على هدية من المتجر';
  const norm=x=>String(x||'').replace(/[\u064B-\u065F]/g,'').replace(/\s+/g,' ').trim();
  // Shorten only the long marketing blurb INSIDE the offer popup; do not
  // rewrite product records, active offer titles, or other terms on the page.
  function eligible(text){
    const t=norm(text);
    return t.length>110 && /لا تفوت|لا تفوّت/.test(t) && /اشتر/.test(t)
      && /قطعه|قطعة/.test(t);
  }
  function isInsideOfferPopup(el){
    return !!el?.closest?.('salla-offer-modal,.s-offer-modal,[role="dialog"],.s-modal,.s-modal-content,.modal-content');
  }
  function scanRoot(root){
    // Only walk modal DOM, not the full store page (important on mobile).
    root.querySelectorAll?.('salla-offer-modal,salla-modal,.s-offer-modal,[role="dialog"],.s-modal,.s-modal-content,.modal-content').forEach(host=>{
      const tw=document.createTreeWalker(host,NodeFilter.SHOW_TEXT);
      const nodes=[];let current;
      while((current=tw.nextNode())){
        if(eligible(current.nodeValue))nodes.push(current);
      }
      nodes.forEach(node=>{node.nodeValue=SHORT;});
      if(host.shadowRoot)scanShadow(host.shadowRoot);
    });
  }
  function scanShadow(root){
    const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
    while((n=tw.nextNode())){
      if(eligible(n.nodeValue))n.nodeValue=SHORT;
    }
  }
  let scheduled=false;
  function schedule(){
    if(scheduled)return;scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;scanRoot(document.body);});
  }
  function init(){
    if(!document.body)return;
    schedule();
    const observer=new MutationObserver(records=>{
      if(records.some(r=>r.addedNodes.length||r.type==='characterData'))schedule();
    });
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();




/* Relax Smart Footer V103 — visual refresh ONLY.
 * Add once after your currently working V102/footer code. No HTML changes, no cart changes.
 */
(function () {
  "use strict";
  if (document.getElementById("rsx-footer-v103-native-style")) return;
  const css = String.raw`/* Relax Smart Footer V103 | Native footer + navigation harmonization
   Visual-only, scoped to original Salla footer and RSX navigation; no cart or checkout changes.
   Use either this CSS with existing V102 JS, OR the integrated V103 JS; not both.
*/

/* ===== Original Salla footer ===== */
html body footer.store-footer-wrap {
  --rsf-coral: #cf253a;
  --rsf-orange: #d67027;
  --rsf-ink: #213446;
  --rsf-muted: #687789;
  --rsf-line: #efdeda;
  direction: rtl;
  color: var(--rsf-ink) !important;
  background: #fff8f4 !important;
  border: 0 !important;
  overflow: visible;
  isolation: isolate;
}
html body footer.store-footer-wrap .store-footer {
  position: relative;
  background-color: #fff8f4 !important;
  background-image: linear-gradient(125deg, #fff4e9 0%, #fffaf8 44%, #fff5f6 100%) !important;
  color: var(--rsf-ink) !important;
  overflow: visible;
}
html body footer.store-footer-wrap .store-footer::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 5px;
  background: linear-gradient(90deg, #d67027 0%, #ef8557 43%, #cf253a 100%);
}
html body footer.store-footer-wrap .store-footer__inner {
  padding-top: 0 !important;
  color: var(--rsf-ink) !important;
}
/* Branded welcome area: light, airy and readable */
html body footer.store-footer-wrap .store-footer__inner > .container.without-apps-footer {
  max-width: 1210px !important;
  width: calc(100% - 32px) !important;
  margin-inline: auto !important;
  padding: 36px clamp(12px, 3vw, 36px) 26px !important;
  gap: 19px !important;
  background: transparent !important;
  color: var(--rsf-ink) !important;
}
html body footer.store-footer-wrap .without-apps-footer .max-w-3xl {
  max-width: 770px !important;
  gap: 6px !important;
  color: var(--rsf-ink) !important;
}
html body footer.store-footer-wrap .without-apps-footer .max-w-3xl > a {
  display: inline-flex !important;
  justify-content: center;
  align-items: center;
  width: 94px;
  min-height: 88px;
  margin-bottom: 10px !important;
  border-radius: 23px;
  background: #fff !important;
  box-shadow: 0 12px 32px rgba(159, 63, 41, .10);
  border: 1px solid #f5deda;
}
html body footer.store-footer-wrap .without-apps-footer .max-w-3xl > a img {
  display: block;
  max-width: 74px;
  max-height: 70px;
  object-fit: contain;
}
html body footer.store-footer-wrap .without-apps-footer blockquote,
html body footer.store-footer-wrap .without-apps-footer .pref-about-store {
  padding: 0 !important;
  border: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  max-width: 770px;
  color: #435369 !important;
  line-height: 2.05 !important;
  text-align: center;
  font-size: clamp(12px, 1vw, 14px) !important;
}
html body footer.store-footer-wrap .without-apps-footer blockquote strong {
  color: #435369 !important;
  font-weight: 650 !important;
}
html body footer.store-footer-wrap .without-apps-footer .contacts-list {
  padding: 0 !important;
  margin: 1px 0 0 !important;
  width: min(900px, 100%);
  justify-content: center;
}
html body footer.store-footer-wrap .s-contacts-list {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 10px !important;
}
html body footer.store-footer-wrap .s-contacts-list .s-contacts-item {
  display: inline-flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 9px !important;
  padding: 8px 15px !important;
  border-radius: 50px;
  color: var(--rsf-ink) !important;
  background: #fff !important;
  border: 1px solid #f2dbd7 !important;
  text-decoration: none !important;
  line-height: 1.7;
  font-size: 12px;
  box-shadow: 0 3px 12px rgba(166, 62, 50, .045);
  direction: ltr;
  transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease;
}
html body footer.store-footer-wrap .s-contacts-list .s-contacts-item:hover {
  border-color: #e7a3a3 !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(166, 62, 50, .10);
}
html body footer.store-footer-wrap .s-contacts-list .s-contacts-icon {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 6px;
  border-radius: 9px;
  color: var(--rsf-coral) !important;
  background: #fff1ee !important;
}
html body footer.store-footer-wrap .s-contacts-list .s-contacts-icon svg {
  display: block;
  width: 16px !important;
  height: 16px !important;
  fill: currentColor !important;
}
/* Utility + social links on a calm stripe */
html body footer.store-footer-wrap .footer-main-row {
  max-width: 1210px !important;
  width: calc(100% - 32px) !important;
  margin: 0 auto !important;
  padding: 18px 0 !important;
  gap: 14px !important;
  border-top: 1px solid #eddddd !important;
  border-bottom: 1px solid #eddddd !important;
  color: var(--rsf-ink) !important;
  background: transparent !important;
}
html body footer.store-footer-wrap .footer-menu-list {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px 13px !important;
  justify-content: center;
  border-color: #edd8d4 !important;
  min-width: 0;
}
html body footer.store-footer-wrap .footer-menu-list a {
  display: inline-flex !important;
  color: #3d4e61 !important;
  font-size: 12px !important;
  font-weight: 700;
  line-height: 1.7 !important;
  background: rgba(255,255,255,.75) !important;
  border: 1px solid #f0dfdc;
  padding: 10px 13px !important;
  border-radius: 12px;
  text-decoration: none !important;
  transition: background-color .2s ease, color .2s ease, border-color .2s ease;
}
html body footer.store-footer-wrap .footer-menu-list a:hover {
  background: #fff1ef !important;
  border-color: #e8aeae;
  color: var(--rsf-coral) !important;
}
html body footer.store-footer-wrap .s-social-list {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 9px !important;
}
html body footer.store-footer-wrap .s-social-link a {
  display: grid !important;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 13px;
  background: #fff !important;
  border: 1px solid #f0dbd6 !important;
  color: var(--rsf-orange) !important;
  box-shadow: 0 4px 12px rgba(143, 64, 41, .045);
  transition: transform .2s ease, color .2s ease, background-color .2s ease;
}
html body footer.store-footer-wrap .s-social-link a:hover {
  transform: translateY(-3px);
  background: var(--rsf-coral) !important;
  color: white !important;
}
html body footer.store-footer-wrap .s-social-link svg {
  fill: currentColor !important;
  width: 19px !important;
  height: 19px !important;
}
html body footer.store-footer-wrap .footer-lang-currency-btns .s-button-element {
  border: 1px solid #e8ccc6 !important;
  background: #fff !important;
  color: #36495e !important;
  border-radius: 11px !important;
  box-shadow: none !important;
  min-height: 39px;
}
/* Preserve national credentials and native payment badges */
html body footer.store-footer-wrap .store-footer > .container.border-t {
  max-width: 1210px !important;
  width: calc(100% - 32px) !important;
  margin-inline: auto !important;
  padding: 23px 0 29px !important;
  border-top: 0 !important;
  gap: 18px !important;
  background: transparent !important;
  color: var(--rsf-ink) !important;
}
html body footer.store-footer-wrap salla-trust-badges,
html body footer.store-footer-wrap .store-footer > .container.border-t > div:first-child > a {
  display: inline-flex !important;
  align-items: center !important;
  gap: 9px;
  color: #354659 !important;
}
html body footer.store-footer-wrap .s-trust-badges-label,
html body footer.store-footer-wrap .store-footer > .container.border-t p {
  color: #728094 !important;
  line-height: 1.7;
}
html body footer.store-footer-wrap .s-trust-badges-number,
html body footer.store-footer-wrap .store-footer > .container.border-t b {
  color: #283b51 !important;
  font-weight: 850 !important;
}
html body footer.store-footer-wrap .copyright-text,
html body footer.store-footer-wrap .copyright-text p,
html body footer.store-footer-wrap .copyright-text a {
  color: #637185 !important;
  font-size: 11px !important;
  text-decoration: none;
}
html body footer.store-footer-wrap .copyright-text a:hover {
  color: var(--rsf-coral) !important;
}
html body footer.store-footer-wrap salla-payments .s-payments-list {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center;
  gap: 7px !important;
  align-items: center;
  padding: 0 !important;
}
html body footer.store-footer-wrap .s-payments-list-item {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  min-width: 41px;
  min-height: 34px;
  padding: 5px 6px !important;
  border: 1px solid #f2e3df !important;
  background: #fff !important;
  border-radius: 9px;
  box-shadow: 0 2px 8px rgba(129, 56, 41, .025);
}
html body footer.store-footer-wrap .s-payments-list-item img {
  width: auto !important;
  height: auto !important;
  max-width: 48px !important;
  max-height: 27px !important;
  object-fit: contain !important;
}

/* Legal/payment row: also works if a theme utility CSS loads late */
html body footer.store-footer-wrap .store-footer > .container.border-t {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: space-between !important;
  align-items: center !important;
}
html body footer.store-footer-wrap .store-footer > .container.border-t > div:first-child {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 12px 20px !important;
  max-width: 100%;
}
html body footer.store-footer-wrap salla-trust-badges img.s-trust-badges-image {
  width: 55px !important;
  height: 55px !important;
  object-fit: contain !important;
}
html body footer.store-footer-wrap button[data-modal-id="modal-value-tax"] {
  width: 32px !important;
  height: 42px !important;
  flex: 0 0 32px !important;
}
html body footer.store-footer-wrap button[data-modal-id="modal-value-tax"] img {
  width: 28px !important;
  height: 40px !important;
  object-fit: contain !important;
}
html body footer.store-footer-wrap a[href*="certificate-details/"] img {
  width: 56px !important;
  height: 40px !important;
  object-fit: contain !important;
}
html body footer.store-footer-wrap salla-payments {
  max-width: 100%;
}

/* V102 navigation area: complementary warmth and subtle motion */
html body #rsx-footer-v102 .rsx-footer-services { background: linear-gradient(95deg,#fff1eb,#fff8f4 50%,#fff1f3) !important; }
html body #rsx-footer-v102 .rsx-footer-service {
  padding: 10px;
  border: 1px solid #f4e0db;
  border-radius: 14px;
  background: rgba(255,255,255,.84);
}
html body #rsx-footer-v102 .rsx-footer-service-icon { background:#fff0e9 !important; border-color:#f7d9cf !important; }
html body #rsx-footer-v102 .rsx-footer-eyebrow { background:#fff0e8 !important; color:#b63646 !important; }
html body #rsx-footer-v102 .rsx-footer-brand-title { color:#263749 !important; }
html body #rsx-footer-v102 .rsx-footer-cta-primary { background:#cf253a !important; color:#fff !important; }
html body #rsx-footer-v102 .rsx-footer-cta-primary:hover { background:#a81e34 !important; }
html body #rsx-footer-v102 .rsx-footer-bottom-note { background:#fff9f5 !important; }
@media (min-width: 769px) {
  html body #rsx-footer-v102 .rsx-footer-group-title::after { background:#d67027; }
}
@media (max-width: 768px) {
  html body #rsx-footer-v102 .rsx-footer-group-title::after {
    background: transparent !important;
    color: #cf253a !important;
  }
}
html body #rsx-footer-v102 .rsx-footer-links a:hover { color:#cf253a !important; }
@media (max-width: 768px) {
  html body footer.store-footer-wrap .store-footer__inner > .container.without-apps-footer {
    padding: 24px 8px 20px !important;
    gap: 13px !important;
  }
  html body footer.store-footer-wrap .without-apps-footer .max-w-3xl > a {
    width: 78px; min-height: 73px; border-radius: 18px;
  }
  html body footer.store-footer-wrap .without-apps-footer .max-w-3xl > a img {
    max-width: 64px; max-height: 60px;
  }
  html body footer.store-footer-wrap .s-contacts-list {
    gap: 8px !important;
  }
  html body footer.store-footer-wrap .s-contacts-list .s-contacts-item {
    padding: 7px 10px !important;
    font-size: 11px !important;
  }
  html body footer.store-footer-wrap .footer-main-row {
    flex-direction: column !important;
    padding-block: 18px !important;
    gap: 17px !important;
  }
  html body footer.store-footer-wrap .footer-menu-list {
    border: 0 !important;
    padding: 0 !important;
    gap: 8px !important;
  }
  html body footer.store-footer-wrap .footer-menu-list a {
    font-size: 11px !important;
    padding: 9px 12px !important;
  }
  html body footer.store-footer-wrap .store-footer > .container.border-t {
    padding: 20px 0 34px !important;
    flex-direction: column !important;
    gap: 20px !important;
    text-align: center !important;
  }
  html body footer.store-footer-wrap .store-footer > .container.border-t > div:first-child {
    justify-content: center !important;
    gap: 10px 16px !important;
  }
  html body footer.store-footer-wrap salla-payments .s-payments-list {
    gap: 6px !important;
    max-width: 360px;
    margin-inline: auto;
  }
  html body #rsx-footer-v102 .rsx-footer-service { padding: 7px 4px; }
}
@media (prefers-reduced-motion: reduce) {
  html body footer.store-footer-wrap :is(a,.s-social-link) { transition: none !important; transform: none !important; }
}
`;
  const style = document.createElement("style");
  style.id = "rsx-footer-v103-native-style";
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
})();



/* RELAX SMART — LIGHTWEIGHT SAFE PATCH */
(function () {
  "use strict";

  if (window.__RS_LIGHT_PATCH__) return;
  window.__RS_LIGHT_PATCH__ = true;

  function init() {
    document.documentElement.classList.add(
      "rs-optimized"
    );

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      document.documentElement.classList.add(
        "rs-reduced-motion"
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();



/* RELAX SMART PERF TEST V118: V104 late footer links injection removed.
   Commerce, gifts, payment and the original Salla footer remain unchanged. */

/* RELAX SMART V112 — one-time relocation of Salla's existing WhatsApp button.
   Paste at END of custom JavaScript; no <script> tags. */
(function () {
  'use strict';
  function relocateWhatsApp() {
    var app = document.body;
    var widget = document.querySelector('.floating-contacts:has(a[href*="wa.me"])');
    if (!widget || !app) return false;
    if (widget.parentElement !== app) app.appendChild(widget);
    widget.classList.add('rs112-whatsapp');
    return true;
  }
  if (!relocateWhatsApp()) {
    document.addEventListener('DOMContentLoaded', relocateWhatsApp, {once:true});
    window.addEventListener('load', relocateWhatsApp, {once:true});
  }
})();


/* RELAX SMART V117 — Hide testimonial avatars */
(function () {
  "use strict";

  if (window.__rs117AvatarFix) return;
  window.__rs117AvatarFix = true;

  const selector =
    ".testimonials-slider .testimonial-card " +
    ".customer-info img.avatar";

  function hideAvatars(root) {
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll(selector).forEach(img => {
      img.remove();
    });
  }

  function scan(root) {
    hideAvatars(root);

    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll("*").forEach(el => {
      if (el.shadowRoot) {
        hideAvatars(el.shadowRoot);
      }
    });
  }

  function init() {
    scan(document);

    const observer = new MutationObserver(() => {
      scan(document);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
