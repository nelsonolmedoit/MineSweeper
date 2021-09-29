import { useContext, useRef, useState } from "react";

import "./GroundPiece.css";
import GroundContext from "../../store/ground-context";

const GroundPiece = (props) => {
  const ctx = useContext(GroundContext);
  const { groundState } = ctx;
  const [stateClick, setStateClick] = useState(false);
  const refDiv = useRef();
  const proxyValue = props.proxyValue;
  const xIndex = props.xIndex;
  const yIndex = props.yIndex;
  console.log(yIndex);
  console.log(xIndex);
  console.log(
    "Previo ground state: " + yIndex.toString() + " " + xIndex.toString()
  );
  console.log(groundState);

  const groundPieceState = groundState[yIndex][xIndex];

  useState(() => {
    if (groundPieceState === 1 && stateClick === false) {
      setStateClick(true);
      if (proxyValue !== -1) {
        refDiv.current.innerHTML = proxyValue;
      }
    }
  }, [groundPieceState, stateClick]);

  const clickHandler = () => {
    if (!stateClick) {
      setStateClick(true);
      if (proxyValue !== -1) {
        refDiv.current.innerHTML = proxyValue;
      }
      props.onCheckGround(xIndex, yIndex);
    }
  };

  if (groundPieceState) {
    refDiv.current.innerHTML = proxyValue;
  }

  const divCssHandler = `${
    groundPieceState ? "GroundPiece red" : "GroundPiece blue"
  }`;

  return (
    <div ref={refDiv} onClick={clickHandler} className={divCssHandler}></div>
  );
};

export default GroundPiece;
