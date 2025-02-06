import "./styles.css";

export const useReducer = (reducer, initialValue) => {
  let state = initialValue;
  const listeners = new Set();

  const dispatch = (action) => {
    if (typeof state === "object")
      state = Object.assign(state, reducer(state, action));
    else state = reducer(state, action);
    listeners.forEach((listener) => listener(state));
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return [dispatch, subscribe];
};

const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
};
const initialValue = { count: 0 };

const [dispatch, subscribe] = useReducer(reducer, initialValue);

const ui = () => {
  document.getElementById("app").innerHTML = `
    <h1>Counter: <b id="counter">0</b></h1>
    <button id="increment">Increment</button>
    <button id="decrement">Decrement</button>
    <button id="reset">Reset</button>
  `;
};
ui();
const buttonEvents = (dispatch, buttons) => {
  buttons.map((button) =>
    document.getElementById(button).addEventListener("click", () => {
      dispatch({ type: button.replace(/\d+/g, "") });
    })
  );
};
buttonEvents(dispatch, ["increment", "decrement", "reset"]);

const counterElement = document.getElementById("counter");

subscribe((newState) => {
  counterElement.textContent = newState.count;
});
