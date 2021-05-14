// const { Socket } = require("socket.io")

// const { PeerServer } = require("peer")

const socket = io('/')
const videoGrid = document.getElementById("video-grid")
const myvideoTag = document.createElement('video')
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'

})
let myVideoStream


navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream => {
    myvideoStream = stream;
    addVideoStream(myvideoTag, stream)

    peer.on("call", call => {
        call.answer(stream)
        const video = document.createElement("video")
        console.log("calling is doing");
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
            console.log("new users video function  connected");
        })
    })
    socket.on('user-connected', (userId) => {
        connectTONewUser(userId, stream)
        // console.log("calling the connectotnewuser function", userId);

    })


})


peer.on('open', id => {

    socket.emit('join-room', ROOM_ID, id);

})

const addVideoStream = (video, stream) => {
    console.log("add stram video is called");
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()

    })
    videoGrid.append(video)
}





function connectTONewUser(userId, stream) {
    console.log("new user function is called");
    const call = peer.call(userId, stream);

    const video = document.createElement("video")
    call.on("stream", userVideoStream => {
        console.log("calling once again add video stream");
        addVideoStream(video, userVideoStream)
    })
}


