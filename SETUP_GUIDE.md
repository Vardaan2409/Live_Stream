# Quick Setup Commands

## 📋 File Structure Created

```
livestream-app/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── README.md
├── API_DOCUMENTATION.md
└── SETUP_GUIDE.md
```

## 🚀 Quick Start Commands

### Step 1: Create Project Structure

```bash
# Create main project directory
mkdir livestream-app
cd livestream-app

# Create backend structure
mkdir backend
cd backend
# Create files: app.py, requirements.txt, .env (copy content from artifacts)

# Go back and create frontend structure
cd ..
mkdir -p frontend/src
cd frontend
# Create files: package.json, vite.config.js, .env, index.html
cd src
# Create files: App.jsx, App.css, main.jsx
```

### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start MongoDB (if local)
# Windows: mongod
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Run backend server
python app.py
```

Backend will run on: `http://localhost:5000`

### Step 3: Setup Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

### Step 4: Open Application

Open your browser and visit: **http://localhost:3000**

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/
DB_NAME=livestream_app
PORT=5000
FLASK_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 📝 Testing RTSP Streams

### Option 1: Use a Test Video URL
Replace RTSP with HLS for browser testing:
```
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
```

### Option 2: Use VLC to Stream
1. Open VLC → Media → Stream
2. Add your video file
3. Select RTSP destination
4. Use: `rtsp://localhost:8554/stream`

### Option 3: Use FFmpeg
```bash
ffmpeg -re -i your-video.mp4 -c copy -f rtsp rtsp://localhost:8554/stream
```

## ✅ Verify Installation

### Check Backend
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

### Check Frontend
Open browser to `http://localhost:3000` - you should see the landing page.

## 🐛 Common Issues

### Backend Issues

**MongoDB Connection Error:**
```bash
# Make sure MongoDB is running
mongod

# Or check if service is running
# macOS: brew services list
# Linux: systemctl status mongod
```

**Port 5000 Already in Use:**
```bash
# Change PORT in backend/.env
PORT=5001

# Update VITE_API_URL in frontend/.env
VITE_API_URL=http://localhost:5001
```

### Frontend Issues

**Dependencies Install Failed:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Cannot connect to backend:**
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check VITE_API_URL in frontend/.env matches backend port
```

## 📦 Build for Production

### Backend
```bash
# Update app.py for production
# Change debug=True to debug=False

# Deploy to Heroku/Railway/DigitalOcean
```

### Frontend
```bash
cd frontend
npm run build

# Output will be in frontend/dist/
# Deploy to Vercel/Netlify/Cloudflare Pages
```

## 🎯 Next Steps

1. ✅ Create project structure
2. ✅ Copy all file contents
3. ✅ Install dependencies
4. ✅ Start MongoDB
5. ✅ Run backend server
6. ✅ Run frontend dev server
7. ✅ Test the application
8. 🎨 Add your RTSP stream URL
9. 🎨 Create custom overlays
10. 🚀 Deploy to production

## 📚 Additional Resources

- Full setup guide: See `SETUP_GUIDE.md`
- API reference: See `API_DOCUMENTATION.md`
- Project overview: See `README.md`

## 💡 Tips

- Use Chrome/Firefox for best compatibility
- RTSP streams need transcoding for browser playback (use HLS)
- Overlays are saved in MongoDB automatically
- All styling is responsive and mobile-friendly
- Color scheme matches LiveSitter.com (dark navy + orange)

## 🎨 Customization

### Change Colors
Edit `frontend/src/App.css`:
- Primary color: `#0f172a` (Dark Navy)
- Accent color: `#f97316` (Orange)
- Background: `#f8fafc` (Light Gray)

### Add New Features
- Backend: Add new routes in `backend/app.py`
- Frontend: Add new components in `frontend/src/`

## 🆘 Support

If you encounter any issues:
1. Check MongoDB is running
2. Verify all environment variables are set
3. Ensure both backend and frontend servers are running
4. Check browser console for errors
5. Review the detailed `SETUP_GUIDE.md`
