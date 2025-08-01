import os
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv
import google.generativeai as genai

# ✅ Load API Key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("Missing GOOGLE_API_KEY")
genai.configure(api_key=api_key)

# ✅ FastAPI App
app = FastAPI()

# ✅ Functions
def generate_idea(topic: str, tone: str) -> str:
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = f"Brainstorm a creative LinkedIn post idea for the topic: {topic}. Tone: {tone}."
    return model.generate_content(prompt).text.strip()

def write_content(idea: str, tone: str) -> str:
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = f"Expand this idea into a LinkedIn post draft. Tone: {tone}. Idea:\n\n{idea}"
    return model.generate_content(prompt).text.strip()

def format_draft(draft: str, add_hashtags: bool) -> str:
    model = genai.GenerativeModel("gemini-2.0-flash")
    hashtag_text = "Include 3-5 trending hashtags at the end." if add_hashtags else "Do not include hashtags."
    prompt = f"Format this draft as a clean, engaging LinkedIn post. {hashtag_text}\n\nDraft:\n\n{draft}"
    return model.generate_content(prompt).text.strip()

# ✅ UI Home Page
@app.get("/", response_class=HTMLResponse)
async def home():
    return """
    <html>
        <head>
            <title>LinkedIn Post Generator</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f3f2ef; margin: 0; padding: 0; }
                .container { max-width: 700px; margin: 40px auto; background: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);}
                h2 { color: #0077b5; text-align: center; }
                form { display: flex; flex-direction: column; gap: 15px; }
                label { font-weight: bold; color: #333; }
                input[type="text"], select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
                button { background: #0077b5; color: white; padding: 12px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; }
                button:hover { background: #005f8a; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>LinkedIn Post Generator</h2>
                <form action="/generate" method="post">
                    <label>Topic:</label>
                    <input type="text" name="topic" placeholder="Enter your topic..." required>

                    <label>Select Tone:</label>
                    <select name="tone">
                        <option value="Professional">Professional</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Inspirational">Inspirational</option>
                    </select>

                    <label><input type="checkbox" name="hashtags"> Add Hashtags?</label>

                    <button type="submit">Generate Post</button>
                </form>
            </div>
        </body>
    </html>
    """

# ✅ Generate Page
@app.post("/generate", response_class=HTMLResponse)
async def generate(topic: str = Form(...), tone: str = Form(...), hashtags: str = Form(None)):
    add_hashtags = bool(hashtags)

    # Run pipeline
    idea = generate_idea(topic, tone)
    draft = write_content(idea, tone)
    final_post = format_draft(draft, add_hashtags)

    return f"""
    <html>
        <head>
            <title>Your LinkedIn Post</title>
            <style>
                body {{ font-family: Arial; background: #f3f2ef; }}
                .container {{ max-width: 700px; margin: 40px auto; background: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }}
                h2 {{ color: #0077b5; }}
                textarea {{ width: 100%; height: 300px; padding: 10px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc; }}
                a {{ display: inline-block; margin-top: 15px; color: #0077b5; text-decoration: none; font-weight: bold; }}
                a:hover {{ text-decoration: underline; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Your LinkedIn Post</h2>
                <textarea readonly>{final_post}</textarea>
                <br>
                <a href="/">&#8592; Generate Another Post</a>
            </div>
        </body>
    </html>
    """
