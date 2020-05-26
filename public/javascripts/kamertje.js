var socket = io();

new Vue({
  el: '#kamertje',
  data: {
    nr_of_kamers: 9,
  },
  mounted: function () {
    socket.on('muur', function(msg){
      console.log(msg);
    });
  },
  methods: {
    updateKamer: function(kamerNummer, muur) {
      socket.emit('chat message', 'kamerNummer en muur' + kamerNummer + '/' + muur);
    }
  }
})
