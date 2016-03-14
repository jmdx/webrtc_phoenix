// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "deps/phoenix_html/web/static/js/phoenix_html"
// TODO probably use npm for webrtc-adapter
import "./adapter"

let App = {
  mainPage: function() {
    // TODO setup/use an ICE server so we can establish non-local connections
    document.getElementById('createButton').onclick = function() {
      window.connection = new RTCPeerConnection();
      let dataConstraint = null;
      window.sendChannel = connection.createDataChannel('sendDataChannel', dataConstraint);

      connection.onicecandidate = function(e) {
        console.log('ice candidate', e);
      };
      sendChannel.onopen = function(e) {
        console.log('onopen', e);
      };
      sendChannel.onclose = function(e) {
        console.log('onclose', e);
      };
      // TODO handle errors here
      connection.createOffer().then(function(offer) {
        return connection.setLocalDescription(offer);
      }).then(function() {
        window.fetch('/create', {
          method: 'POST',
          body: JSON.stringify(connection.localDescription)
        }).then(function(response) {
          return response.json();
        }).then(function(json) {
          document.querySelector('.create-or-join').classList.add('hidden');
          document.querySelector('.message-area').classList.remove('hidden');
          document.getElementById('roomIdDisplay').innerText = "" + json.roomId;
          console.log(json.roomId);
        });
      });
      // TODO add a window.fetch polyfill, though maybe unnecessary since webrtc support is probably rarer
      return false;
    };
  },
  join: function() {
    let connectionData = JSON.parse(document.getElementById('connectionData').dataset.connection);
    window.connection = new RTCPeerConnection();
    // TODO account for ICE here, not just SDP https://developer.mozilla.org/en-US/docs/Web/API/RTCSessionDescription
    let sessionDescription = new RTCSessionDescription(connectionData);
    let dataConstraint = null;
    window.sendChannel = connection.createDataChannel('sendDataChannel', dataConstraint);
    connection.setRemoteDescription(sessionDescription).then(function() {
      connection.createAnswer().then(function(answer) {
        connection.setLocalDescription(answer);
      });
    });
    // TODO send this answer back, probably via phoenix's socket.js
    console.log("join page");
  }
};

let hiddenPageDescriptor = document.getElementById('appPage');
if (hiddenPageDescriptor) {
  let pageInit = App[hiddenPageDescriptor.dataset.page];
  if (pageInit) {
    pageInit();
  }
}

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
