# Projeto: Agente de IA Especialista em Química (Chemistry AI Agent)

Este plano propõe a criação de um sistema onde uma IA pode atuar como uma verdadeira especialista em química. Em vez de depender apenas do treinamento prévio, vamos "acoplar" a IA a ferramentas e bancos de dados reais de química, permitindo que ela pesquise, calcule e visualize moléculas com precisão científica.

## User Review Required
> [!IMPORTANT]
> Para iniciar, precisaremos usar a API de um modelo de linguagem (LLM). O plano atual assume o uso de um modelo avançado como o Gemini. Você possui uma chave de API para usarmos, ou gostaria de testar com modelos open-source locais (que exigem mais hardware)?

## Open Questions
> [!WARNING]
> 1. **Qual é o seu objetivo principal?** O foco é ensino (tirar dúvidas), pesquisa (análise de artigos) ou quimioinformática avançada (análise de propriedades moleculares)?
> 2. **Interface:** Proponho criarmos uma interface web simples e interativa usando **Streamlit**, onde você poderá conversar com a IA e visualizar moléculas em 2D/3D. Você concorda com essa abordagem?

## Proposed Changes

Vamos construir a aplicação em **Python**, usando conceitos de Agentes Autônomos (que usam ferramentas) e RAG (Geração Aumentada por Recuperação).

### Arquitetura do Sistema

#### 1. Integração de Ferramentas Químicas (Tool Use)
A IA terá acesso a ferramentas reais para não "alucinar" dados químicos:
- **PubChem API / ChemSpider**: A IA será capaz de pesquisar em tempo real nesses bancos de dados para obter informações sobre qualquer composto químico.
- **RDKit**: Uma poderosa biblioteca de quimioinformática. Daremos à IA a habilidade de escrever código em RDKit para calcular peso molecular, analisar estruturas (SMILES) e desenhar moléculas sob demanda.

#### 2. Base de Conhecimento Própria (RAG)
- Criaremos uma base vetorial onde você poderá fazer o upload de PDFs (livros de química, artigos científicos). A IA lerá sua base de dados antes de responder, aprendendo o que você quiser ensinar a ela.

#### 3. Interface do Chatbot Químico
- Usaremos o framework **Streamlit** para construir um chat na web onde a IA poderá responder em texto e renderizar imagens de estruturas moleculares.

---

### [Estrutura do Projeto]

#### [NEW] `requirements.txt`
Arquivo com as dependências: `streamlit`, `langchain` (ou `google-generativeai`), `rdkit`, `requests`, `chromadb` (para memória dos PDFs).

#### [NEW] `app.py`
A interface do usuário (UI) onde ocorrerá o chat.

#### [NEW] `agent.py`
O "cérebro" do sistema. Aqui definiremos o agente da IA e as ferramentas que ele tem permissão para usar.

#### [NEW] `tools/chemistry_tools.py`
Um arquivo contendo as ferramentas reais (funções Python) que a IA poderá invocar, como `search_pubchem_molecule(nome)` ou `draw_molecule_from_smiles(smiles)`.

## Verification Plan

### Manual Verification
- Iniciaremos o projeto localmente com `streamlit run app.py`.
- Pediremos para a IA tarefas como: "Desenhe a estrutura do Ácido Sulfúrico", "Qual é o peso molecular do Ibuprofeno?" e "Leia este PDF sobre Química Orgânica e me resuma o capítulo 2".
- O sucesso será validado se a IA fornecer os dados corretos buscando nas APIs, ao invés de tentar adivinhar, e renderizar a molécula corretamente na tela.
