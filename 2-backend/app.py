from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import deepl
import os
from dotenv import load_dotenv


load_dotenv(dotenv_path='/env')


auth_key = os.getenv("DEEPL_AUTH_KEY")

# print(os.getenv("DEEPL_AUTH_KEY"))
translator = deepl.Translator(auth_key)



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']  = os.environ.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db = SQLAlchemy(app)

migrate = Migrate(app,db)

CORS(app, methods=['GET', 'POST'], origins=["http://localhost:3000"], allow_headers=['Content-Type'])
# translator = Translator()







@app.route("/")
def test():
    return jsonify({"message": "Hello World"})


@app.route("/translate", methods=['POST'])
def translate():
    input_text = request.json.get("inputText")
    target_language = request.json.get("targetLanguage")

    if not input_text or not target_language:
        return jsonify({"error": "Missing input or target language"}), 400
    

    

    # send request logic

    try:
        result = translator.translate_text(input_text, target_lang = target_language)
        return jsonify({"translation": result.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500 


if __name__=="__main__":
    app.run(debug=True)