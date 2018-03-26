/** Library **/

function createStore(reducer, preloadedState) {
  if (typeof reducer !== 'function') {
    throw new Error('Expected `reducer` to be a function.');
  }

  if (typeof preloadedState === 'function') {
    console.warn(
      'Received function as `preloadedState`.' +
      'State is undefined.'
    );
    preloadedState = undefined;
  }

  var currentState = preloadedState;
  var listeners = [];

  function getState() {
    return currentState;
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

  dispatch({ type: '__INIT__' });

  return {
    getState: getState,
    dispatch: dispatch,
    subscribe: subscribe
  };
}

/** Case **/

var initialState = {
  counter: 0,
};

var actionTypes = {
  increment: 'increment',
  decrement: 'decrement',
};

function incrementAction() {
  return {
    type: actionTypes.increment
  };
}

function decrementAction() {
  return {
    type: actionTypes.decrement
  };
}

function incrementHandler(state, action) {
  var nextState = Object.assign({}, state);
  nextState.counter += 1;
  return nextState;
}

function decrementHandler(state, action) {
  var nextState = Object.assign({}, state);
  nextState.counter -= 1;
  return nextState;
}

function counterReducer(state, action) {
  switch (action.type) {
    case actionTypes.increment:
      return incrementHandler(state, action);
    case actionTypes.decrement:
      return decrementHandler(state, action);
    default:
      return state;
  }
}

/** Test **/

var buttonDecrement = document.getElementById('counter-decrement');
var buttonIncrement = document.getElementById('counter-increment');
var spanValue = document.getElementById('counter-value');

function setSpanValue(value) {
  spanValue.innerHTML = value;
}

var store = createStore(counterReducer, initialState);

setSpanValue(store.getState().counter);

store.subscribe(function () {
  setSpanValue(store.getState().counter);
});

buttonIncrement.addEventListener('click', function () {
  store.dispatch(incrementAction());
});

buttonDecrement.addEventListener('click', function () {
  store.dispatch(decrementAction());
});
