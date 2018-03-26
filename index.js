function createStore(reducer, preloadedState) {
  if (typeof reducer !== 'function') {
    throw new Error('Expected `reducer` to be a function.');
  }

  if (typeof preloadedState === 'function') {
    console.warn(
      'Received function as `preloadedState`. ' +
      'State is undefined.'
    );
    preloadedState = undefined;
  }

  var currentState = preloadedState;
  var listeners = [];

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected `listener` to be a function.');
    }
    
    listeners.push(listener);
    
    return function unsubscribe() {
      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function dispatch(action) {
    if (action.type === undefined) {
      throw new Error('Expected `action` to have a `type` property.');
    }
    
    currentState = reducer(currentState, action);
    
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  }

  dispatch({ type: '__INIT__' });

  return {
    getState: getState,
    subscribe: subscribe,
    dispatch: dispatch,
  };
}
