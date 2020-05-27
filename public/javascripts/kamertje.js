var socket = io();

new Vue({
  el: '#kamertje',
  data: {
    playerColor: '',
    rooms: []
  },
  mounted: function () {
    let self = this;

    // Connect to socket.io
    socket.on('updateRoom', function(data){
      let room = self.rooms.filter(room => room.number == data.number)[0]
      room[data.wall] = data.playerColor;
    });

    this.getRooms();
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
    async getRooms() {
      const response = await fetch('/game');
      const game = await response.json();
      this.rooms = game.rooms;
    },
    checkWall(roomNumber, wall) {
      if (this.playerColor.length == 0)
        return true;
      if (this.winner().length > 0)
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
