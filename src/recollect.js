import React, { Component } from 'react';
import * as storage from './utils/storage';

// Lot's of globals here, break out into modules
let currentComponent;

let listeners = [];

let DEBUG = storage.getItem('DEBUG') || false;

if (DEBUG) {
  console.log('Debugging is on. Use `__RR__.debugOff()` to turn it off');
}

const isObject = item => item && typeof item === 'object' && item.constructor === Object;

const log = (...args) => {
  if (DEBUG) console.log(...args);
};

const addListener = (target, prop) => {
  if (!currentComponent) return;

  // Perhaps this could be more efficient than looping over every listener
  // for every get. BUT, it will loop ~1,000 items in 0.01ms so is very likely to be
  // nothing compared to updating the DOM
  const existingListener = listeners.some(listener => (
    listener.component === currentComponent &&
    listener.target === target &&
    listener.prop === prop
  ));

  if (!existingListener) {
    listeners.push({
      component: currentComponent,
      target,
      prop,
    });
  }
};

const manualListeners = [];

export const afterChange = cb => {
  manualListeners.push(cb);
};

const proxies = new WeakSet();

const createProxy = (obj, handler) => {
  const proxy = new Proxy(obj, handler);
  proxies.add(proxy);
  return proxy;
};

const isProxy = obj => proxies.has(obj);

const notifyListeners = (target, prop) => {
  listeners.forEach(listener => {
    if (listener.prop === prop && listener.target === target) {
      log(`Updating ${listener.component._displayName}`);

      listener.component.forceUpdate();
    }
  });

  manualListeners.forEach(cb => cb());
};

const proxyHandler = {
  get(target, prop) {
    if (Array.isArray(target)) {
      // If the TARGET is an array, e.g. if a component
      // checks someArray.length OR uses someArray.forEach() or .map() or .reduce(), etc.
      // Then it needs to be notified when the length changes
      addListener(target, 'length');
    } else {
      // otherwise, add a listener for whenever the target/prop is
      addListener(target, prop);
    }

    const result = Reflect.get(target, prop);

    // We need to recursively wrap arrays/objects in proxies
    if ((Array.isArray(result) || isObject(result)) && !isProxy(result)) {
      return createProxy(result, proxyHandler);
    } else {
      return result;
    }
  },

  has(target, prop) {
    // has() gets called when looping over an array. We don't care about that
    if (!Array.isArray(target)) {
      log('HAS target:', target);
      log('HAS prop:', prop);

      addListener(target, prop);
    }

    return Reflect.has(target, prop);
  },

  set(target, prop, value) {
    log('SET target:', target);
    log('SET prop:', prop);
    log('SET from:', target[prop]);
    log('SET to:', value);

    const result = Reflect.set(target, prop, value);

    notifyListeners(target, prop);

    return result;
  },

  deleteProperty(target, prop) {
    log('DELETE target:', target);
    log('DELETE prop:', prop);

    const result = Reflect.deleteProperty(target, prop);

    notifyListeners(target, prop);

    return result;
  }
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

export const register = (WrappedComponent) => {
  return class extends Component {
    _displayName = `Recollect(${WrappedComponent.displayName || WrappedComponent.name})`;

    // When React renders a parent component, it will naturally try to render its children.
    // We never want it to do this, because we already know which children to update
    // and component.forceUpdate() will bypass shouldComponentUpdate
    shouldComponentUpdate = () => false;

    componentDidMount() {
      log(`${this._displayName}.componentDidMount`);
      stopRecordingGetsForComponent();
    }

    componentWillUnmount = () => {
      log(`${this._displayName}.componentWillUnmount`);
      removeListenersForComponent(this);
    };

    render() {
      startRecordingGetsForComponent(this);

      return <WrappedComponent {...this.props} />
    }
  }
};

export const store = createProxy({}, proxyHandler);

window.__RR__ = {
  getStore: () => store,
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
