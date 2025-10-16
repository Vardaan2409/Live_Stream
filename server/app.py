from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from datetime import datetime
import cv2
import threading
import queue

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('DB_NAME', 'livestream_app')

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
overlays_collection = db['overlays']
settings_collection = db['settings']

# Video streaming setup
stream_queue = queue.Queue(maxsize=10)
current_rtsp_url = None
streaming_active = False

def json_serialize(data):
    """Convert MongoDB ObjectId to string"""
    if isinstance(data, list):
        return [{**item, '_id': str(item['_id'])} for item in data]
    elif isinstance(data, dict) and '_id' in data:
        return {**data, '_id': str(data['_id'])}
    return data

# ============ OVERLAY CRUD ENDPOINTS ============

@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    """Create a new overlay"""
    try:
        data = request.json
        overlay = {
            'name': data.get('name', 'Untitled Overlay'),
            'type': data.get('type', 'text'),  # text or image
            'content': data.get('content', ''),
            'position': data.get('position', {'x': 50, 'y': 50}),
            'size': data.get('size', {'width': 200, 'height': 50}),
            'style': data.get('style', {
                'fontSize': '16px',
                'color': '#FFFFFF',
                'backgroundColor': 'rgba(0, 0, 0, 0.5)',
                'fontWeight': 'normal'
            }),
            'visible': data.get('visible', True),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = overlays_collection.insert_one(overlay)
        overlay['_id'] = str(result.inserted_id)
        
        return jsonify({
            'success': True,
            'message': 'Overlay created successfully',
            'data': json_serialize(overlay)
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    """Get all overlays"""
    try:
        overlays = list(overlays_collection.find())
        return jsonify({
            'success': True,
            'data': json_serialize(overlays)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    """Get a specific overlay by ID"""
    try:
        overlay = overlays_collection.find_one({'_id': ObjectId(overlay_id)})
        if not overlay:
            return jsonify({'success': False, 'message': 'Overlay not found'}), 404
        
        return jsonify({
            'success': True,
            'data': json_serialize(overlay)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    """Update an existing overlay"""
    try:
        data = request.json
        update_data = {
            'updated_at': datetime.utcnow()
        }
        
        if 'name' in data:
            update_data['name'] = data['name']
        if 'type' in data:
            update_data['type'] = data['type']
        if 'content' in data:
            update_data['content'] = data['content']
        if 'position' in data:
            update_data['position'] = data['position']
        if 'size' in data:
            update_data['size'] = data['size']
        if 'style' in data:
            update_data['style'] = data['style']
        if 'visible' in data:
            update_data['visible'] = data['visible']
        
        result = overlays_collection.update_one(
            {'_id': ObjectId(overlay_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'success': False, 'message': 'Overlay not found'}), 404
        
        updated_overlay = overlays_collection.find_one({'_id': ObjectId(overlay_id)})
        
        return jsonify({
            'success': True,
            'message': 'Overlay updated successfully',
            'data': json_serialize(updated_overlay)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    """Delete an overlay"""
    try:
        result = overlays_collection.delete_one({'_id': ObjectId(overlay_id)})
        
        if result.deleted_count == 0:
            return jsonify({'success': False, 'message': 'Overlay not found'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Overlay deleted successfully'
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ============ SETTINGS ENDPOINTS ============

@app.route('/api/settings', methods=['POST'])
def save_settings():
    """Save or update app settings"""
    try:
        data = request.json
        settings = {
            'rtsp_url': data.get('rtsp_url', ''),
            'volume': data.get('volume', 100),
            'autoplay': data.get('autoplay', False),
            'updated_at': datetime.utcnow()
        }
        
        # Upsert settings (update if exists, insert if not)
        result = settings_collection.update_one(
            {'type': 'app_settings'},
            {'$set': settings},
            upsert=True
        )
        
        return jsonify({
            'success': True,
            'message': 'Settings saved successfully',
            'data': settings
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/settings', methods=['GET'])
def get_settings():
    """Get app settings"""
    try:
        settings = settings_collection.find_one({'type': 'app_settings'})
        if not settings:
            settings = {
                'rtsp_url': '',
                'volume': 100,
                'autoplay': False
            }
        else:
            settings = json_serialize(settings)
        
        return jsonify({
            'success': True,
            'data': settings
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ============ STREAM ENDPOINTS ============

@app.route('/api/stream/status', methods=['GET'])
def stream_status():
    """Get stream status"""
    return jsonify({
        'success': True,
        'data': {
            'active': streaming_active,
            'rtsp_url': current_rtsp_url
        }
    }), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Server is running',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)