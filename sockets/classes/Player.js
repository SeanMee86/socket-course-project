class Player{
    constructor(socketId, playerConfig, playerData){
        this.socketId = socketId;
        this.playerData = playerData;
        this.playerConfig = playerConfig;
    }
}

module.exports = Player;