from flask import Flask, jsonify, request, send_from_directory, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import deepl
from dotenv import load_dotenv
import os
from functools import wraps
import jwt
import datetime
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

from app_config import config

load_dotenv(dotenv_path='.env')  # loading environment variables

env = os.environ.get('FLASK_ENV', 'development')
app = Flask(__name__)
app.config.from_object(config[env])

# Initialize services
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# Initialize translator 
auth_key = os.getenv("DEEPL_AUTH_KEY")
translator = deepl.Translator(auth_key)

from backendfiles.models import User, Translation

# Test route for server 
@app.route("/")
def test():
    return jsonify({"message": "Backend is working!"})

@app.route("/translate", methods=['POST'])
def translate():
    input_text = request.json.get("inputText")
    target_language = request.json.get("targetLanguage")

    if not input_text or not target_language:
        return jsonify({"error": "Missing input or target language"}), 400

    try:
        result = translator.translate_text(input_text, target_lang=target_language)
        return jsonify({"translation": result.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# TOKEN
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'Token is missing.'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# REGISTRATION/AUTHENTICATION/LOGOUT
@app.route("/register", methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], email=data['email'], password_hashed=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    #new user token
    token = jwt.encode({
        'user_id': new_user.id,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=30)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'message': 'Your account has been created!', 'token': token}), 201

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password_hashed, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=30)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'token': token})

@app.route("/logout", methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out!'}), 200

# PROTECTED ROUTES
@app.route('/user/translations', methods=['GET'])
@token_required
def get_user_translations(current_user):
    translations = Translation.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': t.id,
        'input_text': t.input_text,
        'translated_text': t.translated_text,
        'input_language': t.input_language,
        'target_language': t.target_language,
        'timestamp': t.timestamp
    } for t in translations]), 200


@app.route('/get-user-info', methods=['GET'])
@token_required
def get_user_info(current_user):
    return jsonify({
        'username': current_user.username,
        'email': current_user.email
    }), 200

@app.route('/edit-info', methods=['POST'])
@token_required
def edit_user_info(current_user):
    data = request.get_json()
    current_user.username = data.get('username', current_user.username)
    current_user.email = data.get('email', current_user.email)
    if 'password' in data:
        current_user.password_hashed = generate_password_hash(data['password'], method='pbkdf2:sha256')
    db.session.commit()
    return jsonify({'message': 'User info updated'}), 200

@app.route('/delete-account', methods=['DELETE'])
@token_required
def delete_account(current_user):
    db.session.delete(current_user)
    db.session.commit()
    return jsonify({'message': 'Account deleted'}), 200

@app.route("/translations", methods=['POST'])
@token_required
def add_translation(current_user):
    data = request.get_json()
    new_translation = Translation(
        user_id=current_user.id,
        input_text=data['input_text'],
        translated_text=data['translated_text'],
        input_language=data['input_language'],
        target_language=data['target_language']
    )
    db.session.add(new_translation)
    db.session.commit()
    return jsonify({'message': 'Remembered Translation!'}), 201

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("1-frontend/build/" + path):
        return send_from_directory('1-frontend/build', path)
    else:
        return send_from_directory('1-frontend/build', 'index.html')

if __name__ == "__main__":
    print(app.url_map)
    app.run(debug=True)
