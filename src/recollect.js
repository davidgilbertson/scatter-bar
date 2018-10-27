import React, { Component } from 'react';
import * as storage from './utils/storage';

let currentCaller;

const rawStore = {};

let listeners = [];

let DEBUG = storage.getItem('DEBUG') || false;

if (DEBUG) {
  console.log('Debugging is on. Use `__RR__.debugOff()` to turn it off');
}

const log = (...args) => {
  if (DEBUG) console.log(...args);
};

// TODO (davidg): this is not a 100% test for an object
const isObject = (item) => (
  typeof item === 'object' &&
  !Array.isArray(item) &&
  item !== null &&
  item !== true &&
  item !== false
);

const addListener = newListener => {
  if (!newListener.caller) return;

  // TODO (davidg): think about listeners shape
  // This is looped over potentially thousands of times in a render cycle, X thousands of entries
  // If it was an object, with caller as a prop, then prop as a prop, the an array of targets,
  // I could minimise the looping.
  // TODO (davidg): maybe just allow duplicates (within a caller). For one set() there's thousands
  // of get()s, so filtering out duplicates in a set should be faster.
  console.time(`Checked ${listeners.length} listeners`);
  const existingListener = listeners.some(listener => (
    listener.caller === newListener.caller &&
    listener.target === newListener.target &&
    listener.prop === newListener.prop
  ));
  console.timeEnd(`Checked ${listeners.length} listeners`);

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

    // If the RESULT is an array, then we want a listener in case the whole array is replaced
    if (Array.isArray(result)) {
      addListener({
        caller: currentCaller,
        target,
        prop,
      });

      return new Proxy(result, proxyHandler);
    }

    // If the TARGET is an array...
    if (Array.isArray(target)) {
      // If a component checks someArray.length OR a component uses someArray.forEach() or .map() or .reduce() etc
      // Then they need to be notified when the length changes

      addListener({
        caller: currentCaller,
        target,
        prop: 'length', // essentially subscribing this caller to any change in the array length
      });

      return isObject(result)
        ? new Proxy(result, proxyHandler)
        :result;
    }

    if (isObject(result)) {
      addListener({
        caller: currentCaller,
        target,
        prop,
      });
      return new Proxy(result, proxyHandler);
    }

    // The property isn't an array or an object
    addListener({
      caller: currentCaller,
      target,
      prop,
    });

    return result;
  },

  // TODO (davidg): handle the syntax: "'prop' in object" with trap

  set(target, prop, value) {
    target[prop] = value;

    const updatedListeners = [];

    listeners.forEach(listener => {
      if (
        listener.prop === prop &&
        listener.target === target &&
        !updatedListeners.includes(listener.caller)
      ) {
        // RITMO check this logic. When could one set() have two matching listeners?
        updatedListeners.push(listener.caller);
        log(`Updating ${listener.caller._displayName}`);

        listener.caller.forceUpdate();
      }
    });

    updatedListeners.length = 0;

    manualListeners.forEach(cb => cb());

    return true;
  },
};

const removeListenersForComponent = caller => {
  listeners = listeners.filter(listener => listener.caller !== caller);
};

const startRecordingGetsForComponent = component => {
  removeListenersForComponent(component);
  currentCaller = component;
};

const stopRecordingGetsForComponent = () => {
  currentCaller = null;
};

export const register = (WrappedComponent, options = { frozen: true }) => {
  return class extends Component {
    _displayName = `Registered(${WrappedComponent.displayName || WrappedComponent.name})`;

    // When React renders a parent component, it will naturally try to render its children.
    // We never want it to do this, because we already know which children to update
    // and component.forceUpdate() will bypass shouldComponentUpdate
    shouldComponentUpdate = () => !options.frozen;

    componentDidMount() {
      log(`${this._displayName}.componentDidMount`);
      // currentCaller = null;
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
