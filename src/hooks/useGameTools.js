import { useContext } from "react";
import GroundContext from "../store/ground-context";
import useGroundTools from "./useGroundTools";

// const DUMMY_GROUND = [
//   [0, 0, 0, 1, 0],
//   [0, 1, 1, 1, 0],
//   [0, 0, 0, 0, 1],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1],
// ];

const DUMMY_GROUND = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const useGameTools = () => {
  const gCtx = useContext(GroundContext);
  const { CheckNeighbors } = useGroundTools();

  const CreateGround = (minesQuantity, setCreatedGround) => {
    setCreatedGround(true);

    //Code to implement auto generated mines map.
    
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

  const CreateProximityGround = (ground) => {
    const yMax = ground.length;
    const xMax = ground[0].length;

    let newProximityGround = new Array(yMax).fill([], 0, yMax);
    newProximityGround = newProximityGround.map((y) =>
      new Array(xMax).fill(0, 0, xMax)
    );
    let proxMines = 0;
    //console.log(newProximityGround);
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
    //console.log(newProximityGround);
    gCtx.setGroundProximity(newProximityGround);
  };

  return { CreateGround, CreateProximityGround };
};

export default useGameTools;
