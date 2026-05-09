import requests

def get_pubchem_data(query: str) -> str:
    """
    Busca informações sobre um composto químico no PubChem pelo nome.
    Retorna a Fórmula Molecular, Massa Exata, Nome IUPAC e o CID.
    """
    url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{query}/property/ExactMass,MolecularFormula,IUPACName,CanonicalSMILES/JSON"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'PropertyTable' in data and 'Properties' in data['PropertyTable']:
            props = data['PropertyTable']['Properties'][0]
            return str(props)
    return "Erro: Composto não encontrado no PubChem."

def get_pubchem_description(cid: int) -> str:
    """
    Obtém a descrição textual (se disponível) de um composto no PubChem usando o seu CID.
    """
    url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/description/JSON"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'InformationList' in data and 'Information' in data['InformationList']:
            for info in data['InformationList']['Information']:
                if 'Description' in info:
                    return info['Description']
    return "Descrição não encontrada."
