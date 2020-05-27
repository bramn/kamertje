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
      room[`${data.wall}Wall`] = data.playerColor;
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
      room[`${wall}Wall`] = this.playerColor;
      socket.emit('updateRoom', { number: roomNumber, wall: wall, playerColor: this.playerColor });
    },
    async getRooms() {
      const rooms = await fetch('/game');
      this.rooms = await rooms.json();
    },
    checkWall(roomNumber, wall) {
      let room = this.rooms.filter(room => room.number == roomNumber)[0]
      return (room[`${wall}Wall`] == undefined) ? false: true;
    }
  }
})
