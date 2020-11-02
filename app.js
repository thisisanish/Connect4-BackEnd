const express = require('express'),
    app = express()
    server = require('http').createServer(app),
    port = process.env.PORT || 3001,
    io = require('socket.io')(server,{ origins: '*:*'}),
    cors = require('cors')

    // main object for handeling the game data
let gameArea = {}


let gameStatus  = [[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,]]
let playablePosition = [6,6,6,6,6,6,6]
let winnerPlayer = null
let room;
app.use(cors())
app.get("/",(req,res)=>{
    res.send("Backend for Connect 4")
})
    
const winner = (player,method,room)=>{
    if(winnerPlayer){}
    gameArea[room].winnerPlayer = (`${player} won by ${method}`);
    // resetBoard(room) 
}
const resetBoard = (room)=>{
    gameArea[room].gameStatus = gameArea[room].gameStatus = [[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,]]
    gameArea[room].playablePosition = [6,6,6,6,6,6,6]
    gameArea[room].winnerPlayer=null
}
    
 
    
const updatePlayablePosition=(position,room)=>{
    // console.log(playablePosition[position]);
    // console.log(gameArea[room]);
    gameArea[room].playablePosition[position] = gameArea[room].playablePosition[position] - 1
}
    
const checkWinVY = (turn,h,v,room)=>{
    // console.log(h,v);
    let count = 0
    if(h<3){
        for(let i = 0; i<4;i++){
            // console.log(gameStatus[h+i][v]); 
            if(gameArea[room].gameStatus[h+i][v]==turn){
                count = count+1
            }
        }
    }   
    if(count >= 4){
        winner(turn,`Connecting 4 Vertically`,room)
    }
}
    
const checkWinHX = (turn,h,v,room)=>{
    let count = 0
    // console.log(h,v);
  
    gameArea[room].gameStatus[h].forEach(element => {
        // console.log(element);
        if(element == turn){
            // console.log(element);
            count = count+1
            // console.log(count);
            if(count >= 4){
                winner(turn,`Connecting 4 Horizontally`,room)
            }
        }
        else{            
            count = 0
        }
    });
    // console.log(count);   
}
    
const playTurn = (player,position,room)=>{
    if(gameArea[room].winnerPlayer){
        resetBoard(room)
        loadData(room)
    }
    // console.log(gameArea[room]);
    console.log(position);
    if(gameArea[room].playablePosition[position]==0){
        // console.log('Invalid move')
        return false
    }
    if(position > 6 | position <0 | position === null | position === undefined){
        // console.log(`position is ${position}`);
        // console.log('Wrong position')
        return false
    }
        
    updatePlayablePosition(position,room)
    
    let h = gameArea[room].playablePosition[position]
    let v = position
    // console.log(h,v)
    // console.log(gameArea);
    gameArea[room].gameStatus[h][v] = player
    // console.log(gameArea[room].gameStatus);
    checkWinVY(player,h,v,room)
    checkWinHX(player,h,v,room)
    return gameArea[room]
        
}
const loadData = (userName,room) =>{
    if(!gameArea[room]){       
        let newRoomStarter = {
            gameStatus  : [[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,]],
            playablePosition : [6,6,6,6,6,6,6],
            winnerPlayer : null
        }
        gameArea[room] = newRoomStarter 
    }   
        return gameArea[room]    
    }



io.on('connection',(socket)=>{

    socket.on('join',({userName,room},cb)=>{
        // socket.emit('yo',{yo:"yo"})
        console.log(socket.id,userName,room);   
        socket.join(room)
        // console.log(gameArea[room]);
        loadData(userName,room)
        io.to(room).emit('game',gameArea[room])
        
        // console.log(gameArea);
})
    

    socket.on('playPosition',({userName,room,position},cb)=>{

        console.log(userName, position, room);
        // if(!gameArea[room]){            
        //     let newRoomStarter = {
        //         gameStatus  : [[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,],[0,0,0,0,0,0,0,]],
        //         playablePosition : [6,6,6,6,6,6,6],
        //     }
        //     gameArea[room] = newRoomStarter 
        // }
        loadData(room)
        if(gameArea[room]){
            let game = playTurn(userName,position,room)
            // console.log(game);
            io.of('/').in(room).clients((err,clients)=>{
                game.playersInGame = clients
                // 
            })    
            // console.log(io.in(room).clients());
            // console.log(game);
            io.to(room).emit('game',game)          
        }
            // console.log(gameArea);
            // console.log(gameArea[room]);
    })

    socket.on('resetBoard',(room)=>{
        // console.log("Reset");
        resetBoard(room)
        loadData(room)
        io.to(room).emit('game',gameArea[room])

    })

    socket.on('disconnect',(reason)=>{
        console.log(reason);
    })

})


server.listen(port)
    
