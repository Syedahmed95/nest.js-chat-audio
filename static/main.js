const socket = io("http://localhost:3000")
var mediaRecorder,
    audioChunks,
    audio,
    playAudio = function(){}
const createRoomID = ()=>{
    let getroomID = document.getElementById("roomID").value;
    if(getroomID){
        socket.emit("createRoom",getroomID)
    }
}
const joinRoomID = ()=> {
    let getJoinRoomID = document.getElementById("joinRoomID").value
    if(getJoinRoomID){
        socket.emit("joinRoom",getJoinRoomID)
        let getChatWindow = document.getElementById("chatWindow")
        getChatWindow.style.visibility = "visible"
    }
}

const sendMessage = () => {
    let getMessage = document.getElementById("messageInput").value
    if(getMessage){
        socket.emit("messageToServer",getMessage)
        document.getElementById("messageInput").value = ""

        let messagesList = document.createElement("li")
        messagesList.className = "message right appeared"
        let createDivAvatar = document.createElement("div")
        createDivAvatar.className = "avatar"
        let createDivText = document.createElement("div")
        createDivText.className = "text_wrapper"
        let createDivMessage = document.createElement("div")
        createDivMessage.className = "text"
        createDivMessage.innerHTML = getMessage

        createDivText.appendChild(createDivMessage)
        messagesList.appendChild(createDivAvatar)
        messagesList.appendChild(createDivText)

        document.getElementById("messages-list").appendChild(messagesList)
    }
}

const getMessage = () => {
    socket.on("chat_message",(data)=>{
        let getChatWindow = document.getElementById("chatWindow")
        getChatWindow.style.visibility = "visible"
        
        let messagesList = document.createElement("li")
        messagesList.className = "message left appeared"
        let createDivAvatar = document.createElement("div")
        createDivAvatar.className = "avatar"
        let createDivText = document.createElement("div")
        createDivText.className = "text_wrapper"
        let createDivMessage = document.createElement("div")
        createDivMessage.className = "text"
        createDivMessage.innerHTML = data

        createDivText.appendChild(createDivMessage)
        messagesList.appendChild(createDivAvatar)
        messagesList.appendChild(createDivText)

        document.getElementById("messages-list").appendChild(messagesList)
    })
}
getMessage()

const getAudio = async()=>{
    audio = await navigator.mediaDevices.getUserMedia({audio: true})
    mediaRecorder = new MediaRecorder(audio)
    mediaRecorder.start()
    audioChunks = []
    mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });
}

const stopAudio = async()=>{
    if(mediaRecorder){
        mediaRecorder.stop()
        mediaRecorder.stream.getAudioTracks().forEach((data)=>{
            data.stop()
        })
        setTimeout(()=>{
            socket.emit("audioRecieve",{audio: audioChunks[0]})
        },0)
    }
}

socket.on("audioMessage",(data)=>{
    let play = document.getElementById("playAudio")
        play.style.visibility = "visible"
    playAudio = async()=>{
        const audioBlob = new Blob([data.audio]);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        play = audio.play();
    }
})
playAudio()
