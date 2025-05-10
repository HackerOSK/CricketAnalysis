import os
import warnings
from langchain_community.utilities import SQLDatabase
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain import hub
from langgraph.prebuilt import create_react_agent
from langchain_community.agent_toolkits import SQLDatabaseToolkit

# Suppress LangSmith warnings
warnings.filterwarnings("ignore", category=UserWarning, module="langsmith")

# Set API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyAxuqh5UfrPeUPeZjeXh3czeGuQMDl9IBQ"

# Connect to the database
db = SQLDatabase.from_uri('sqlite:///cricket_analysis.db')

# Initialize the LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",  # Fixed typo in model name
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    google_api_key=os.environ["GOOGLE_API_KEY"]
)

# Create toolkit and tools
toolkit = SQLDatabaseToolkit(db=db, llm=llm)
tools = toolkit.get_tools()

# Get prompt template
prompt_template = hub.pull("langchain-ai/sql-agent-system-prompt")
system_message = prompt_template.format(dialect='SQLite', top_k=5)

# Create agent
sql_agent = create_react_agent(llm, tools, prompt=system_message)

def get_response(query):
    """Get response from the SQL agent."""
    try:
        # Stream the response
        response_content = ""
        for event in sql_agent.stream(
            {"messages": [("user", query)]},
            stream_mode="values",
        ):
            if "messages" in event and event["messages"]:
                response_content = event["messages"][-1].content
                # print(response_content)
        
        return response_content
    except Exception as e:
        error_message = f"Error processing query: {str(e)}"
        print(error_message)
        return error_message

# if __name__ == "__main__":
#     # Test query
#     query = "What is the name of the player that has the most hundreds?"
# print(get_response("What is the name of the player that has the most hundreds?"))

