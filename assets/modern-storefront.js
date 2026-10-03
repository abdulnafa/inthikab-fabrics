/* Intikhab Fabrics modern storefront interactions. */
(function () {
  'use strict';

  function closeMobileNavigation(header) {
    if (!header) return;
    var toggle = header.querySelector('[data-modern-menu-toggle]');
    var nav = header.querySelector('[data-modern-nav]');
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('if-modern-menu-open');
  }

  function initHeader(header) {
    if (!header || header.dataset.modernHeaderReady === 'true') return;
    header.dataset.modernHeaderReady = 'true';
    var toggle = header.querySelector('[data-modern-menu-toggle]');
    var nav = header.querySelector('[data-modern-nav]');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('if-modern-menu-open', !isOpen);
    });

    document.addEventListener('click', function (event) {
      if (!header.contains(event.target)) closeMobileNavigation(header);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 989) closeMobileNavigation(header);
    });
  }

  function openNativeMobileFilters(root) {
    var wrapper = root && root.querySelector('.mobile-facets__wrapper');
    var summary = wrapper && wrapper.querySelector('summary');
    if (summary) summary.click();
  }

  function initModernFilterButtons(root) {
    if (!root || root.dataset.modernFiltersReady === 'true') return;
    root.dataset.modernFiltersReady = 'true';
    var openButton = root.querySelector('[data-modern-filter-open]');
    var closeButton = root.querySelector('[data-modern-filter-close]');
    var details = root.querySelector('.mobile-facets__wrapper details');
    if (details) {
      details.addEventListener('toggle', function () {
        if (openButton) openButton.setAttribute('aria-expanded', details.open ? 'true' : 'false');
      });
    }
    if (openButton) {
      openButton.addEventListener('click', function () {
        openNativeMobileFilters(root);
        openButton.setAttribute('aria-expanded', 'true');
      });
    }
    if (closeButton) {
      closeButton.addEventListener('click', function () {
        var openSummary = root.querySelector('.mobile-facets__wrapper details[open] > summary');
        if (openSummary) openSummary.click();
        if (openButton) openButton.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function updateCartCount(cartData) {
    if (!cartData || typeof cartData.item_count === 'undefined') return;
    document.querySelectorAll('[data-modern-cart-count]').forEach(function (element) {
      element.textContent = cartData.item_count;
      element.hidden = cartData.item_count < 1;
    });
  }

  /*
   * The legacy cart drawer asks the Section Rendering API for a
   * cart-icon-bubble section. The modern header owns that markup, so letting
   * the legacy renderer replace it would nest an old icon inside the new
   * anchor. Cart updates already publish the fresh item count; keep the drawer
   * refresh focused on the drawer itself.
   */
  function patchCartDrawerSections() {
    if (!window.customElements || !customElements.get) return;
    ['cart-drawer', 'cart-drawer-items'].forEach(function (elementName) {
      var elementClass = customElements.get(elementName);
      if (!elementClass || !elementClass.prototype || elementClass.prototype.modernSectionsPatched) return;
      var original = elementClass.prototype.getSectionsToRender;
      if (typeof original !== 'function') return;
      elementClass.prototype.getSectionsToRender = function () {
        return original.call(this).filter(function (section) {
          return section.id !== 'cart-icon-bubble';
        });
      };
      elementClass.prototype.modernSectionsPatched = true;
    });
  }

  function initCartDrawerPatch() {
    if (!document.querySelector('[data-modern-header]')) return;
    patchCartDrawerSections();
    if (window.customElements && customElements.whenDefined) {
      customElements.whenDefined('cart-drawer').then(patchCartDrawerSections);
      customElements.whenDefined('cart-drawer-items').then(patchCartDrawerSections);
    }
  }

  function init() {
    document.querySelectorAll('[data-modern-header]').forEach(initHeader);
    document.querySelectorAll('[data-modern-collection], .if-modern-search').forEach(initModernFilterButtons);

    if (window.PUB_SUB_EVENTS && typeof subscribe === 'function') {
      subscribe(PUB_SUB_EVENTS.cartUpdate, function (event) {
        updateCartCount(event && event.cartData);
      });
    }
    initCartDrawerPatch();

    document.addEventListener('keyup', function (event) {
      if (event.key === 'Escape') {
        document.querySelectorAll('[data-modern-header]').forEach(closeMobileNavigation);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
