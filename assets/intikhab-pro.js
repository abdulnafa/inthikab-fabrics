(() => {
  const normaliseEmptyArchiveRail = () => {
    if (!document.body.matches('.page-collection, .page-search')) return;

    document.querySelectorAll('.facets-vertical.page-width').forEach((archive) => {
      const productGrid = archive.querySelector(':scope > .product-grid-container');
      const sidebar = archive.querySelector(
        ':scope > div > .facets-wrapper, :scope > .facets-wrapper, :scope > div:not(.product-grid-container) #main-collection-filters.facets-wrapper, :scope > div:not(.product-grid-container) #main-search-filters.facets-wrapper'
      );
      const isEmpty = !sidebar || sidebar.classList.contains('facets-wrapper--no-filters');
      archive.classList.toggle('if-archive-no-filters', Boolean(productGrid && isEmpty));
    });
  };

  const initialiseArchiveSidebar = () => {
    if (!document.body.matches('.page-collection, .template-collection, .page-search')) return;

    const archive = document.querySelector('.facets-vertical.page-width');
    const grid = archive?.querySelector(':scope > .product-grid-container');
    const collection = grid?.querySelector(':scope > .collection') || grid;
    const host = collection || archive;
    if (!host || host.querySelector('.if-archive-categories') || archive?.querySelector('.if-archive-categories')) return;

    const categories = [
      ['All Fabrics', '/collections'],
      ['Winter Collection', '/collections/winter-collection'],
      ['Summer Collection', '/collections/premium-summer-collection'],
      ['Premium Cotton', '/collections/premium-cotton'],
      ['Cotton - Soft Finish', '/collections/cotton-soft-finish'],
      ['Wash & Wear', '/collections/wash-wear'],
      ['Boski', '/collections/boski']
    ];

    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const section = document.createElement('section');
    section.className = 'if-archive-categories';
    section.setAttribute('aria-labelledby', 'if-archive-categories-title');

    const title = document.createElement('h2');
    title.id = 'if-archive-categories-title';
    title.textContent = 'Categories';
    section.appendChild(title);

    const list = document.createElement('ul');
    categories.forEach(([label, href]) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      if ((href.replace(/\/$/, '') || '/') === currentPath) {
        link.setAttribute('aria-current', 'page');
      }
      item.appendChild(link);
      list.appendChild(item);
    });
    section.appendChild(list);
    if (collection) {
      section.classList.add('if-archive-categories--inline');
      const tabs = collection.querySelector(':scope > .cotton-category-tabs');
      if (tabs) {
        collection.insertBefore(section, tabs);
      } else {
        collection.prepend(section);
      }
    }
  };

  const normalisePrimaryNavigation = () => {
    const normalisePath = (value) => {
      try {
        const path = new URL(value, window.location.origin).pathname;
        return path.replace(/\/$/, '') || '/';
      } catch {
        return value;
      }
    };

    const currentPath = normalisePath(window.location.pathname);
    document.querySelectorAll('.header__inline-menu > ul > li, .menu-drawer__menu > li').forEach((item) => {
      const anchor = item.querySelector(':scope > a, :scope > details > summary a, :scope > details > summary');
      if (!anchor) return;
      const target = anchor.href || anchor.querySelector('a')?.href;
      if (!target) return;
      const isCurrent = normalisePath(target) === currentPath;
      anchor.toggleAttribute('aria-current', isCurrent);
      anchor.querySelectorAll('.header__active-menu-item').forEach((span) => {
        span.classList.toggle('header__active-menu-item', isCurrent);
      });
    });
  };

  const initialiseMobileProductCta = () => {
    if (!document.body.classList.contains('page-product')) return;
    if (document.querySelector('.if-mobile-atc')) return;

    const originalButton = document.querySelector('button[name="add"], .product-form__submit');
    if (!originalButton) return;

    const bar = document.createElement('div');
    bar.className = 'if-mobile-atc';
    bar.setAttribute('aria-hidden', 'true');
    bar.inert = true;

    const prompt = document.createElement('span');
    prompt.className = 'if-mobile-atc__prompt';
    prompt.textContent = 'Ready to order?';

    const action = document.createElement('button');
    action.className = 'if-mobile-atc__button';
    action.type = 'button';

    bar.append(prompt, action);
    document.body.appendChild(bar);

    const readButtonText = () => {
      const label = originalButton.querySelector('span')?.textContent || originalButton.textContent;
      return label.trim() || 'Add to cart';
    };

    const syncButton = () => {
      action.textContent = readButtonText();
      action.disabled = originalButton.disabled;
      action.setAttribute('aria-disabled', String(originalButton.disabled));
    };

    const cartDrawer = document.querySelector('cart-drawer');
    let ctaVisible = false;
    const setCtaVisibility = (visible) => {
      ctaVisible = Boolean(visible);
      bar.classList.toggle('is-visible', ctaVisible);
      bar.setAttribute('aria-hidden', String(!ctaVisible));
      bar.inert = !ctaVisible;
      action.tabIndex = ctaVisible ? 0 : -1;
    };

    const syncDrawer = () => {
      const obscured = Boolean(cartDrawer?.classList.contains('active'));
      bar.classList.toggle('is-obscured', obscured);
      setCtaVisibility(ctaVisible && !obscured);
    };

    const buttonObserver = new MutationObserver(syncButton);
    buttonObserver.observe(originalButton, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
      attributeFilter: ['disabled', 'class']
    });

    if (cartDrawer) {
      const drawerObserver = new MutationObserver(syncDrawer);
      drawerObserver.observe(cartDrawer, { attributes: true, attributeFilter: ['class'] });
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const shouldShow = !entry.isIntersecting;
        setCtaVisibility(shouldShow && !cartDrawer?.classList.contains('active'));
        document.body.classList.toggle('if-mobile-atc-visible', shouldShow);
      },
      { threshold: 0.15 }
    );
    visibilityObserver.observe(originalButton);

    action.addEventListener('click', () => {
      if (originalButton.disabled) return;
      originalButton.click();
    });

    syncButton();
    syncDrawer();
  };

  const initialiseCardViewActions = () => {
    if (!document.body.matches('.page-collection, .template-collection, .page-search, .page-list-collections')) return;

    document.querySelectorAll('.product-card-wrapper, .collection-card-wrapper').forEach((card) => {
      const media = card.querySelector('.card__inner');
      const link = card.querySelector('.card__media a[href], .card__heading a[href]');
      if (!media || !link || media.querySelector('.if-card-view')) return;

      const label = card.querySelector('.card__heading')?.textContent.trim() || 'product';
      const view = document.createElement('a');
      view.className = 'if-card-view';
      view.href = link.href;
      view.setAttribute('aria-label', `View ${label}`);
      view.innerHTML = '<svg viewBox=\'0 0 24 24\' aria-hidden=\'true\' focusable=\'false\'><path d=\'M5 12h13m-5-5 5 5-5 5\' fill=\'none\' stroke=\'currentColor\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.8\'/></svg>';
      media.appendChild(view);
    });
  };

  const runEnhancements = () => {
    normaliseEmptyArchiveRail();
    initialiseArchiveSidebar();
    normalisePrimaryNavigation();
    initialiseMobileProductCta();
    initialiseCardViewActions();
  };

  let enhancementTimer;
  const scheduleEnhancements = () => {
    window.clearTimeout(enhancementTimer);
    enhancementTimer = window.setTimeout(runEnhancements, 40);
  };

  const observeDynamicArchive = () => {
    if (!document.body || document.body.dataset.ifEnhancementObserver === 'true') return;

    const isRelevantNode = (node) => {
      if (!node || node.nodeType !== 1) return false;
      return node.matches('.facets-vertical.page-width, .product-grid-container, .collection')
        || Boolean(node.querySelector?.('.facets-vertical.page-width, .product-grid-container, .collection'));
    };

    const observer = new MutationObserver((records) => {
      if (!document.body.matches('.page-collection, .template-collection, .page-search')) return;
      const archive = document.querySelector('.facets-vertical.page-width');
      if (!archive) return;
      const relevant = records.some((record) => {
        const target = record.target?.nodeType === 1 ? record.target : record.target?.parentElement;
        return isRelevantNode(target)
          || [...record.addedNodes, ...record.removedNodes].some(isRelevantNode);
      });
      if (relevant || !archive.querySelector('.if-archive-categories')) scheduleEnhancements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.body.dataset.ifEnhancementObserver = 'true';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      runEnhancements();
      observeDynamicArchive();
    }, { once: true });
  } else {
    runEnhancements();
    observeDynamicArchive();
  }

  ['shopify:section:load', 'shopify:section:reorder', 'facets:render', 'facet:render'].forEach((eventName) => {
    document.addEventListener(eventName, scheduleEnhancements);
  });
})();
