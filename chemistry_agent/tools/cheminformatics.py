from rdkit import Chem
from rdkit.Chem import Descriptors
from rdkit.Chem import Draw
import os

def calculate_molecular_properties(smiles: str) -> str:
    """
    Calcula propriedades moleculares avançadas a partir de uma string SMILES usando RDKit.
    Retorna Peso Molecular, LogP, Doadores de H e Aceitadores de H.
    """
    try:
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return "Erro: String SMILES inválida."
        
        props = {
            "Peso Molecular (g/mol)": Descriptors.MolWt(mol),
            "LogP (Lipofilicidade)": Descriptors.MolLogP(mol),
            "Doadores de Ponte de Hidrogênio": Descriptors.NumHDonors(mol),
            "Aceitadores de Ponte de Hidrogênio": Descriptors.NumHAcceptors(mol)
        }
        return str(props)
    except Exception as e:
        return f"Erro ao calcular propriedades: {str(e)}"

def draw_molecule(smiles: str, filename: str = "molecule.png") -> str:
    """
    Gera uma imagem 2D da molécula a partir de uma string SMILES e salva em disco.
    Retorna o caminho do arquivo gerado.
    """
    try:
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return "Erro: String SMILES inválida para desenho."
        
        os.makedirs("static", exist_ok=True)
        filepath = os.path.join("static", filename)
        Draw.MolToFile(mol, filepath, size=(400, 400))
        return filepath
    except Exception as e:
         return f"Erro ao gerar imagem: {str(e)}"
