var socket = io();

new Vue({
  el: '#kamertje',
  data: {
    rooms: [
      { top: '', bottom: '', left: '', right: ''},
      { top: '', bottom: '', left: '', right: ''},
      { top: '', bottom: '', left: '', right: ''},

      { top: '', bottom: '', left: '', right: ''},
      { top: '', bottom: '', left: '', right: ''},
      { top: '', bottom: '', left: '', right: ''},

      { top: '', bottom: '', left: '', right: ''},
      { top: '', bottom: '', left: '', right: ''},
      { top: '', bottom: '', left: '', right: ''}
    ]
  },
  mounted: function () {
    var self = this;

    // Connect to socket.io
    socket.on('updateRoom', function(data){
      self.rooms[data.roomNumber][data.wall] = 'other';
    });

    // Retrieve game state

  },
  methods: {
    updateKamer: function(roomNumber, wall) {
      this.rooms[roomNumber][wall] = 'mine';
      socket.emit('updateRoom', { number: roomNumber, wall: wall });
    }
  }
})
