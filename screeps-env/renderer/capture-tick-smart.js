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

// 从 Screeps API 获取当前房间数据
async function fetchCurrentRoomData(roomName) {
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
    
    return { objectsData, terrainData, timeData };
}

// 尝试从 history 插件获取指定tick的历史数据
async function fetchHistoryRoomData(roomName, tick) {
    const fetch = (await import('node-fetch')).default;
    
    console.log(`Attempting to fetch history for room ${roomName}, tick ${tick}...`);
    
    // 尝试多个可能的history API端点
    const endpoints = [
        `/api/room-history/${roomName}/${tick}.json`,
        `/room-history/${roomName}/${tick}.json`,
        `/api/game/room-history/${roomName}/${tick}`,
        `/api/history/${roomName}/${tick}`,
        `/history/${roomName}/${tick}.json`
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`Trying endpoint: ${SERVER_URL}${endpoint}`);
            const response = await fetch(SERVER_URL + endpoint);
            
            if (response.ok) {
                const historyData = await response.json();
                console.log(`Successfully retrieved history data from ${endpoint}`);
                
                // 获取地形数据（地形通常不变，使用当前地形）
                const terrainRes = await fetch(`${SERVER_URL}/api/game/room-terrain?room=${roomName}`);
                const terrainData = await terrainRes.json();
                
                return {
                    objectsData: { 
                        objects: historyData.ticks[tick] || {}, 
                        users: historyData.users || {} 
                    },
                    terrainData,
                    timeData: { time: tick }
                };
            } else {
                console.log(`  -> ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.log(`  -> Error: ${error.message}`);
        }
    }
    
    throw new Error('All history API endpoints failed');
}

// 模拟历史数据（用于测试或当history插件不可用时）
function generateSimulatedHistory(roomName, targetTick, currentData) {
    console.log(`Generating simulated history for tick ${targetTick}...`);
    
    // 基于当前数据创建一些变化来模拟历史状态
    const simulatedObjects = [];
    const currentTick = currentData.timeData.time;
    const tickDiff = currentTick - targetTick;
    
    if (currentData.objectsData.objects) {
        currentData.objectsData.objects.forEach(obj => {
            const simulatedObj = { ...obj };
            
            // 根据tick差异模拟一些变化
            if (obj.type === 'creep') {
                // 模拟creep移动 - 随机位置变化
                const moveRange = Math.min(10, Math.floor(tickDiff / 100));
                if (moveRange > 0) {
                    simulatedObj.x = Math.max(0, Math.min(49, obj.x + Math.floor(Math.random() * moveRange * 2) - moveRange));
                    simulatedObj.y = Math.max(0, Math.min(49, obj.y + Math.floor(Math.random() * moveRange * 2) - moveRange));
                }
                
                // 模拟能量消耗
                if (obj.store && obj.store.energy) {
                    const energyConsumption = Math.floor(tickDiff * 0.1);
                    simulatedObj.store = {
                        ...obj.store,
                        energy: Math.max(0, obj.store.energy - energyConsumption)
                    };
                }
            }
            
            if (obj.type === 'source') {
                // 模拟能量再生
                const regenAmount = Math.floor(tickDiff / 300) * 400; // 每300tick再生400能量
                simulatedObj.energy = Math.min(obj.energyCapacity || 4000, (obj.energy || 0) + regenAmount);
            }
            
            simulatedObjects.push(simulatedObj);
        });
    }
    
    return {
        objectsData: { 
            objects: simulatedObjects, 
            users: currentData.objectsData.users || {} 
        },
        terrainData: currentData.terrainData,
        timeData: { time: targetTick }
    };
}

// 从保存的数据文件加载历史状态
function loadSavedHistoryState(roomName, tick) {
    const possibleFiles = [
        `${roomName}_tick_${tick}_data.json`,
        `${roomName}_data.json`,
        `saved_states/${roomName}_tick_${tick}.json`,
        `history/${roomName}_tick_${tick}.json`
    ];
    
    for (const file of possibleFiles) {
        if (fs.existsSync(file)) {
            console.log(`Loading saved state from ${file}...`);
            try {
                const data = JSON.parse(fs.readFileSync(file, 'utf8'));
                return {
                    objectsData: data.roomState || data.objectsData,
                    terrainData: data.terrain || data.terrainData,
                    timeData: { time: tick }
                };
            } catch (error) {
                console.log(`  -> Error loading ${file}: ${error.message}`);
            }
        }
    }
    
    return null;
}

// 构建渲染器需要的状态格式
function buildRoomState(roomName, objectsData, terrainData, timeData) {
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
        // 处理不同格式的对象数据
        if (Array.isArray(objectsData.objects)) {
            objectsData.objects.forEach(obj => {
                roomState.objects.push(obj);
            });
        } else if (typeof objectsData.objects === 'object') {
            // 如果是对象格式（历史数据可能是这样），转换为数组
            Object.values(objectsData.objects).forEach(obj => {
                roomState.objects.push(obj);
            });
        }
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
    const PORT = 8890; // 使用不同端口避免冲突
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
    
    if (args.length < 2) {
        console.log('Usage: node capture-tick-smart.js <roomName> <tick> [outputFile] [options]');
        console.log('');
        console.log('Parameters:');
        console.log('  roomName    - Room name (e.g., W6N5)');
        console.log('  tick        - Tick number, "current", or "saved"');
        console.log('  outputFile  - Output filename (optional)');
        console.log('');
        console.log('Options:');
        console.log('  --simulate  - Generate simulated history when real history unavailable');
        console.log('  --save      - Save the state data for future use');
        console.log('');
        console.log('Examples:');
        console.log('  node capture-tick-smart.js W6N5 current                    # 当前状态');
        console.log('  node capture-tick-smart.js W6N5 5000                      # 尝试获取tick 5000');
        console.log('  node capture-tick-smart.js W6N5 5000 --simulate          # 模拟tick 5000');
        console.log('  node capture-tick-smart.js W6N5 saved W6N5_old.png        # 使用保存的数据');
        process.exit(1);
    }
    
    const roomName = args[0];
    const tickArg = args[1];
    const outputFile = args[2] && !args[2].startsWith('--') ? args[2] : `${roomName}_tick_${tickArg}.png`;
    const options = {
        simulate: args.includes('--simulate'),
        save: args.includes('--save')
    };
    
    try {
        let roomData;
        
        if (tickArg === 'current') {
            console.log(`Fetching current state for room ${roomName}...`);
            const currentData = await fetchCurrentRoomData(roomName);
            roomData = buildRoomState(roomName, currentData.objectsData, currentData.terrainData, currentData.timeData);
            
        } else if (tickArg === 'saved') {
            console.log(`Looking for saved state data...`);
            const savedData = loadSavedHistoryState(roomName, tickArg);
            if (!savedData) {
                throw new Error('No saved state data found');
            }
            roomData = buildRoomState(roomName, savedData.objectsData, savedData.terrainData, savedData.timeData);
            
        } else {
            const targetTick = parseInt(tickArg);
            if (isNaN(targetTick)) {
                throw new Error(`Invalid tick number: ${tickArg}`);
            }
            
            console.log(`Fetching data for room ${roomName} at tick ${targetTick}...`);
            
            // 首先获取当前数据作为基础
            const currentData = await fetchCurrentRoomData(roomName);
            
            try {
                // 尝试获取真实的历史数据
                const historyData = await fetchHistoryRoomData(roomName, targetTick);
                roomData = buildRoomState(roomName, historyData.objectsData, historyData.terrainData, historyData.timeData);
                console.log('Successfully retrieved real historical data');
                
            } catch (historyError) {
                console.log(`Failed to get real history: ${historyError.message}`);
                
                if (options.simulate) {
                    // 生成模拟历史数据
                    const simulatedData = generateSimulatedHistory(roomName, targetTick, currentData);
                    roomData = buildRoomState(roomName, simulatedData.objectsData, simulatedData.terrainData, simulatedData.timeData);
                } else {
                    throw new Error(`History data not available for tick ${targetTick}. Use --simulate to generate simulated history.`);
                }
            }
        }
        
        console.log(`Got ${roomData.roomState.objects.length} objects, ${roomData.terrain.length} terrain tiles`);
        console.log(`Users: ${Object.keys(roomData.roomState.users).join(', ') || 'none'}`);
        console.log(`Game time: ${roomData.roomState.gameTime}`);
        
        // 保存数据用于调试或将来使用
        if (options.save || tickArg !== 'current') {
            const dataFile = `${roomName}_tick_${tickArg}_data.json`;
            fs.writeFileSync(dataFile, JSON.stringify(roomData, null, 2));
            console.log(`Data saved to ${dataFile}`);
        }
        
        await captureRoom(outputFile, roomData.roomState, roomData.terrain);
        
    } catch (e) {
        console.error('Error:', e.message);
        console.error('Stack:', e.stack);
        process.exit(1);
    }
}

main();