// const { Socket } = require("socket.io")

// const { PeerServer } = require("peer")

const socket = io('/')
const videoGrid = document.getElementById("video-grid")
const myvideoTag = document.createElement('video')
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'

})
let myVideoStream;


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
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

    let text = $('input')
    $('html').keydown((e)=>{
        if(e.which==13 && text.val()!==0){
            
            socket.emit('message',text.val())
            text.val('')
        }
    })
    socket.on('createMessage',message=>{
        $('ul').append(`<li><span>User</span></br>${message}</li>`);
        scrollToBottom();
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





const connectTONewUser=(userId, stream) =>{
    console.log("new user function is called");
    const call = peer.call(userId, stream);

    const video = document.createElement("video")
    call.on("stream", userVideoStream => {
        console.log("calling once again add video stream");
        addVideoStream(video, userVideoStream)
    })
}


const scrollToBottom = ()=>{
 let d =$('.main__chat_window');
 d.scrollTop(d.prop("scrollHeight"));   
}

const muteUnmute =()=>{
    console.log(myVideoStream);
   const enabled = myVideoStream.getAudiotracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudiotracks()[0].enabled=false;
        setUnMuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudiotracks()[0].enabled=true;
    }
}
const setMuteButton =()=>{
    const html =`<i class="fas fa-microphone"></i>
    <span>mute</span>`
    document.querySelector('main__mute_button').innerHTML=html;
}

const setUnMuteButton =()=>{
    const html =`<i class="fas fa-microphone-slash"></i>
    <span>unmute</span>` 
    document.querySelector('main__mute_button').innerHTML=html;
}


const playStop =()=>{
    let enabled = myVideoStream.getVideotracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideotracks()[0].enabled=false;
        setPlayVideo()
    }
    else{
        setStopVideo()
        myVideoStream.getVideotracks()[0].enabled=true;
    }
}


const setPlayVideo = ()=>{
    const html =   `
    <i class="fas fa-video-slash"></i>
    <span>play video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}

const setStopVideo = ()=>{
    const html =   `
    <i class="fas fa-video></i>
    <span>stop video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}