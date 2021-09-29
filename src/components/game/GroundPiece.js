import { useContext, useRef, useState } from "react";

import "./GroundPiece.css";
import GroundContext from "../../store/ground-context";

const GroundPiece = (props) => {
  const groundCtx = useContext(GroundContext);
  const { groundState, lastPlayX, lastPlayY } = groundCtx;
  const [stateClick, setStateClick] = useState(false);
  const refDiv = useRef();
  const proxyValue = props.proxyValue;
  const xIndex = props.xIndex;
  const yIndex = props.yIndex;
  const groundPieceState = groundState[yIndex][xIndex];

  useState(() => {
    console.log(lastPlayX.toString() + " " + lastPlayY.toString());
    if (lastPlayX === xIndex && lastPlayY === yIndex) {
      if (groundState[yIndex][xIndex] === 1 && stateClick === false) {
        setStateClick(true);
        if (proxyValue !== -1) {
          refDiv.current.innerHTML = proxyValue;
        }
      }
    }
  }, [groundState, lastPlayX, lastPlayY, groundCtx]);

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
