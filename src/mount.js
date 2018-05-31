import Component from './component/Component';
import appendChild from './r/appendChild';
import fuseDom from './r/utils/fuseDom';

/**
 * @param {Component} component
 * @param {string} id
 * @param {boolean} isSvg
 * @param {number} depth
 * @returns {HTMLElement|Node}
 */
const mount = (component, id, isSvg, depth = 0) => {
  const slot = typeof id === 'string' ? document.getElementById(id) : id;
  isSvg = isSvg || slot instanceof SVGElement;
  const rendered =
    (component instanceof Component || component.render) ? component.render(isSvg) : component;

  if (Array.isArray(rendered)) {
    for (var i = 0; i < rendered.length; i++) {
      mount(rendered[i], slot, isSvg, depth);
    }
  } else {
    appendChild(slot, isSvg, depth)(rendered);
  }

  if (typeof slot.destroy !== 'function') {
    slot.destroy = () => {
      for (var i = 0; i < rendered.length; i++) {
        fuseDom.destroy(rendered[i]);
      }
    }
  }

  if (typeof component.mount === 'function') component.mount();

  return slot;
}

export default mount;