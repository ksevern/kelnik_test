function InputEmail() {
  const config = {
    elemClass: 'j-inp',
    input: document.querySelector('.j-inp__field'),
    className: 'inp--error',
    msgClass: 'inp__message',
    error: 'Введите корректный email',
    pattern: /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i
  };

  const checkOnBlur = (e) => {
    const val = e.target.value;
    const parent = getAncestor(e.target, config.elemClass);

    if (!val || val.trim() === '' || val.search(config.pattern) == 0) {
      parent.classList.remove(config.className);
    } else {
      parent.classList.add(config.className);

      if (!parent.querySelector(config.msgClass)) {
        const msg = document.createElement('span');

        msg.classList.add(config.msgClass);
        msg.innerHTML = config.error;

        parent.appendChild(msg);
      }
    }
  };

  this.init = () => {
    config.input.onblur = checkOnBlur;

    config.input.oninput = (e) => {
      const parent = getAncestor(e.target, config.elemClass);

      if (parent.classList.contains(config.className)) {
        parent.classList.remove(config.className);
        parent.removeChild(parent.querySelector(`.${config.msgClass}`));
      }
    }
  };
};

const inpEmail = new InputEmail();

inpEmail.init();
