import React from "react";

const GroundContext = React.createContext({
  groundState: [],
  groundProximity: [],
  lastPlayX: 0,
  lastPlayY: 0,
  setGroundState: () => {},
  setGroundProximity: () => {},
  setLastPlay: () => {},
});

export default GroundContext;
