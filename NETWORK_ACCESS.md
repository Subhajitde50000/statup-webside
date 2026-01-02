# Network Access Setup Guide

## ✅ Configuration Complete!

Your Electronics website is now accessible from other devices on the same WiFi network.

## 🌐 Access URLs

### From This Computer (Host):
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### From Other Devices on Same WiFi:
- Frontend: http://172.23.208.159:3000
- Backend: http://172.23.208.159:8000

## 📱 Steps to Access from Another Device:

1. **Make sure both devices are on the same WiFi network**

2. **On the other device, open a web browser and go to:**
   ```
   http://172.23.208.159:3000
   ```

3. **Important Notes:**
   - If your computer's IP changes (after restart), you'll need to update it
   - Make sure Windows Firewall allows Node.js and Python connections
   - Keep both backend and frontend servers running

## 🔧 What Was Changed:

### Backend (Python FastAPI):
- ✅ Running on `0.0.0.0:8000` (accepts connections from network)
- ✅ Added CORS origins for local IP: `172.23.208.159`

### Frontend (Next.js):
- ✅ Updated `.env.local` with network IP
- ✅ API calls now use `http://172.23.208.159:8000`

## 🔍 Finding Your IP Address (if it changes):

Run this command in PowerShell:
```powershell
ipconfig | Select-String "IPv4"
```

Look for the IPv4 Address (usually starts with 192.168.x.x or 172.x.x.x)

## 🛠️ Restart Commands (if needed):

### Backend:
```powershell
cd python_backnd
.\.venv\Scripts\Activate.ps1
uvicorn main:socket_app --host 0.0.0.0 --port 8000 --reload
```

### Frontend:
```powershell
cd fontend
npm run dev
```

## 🔒 Firewall Issues?

If the other device can't connect, you may need to allow the ports through Windows Firewall:

1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter "3000, 8000" → Next
6. Select "Allow the connection" → Next
7. Check all profiles → Next
8. Name it "Electronics Dev Server" → Finish

## ✨ Testing:

From another device, try accessing:
- http://172.23.208.159:8000/health (should show: {"status":"healthy"})
- http://172.23.208.159:3000 (should load the website)

Enjoy your multi-device development! 🎉
