const userVideo = document.getElementById('user-video');
const startButton = document.getElementById('start-btn');
const urlInput = document.getElementById('urlInput');
const apiInput = document.getElementById('apiKeyfield');
const urlSender = document.getElementById('urlSender');

const state = { media: null };
const socket = io();
const urlBody = { url: null, apiKey: null };

startButton.addEventListener('click', async () => {
    if (state.media) {
        const mediaRecorder = new MediaRecorder(state.media, {
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            framerate: 25
        });

        mediaRecorder.ondataavailable = ev => {
            console.log("binary stream available", ev.data);
            socket.emit('binaryStream', ev.data);
        };

        mediaRecorder.start(25);
    } else {
        console.log("Media stream not available");
    }
});

window.addEventListener('load', async () => {
    const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    state.media = media;
    userVideo.srcObject = media;
});

urlInput.addEventListener('change', (e) => {
    urlBody.url = e.target.value;
});

apiInput.addEventListener('change', (e) => {
    urlBody.apiKey = e.target.value;
});

urlSender.addEventListener('click', async () => {
    try {
        const response = await fetch("http://localhost:8080/streamId", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(urlBody)
        });

        if (!response.ok) {
            throw new Error('Failed to set stream URL');
        }

        console.log("Stream URL set successfully");
    } catch (error) {
        console.error('Error setting stream URL:', error);
    }
});
