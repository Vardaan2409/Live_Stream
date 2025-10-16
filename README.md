# LiveStream Pro - RTSP Streaming with Custom Overlays

A professional full-stack web application for streaming RTSP video feeds with customizable text and image overlays. Built with React, Flask, and MongoDB.

![LiveStream Pro](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![React](https://img.shields.io/badge/react-18.2-blue)
![MongoDB](https://img.shields.io/badge/mongodb-latest-green)

## ✨ Features

- 📹 **RTSP Video Streaming** - Connect and stream from any RTSP source
- 🎨 **Custom Overlays** - Add text and image overlays with full customization
- 🎯 **Drag & Resize** - Intuitive positioning and resizing of overlays
- 💾 **Persistent Storage** - Save overlay configurations in MongoDB
- 🎛️ **Playback Controls** - Play, pause, and volume adjustment
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🔄 **Real-time Updates** - Live overlay management without page refresh
- 🎨 **Professional UI** - Modern design inspired by LiveSitter.com

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd livestream-app
```

2. **Setup Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/
DB_NAME=livestream_app
PORT=5000
FLASK_ENV=development
```

Start the server:
```bash
python app.py
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
```

4. **Access the Application**

Open your browser and visit: `http://localhost:3000`

## 📁 Project Structure

```
livestream-app/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Backend configuration
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── App.css           # Styling
│   │   └── main.jsx          # Entry point
│   ├── index.html            # HTML template
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   └── .env                  # Frontend configuration
│
├── API_DOCUMENTATION.md      # Complete API reference
├── SETUP_GUIDE.md           # Detailed setup instructions
└── README.md                # This file
```

## 🎯 Usage

### 1. Connect RTSP Stream

Enter your RTSP URL in the input field:
```
rtsp://example.com/stream
```

### 2. Create Overlays

- Click **"+ Add Overlay"**
- Choose overlay type (Text or Image)
- Customize appearance and content
- Click **"Create"**

### 3. Position Overlays

- **Drag** overlays to move them
- **Resize** using the bottom-right corner handle
- Changes save automatically

### 4. Manage Overlays

- 👁️ **Toggle visibility**
- ✏️ **Edit properties**
- 🗑️ **Delete overlays**

## 🔌 API Endpoints

### Overlays
- `POST /api/overlays` - Create overlay
- `GET /api/overlays` - Get all overlays
- `GET /api/overlays/:id` - Get specific overlay
- `PUT /api/overlays/:id` - Update overlay
- `DELETE /api/overlays/:id` - Delete overlay

### Settings
- `POST /api/settings` - Save settings
- `GET /api/settings` - Get settings

### Stream
- `GET /api/stream/status` - Get stream status
- `GET /api/health` - Health check

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API reference.

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **MongoDB** - NoSQL database
- **PyMongo** - MongoDB driver
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations
- **Fetch API** - HTTP requests

## 🎨 Color Palette

Inspired by LiveSitter.com:
- Primary: `#0f172a` (Dark Navy)
- Accent: `#f97316` (Orange)
- Background: `#f8fafc` (Light Gray)
- Text: `#1a202c` (Dark)

## 📋 Environment Variables

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

## 🔧 Development

### Run Backend
```bash
cd backend
source venv/bin/activate
python app.py
```

### Run Frontend
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
cd frontend
npm run build
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## ⚠️ Important Notes

### RTSP in Browsers

Modern browsers don't natively support RTSP playback. For production use:

1. **Use HLS transcoding** with FFmpeg:
```bash
ffmpeg -i rtsp://your-stream -c:v copy -c:a aac -f hls output.m3u8
```

2. **Use WebRTC** for real-time streaming

3. **Use a media server** like:
   - Wowza Streaming Engine
   - GStreamer
   - Nginx-RTMP

### Testing RTSP Streams

- **RTSP.me** - Create temporary test streams
- **VLC Media Player** - Stream local video files
- **IP Cameras** - Direct RTSP feeds

## 🐛 Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check virtual environment is activated
- Verify environment variables

### Frontend Issues
- Confirm backend is running on port 5000
- Check API URL in .env file
- Clear browser cache

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting.

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Complete installation and usage guide
- [API Documentation](API_DOCUMENTATION.md) - Full API reference with examples

## 🚀 Deployment

### Backend (Heroku)
```bash
heroku create your-app
heroku config:set MONGO_URI=your-mongodb-uri
git push heroku main
```

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

## 📄 License

This project is provided as-is for educational and development purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

For API usage, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

**Built with ❤️ using Flask, React, and MongoDB**