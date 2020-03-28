const {io} = require('../server');
const {checkForOrbCollisions} = require('./checkCollisions');
const {checkForPlayerCollisions} = require('./checkCollisions');

const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');


const Orb = require('./classes/Orb');
let orbs = [];
let players = [];
let settings = {
    defaultOrbs: 50,
    defaultSpeed: 6,
    defaultSize: 10,
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500
};

initGame();

// issue a message to Every socket at 30 fps
setInterval(() => {
    if(players.length > 0) {
        io.to('game').emit('tock', {
            players
        });
    }
}, 33);

io.sockets.on('connect', socket => {
    let player = {};
    // a player has connected
    socket.on('init', data => {
        // add the player to the game namespace
        socket.join('game');
        // make a player config object
        let playerConfig = new PlayerConfig(settings);
        // make a player data object
        let playerData = new PlayerData(data.playerName, settings);
        // make a master player object to hold both
        player = new Player(socket.id, playerConfig, playerData);

        setInterval(()=> {
            socket.emit('tickTock', {
                playerX: player.playerData.locX,
                playerY: player.playerData.locY
            })
        }, 33);

        socket.emit('initReturn', {
            orbs
        });
        players.push(playerData);
    });
    // the client sent over a tick.  That means we know what direction to move.
    socket.on('tick', data => {
        // console.log(player);
        speed = player.playerConfig.speed;
        xV = player.playerConfig.xVector = data.xVector;
        yV = player.playerConfig.yVector = data.yVector;

        if((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
            player.playerData.locY -= speed * yV;
        }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
            player.playerData.locX += speed * xV;
        }else{
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }
        let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings);
        capturedOrb.then(data => {
            const orbData = {
                orbIndex: data,
                newOrb: orbs[data]
            };
            io.sockets.emit('updateLeaderBoard', getLeaderBoard());
            io.sockets.emit('orbSwitch', orbData);
        }).catch(err => {
        });

        let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId);
        playerDeath.then((data) => {
            io.sockets.emit('updateLeaderBoard', getLeaderBoard());
            io.sockets.emit('playerDeath', data)
            players.forEach((curPlayer) => {
                console.log(curPlayer);
                console.log(data);
            })
        }).catch(err => {

        })
    });

    socket.on('disconnect', () => {
        if(player.playerData) {
            players.forEach((curPlayer, i) => {
                if (curPlayer.uid === player.playerData.uid) {
                    players.splice(i, 1);
                    io.sockets.emit('updateLeaderBoard', getLeaderBoard());
                }
            })
        }
    })
});

function getLeaderBoard(){
    players.sort((a,b) => {
        return b.score - a.score;
    });
    return players.map(curPlayer => {
        return {
            name: curPlayer.name,
            score: curPlayer.score
        }
    });
}
// Run at the beginning of a new game
function initGame() {
    for(let i=0; i<settings.defaultOrbs; i++){
        orbs.push(new Orb(settings));
    }
}

module.exports = io;