import http from "http";
import express from "express";
import path from "path";
import { Server as SocketIO } from 'socket.io';
import { spawn } from 'child_process';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

let ffmpegProcess: any = null;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../public')));

io.on('connection', socket => {
    console.log('socket connected', socket.id);
    socket.on('binaryStream', stream => {
        console.log("binary stream incoming");
        if (ffmpegProcess && !ffmpegProcess.killed) {
            //@ts-ignore
            ffmpegProcess.stdin.write(stream, (err) => {
                if (err) {
                    console.error('Error writing to ffmpeg stdin:', err);
                }
            });
        } else {
            socket.send("Enter a valid URL and API key first.");
        }
    });
});

app.post("/streamId", (req, res) => {
    const { url, apiKey } = req.body;

    if (!url || !apiKey) {
        return res.status(400).json({ error: "URL and API key are required." });
    }

    const streamUrl = `${url}/${apiKey}`;

    const options = [
        '-i',
        '-',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-r', `${25}`,
        '-g', `${25 * 2}`,
        '-keyint_min', 25,
        '-crf', '25',
        '-pix_fmt', 'yuv420p',
        '-sc_threshold', '0',
        '-profile:v', 'main',
        '-level', '3.1',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', 128000 / 4,
        '-f', 'flv',
        streamUrl,
    ];

    if (ffmpegProcess && !ffmpegProcess.killed) {
        ffmpegProcess.kill();
    }
    //@ts-ignore
    ffmpegProcess = spawn('ffmpeg', options);
    //@ts-ignore
    ffmpegProcess.stdout.on('data', (data) => {
        console.log(`ffmpeg stdout: ${data}`);
    });
    //@ts-ignore
    ffmpegProcess.stderr.on('data', (data) => {
        console.log(`ffmpeg stderr: ${data}`);
    });

    //@ts-ignore
    ffmpegProcess.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}`);
    });

    res.json("URL set successfully");
});

server.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
