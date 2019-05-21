function UpBtn() {
  let timeout = null;

  const config = {
    elem: document.querySelector('.j-up-btn'),
    className: 'up-btn--hidden',
    scrollSpeed: 600
  };

  const checkScrollTop = () => {
    if (window.pageYOffset > 0) {
      config.elem.classList.remove(config.className);
    } else {
      config.elem.classList.add(config.className);
    }
  };

  const bindResizeWindow = () => {
    const events = ['resize', 'orientationchage'];

    events.forEach((ev) => {
      window.addEventListener(ev, checkScrollTop);
    });
  };

  const scrollTop = () => {
    const top = window.pageYOffset;

    if (top > 0) {
      window.scrollTo(0, Math.floor(top/1.5));
      timeout = setTimeout(scrollTop, 30);
    } else {
      clearTimeout(timeout);
    }

    return false;
  }

  const toggleClick = () => {
    config.elem.addEventListener('click', (e) => {
      e.preventDefault();
      clearTimeout(timeout);
      scrollTop();
    });
  };

  this.init = () => {
    document.addEventListener('DOMContentLoaded', () => {
      checkScrollTop();
      window.onscroll = checkScrollTop;
      bindResizeWindow();
      toggleClick();
    });
  };
};

const upBtn = new UpBtn();

upBtn.init();