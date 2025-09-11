from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///diary.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Diary model
class DiaryEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

# Create tables
with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return send_from_directory('.', 'home.html')

@app.route("/index.html")
def index():
    return send_from_directory('.', 'index.html')

@app.route("/thoughts.html")
def thoughts():
    return send_from_directory('.', 'thoughts.html')

@app.route("/goals.html")
def goals():
    return send_from_directory('.', 'goals.html')

@app.route("/achivements.html")
def achievements():
    return send_from_directory('.', 'achivements.html')

@app.route("/notes.html")
def notes():
    return send_from_directory('.', 'notes.html')

@app.route("/contact.html")
def contact_html():
    return send_from_directory('.', 'contact.html')

@app.route("/contact")
def contact_page():
    return redirect(url_for('contact_html'))

@app.route("/login.html")
def login_html():
    return send_from_directory('.', 'login.html')

@app.route("/login")
def login_page():
    return redirect(url_for('login_html'))

@app.route("/home.html")
def home_html():
    return send_from_directory('.', 'home.html')

@app.route("/home")
def home_page():
    return redirect(url_for('home_html'))

@app.route("/attendance.html")
def attendance():
    return send_from_directory('.', 'attendance.html')

@app.route("/intial.html")
def initial():
    return send_from_directory('.', 'intial.html')

@app.route("/script.js")
def script():
    return send_from_directory('.', 'script.js')

@app.route("/style.css")
def style():
    return send_from_directory('.', 'style.css')

# Add entry (via form)
@app.route("/add", methods=["GET", "POST"])
def add_entry():
    if request.method == "POST":
        entry_text = request.form.get("entry")
        if entry_text:
            new_entry = DiaryEntry(content=entry_text)
            db.session.add(new_entry)
            db.session.commit()
        return redirect(url_for("home"))
    return render_template("add_entry.html")

# Save entry (via API - JavaScript fetch)
@app.route("/api/save", methods=["POST"])
def save_data():
    data = request.get_json()
    entry_text = data.get("entry")
    if entry_text:
        new_entry = DiaryEntry(content=entry_text)
        db.session.add(new_entry)
        db.session.commit()
        return {"status": "success", "message": "Data saved to DB"}
    return {"status": "error", "message": "No entry provided"}

# Load all entries (via API)
@app.route("/api/load", methods=["GET"])
def load_data():
    entries = DiaryEntry.query.all()
    return jsonify({"data": [e.content for e in entries]})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
