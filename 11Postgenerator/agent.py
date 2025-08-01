import os
from dotenv import load_dotenv
import google.generativeai as genai 
from google.adk.agents import LlmAgent, SequentialAgent

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    raise RuntimeError('Missing GOOGLE_API_KEY')
genai.configure(api_key=api_key)

# Tools

def generate_idea(topic: str) -> str:
    """Ask Gemini to brainstorm linkedin post idead for a topic"""
    model = genai.GenerativeModel(model_name="gemini-2.0-flash")
    resp = model.generate_content(
        f"Brainstorm a creative linkedin post idea on the topic \n\n{topic}"
    )
    return resp.text

def write_content(idea: str) -> str:
    """Ask Gemini to expand an outline into a linkedin post draft"""
    model = genai.GenerativeModel(model_name="gemini-2.0-flash")
    resp = model.generate_content(
        f"Expand the idea into a linkedin post draft \n\n{idea}"
    )
    return resp.text

def format_draft(draft: str) -> str:
    """Ask Gemini to format the draft as a linkedin post"""
    model = genai.GenerativeModel(model_name="gemini-2.0-flash")
    resp = model.generate_content(
        f"Format the draft as a clean trending linkedin post \n\n{draft}"
    )
    return resp.text

# Agents

topic_agent = LlmAgent(
    name="IdeaAgent",
    model="gemini-2.0-flash",
    description="Brainstorms linkedin post idea",
    instruction=(
        "Call generate_idea(topic) with the exact topic string you receive "
        "and return only the idea"
    ),
    tools=[generate_idea],
    output_key="idea"
)

draft_agent = LlmAgent(
    name="WriteAgent",
    model="gemini-2.0-flash",
    description="Writes a linkedin post draft from the idea",
    instruction=(
        "Call write_content(idea) where `idea` is the output from the prior step "
        "and return only the linkedin post draft"
    ),
    tools=[write_content],
    output_key="draft"
)

format_agent = LlmAgent(
    name="FormatAgent",
    model="gemini-2.0-flash",
    description="Format the draft as a trending linkedin post",
    instruction=(
        "Call format_draft(draft) where `draft` is the output from the prior step "
        "and return only the final trending linkedin post"
    ),
    tools=[format_draft],
    output_key="formatted"
)

# Orchestrate

root_agent = SequentialAgent(
    name="ContentAssistant",
    sub_agents=[topic_agent, draft_agent, format_agent],
    description="Takes the user topic -> generates idea -> writes draft -> formats as a trending linkedin post"
)