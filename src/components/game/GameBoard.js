import { useEffect, useState } from "react";
import GroundPiece from "./GroundPiece";

const DUMMY_GROUND = [
  [0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1],
];

const lastPlayDTO = {
  x: 0,
  y: 0,
};

const GameBoard = (props) => {
  const [createdGround, setCreatedGround] = useState(false);
  const [proximityGround, setProximityGround] = useState();
  const [ground, setGround] = useState([]);
  const [stateGround, setStateGround] = useState([]);
  const [lastPlay, setLastPlay] = useState(lastPlayDTO);
  const xMax = 5;
  const yMax = 5;

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

    CreateProximityGround(DUMMY_GROUND);
    setGround(DUMMY_GROUND);
  };

  const CreateGame = () => {
    let matrix = new Array(yMax).fill([], 0, yMax);
    matrix = matrix.map((y) => new Array(xMax).fill(0, 0, xMax));
    console.log(matrix);
    setStateGround(matrix);
  };

  const CreateProximityGround = (ground) => {
    const yMax = ground.length;
    const xMax = ground[0].length;

    let proximityGround = new Array(yMax).fill([], 0, yMax);
    proximityGround = proximityGround.map((y) =>
      new Array(xMax).fill(0, 0, xMax)
    );
    let proxMines = 0;
    console.log(proximityGround);
    for (let y = 0; y < yMax; y++) {
      for (let x = 0; x < xMax; x++) {
        if (ground[y][x] === 0) {
          proxMines = CheckNeighbors(x, ground, y, xMax, yMax);
          proximityGround[y][x] = proxMines;
        } else {
          proximityGround[y][x] = -1;
        }
      }
    }
    console.log(proximityGround);
    setProximityGround(proximityGround);
  };

  useEffect(() => {
    console.log(lastPlay);
    const prevStateGround = [...stateGround];
    prevStateGround[0][0] = 1;
    setStateGround(prevStateGround);
  }, [lastPlay]);

  const checkGroundHandler = (x, y) => {
    //alert("Checking" + x.toString() + y.toString());
    setLastPlay({ x: x, y: y });
    let prevStateGround = [...stateGround];
    prevStateGround[y][x] = 1;

    //let proxMines = CheckNeighbors(x, ground, y, xMax, yMax);
    let proxMines = proximityGround[y][x];
    if (proxMines === -1) {
      alert("Game over!");
    }

    console.log(prevStateGround);
    setStateGround(prevStateGround);

    return proxMines;
  };

  const displayGround = () => {
    if (createdGround) {
      console.log(ground);
      const display = (
        <table>
          <tbody>
            {ground.map((y, yIndex) => (
              <tr key={`${yIndex}`}>
                {y.map((x, xIndex) => (
                  <td key={`${yIndex}${xIndex}`}>
                    <GroundPiece
                      proxyValue={proximityGround[yIndex][xIndex]}
                      xIndex={xIndex}
                      yIndex={yIndex}
                      groundState={stateGround}
                      onCheckGround={checkGroundHandler}
                    ></GroundPiece>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

      return display;
    }
    return <div></div>;
  };

  if (!createdGround) {
    CreateGround(20);
    CreateGame();
  }

  return (
    <div>
      {lastPlay.x.toString()} {lastPlay.y.toString()}
      <div></div>
      <div>        
        <table>
          <tbody>
            {ground.map((y, yIndex) => (
              <tr key={`${yIndex}`}>
                {y.map((x, xIndex) => (
                  <td key={`${yIndex}${xIndex}`}>
                    <GroundPiece
                      proxyValue={proximityGround[yIndex][xIndex]}
                      xIndex={xIndex}
                      yIndex={yIndex}
                      groundState={stateGround}
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