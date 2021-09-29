import { useEffect, useState, useContext, useRef } from "react";
import GroundPiece from "./GroundPiece";

import groundContext from "../../store/ground-context.js";

const DUMMY_GROUND = [
  [0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1],
];


const GameBoard = (props) => {
  const groundCtx = useContext(groundContext);
  const { groundProximity, groundState } = groundCtx;
  const [createdGround, setCreatedGround] = useState(false);
  //const [proximityGround, setProximityGround] = useState();
  //const [ground, setGround] = useState([]);
  //const [stateGround, setStateGround] = useState([]);
  const refDivLastPlay = useRef();
  //const [lastPlay, setLastPlay] = useState(lastPlayDTO);
  const xMax = +5;
  const yMax = +5;

  const CheckNeighbors = (x, ground, y, xMax, yMax) => {
    let proxMines = 0;

    proxMines += x > 0 ? ground[y][x - 1] : 0;
    proxMines += x < xMax - 1 ? ground[y][x + 1] : 0;
    proxMines += y > 0 ? ground[y - 1][x] : 0;
    proxMines += y < yMax - 1 ? ground[y + 1][x] : 0;

    proxMines += y > 0 && x > 0 ? ground[y - 1][x - 1] : 0;
    proxMines += y > 0 && x < xMax - 1 ? ground[y - 1][x + 1] : 0;
    proxMines += y < yMax - 1 && x > 0 ? ground[y + 1][x - 1] : 0;
    proxMines += y < yMax - 1 && x < xMax - 1 ? ground[y + 1][x + 1] : 0;

    return proxMines;
  };

  const ValidateGroundPieceState = (y, x, gProximity, cSurroundingGround, fromProxy) => {
    console.log('inside validate group piced state: ' + y.toString() + ' ' + x.toString());
    console.log('GProximity');
    console.log(gProximity);
    
    const groundAlreadyChecked = cSurroundingGround.findIndex(ground => ground.x === +x && ground.y === +y);

    console.log('groundAlreadyChecked:' + groundAlreadyChecked);
    if (groundAlreadyChecked === -1 && gProximity) {
      console.log('GProx X/Y:' + gProximity[y][x]);
      let groundOk = false;
      if (fromProxy) {
        groundOk = gProximity[+y][+x] === 0;      
      } else {
        groundOk = gProximity[+y][+x] !== -1;      
      }
      console.log('Ground OK:' + groundOk);
      if (groundOk) {    
        console.log('surroundingGround.length: ' + cSurroundingGround.length);
        let newCheckedPosition = {x: +x, y: +y, groundProx: gProximity[+y][+x], checked: false};
        if (cSurroundingGround.length === 0 ){
          cSurroundingGround = [newCheckedPosition]
        } else {
          cSurroundingGround = [...cSurroundingGround, newCheckedPosition];
        }
      }
      //console.log('final surrounding object:' + cSurroundingGround);
    }

    return cSurroundingGround;
  }

  const ValidateCleanSurroundingGround = (gProximity, x, y,cleanSurroundingGround) => {
    console.log('VALIDATE CLEAN SURROUNDINGS: ' + y.toString() + ' ' + x.toString());
    // console.log(gProximity);
     console.log(cleanSurroundingGround);
    let csgIndex = cleanSurroundingGround.findIndex(csg => csg.x === +x && csg.y === +y);
    cleanSurroundingGround[csgIndex].checked = true;
    const fromProxy = cleanSurroundingGround[csgIndex].groundProx !== 0;

    cleanSurroundingGround = x > 0 ? ValidateGroundPieceState([y],[x - 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    console.log('test1 passed');
    cleanSurroundingGround = x < xMax - 1 ? ValidateGroundPieceState([y],[x + 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    console.log('test2 passed');
    cleanSurroundingGround = y > 0 ? ValidateGroundPieceState([y - 1],[x], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    console.log('test3 passed');
    cleanSurroundingGround = y < yMax - 1 ? ValidateGroundPieceState([y + 1],[x], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    console.log('test4 passed');

    cleanSurroundingGround = y > 0 && x > 0 ? ValidateGroundPieceState([y - 1],[x - 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    console.log('test5 passed');
    cleanSurroundingGround = y > 0 && x < xMax - 1 ? ValidateGroundPieceState([y - 1],[x + 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    console.log('test6 passed');
    cleanSurroundingGround = y < yMax - 1 && x > 0 ? ValidateGroundPieceState([y + 1],[x - 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    console.log('test7 passed');
    cleanSurroundingGround = y < yMax - 1 && x < xMax - 1 ? ValidateGroundPieceState([y + 1],[x + 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    console.log('test8 passed');

    return cleanSurroundingGround;
  }

  const UpdateStateAfterSurroundCheck = (gState, cleanSurroundingGround) => {
    cleanSurroundingGround.forEach(csg => {
      gState[csg.y][csg.x] = 1;
    });
  }

  const CheckNeighborsState = (x,y,gState, gProximity, xMax, yMax) => {
    console.log('Check neighbors');
    console.log(gProximity);

    let newGProximity = [...gProximity];
    let cleanSurroundingGround = [];
    cleanSurroundingGround = [{x: +x,y: +y, groundOk: true, checked: true}];

    cleanSurroundingGround = ValidateCleanSurroundingGround(newGProximity,x, y,cleanSurroundingGround);
    console.log('cleanSurroundingGround 1: ');
    console.log(cleanSurroundingGround);
    let newPosition;
    
    let nextPositionToCheck = cleanSurroundingGround.findIndex(x => x.checked === false);
    if (nextPositionToCheck !== -1)
    {
      console.log('nextPositionToCheck:' + nextPositionToCheck);
      console.log('cleanSurroundingGround: ' + cleanSurroundingGround);

      newPosition = cleanSurroundingGround[nextPositionToCheck];

      console.log('NewPosition:' + newPosition.x + ' ' + newPosition.y);
      console.log('Clean pendings: ' + cleanSurroundingGround.length);

      while (nextPositionToCheck !== -1) {
        //console.log(cleanSurroundings.length);
        
        //console.log(cleanSurroundings.length);      
        cleanSurroundingGround = ValidateCleanSurroundingGround(newGProximity,newPosition.x,newPosition.y,cleanSurroundingGround)

        nextPositionToCheck = cleanSurroundingGround.findIndex(x => x.checked === false);
        if (nextPositionToCheck !== -1) {
          newPosition = cleanSurroundingGround[nextPositionToCheck];
          console.log('NewPosition:' + newPosition.x + ' ' + newPosition.y);
          console.log('Clean pendings: ' + cleanSurroundingGround.length);
        }
      }
    }

    UpdateStateAfterSurroundCheck(gState, cleanSurroundingGround);

    console.log(cleanSurroundingGround);
  }
  
  useEffect(() => {
    const CreateGround = (minesQuantity) => {
      setCreatedGround(true);
      // const xMax = 5;
      // const yMax = 5;
      // let minesCounter = 0;
      // let matrix = [yMax];
      // // matrix[(0, 1)] = "hola viteh";
      // // console.log(matrix[(0, 1)]);
      // let hasMine = 0;
      // let randomValue = 0;

      // for (let y = 0; y < yMax; y++) {
      //   matrix[y] = [xMax];
      // }

      // for (let y = 0; y < yMax; y++) {
      //   for (let x = 0; x < xMax; x++) {
      //     hasMine = 0;

      //     if (minesCounter <= minesQuantity) {
      //       randomValue = Math.random();
      //       if (randomValue > 0.5) {
      //         minesCounter++;
      //         //hasMine = true;
      //         hasMine = randomValue;
      //       }
      //     }

      //     //matrix[x][y] = hasMine ? 1 : 0;
      //     matrix[x][y] = Number.parseFloat(hasMine).toPrecision(3);
      //   }
      // }

      //setGround(DUMMY_GROUND);
      return DUMMY_GROUND;
    };

    const CreateGame = () => {
      let matrix = new Array(yMax).fill([], 0, yMax);
      matrix = matrix.map((y) => new Array(xMax).fill(0, 0, xMax));
      console.log(matrix);
      //setStateGround(matrix);
      groundCtx.setGroundState(matrix);
    };

    const CreateProximityGround = (ground) => {
      const yMax = ground.length;
      const xMax = ground[0].length;

      let newProximityGround = new Array(yMax).fill([], 0, yMax);
      newProximityGround = newProximityGround.map((y) =>
        new Array(xMax).fill(0, 0, xMax)
      );
      let proxMines = 0;
      console.log(newProximityGround);
      for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
          if (ground[y][x] === 0) {
            proxMines = CheckNeighbors(x, ground, y, xMax, yMax);
            newProximityGround[y][x] = proxMines;
          } else {
            newProximityGround[y][x] = -1;
          }
        }
      }
      console.log(newProximityGround);
      //setProximityGround(newProximityGround);
      groundCtx.setGroundProximity(newProximityGround);
    };

    if (!createdGround) {
      const ground = CreateGround(20);
      CreateProximityGround(ground);
      CreateGame();
    }
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   refDivLastPlay.current.innerHTML = lastPlayX.toString() + ' ' + lastPlayY.toString();

  //   // setInterval(() => {
  //   //   console.log(lastPlayX);
  //   //   console.log(lastPlayY);
  //   // }, 2000);

  // }, [lastPlayX, lastPlayY]);

  const checkGroundHandler = (x, y) => {
    //Just For debug
    //alert("Checking" + x.toString() + y.toString());
    const newLastPlay = { x, y };
    //refDivLastPlay.current.innerHTML = x.toString() + ' ' + y.toString();
    // console.log(lastPlayX);
    // console.log(lastPlayY);
    // console.log(newLastPlay);
    groundCtx.setLastPlay(newLastPlay);
    
    //let prevStateGround = [...stateGround];
    let prevStateGround = [...groundState];
    let prevGroundProximity = [...groundProximity];
    prevStateGround[y][x] = 1;
    //prevStateGround[0][0] = 1;
    console.log('prevStateGround')
    console.log(prevStateGround);
    console.log(groundCtx.groundState);
    console.log('prevGroundProximity');
    console.log(prevGroundProximity);
    CheckNeighborsState(x, y, prevStateGround, prevGroundProximity, xMax, yMax);

    //let proxMines = CheckNeighbors(x, ground, y, xMax, yMax);
    let proxMines = groundProximity[y][x];
    if (proxMines === -1) {
      alert("Game over!");
    }
    //setStateGround(prevStateGround);
  };

  // const displayGround = () => {
  //   if (createdGround) {
  //     console.log(groundState);
  //     const display = (
  //       <table>
  //         <tbody>
  //           {groundProximity.map((y, yIndex) => (
  //             <tr key={`${yIndex}`}>
  //               {y.map((x, xIndex) => (
  //                 <td key={`${yIndex}${xIndex}`}>
  //                   <GroundPiece
  //                     proxyValue={x}
  //                     xIndex={xIndex}
  //                     yIndex={yIndex}
  //                     groundState={groundState}
  //                     onCheckGround={checkGroundHandler}
  //                   ></GroundPiece>
  //                 </td>
  //               ))}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     );

  //     return display;
  //   }
  //   return <div></div>;
  // };

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
