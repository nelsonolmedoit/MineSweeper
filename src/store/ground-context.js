import React from "react";

const GroundContext = React.createContext({
  groundState: [[0]],
  groundProximity: [[0]],
  lastPlayX: 0,
  lastPlayY: 0,
  setGroundState: () => {},
  setGroundProximity: () => {},
  setLastPlay: () => {},
});

export default GroundContext;
