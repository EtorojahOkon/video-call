const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket('wss://video-call.eu-4.evennode.com');

const constraints = {
    audio: true,
    video: true
}

const user = sessionStorage.getItem('username')

var peer = new Peer();

let videoStream;
let peerId
let screenStream;

/* Methods */
endCall = () => {
    sessionStorage.removeItem('username')
    window.location.href = '/'
}

toggleAudio = (element) => {
    let enabled = videoStream.getAudioTracks()[0].enabled;

    if (enabled) {
        videoStream.getAudioTracks()[0].enabled = false;
        element.innerHTML = '<i class="fa fa-microphone-slash text-danger"></i>'
    }
    else{
        videoStream.getAudioTracks()[0].enabled = true;
        element.innerHTML = '<i class="fa fa-microphone text-white"></i>'
    }
}

toggleVideo = (element) => {
    let enabled = videoStream.getVideoTracks()[0].enabled;

    if (enabled) {
        videoStream.getVideoTracks()[0].enabled = false;
        element.innerHTML = '<i class="fa fa-video-slash text-danger"></i>'
    }
    else{
        videoStream.getVideoTracks()[0].enabled = true;
        element.innerHTML = '<i class="fa fa-video text-white"></i>'
    }
}

addStream = (stream) => {
    const div = document.createElement('div')
    div.className = 'col-sm-3'
    const othervideo = document.createElement("video");
    othervideo.className = 'other-video'
    othervideo.autoplay = true
    othervideo.srcObject = stream
    div.appendChild(othervideo)
    document.getElementById('video-grid').appendChild(div)
}


/* Event Listeners*/
ws.addEventListener('open', function open() {
    
});

ws.addEventListener('message', function message(message) {
    let info= JSON.parse(message.data)

    if (info.status == 'call') {
        const call = peer.call(info.id, videoStream);
        call.on("stream", (userStream) => {
            addStream(userStream)
        });
    }
});

peer.on("open", (id) => {
    peerId = id
        ws.send(JSON.stringify({
        status : 'joined',
        'id' : peerId,
        'name' : user
    }))
});

peer.on("call", (call) => {
    call.answer(videoStream);
    call.on("stream", (userStream) => {
        addStream(userStream)
    });
});

window.addEventListener('load', () => {
    if (user == null) {
        window.location.href = '/'
        return
    }

    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        videoStream = stream
        let myplayer = document.createElement('video')
        myplayer.autoplay = true
        myplayer.className = 'my-player'
        myplayer.srcObject = stream
        document.getElementById('my-video').appendChild(myplayer)
    })
    .catch(error => {
        console.log(error)
    })
})