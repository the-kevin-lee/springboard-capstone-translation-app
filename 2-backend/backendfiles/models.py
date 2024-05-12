from .. import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hashed = db.Column(db.String(120), nullable=False)


class Translation(db.Model):

    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    input_text = db.Column(db.Text, nullable=False)
    translated_text = db.Column(db.Text, nullable=False)
    input_language = db.Column(db.String(5), nullable=False)
    target_language = db.Column(db.String(5), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())

    author = db.relationship('User', backref=db.backref('translations', lazy=True))
