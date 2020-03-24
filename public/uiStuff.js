let wHeight = $(window).height();
let wWidth = $(window).width();
let player = {};
let orbs = [];

let canvas = document.querySelector('#the-canvas');
let context = canvas.getContext('2d');
canvas.width = wWidth;
canvas.height = wHeight;

$(window).load(() => {
    $('#loginModal').modal('show');
});

$('.name-form').submit((e) => {
    e.preventDefault();
    // console.log('Submitted');
    player.name = document.getElementById('name-input').value;
    $('#loginModal').modal('hide');
    $('#spawnModal').modal('show');
    document.querySelector('.player-name').innerHTML = player.name;
});

$('.start-game').click((e) => {
    $('.modal').modal('hide');
    $('.hiddenOnStart').removeAttr('hidden');
    init();
});