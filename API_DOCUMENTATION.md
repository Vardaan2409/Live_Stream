# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Health Check

#### GET `/health`
Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

---

### Overlays

#### POST `/overlays`
Create a new overlay.

**Request Body:**
```json
{
  "name": "Company Logo",
  "type": "text",
  "content": "LIVE",
  "position": {
    "x": 50,
    "y": 50
  },
  "size": {
    "width": 200,
    "height": 50
  },
  "style": {
    "fontSize": "16px",
    "color": "#FFFFFF",
    "backgroundColor": "rgba(0, 0, 0, 0.5)",
    "fontWeight": "normal"
  },
  "visible": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Overlay created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Company Logo",
    "type": "text",
    "content": "LIVE",
    "position": { "x": 50, "y": 50 },
    "size": { "width": 200, "height": 50 },
    "style": {
      "fontSize": "16px",
      "color": "#FFFFFF",
      "backgroundColor": "rgba(0, 0, 0, 0.5)",
      "fontWeight": "normal"
    },
    "visible": true,
    "created_at": "2025-10-15T10:30:00.000Z",
    "updated_at": "2025-10-15T10:30:00.000Z"
  }
}
```

#### GET `/overlays`
Get all overlays.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Company Logo",
      "type": "text",
      "content": "LIVE",
      "position": { "x": 50, "y": 50 },
      "size": { "width": 200, "height": 50 },
      "style": { ... },
      "visible": true,
      "created_at": "2025-10-15T10:30:00.000Z",
      "updated_at": "2025-10-15T10:30:00.000Z"
    }
  ]
}
```

#### GET `/overlays/:overlay_id`
Get a specific overlay by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Company Logo",
    ...
  }
}
```

#### PUT `/overlays/:overlay_id`
Update an existing overlay.

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Logo",
  "visible": false,
  "position": { "x": 100, "y": 100 }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Overlay updated successfully",
  "data": { ... }
}
```

#### DELETE `/overlays/:overlay_id`
Delete an overlay.

**Response:**
```json
{
  "success": true,
  "message": "Overlay deleted successfully"
}
```

---

### Settings

#### POST `/settings`
Save or update application settings.

**Request Body:**
```json
{
  "rtsp_url": "rtsp://example.com/stream",
  "volume": 80,
  "autoplay": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings saved successfully",
  "data": {
    "rtsp_url": "rtsp://example.com/stream",
    "volume": 80,
    "autoplay": false,
    "updated_at": "2025-10-15T10:30:00.000Z"
  }
}
```

#### GET `/settings`
Get application settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "rtsp_url": "rtsp://example.com/stream",
    "volume": 80,
    "autoplay": false
  }
}
```

---

### Stream

#### GET `/stream/status`
Get current stream status.

**Response:**
```json
{
  "success": true,
  "data": {
    "active": true,
    "rtsp_url": "rtsp://example.com/stream"
  }
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Types

### Overlay Type
- `text` - Text overlay
- `image` - Image overlay (using URL)

### Position Object
```json
{
  "x": 50,    // X coordinate in pixels
  "y": 50     // Y coordinate in pixels