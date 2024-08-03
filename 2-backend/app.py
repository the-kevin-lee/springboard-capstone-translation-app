from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import deepl
from dotenv import load_dotenv
import os
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv(dotenv_path='.env')  # Adjust path if necessary

auth_key = os.getenv("DEEPL_AUTH_KEY")
translator = deepl.Translator(auth_key)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
# CORS(app, methods=['GET', 'POST'], origins=['https://translation-app-frontend-jk98.onrender.com/'], allow_headers=['Content-Type'])
CORS(app)
# os.environ.get('FRONTEND_URL'), 'http://localhost:3000'


from .backendfiles.models import User, Translation

# test route for server 
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

@app.route("/register", methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], email=data['email'], password_hashed=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Your account has been created!'}), 201

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password_hashed, data['password']):
        return jsonify({'message': 'Login success!'}), 200
    return jsonify({'message': 'Invalid credentials'}), 400

@app.route("/translations", methods=['POST'])
def add_translation():
    data = request.get_json()
    new_translation = Translation(
        user_id=data['user_id'],
        input_text=data['input_text'],
        translated_text=data['translated_text'],
        input_language=data['input_language'],
        target_language=data['target_language']
    )
    db.session.add(new_translation)
    db.session.commit()
    return jsonify({'message': 'Remembered Translation!'}), 201

@app.route("/translations/<int:user_id>", methods=['GET'])
def get_translations(user_id):
    translations = Translation.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': t.id,
        'input_text': t.input_text,
        'translated_text': t.translated_text,
        'input_language': t.input_language,
        'target_language': t.target_language,
        'timestamp': t.timestamp
    } for t in translations]), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("1-frontend/build/" + path):
        return send_from_directory('1-frontend/build', path)
    else:
        return send_from_directory('1-frontend/build', 'index.html')

if __name__ == "__main__":
    app.run(debug=True)
