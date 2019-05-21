/**
 * Returns parent node
 *
 * @param {object} el Child node
 * @return {object} Parent node
 */
const getParent = el => el.parentElement || el.parentNode;

/**
 * Returns ancestor having class name
 *
 * @param {object} el Child node
 * @param {string} cls Class name
 * @return {object} Ancestor
 */
function getAncestor(el, cls) {
  let element = el;

  while (!element.classList.contains(cls)) {
    element = element.parentElement;

    if (!element) break;
  }

  return element;
}

/**
 * Returns siblings nodes
 *
 * @param {object} elem Start element
 * @return {array} siblings Siblings array
 */
function getSiblings(elem) {
  const siblings = [];
  let sibling = elem;

  while (sibling.previousSibling) {
    sibling = sibling.previousSibling;

    if (sibling.nodeType === 1) {
      siblings.push(sibling);
    }
  }

  sibling = elem;

  while (sibling.nextSibling) {
    sibling = sibling.nextSibling;

    if (sibling.nodeType === 1) {
      siblings.push(sibling);
    }
  }

  return siblings;
}

/**
 * Returns divided number
 */
function divideNumber(x, delimiter) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter || ' ');
}