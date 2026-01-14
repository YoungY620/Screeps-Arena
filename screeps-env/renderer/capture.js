const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER_URL = process.env.SCREEPS_SERVER || 'http://localhost:21025';

// 静态文件服务器
function startServer(port, rootDir) {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            let filePath = path.join(rootDir, req.url === '/' ? 'render.html' : req.url);
            filePath = filePath.split('?')[0];
            
            const ext = path.extname(filePath);
            const contentTypes = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.svg': 'image/svg+xml',
                '.png': 'image/png',
            };
            
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(404);
                    res.end(`Not found: ${filePath}`);
                    return;
                }
                res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
                res.end(content);
            });
        });
        
        server.listen(port, () => {
            console.log(`Static server at http://localhost:${port}`);
            resolve(server);
        });
    });
}

// 从 Screeps API 获取房间数据
async function fetchRoomData(roomName) {
    const fetch = (await import('node-fetch')).default;
    
    // 获取房间对象
    const objectsRes = await fetch(`${SERVER_URL}/api/game/room-objects?room=${roomName}`);
    const objectsData = await objectsRes.json();
    
    // 获取房间地形
    const terrainRes = await fetch(`${SERVER_URL}/api/game/room-terrain?room=${roomName}`);
    const terrainData = await terrainRes.json();
    
    // 获取游戏时间
    const timeRes = await fetch(`${SERVER_URL}/api/game/time`);
    const timeData = await timeRes.json();
    
    // 构建渲染器需要的状态格式 - objects 是数组！
    const roomState = {
        gameTime: timeData.time || 1,
        room: roomName,
        objects: [],  // 数组格式
        users: objectsData.users || {},
        visual: '',
        info: { mode: 'world' }
    };
    
    // 添加游戏对象（数组格式）
    if (objectsData.objects) {
        objectsData.objects.forEach(obj => {
            roomState.objects.push(obj);
        });
    }
    
    // 构建地形数组
    const terrain = [];
    if (terrainData.terrain) {
        terrainData.terrain.forEach(t => {
            terrain.push({
                room: roomName,
                x: t.x,
                y: t.y,
                type: t.type
            });
        });
    }
    
    return { roomState, terrain };
}

async function captureRoom(outputPath, roomState, terrain) {
    const PORT = 8888;
    const rootDir = __dirname;
    
    const server = await startServer(PORT, rootDir);
    
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 900, height: 900 });
        
        page.on('console', msg => console.log('Browser:', msg.text()));
        page.on('pageerror', err => console.error('Page error:', err.message));
        
        // 注入数据
        await page.evaluateOnNewDocument((data, terr) => {
            window.ROOM_DATA = data;
            window.TERRAIN_DATA = terr;
        }, roomState, terrain);
        
        await page.goto(`http://localhost:${PORT}/render.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // 等待渲染完成
        try {
            await page.waitForFunction(() => window.RENDER_COMPLETE || window.RENDER_ERROR, {
                timeout: 20000
            });
        } catch (e) {
            console.log('Timeout waiting for render, taking screenshot anyway...');
        }
        
        const error = await page.evaluate(() => window.RENDER_ERROR);
        if (error) {
            console.error(`Render error: ${error}`);
        }
        
        // 等待渲染和资源加载
        await new Promise(r => setTimeout(r, 2000));
        
        await page.screenshot({ path: outputPath, type: 'png' });
        console.log(`Screenshot saved to: ${outputPath}`);
        
        await browser.close();
    } finally {
        server.close();
    }
}

async function main() {
    const args = process.argv.slice(2);
    const roomName = args[0] || 'W6N5';
    const outputPath = args[1] || `${roomName}_screenshot.png`;
    
    console.log(`Fetching room ${roomName} from ${SERVER_URL}...`);
    
    try {
        const { roomState, terrain } = await fetchRoomData(roomName);
        console.log(`Got ${roomState.objects.length} objects, ${terrain.length} terrain tiles`);
        console.log(`Users: ${Object.keys(roomState.users).join(', ') || 'none'}`);
        
        // 保存数据用于调试
        fs.writeFileSync(`${roomName}_data.json`, JSON.stringify({ roomState, terrain }, null, 2));
        console.log(`Data saved to ${roomName}_data.json`);
        
        await captureRoom(outputPath, roomState, terrain);
    } catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
    }
}

main();
