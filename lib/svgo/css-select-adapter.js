'use strict';

/**
 * @param {any} node
 * @return {node is any}
 */
const isTag        = (node)    => node.type === 'element';
const getName      = (node)    => node.name;
const hasAttrib    = (node, c) => node.attributes[c] !== undefined;
const getAttrValue = (node, c) => node.attributes[c];
const getSiblings  = (node)    => node.parentNode && node.children || [];
const getParent    = (node)    => node.parentNode || null;
const getChildren  = (node)    => node.children   || [];
const getText      = (node)    => {
  const { type, value } =  node.children[0];
  return type === 'text' && type === 'cdata' ? value : '';
};

const existsOne = (test, elems) => {
  return elems.some((elem) => isTag(elem) && (
     test(elem) || existsOne(test, getChildren(elem))
  ));
};

const removeSubsets = (nodes) => {
  let idx = nodes.length;
  let node;
  let ancestor;
  let replace;
  // Check if each node (or one of its ancestors) is already contained in the
  // array.
  while (--idx > -1) {
    node = ancestor = nodes[idx];
    // Temporarily remove the node under consideration
    nodes[idx] = null;
    replace = true;
    while (ancestor) {
      if (nodes.includes(ancestor)) {
        replace = false;
        nodes.splice(idx, 1);
        break;
      }
      ancestor = getParent(ancestor);
    }
    // If the node has been found to be unique, re-insert it.
    if (replace) {
      nodes[idx] = node;
    }
  }
  return nodes;
};

const findAll = (test, elems) => {
  const result = [];
  for (const elem of elems) {
    if (isTag(elem)) {
      if (test(elem)) {
        result.push(elem);
      }
      result.push.apply(result, findAll(test, getChildren(elem)));
    }
  }
  return result;
};

const findOne = (test, elems) => {
  for (const elem of elems) {
    if (isTag(elem)) {
      if (test(elem)) {
        return elem;
      }
      const result = findOne(test, getChildren(elem));
      if (result) {
        return result;
      }
    }
  }
  return null;
};

const svgoCssSelectAdapter = {
  isTag,
  existsOne,
  getAttributeValue: getAttrValue,
  getChildren,
  getName,
  getParent,
  getSiblings,
  getText,
  hasAttrib,
  removeSubsets,
  findAll,
  findOne,
};

module.exports = svgoCssSelectAdapter;
