import streamlit as st
import os
import re
from agent import create_chemistry_agent

# Configuração da página Streamlit
st.set_page_config(page_title="EduQuímica AI", page_icon="🧪", layout="wide")

st.title("🧪 EduQuímica AI - Seu Professor de Química")
st.markdown("Bem-vindo! Eu sou uma IA conectada ao **PubChem** e ao **RDKit**. Posso tirar dúvidas complexas, buscar propriedades moleculares reais e desenhar estruturas moleculares para facilitar o seu aprendizado.")

# Sidebar para configuração da API Key
with st.sidebar:
    st.header("⚙️ Configuração")
    api_key = st.text_input("Sua chave API do Google Gemini:", type="password")
    if not api_key:
        st.warning("Insira sua chave da API do Gemini para começar.")
        st.markdown("[Obtenha sua chave gratuitamente aqui](https://aistudio.google.com/app/apikey)")
    
    st.markdown("---")
    st.markdown("### 💡 Exemplos de Perguntas:")
    st.info("- Busque as propriedades do Ácido Sulfúrico.")
    st.info("- Desenhe a estrutura da Aspirina (AAS) e me diga sua fórmula molecular.")
    st.info("- Explique a diferença entre Reação SN1 e SN2 com exemplos práticos.")

# Inicializar histórico do chat na sessão
if "messages" not in st.session_state:
    st.session_state.messages = []

# Mostrar mensagens anteriores
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
        if "images" in message:
            for img_path in message["images"]:
                if os.path.exists(img_path):
                    st.image(img_path)

# Capturar input do usuário
if prompt := st.chat_input("Pergunte algo de química ou peça para desenhar uma molécula..."):
    if not api_key:
        st.error("Por favor, configure sua API Key no menu lateral primeiro!")
        st.stop()

    # Adicionar mensagem do usuário
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Processar resposta da IA
    with st.chat_message("assistant"):
        with st.spinner("Consultando dados químicos e raciocinando..."):
            try:
                agent = create_chemistry_agent(api_key)
                
                # Executar agente
                response = agent.invoke({"input": prompt})
                output = response["output"]
                
                # Exibir texto da IA
                st.markdown(output)
                
                # Extrair possíveis imagens geradas pelo RDKit e exibí-las
                image_paths = re.findall(r'static/[\w-]+\.png', output)
                valid_images = []
                for img_path in image_paths:
                    if os.path.exists(img_path):
                        st.image(img_path)
                        valid_images.append(img_path)
                
                # Salvar no histórico
                msg_data = {"role": "assistant", "content": output}
                if valid_images:
                    msg_data["images"] = valid_images
                
                st.session_state.messages.append(msg_data)
                
            except Exception as e:
                st.error(f"Ocorreu um erro durante o processamento: {e}")
