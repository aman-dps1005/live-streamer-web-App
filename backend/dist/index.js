"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const child_process_1 = require("child_process");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
let ffmpegProcess = null;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../public')));
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
        }
        else {
            socket.send("Enter a valid URL and API key first.");
        }
    });
});
app.post("/streamId", (req, res) => {
    const { url, apiKey } = req.body;
    if (!url || !apiKey) {
        return res.status(400).json({ error: "URL and API key are required." });
    }
    try {
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
        ffmpegProcess = (0, child_process_1.spawn)('ffmpeg', options);
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
    }
    catch (err) {
        console.log(err);
    }
    res.json("URL set successfully");
});
server.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
