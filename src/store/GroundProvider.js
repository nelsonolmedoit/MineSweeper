import { useReducer } from "react";
import GroundContext from "./ground-context";

const defaultGroundState = {
  groundState: [],
  groundProximity: [],
  lastPlayX: 0,
  lastPlayY: 0,
};

const groundReducer = (state, action) => {
  if (action.type === "SET_GROUND_STATE") {
    const udpatedState = { ...state, groundState: action.groundState };

    return udpatedState;
  }
  if (action.type === "SET_GROUND_PROXIMITY") {
    const udpatedState = { ...state, groundProximity: action.groundProximity };

    return udpatedState;
  }
  if (action.type === "SET_LAST_PLAY") {
    const udpatedState = { ...state };
    udpatedState.lastPlayX = action.lastPlay.x;
    udpatedState.lastPlayY = action.lastPlay.y;

    return udpatedState;
  }

  return defaultGroundState;
};

const GroundProvider = (props) => {
  const [groundState, dispatchGroundAction] = useReducer(
    groundReducer,
    defaultGroundState
  );

  const setGroundState = (ground) => {
    dispatchGroundAction({ type: "SET_GROUND_STATE", groundState: ground });
  };

  const setGroundProximity = (ground) => {
    dispatchGroundAction({
      type: "SET_GROUND_PROXIMITY",
      groundProximity: ground,
    });
  };

  const setLastPlay = (item) => {
    dispatchGroundAction({ type: "SET_LAST_PLAY", lastPlay: item });
  };

  const groundContext = {
    groundState: groundState.groundState,
    groundProximity: groundState.groundProximity,
    lastPlayX: groundState.lastPlayX,
    lastPlayY: groundState.lastPlayY,
    setGroundState: setGroundState,
    setGroundProximity: setGroundProximity,
    setLastPlay: setLastPlay,
  };

  return (
    <GroundContext.Provider value={groundContext}>
      {props.children}
    </GroundContext.Provider>
  );
};

export default GroundProvider;
