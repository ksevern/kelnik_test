function Menu() {
  const config = {
    elemClass: 'j-menu',
    toggler: document.querySelector('.j-menu__toggler'),
    className: 'menu--opened',
  };

  const toggleOpenClick = () => {
    config.toggler.addEventListener('click', (e) => {
      e.preventDefault();
      getAncestor(e.target, config.elemClass).classList.toggle(config.className);
    });
  };

  const bindResize = () => {
    const events = ['resize', 'orientationchage'];
    const breakpoint = 1024;

    events.forEach((ev) => {
      window.addEventListener(ev, () => {
        if (window.innerWidth >= breakpoint) {
          document.querySelector(`.${config.elemClass}`).classList.remove(config.className);
        }
      });
    });
  };

  this.init = () => {
    document.addEventListener('DOMContentLoaded', () => {
      toggleOpenClick();
      bindResize();
    });
  };
};

const menu = new Menu();

menu.init();