var socket = io();

new Vue({
  el: '#kamertje',
  data: {
    playerColor: '',
    player: '',
    to_move: '',
    rooms: []
  },
  mounted: function () {
    let self = this;

    socket.on('updateRoom', function(data){
      let room = self.rooms.filter(room => room.number == data.number)[0];
      room[data.wall] = data.playerColor;
      self.to_move = (data.playerColor == 'red') ? 'blue': 'red';
    });

    // This message is only received once, when the other is quicker with selecting a color
    socket.on('updateGame', function(data){
      self.playerColor = data.playerColor;
      self.to_move = (data.playerColor == 'red') ? 'blue': 'red';
      self.player = 'player_two';
      localStorage.player = 'player_two';
    });

    this.getGame();
  },
  computed: {
    sortedRooms() {
      return this.rooms.sort((a, b) => a.number - b.number);
    }
  },
  methods: {
    updateRoom(roomNumber, wall) {
      let room = this.rooms.filter(room => room.number == roomNumber)[0]
      room[wall] = this.playerColor;
      socket.emit('updateRoom', { number: roomNumber, wall: wall, playerColor: this.playerColor });
    },
    updateGame(player) {
      socket.emit('updateGame', { playerColor: player });
      localStorage.player = 'player_one';
      this.player = 'player_one';
      this.to_move = player;
    },
    async getGame() {
      const response = await fetch('/game');
      const game = await response.json();

      this.rooms = game.rooms;
      this.to_move = game.to_move;

      if (localStorage.player !== undefined) {
        if (game[localStorage.player] !== null) {
          this.player = localStorage.player;
          this.playerColor = game[localStorage.player];
        }
      }
    },
    checkWall(roomNumber, wall) {
      if (this.playerColor.length == 0)
        return true;
      if (this.winner().length > 0)
        return true;
      if(this.to_move !== this.playerColor)
        return true;

      let room = this.rooms.filter(room => room.number === roomNumber)[0];
      return (room[wall] == undefined) ? false: true;
    },
    nrOfRooms(color) {
      return this.rooms.filter(room =>
        room.topWall === color & room.rightWall === color & room.bottomWall === color & room.leftWall === color
      ).length
    },
    winner() {
      if(this.nrOfRooms('red') > 4) {
        return 'Red';
      } else if (this.nrOfRooms('blue') > 4) {
        return 'Blue';
      }
      return '';
    }
  }
})
