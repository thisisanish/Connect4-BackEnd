    let gameStatus  = [[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,]]
    let playablePosition = [6,6,6,6,6,6,6]
    let room;
    
    
    const winner = (player,method)=>{
        console.log(`${player} won by ${method}`);
        resetBoard()
    }
    const resetBoard = ()=>{
        gameStatus = gameStatus = [[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,]]
        playablePosition = [6,6,6,6,6,6,6]
 
    }
    
    const play=(position)=>{
        console.log(position);
        isPlayer1?playTurn(1,position):playTurn(2,position)
        isPlayer1 = !isPlayer1
        
        
    }
    
    const updatePlayablePosition=(position)=>{
        // console.log(playablePosition[position]);
        
        playablePosition[position] = playablePosition[position] - 1
    }
    
    const checkWinVY = (turn,h,v)=>{
        // console.log(h,v);
        let count = 0
        if(h<3){
            for(let i = 0; i<4;i++){
                // console.log(gameStatus[h+i][v]); 
                if(gameStatus[h+i][v]==turn){
                    count = count+1
                }
            }
        }   
        if(count >= 4){
            winner(turn,`Connecting 4 Vertically at ${h},${v} `)
        }
    }
    
    const checkWinHX = (turn,h,v)=>{
        let count = 0
        // console.log(h,v);
      
        gameStatus[h].forEach(element => {
            // console.log(element);
            if(element == turn){
                // console.log(element);
                count = count+1
                // console.log(count);
                if(count >= 4){
                    winner(turn,`Connecting 4 Horizontally at ${h},${v} `)
                }
            }
            else{
            
                count = 0
            }
     
            
        });
        // console.log(count);
       
        
    
    }
    
    const playTurn = (player,position)=>{
        // if(winStatus !=0){
        //     console.log("GAME OVER");
        //     return;
        // }
        if(playablePosition[position]==0){
            console.log('Invalid move')
            return false
        }
        if(position > 6 | position <0 | position === null | position === undefined){
            console.log('Wrong position')
            return false
        }
        
        updatePlayablePosition(position)
    
        let h = playablePosition[position]
        let v = position
        // console.log(h,v)
        gameStatus[h][v] = player
        console.log(gameStatus);
        checkWinVY(player,h,v)
        checkWinHX(player,h,v)
        
        
    }