import { useState, useContext, useRef } from "react";
import GroundPiece from "./GroundPiece";

import groundContext from "../../store/ground-context.js";
import useGroundTools from "../../hooks/useGroundTools";
import useGameTools from "../../hooks/useGameTools";

// const DUMMY_GROUND = [
//   [0, 0, 0, 1, 0],
//   [0, 1, 1, 1, 0],
//   [0, 0, 0, 0, 1],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1],
// ];


const GameBoard = (props) => {
  const groundCtx = useContext(groundContext);
  const { groundProximity, groundState } = groundCtx;
  const [createdGround, setCreatedGround] = useState(false);
  const refDivLastPlay = useRef();

  const xMax = +10;
  const yMax = +10;

  const { CheckNeighborsState } = useGroundTools();
  const { CreateGround, CreateProximityGround } = useGameTools();
  
  const CreateGame = () => {
    let groundStateMap = new Array(yMax).fill([], 0, yMax);
    groundStateMap = groundStateMap.map((y) => new Array(xMax).fill(0, 0, xMax));
    console.log(groundStateMap);
    groundCtx.setGroundState(groundStateMap);
  };

  if (!createdGround) {
    const ground = CreateGround(20, setCreatedGround);
    CreateProximityGround(ground);
    CreateGame();
  }

  const checkGroundHandler = (x, y) => {
    //Just For debug
    //alert("Checking" + x.toString() + y.toString());
    const newLastPlay = { x, y };
    groundCtx.setLastPlay(newLastPlay);

    let newStateGround = [...groundState];
    let newGroundProximity = [...groundProximity];
    newStateGround[y][x] = 1;

    CheckNeighborsState(x, y, newStateGround, newGroundProximity, xMax, yMax);

    let proxMines = groundProximity[y][x];
    if (proxMines === -1) {
      alert("Game over!");
    }
  };

  return (
    <div>
      <div ref={refDivLastPlay}></div>
      <div>
        <table>
          <tbody>
            {groundProximity.map((y, yIndex) => (
              <tr key={`${yIndex}`}>
                {y.map((x, xIndex) => (
                  <td key={`${yIndex}${xIndex}`}>
                    <GroundPiece
                      proxyValue={groundProximity[yIndex][xIndex]}
                      xIndex={xIndex}
                      yIndex={yIndex}
                      groundState={groundState}
                      onCheckGround={checkGroundHandler}
                    ></GroundPiece>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameBoard;
