let socket = io.connect();

function init() {
    draw();
    socket.emit('init', {
        playerName: player.name
    })
}

socket.on('initReturn', data => {
    orbs = data.orbs;
});