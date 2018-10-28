import React, { Component } from 'react';
import * as storage from './utils/storage';
import isObject from './utils/isObject';

// Lot's of globals here, TODO break out into modules
const rawStore = {};

let currentComponent;

let listeners = [];

let DEBUG = storage.getItem('DEBUG') || false;

if (DEBUG) {
  console.log('Debugging is on. Use `__RR__.debugOff()` to turn it off');
}

const log = (...args) => {
  if (DEBUG) console.log(...args);
};

const addListener = newListener => {
  if (!newListener.component) return;

  // Perhaps this could be more efficient than looping over every listener
  // for every get. BUT, it will loop ~1,000 items in 0.01ms so is very likely to be
  // nothing compared to updating the DOM
  const existingListener = listeners.some(listener => (
    listener.component === newListener.component &&
    listener.target === newListener.target &&
    listener.prop === newListener.prop
  ));

  if (!existingListener) {
    listeners.push(newListener);
  }
};

const manualListeners = [];
export const afterChange = cb => {
  manualListeners.push(cb);
};

const proxyHandler = {
  get(target, prop) {
    const result = target[prop];

    let returnObject;

    if (Array.isArray(result) || isObject(result)) {
      // We need to recursively wrap arrays/objects in proxies
      returnObject = new Proxy(result, proxyHandler);
    } else {
      returnObject = result;
    }

    if (Array.isArray(target)) {
      // If the TARGET is an array, e.g. if a component
      // checks someArray.length OR uses someArray.forEach() or .map() or .reduce(), etc.
      // Then it needs to be notified when the length changes

      addListener({
        component: currentComponent,
        target,
        prop: 'length',
      });
    } else {
      // otherwise, add a listener for whenever the target/prop is
      addListener({
        component: currentComponent,
        target,
        prop,
      });
    }

    return returnObject;
  },

  // TODO (davidg): handle the syntax: "'prop' in object" with trap

  set(target, prop, value) {
    target[prop] = value;

    listeners.forEach(listener => {
      if (listener.prop === prop && listener.target === target) {
        log(`Updating ${listener.component._displayName}`);

        listener.component.forceUpdate();
      }
    });

    manualListeners.forEach(cb => cb());

    return true;
  },
};

const removeListenersForComponent = component => {
  listeners = listeners.filter(listener => listener.component !== component);
};

const startRecordingGetsForComponent = component => {
  removeListenersForComponent(component);
  currentComponent = component;
};

const stopRecordingGetsForComponent = () => {
  currentComponent = null;
};

export const register = (WrappedComponent, options = { frozen: true }) => {
  return class extends Component {
    _displayName = `Recollect(${WrappedComponent.displayName || WrappedComponent.name})`;

    // When React renders a parent component, it will naturally try to render its children.
    // We never want it to do this, because we already know which children to update
    // and component.forceUpdate() will bypass shouldComponentUpdate
    shouldComponentUpdate = () => !options.frozen;

    componentDidMount() {
      log(`${this._displayName}.componentDidMount`);
      stopRecordingGetsForComponent();
    }

    componentWillUnmount = () => {
      log(`${this._displayName}.componentWillUnmount`);
      removeListenersForComponent(this);
    };

    render() {
      log(`${this._displayName}.render`);
      startRecordingGetsForComponent(this);

      return <WrappedComponent {...this.props} />
    }
  }
};

export const store = new Proxy(rawStore, proxyHandler);

window.__RR__ = {
  store,
  getStore: () => rawStore,
  getListeners: () => listeners,
  debugOn: () => {
    DEBUG = true;
    storage.setItem('DEBUG', DEBUG);
  },
  debugOff: () => {
    DEBUG = false;
    storage.setItem('DEBUG', DEBUG);
  },
};
