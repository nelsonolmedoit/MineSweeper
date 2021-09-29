

const useGroundTools = () => {

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
    //Just 4 debug.
    // console.log('inside validate group piced state: ' + y.toString() + ' ' + x.toString());
    // console.log('GProximity');
    // console.log(gProximity);
    
    const groundAlreadyChecked = cSurroundingGround.findIndex(ground => ground.x === +x && ground.y === +y);

    //console.log('groundAlreadyChecked:' + groundAlreadyChecked);
    if (groundAlreadyChecked === -1 && gProximity) {
      //console.log('GProx X/Y:' + gProximity[y][x]);
      let groundOk = false;
      if (fromProxy) {
        groundOk = gProximity[+y][+x] === 0;      
      } else {
        groundOk = gProximity[+y][+x] !== -1;      
      }
      //console.log('Ground OK:' + groundOk);
      if (groundOk) {    
        //console.log('surroundingGround.length: ' + cSurroundingGround.length);
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

  const ValidateCleanSurroundingGround = (gProximity, x, y,cleanSurroundingGround, xMax, yMax) => {
    //console.log('VALIDATE CLEAN SURROUNDINGS: ' + y.toString() + ' ' + x.toString());
    //console.log(gProximity);
    //console.log(cleanSurroundingGround);
    let csgIndex = cleanSurroundingGround.findIndex(csg => csg.x === +x && csg.y === +y);
    cleanSurroundingGround[csgIndex].checked = true;
    const fromProxy = cleanSurroundingGround[csgIndex].groundProx !== 0;

    cleanSurroundingGround = x > 0 ? ValidateGroundPieceState([y],[x - 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    cleanSurroundingGround = x < xMax - 1 ? ValidateGroundPieceState([y],[x + 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    cleanSurroundingGround = y > 0 ? ValidateGroundPieceState([y - 1],[x], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    cleanSurroundingGround = y < yMax - 1 ? ValidateGroundPieceState([y + 1],[x], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;

    cleanSurroundingGround = y > 0 && x > 0 ? ValidateGroundPieceState([y - 1],[x - 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    cleanSurroundingGround = y > 0 && x < xMax - 1 ? ValidateGroundPieceState([y - 1],[x + 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    cleanSurroundingGround = y < yMax - 1 && x > 0 ? ValidateGroundPieceState([y + 1],[x - 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;
    cleanSurroundingGround = y < yMax - 1 && x < xMax - 1 ? ValidateGroundPieceState([y + 1],[x + 1], gProximity, cleanSurroundingGround, fromProxy) : cleanSurroundingGround;

    return cleanSurroundingGround;
  }

  const UpdateStateAfterSurroundCheck = (gState, cleanSurroundingGround) => {
    cleanSurroundingGround.forEach(csg => {
      gState[csg.y][csg.x] = 1;
    });
  }

  const CheckNeighborsState = (x,y,gState, gProximity, xMax, yMax) => {
    // console.log('Check neighbors');
    // console.log(gProximity);

    let newGProximity = [...gProximity];
    let cleanSurroundingGround = [];
    cleanSurroundingGround = [{x: +x,y: +y, groundOk: true, checked: true}];

    cleanSurroundingGround = ValidateCleanSurroundingGround(newGProximity,x, y,cleanSurroundingGround, xMax, yMax);
    let newPosition;
    
    let nextPositionToCheck = cleanSurroundingGround.findIndex(x => x.checked === false);
    if (nextPositionToCheck !== -1)
    {
      newPosition = cleanSurroundingGround[nextPositionToCheck];

      while (nextPositionToCheck !== -1) {
        cleanSurroundingGround = ValidateCleanSurroundingGround(newGProximity,newPosition.x,newPosition.y,cleanSurroundingGround, xMax, yMax)

        nextPositionToCheck = cleanSurroundingGround.findIndex(x => x.checked === false);
        if (nextPositionToCheck !== -1) {
          newPosition = cleanSurroundingGround[nextPositionToCheck];
          // console.log('NewPosition:' + newPosition.x + ' ' + newPosition.y);
          // console.log('Clean pendings: ' + cleanSurroundingGround.length);
        }
      }
    }

    UpdateStateAfterSurroundCheck(gState, cleanSurroundingGround);
  }

  return {
    CheckNeighbors,
    ValidateGroundPieceState,
    ValidateCleanSurroundingGround,
    UpdateStateAfterSurroundCheck,
    CheckNeighborsState,
  }  
}

export default useGroundTools;