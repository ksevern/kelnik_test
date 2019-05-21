function Catalog() {
  const config = {
    listSelector: '.j-catalog__list',
    itemSelector: '.j-catalog__item',
    cardSelector: '.card',
    sorter: document.querySelector('.j-sorter'),
    sortItemSelector: '.j-sort-item',
    sortActiveClass: 'sort-item--active',
    sortOrderDownClass: 'sort-item--down',
    sortOrderUpClass: 'sort-item--up',
    moreBtn: document.querySelector('.j-catalog__btn'),
    btnLoadClass: 'btn--loading',
    favClass: 'fav-btn',
    favActiveClass: 'fav-btn--active',
    favKey: 'fav',
    unfavKey: 'unfav'
  };

  const sortConfig = {
    type: 'price',
    order: 'down'
  };

  const moreConfig = {
    step: 1,
    url: 'static/json/data_'
  };

  const getSortConfig = () => {
    const sortElem = config.sorter.querySelector(`.${config.sortActiveClass}`);
    sortConfig.type = sortElem.getAttribute('data-sort-type');
    sortConfig.order = sortElem.classList.contains(config.sortOrderDownClass) ? 'down' : 'up';
  }

  const sortItems = () => {
    const parent = document.querySelector(config.listSelector);
    const items = document.querySelectorAll(config.itemSelector);

    Array.prototype.slice.call(items).map((item) => {
      return parent.removeChild(item);
    }).sort((elem1, elem2) => {
      const val1 = parseInt(elem1.querySelector(config.cardSelector).getAttribute(`data-${sortConfig.type}`).replace(/\s/g, ''));
      const val2 = parseInt(elem2.querySelector(config.cardSelector).getAttribute(`data-${sortConfig.type}`).replace(/\s/g, ''));

      if (val1 === val2) {
        return 0;
      } else if (val1 > val2) {
        return sortConfig.order === 'down' ? -1 : 1;
      } else {
        return sortConfig.order === 'down' ? 1 : -1;
      }
    }).forEach((item) => {
      parent.appendChild(item);
    });
  };

  const bindSortClick = () => {
    document.querySelectorAll(config.sortItemSelector).forEach((item) => {
      item.addEventListener('click', function (e) {
        e.preventDefault();

        if (this.classList.contains(config.sortActiveClass)) {
          if (this.classList.contains(config.sortOrderDownClass)) {
            this.classList.remove(config.sortOrderDownClass);
            this.classList.add(config.sortOrderUpClass);
          } else {
            this.classList.add(config.sortOrderDownClass);
            this.classList.remove(config.sortOrderUpClass);
          }
        } else {
          config.sorter.querySelector(`.${config.sortActiveClass}`).classList.remove(config.sortActiveClass);
          this.classList.add(config.sortActiveClass);
        }

        getSortConfig();
        sortItems();
      });
    });
  };

  const generateNewItems = (data) => {
    const parent = document.querySelector(config.listSelector);
    let favs = localStorage.getItem(config.favKey);
    favs = favs ? favs.split(';') : [];

    let unfavs = localStorage.getItem(config.unfavKey);
    unfavs = unfavs ? unfavs.split(';') : [];

    data.map((item) => {
      const elem = document.createElement('div');

      function getLabels(labels) {
        let labelsStr = '';

        if (labels) {
          labels.forEach((label) => {
            labelsStr += `<span class="label ${label.discount ? 'label--discount' : null}">${label.value}</span>`
          });
        }

        return labelsStr;
      }

      function checkFavStatus() {
        let favStatus = false;

        if (item.favourite && !(unfavs.indexOf(`${item.id}`) !== -1)) {
          favStatus = true;
        }

        if (favs.indexOf(`${item.id}`) !== -1) {
          favStatus = true;
        }

        return favStatus;
      }

      elem.classList.add('catalog__item', 'j-catalog__item');

      elem.innerHTML = `
        <div class="card card--status--${item.status}" data-id="${item.id}" data-price="${item.price}" data-rooms="${item.rooms}">
          <button class="card__fav fav-btn ${checkFavStatus() ? 'fav-btn--active' : null}" type="button">
            <svg class="fav-btn__icon" width="19" height="18">
              <use href="static/img/icons.svg#i-star"></use>
            </svg>
          </button><a class="card__body" href="${item.url}">
            <div class="card__labels">${getLabels(item.labels)}</div>
            <div class="card__content">
              <div class="card__img">
                <div class="card__img-inner" style="background-image: url(${item.back})"></div>
              </div>
              <h4 class="heading card__title">${item.title}</h4>
              <ul class="card__params params">
                <li class="params__item params__item--accent">${item.finish}</li>
                <li class="params__item"><span class="params__value">${item.area} м<sup>2</sup></span><span class="params__label">площадь</span></li>
                <li class="params__item"><span class="params__value">${item.floor}</span><span class="params__label">этаж</span></li>
              </ul>
              <div class="card__price">${divideNumber(item.price)} руб.</div>
            </div>
            <div class="card__status btn"></div></a>
        </div>
      `;

      return elem;
    }).forEach((item) => {
      parent.appendChild(item);
    });
  };

  const updateMoreButton = (data) => {
    if (!data.next) {
      getParent(config.moreBtn).removeChild(config.moreBtn);
      return;
    }

    config.moreBtn.innerHTML = `Показать еще ${data.total - document.querySelectorAll(config.itemSelector).length}`;
  };

  const bindMoreClick = () => {
    config.moreBtn.addEventListener('click', function (e) {
      e.preventDefault();

      this.classList.add(config.btnLoadClass);
      fetch(`${moreConfig.url}${moreConfig.step}.json`)
        .then((response) => response.json())
        .then((json) => {
          moreConfig.step += 1;
          this.classList.remove(config.btnLoadClass);
          generateNewItems(json.result);
          updateMoreButton(json);
          sortItems();
        })
        .catch(() => {
          this.classList.remove(config.btnLoadClass);
        });
    });
  };

  const checkFavoutiteStorage = () => {
    const items = document.querySelectorAll(config.cardSelector);

    let favs = localStorage.getItem(config.favKey);
    favs = favs ? favs.split(';') : [];

    let unfavs = localStorage.getItem(config.unfavKey);
    unfavs = unfavs ? unfavs.split(';') : [];

    Array.prototype.slice.call(items).forEach((item) => {
      const favBtn = item.querySelector(`.${config.favClass}`);

      if (favBtn.classList.contains(config.favActiveClass)) {
        if (unfavs.indexOf(item.getAttribute('data-id')) !== -1) {
          favBtn.classList.remove(config.favActiveClass);
        }
      } else {
        if (favs.indexOf(item.getAttribute('data-id')) !== -1) {
          favBtn.classList.add(config.favActiveClass);
        }
      }
    });
  };

  const bindFavouriteClick = () => {
    document.querySelector(config.listSelector).addEventListener('click', function(e) {
      if (e.target.classList.contains(config.favClass)) {
        const btn = e.target;
        const id = getParent(btn).getAttribute('data-id');

        let favs = localStorage.getItem(config.favKey);
        favs = favs ? favs.split(';') : [];

        let unfavs = localStorage.getItem(config.unfavKey);
        unfavs = unfavs ? unfavs.split(';') : [];

        if (btn.classList.contains(config.favActiveClass)) {
          if (favs.indexOf(id) !== -1) {
            favs.splice(favs.indexOf(id), 1);
          }

          if (!(unfavs.indexOf(id) !== -1)) {
            unfavs.push(id);
          }
        } else {
          if (unfavs.indexOf(id) !== -1) {
            unfavs.splice(unfavs.indexOf(id), 1);
          }

          if (!(favs.indexOf(id) !== -1)) {
            favs.push(id);
          }
        }

        favs = favs.join(';');
        unfavs = unfavs.join(';');
        localStorage.setItem(config.favKey, favs);
        localStorage.setItem(config.unfavKey, unfavs);
        btn.classList.toggle(config.favActiveClass);
      }
    });
  };

  this.init = () => {
    document.addEventListener('DOMContentLoaded', () => {
      getSortConfig();
      sortItems();
      bindSortClick();
      bindMoreClick();
      checkFavoutiteStorage();
      bindFavouriteClick();
    });
  };
}

const catalog = new Catalog();

catalog.init();
