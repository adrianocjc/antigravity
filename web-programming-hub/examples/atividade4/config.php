<?php
/**
 * ============================================================================
 * SCRIPT DE CONFIGURAÇÃO - CONEXÃO COM BANCO DE DADOS (PDO)
 * ============================================================================
 */

// Definições de Credenciais do MySQL (Altere conforme suas configurações locais)
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Senha padrão vazia em ferramentas como o XAMPP
define('DB_NAME', 'academia_feedback');

try {
    // String de Conexão DSN com charset UTF-8 explícito para evitar problemas de acentuação
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    
    // Configurações e comportamentos do driver PDO
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lança exceções PDOException caso ocorram falhas SQL
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Retorna dados na consulta como arrays associativos simples
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Desativa emulação de preparado para ganho de segurança real contra SQLi
    ];

    // Instanciação e Conexão Principal
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

} catch (PDOException $e) {
    // Tratamento e encerramento robusto em caso de falhas de conexão
    die("Falha crítica de conexão com o Banco de Dados local: " . $e->getMessage());
}
?>
