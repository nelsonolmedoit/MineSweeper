import { useRef, useState } from "react";

import "./GroundPiece.css";

const GroundPiece = (props) => {
  const [stateClick, setStateClick] = useState(false);
  const refDiv = useRef();
  const proxyValue = props.proxyValue;
  const xIndex = props.xIndex;
  const yIndex = props.yIndex;
  const groundState = props.groundState[yIndex][xIndex];

  useState(() => {
    if (groundState === 1 && stateClick === false) {
      setStateClick(true);
    }
  }, [groundState]);

  const clickHandler = () => {
    setStateClick(true);
    if (proxyValue !== -1) {
      refDiv.current.innerHTML = proxyValue;
    }
    props.onCheckGround(xIndex, yIndex);
  };

  const divCssHandler = () => {
    let response = "";

    if (stateClick) {
      response = "GroundPiece red";
    } else {
      response = "GroundPiece blue";
    }

    return response;
  };

  return (
    <div ref={refDiv} onClick={clickHandler} className={divCssHandler()}></div>
  );
};

export default GroundPiece;
