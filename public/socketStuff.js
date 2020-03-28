let socket = io.connect();
let playerAlive = true;

function init() {
    draw();
    socket.emit('init', {
        playerName: player.name
    })
}

socket.on('initReturn', data => {
    orbs = data.orbs;
    setInterval(() => {
        socket.emit('tick', {
            xVector: player.xVector,
            yVector: player.yVector
        })
    },33)
});

socket.on('tock', data => {
    players = data.players;
});

socket.on('tickTock', data => {
    player.locX = data.playerX;
    player.locY = data.playerY;
});

socket.on('orbSwitch', data => {
    orbs.splice(data.orbIndex,1, data.newOrb);
});

socket.on('updateLeaderBoard', data => {
    document.querySelector('.leader-board').innerHTML = '';
    data.forEach(curPlayer => {
        document.querySelector('.leader-board').innerHTML += `<li class="leaderboard-player">${curPlayer.name} - ${curPlayer.score}</li>`
    })
});

socket.on('playerDeath', (data) => {
    console.log(`Got killed: ${data.died.name}`);
    console.log(`Got killed by: ${data.killedBy.name}`);
    document.querySelector('#game-message').innerHTML = `${data.died.name} Absorbed By ${data.killedBy.name}`
    $('#game-message').css({
        "background-color": "#00e6e6",
        "opacity": 1
    });
    $('#game-message').show();
    $('#game-message').fadeOut(5000);
});