function layoutSwitcher() {
  Array.from(document.querySelectorAll(".wblistgridbtn")).forEach(link => {
    link.addEventListener('click', toggle);
    link.addEventListener('keydown', handleKeyDown);
  });
};
function handleKeyDown(event){
  if (event.keyCode === 13) {
    toggle(event);
  }
}
function toggle(event){
  Array.from(document.querySelectorAll(".wblistgridbtn")).forEach(e => e.classList.remove('active'));
  event.currentTarget.classList.add('active');
  if(event.currentTarget.classList.contains('listv')){
    document.getElementById('ProductGridContainer').classList.add('product-list');
    document.getElementById('ProductGridContainer').classList.add('product-list--premium');
    document.getElementById('ProductGridContainer').classList.remove('product-grid');
  }else if(event.currentTarget.classList.contains('gridv')){
    document.getElementById('ProductGridContainer').classList.add('product-grid');
    document.getElementById('ProductGridContainer').classList.remove('product-list');
    document.getElementById('ProductGridContainer').classList.remove('product-list--premium');
  }
}
document.addEventListener("shopify:section:load", layoutSwitcher);
layoutSwitcher();

function initExclusiveHomeMediaCarousels() {
  document.querySelectorAll('.sponsored-section--exclusive-home .wbproduct-container').forEach(card => {
    if (card.dataset.homeCarouselReady === 'true') return;

    const mediaRoot = card.querySelector('.card__media');
    if (!mediaRoot) return;

    const mediaItems = Array.from(mediaRoot.querySelectorAll(':scope > .product__media-item'));
    if (mediaItems.length < 2) return;

    card.dataset.homeCarouselReady = 'true';
    let activeIndex = 0;
    let timerId = null;

    const dots = document.createElement('div');
    dots.className = 'homepage-media-carousel__dots';
    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', 'Product image gallery');

    const activate = index => {
      activeIndex = (index + mediaItems.length) % mediaItems.length;
      mediaItems.forEach((item, itemIndex) => {
        const active = itemIndex === activeIndex;
        item.classList.toggle('is-carousel-active', active);
        item.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dots.querySelectorAll('.homepage-media-carousel__dot').forEach((dot, dotIndex) => {
        const active = dotIndex === activeIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    };

    mediaItems.forEach((item, itemIndex) => {
      item.setAttribute('aria-hidden', itemIndex === 0 ? 'false' : 'true');

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'homepage-media-carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Show product image ${itemIndex + 1}`);
      dot.addEventListener('click', () => {
        activate(itemIndex);
        start();
      });
      dots.appendChild(dot);
    });

    mediaRoot.appendChild(dots);

    const stop = () => {
      if (timerId) window.clearInterval(timerId);
      timerId = null;
    };

    const start = () => {
      stop();
      timerId = window.setInterval(() => activate(activeIndex + 1), 4200);
    };

    card.addEventListener('mouseenter', stop);
    card.addEventListener('mouseleave', start);
    card.addEventListener('focusin', stop);
    card.addEventListener('focusout', event => {
      if (!card.contains(event.relatedTarget)) start();
    });

    activate(0);
    start();
  });
}

document.addEventListener('DOMContentLoaded', initExclusiveHomeMediaCarousels);
document.addEventListener('shopify:section:load', initExclusiveHomeMediaCarousels);
initExclusiveHomeMediaCarousels();

function initArchiveMediaCarousels() {
  document.querySelectorAll('.page-collection .archive-products--premium .wbproduct-container').forEach(card => {
    if (card.dataset.archiveCarouselReady === 'true') return;

    const mediaRoot = card.querySelector('.card__media');
    if (!mediaRoot) return;

    const mediaItems = Array.from(mediaRoot.querySelectorAll(':scope > .product__media-item'));
    if (mediaItems.length < 2) return;

    card.dataset.archiveCarouselReady = 'true';
    let activeIndex = 0;
    let timerId = null;

    const dots = document.createElement('div');
    dots.className = 'archive-media-carousel__dots';
    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', 'Product image gallery');

    const activate = index => {
      activeIndex = (index + mediaItems.length) % mediaItems.length;
      mediaItems.forEach((item, itemIndex) => {
        const active = itemIndex === activeIndex;
        item.classList.toggle('is-carousel-active', active);
        item.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dots.querySelectorAll('.archive-media-carousel__dot').forEach((dot, dotIndex) => {
        const active = dotIndex === activeIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    };

    mediaItems.forEach((item, itemIndex) => {
      item.setAttribute('aria-hidden', itemIndex === 0 ? 'false' : 'true');

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'archive-media-carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Show product image ${itemIndex + 1}`);
      dot.addEventListener('click', () => {
        activate(itemIndex);
        start();
      });
      dots.appendChild(dot);
    });

    mediaRoot.appendChild(dots);

    const stop = () => {
      if (timerId) window.clearInterval(timerId);
      timerId = null;
    };

    const start = () => {
      stop();
      timerId = window.setInterval(() => activate(activeIndex + 1), 4500);
    };

    card.addEventListener('mouseenter', stop);
    card.addEventListener('mouseleave', start);
    card.addEventListener('focusin', stop);
    card.addEventListener('focusout', event => {
      if (!card.contains(event.relatedTarget)) start();
    });

    activate(0);
    start();
  });
}

document.addEventListener('DOMContentLoaded', initArchiveMediaCarousels);
document.addEventListener('shopify:section:load', initArchiveMediaCarousels);
document.addEventListener('shopify:section:reorder', initArchiveMediaCarousels);
initArchiveMediaCarousels();

const archiveGrid = document.getElementById('ProductGridContainer');
if (archiveGrid && window.MutationObserver) {
  new MutationObserver(() => initArchiveMediaCarousels()).observe(archiveGrid, { childList: true, subtree: true });
}

// on scroll play video
window.addEventListener('load', videoScroll);
window.addEventListener('scroll', videoScroll);
function videoScroll() {
  if ( document.querySelectorAll('video[autoplay]').length > 0) {
    var windowHeight = window.innerHeight, videoEl = document.querySelectorAll('video[autoplay]');
    for (var i = 0; i < videoEl.length; i++) {
      var thisVideoEl = videoEl[i],
          videoHeight = thisVideoEl.clientHeight,
          videoClientRect = thisVideoEl.getBoundingClientRect().top;
      if ( videoClientRect <= ( (windowHeight) - (videoHeight*.5) ) && videoClientRect >= ( 0 - ( videoHeight*.5 ) ) ) {
        thisVideoEl.play();
      } else {
        thisVideoEl.pause();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const countdowns = [];

  document.querySelectorAll('.countd_all').forEach(section => {
    const targetDate = new Date(section.dataset.date).getTime();

    countdowns.push({
      section,
      targetDate,
      days: section.querySelector('.wb_cdays'),
      hours: section.querySelector('.wb_chours'),
      minutes: section.querySelector('.wb_cminutes'),
      seconds: section.querySelector('.wb_cseconds')
    });
  });

  if (!countdowns.length) return;

  let timerStarted = false;
  let timerId = null;

  function updateCountdowns() {
    const now = Date.now();

    countdowns.forEach(item => {
      if (isNaN(item.targetDate)) return;

      const distance = item.targetDate - now;

      if (distance <= 0) {
        item.days && (item.days.textContent = '00');
        item.hours && (item.hours.textContent = '00');
        item.minutes && (item.minutes.textContent = '00');
        item.seconds && (item.seconds.textContent = '00');
        return;
      }

      item.days && (item.days.textContent = String(Math.floor(distance / 86400000)).padStart(2, '0'));
      item.hours && (item.hours.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0'));
      item.minutes && (item.minutes.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0'));
      item.seconds && (item.seconds.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0'));
    });

    timerId = setTimeout(updateCountdowns, 1000);
  }

  function startCountdown() {
    if (timerStarted) return;

    timerStarted = true;
    updateCountdowns();
  }

  // Observe all countdown sections instead of only the first one
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.disconnect();

        if (window.requestIdleCallback) {
          requestIdleCallback(startCountdown);
        } else {
          setTimeout(startCountdown, 200);
        }
      }
    });
  }, {
    rootMargin: '200px'
  });

  countdowns.forEach(item => {
    observer.observe(item.section);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(timerId);
      timerStarted = false;
    } else {
      const hasVisibleCountdown = countdowns.some(item => {
        const rect = item.section.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });

      if (hasVisibleCountdown) {
        startCountdown();
      }
    }
  });
});
