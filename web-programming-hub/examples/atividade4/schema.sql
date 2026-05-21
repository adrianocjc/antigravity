-- ============================================================================
-- SCRIPT SQL: CRIAÇÃO DO BANCO DE DADOS E TABELA DE TESTES
-- ============================================================================

-- 1. Criação do Banco de Dados Relacional com charset amigável a caracteres lusófonos (ç, á, õ...)
CREATE DATABASE IF NOT EXISTS academia_feedback 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE academia_feedback;

-- 2. Criação da Tabela de Armazenamento de Feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
