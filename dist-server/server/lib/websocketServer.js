/**
 * Maza Bridge v3 — WebSocket Server
 * Studio Server ↔ Extension Bridge
 *
 * 기존 Express 서버에 통합됩니다.
 * 원칙: 연결 관리만 — Queue/Workflow는 다른 모듈 책임
 */
import { WebSocketServer, WebSocket } from 'ws';
const clients = new Map();
let _wss = null;
/**
 * WebSocket 서버 초기화 (기존 HTTP 서버에 업그레이드)
 */
export function initWebSocketServer(httpServer) {
    _wss = new WebSocketServer({ server: httpServer, path: '/ws' });
    _wss.on('connection', (ws, req) => {
        const ip = req.socket.remoteAddress;
        console.log(`[WS] Extension connected from ${ip}`);
        // 연결 즉시 등록 (PING 타임아웃 방지)
        clients.set(ws, {
            connectedAt: Date.now(),
            alive: true,
            userId: 'anonymous'
        });
        ws.on('message', (raw) => {
            let data;
            try {
                data = JSON.parse(raw.toString());
            }
            catch {
                return;
            }
            console.log('[WS] ←', data.type);
            switch (data.type) {
                case 'EXTENSION_CONNECTED':
                    // 클라이언트 정보 업데이트
                    const existingMeta = clients.get(ws);
                    if (existingMeta) {
                        existingMeta.userId = data.userId || 'anonymous';
                        existingMeta.alive = true;
                    }
                    else {
                        clients.set(ws, {
                            connectedAt: Date.now(),
                            alive: true,
                            userId: data.userId || 'anonymous'
                        });
                    }
                    console.log(`[WS] Extension registered for user: ${data.userId}. Total:`, clients.size);
                    break;
                case 'ACTION_PROGRESS':
                    handleActionProgress(data);
                    break;
                case 'ACTION_RESULT':
                    // 익스텐션이 DOM 액션 완료 후 결과 보고
                    handleActionResult(data);
                    break;
                case 'ACTION_ERROR':
                    handleActionError(data);
                    break;
                case 'PAGE_PUBLISHED':
                    // 발행 완료 URL 수신
                    handlePagePublished(data);
                    break;
                case 'PONG':
                    const meta = clients.get(ws);
                    if (meta)
                        meta.alive = true;
                    break;
            }
        });
        ws.on('close', () => {
            clients.delete(ws);
            console.log('[WS] Extension disconnected. Total:', clients.size);
        });
        ws.on('error', (err) => {
            console.error('[WS] Error:', err.message);
            clients.delete(ws);
        });
    });
    // Heartbeat: 30초마다 PING (죽은 연결 정리)
    setInterval(() => {
        for (const [ws, meta] of clients.entries()) {
            if (!meta.alive) {
                ws.terminate();
                clients.delete(ws);
                continue;
            }
            meta.alive = false;
            ws.send(JSON.stringify({ type: 'PING' }));
        }
    }, 30000);
    // System Stats Broadcaster: 10초마다 지표 전송 (AGENTS.md: Phase 5)
    setInterval(async () => {
        try {
            const { getSystemStats } = await import('../routes/health.js');
            const stats = await getSystemStats();
            broadcast({ type: 'SYSTEM_HEALTH_UPDATE', data: stats });
        }
        catch (err) {
            // Sliently fail if stats are unavailable
        }
    }, 10000);
    console.log('[WS] WebSocket Server ready on /ws');
    return _wss;
}
/**
 * 연결된 모든 익스텐션에 메시지 브로드캐스트
 */
export function broadcast(message) {
    const payload = JSON.stringify(message);
    let sent = 0;
    for (const ws of clients.keys()) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(payload);
            sent++;
        }
    }
    console.log(`[WS] → Broadcast to ${sent} extension(s):`, message.type);
    return sent;
}
/**
 * 특정 사용자에게 메시지 전송
 */
export function sendToUser(userId, message) {
    const payload = JSON.stringify(message);
    let sent = 0;
    for (const [ws, meta] of clients.entries()) {
        if (meta.userId === userId && ws.readyState === WebSocket.OPEN) {
            ws.send(payload);
            sent++;
        }
    }
    if (sent > 0) {
        console.log(`[WS] → Sent to user ${userId}:`, message.type);
    }
    return sent;
}
/**
 * 연결된 익스텐션 수 반환
 */
export function getConnectedCount() {
    return clients.size;
}
// ── 이벤트 핸들러 (콜백 방식으로 확장 가능) ────────────────
const resultHandlers = new Map(); // jobId → { resolve, reject }
export function waitForResult(jobId, timeoutMs = 30000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            resultHandlers.delete(jobId);
            reject(new Error(`Job ${jobId} timed out after ${timeoutMs}ms`));
        }, timeoutMs);
        resultHandlers.set(jobId, { resolve, reject, timer });
    });
}
function handleActionResult(data) {
    const handler = resultHandlers.get(data.jobId);
    if (handler) {
        clearTimeout(handler.timer);
        resultHandlers.delete(data.jobId);
        handler.resolve(data.result);
    }
}
function handleActionError(data) {
    const handler = resultHandlers.get(data.jobId);
    if (handler) {
        clearTimeout(handler.timer);
        resultHandlers.delete(data.jobId);
        handler.reject(new Error(data.error));
    }
}
function handlePagePublished(data) {
    console.log('[WS] 🎉 Page published:', data.url);
    // TODO: Workflow Engine에 발행 완료 이벤트 전달
}
async function handleActionProgress(data) {
    const { userId, jobId, status, progress, task, metadata, log, replayData } = data;
    if (!userId || userId === 'anonymous')
        return;
    const { supabaseAdmin } = await import('./supabaseServer.js');
    if (!supabaseAdmin)
        return;
    try {
        const statusMetadata = {
            ...(metadata || {}),
            log: log || [],
            replayData: replayData || null
        };
        await supabaseAdmin
            .from('ms_autopilot_status')
            .upsert({
            user_id: userId,
            active_job_id: jobId,
            status: status || 'EXECUTING',
            progress: progress || 0,
            current_task: task || '',
            metadata: statusMetadata,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        // Permanent log for history
        if (status === 'DONE' || status === 'ERROR') {
            await supabaseAdmin
                .from('ms_events')
                .insert({
                user_id: userId,
                event_type: 'mission_complete',
                payload: {
                    jobId,
                    status,
                    task,
                    replayData: replayData || null,
                    error: data.error || null
                },
                created_at: new Date().toISOString()
            });
        }
        // Broadcast to other extensions/clients if needed
        // In this case, Supabase Realtime will handle the web app update
    }
    catch (err) {
        console.error('[WS] Failed to update autopilot status:', err);
    }
}
