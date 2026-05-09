from langchain.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from tools.pubchem import get_pubchem_data, get_pubchem_description
from tools.cheminformatics import calculate_molecular_properties, draw_molecule
import time

@tool
def tool_get_pubchem_data(query: str) -> str:
    """Busca informações sobre um composto químico no PubChem pelo nome. Retorna Fórmula, Massa, IUPAC e SMILES. Use isso para buscar dados reais."""
    return get_pubchem_data(query)

@tool
def tool_get_pubchem_description(cid: int) -> str:
    """Obtém a descrição textual e propriedades gerais de um composto químico pelo seu CID no PubChem."""
    return get_pubchem_description(cid)

@tool
def tool_calculate_molecular_properties(smiles: str) -> str:
    """Calcula propriedades moleculares avançadas (Peso, LogP, Doadores/Aceitadores de H) usando uma string SMILES."""
    return calculate_molecular_properties(smiles)

@tool
def tool_draw_molecule(smiles: str, name: str) -> str:
    """Gera a imagem de uma molécula a partir de uma string SMILES. 'name' deve ser o nome da molécula sem espaços."""
    filename = f"{name}_{int(time.time())}.png"
    return draw_molecule(smiles, filename)

def create_chemistry_agent(api_key: str):
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", google_api_key=api_key, temperature=0.2)
    tools = [
        tool_get_pubchem_data, 
        tool_get_pubchem_description, 
        tool_calculate_molecular_properties,
        tool_draw_molecule
    ]
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Você é um professor e especialista em química altamente qualificado, projetado para ajudar estudantes de todos os níveis (do ensino médio à graduação). "
                   "Você tem acesso a ferramentas reais de quimioinformática. Sempre tente usar as ferramentas para buscar informações precisas no PubChem ou calcular propriedades antes de responder. "
                   "Se o usuário pedir para desenhar a molécula ou se for didaticamente útil visualizá-la, use a ferramenta 'tool_draw_molecule'. "
                   "MUITO IMPORTANTE: Quando você usar a ferramenta de desenhar a molécula, a ferramenta retornará o caminho do arquivo gerado (ex: 'static/nome.png'). "
                   "Você DEVE incluir o caminho desse arquivo exatamente na sua resposta final de texto para que a interface possa renderizar a imagem. "
                   "Explique os conceitos passo a passo e de forma clara e didática, com o foco em ensinar."),
        ("placeholder", "{chat_history}"),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])
    
    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    return agent_executor
