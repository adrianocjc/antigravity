<?php
/**
 * ============================================================================
 * SCRIPT DE SALVAMENTO - INSERÇÃO SEGURA VIA PREPARED STATEMENTS (PDO)
 * ============================================================================
 */

// 1. Validar se a requisição de chegada é estritamente do tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Redireciona de volta para a página inicial caso alguém tente acessar o script diretamente
    header('Location: index.php');
    exit;
}

// 2. Importar a conexão com o banco de dados
require_once 'config.php';

// 3. Captura e Sanitização Rigorosa dos Dados do Formulário
// Combate à entrada de dados perigosos e scripts injetados
$nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$mensagem = filter_input(INPUT_POST, 'mensagem', FILTER_SANITIZE_SPECIAL_CHARS);

// Validação dos dados higienizados
if (!$nome || !$email || !$mensagem) {
    die("Erro de Validação: Certifique-se de preencher todos os campos corretamente com dados válidos.");
}

try {
    // 4. Preparação da Query SQL usando Named Placeholders (Evita SQL Injection)
    $sql = "INSERT INTO feedbacks (nome, email, mensagem) VALUES (:nome, :email, :mensagem)";
    $stmt = $pdo->prepare($sql);

    // 5. Execução vinculando os parâmetros às variáveis correspondentes
    $stmt->execute([
        ':nome'     => $nome,
        ':email'    => $email,
        ':mensagem' => $mensagem
    ]);

    // 6. Redirecionamento de volta com parâmetro de Sucesso
    header('Location: index.php?sucesso=1');
    exit;

} catch (PDOException $e) {
    // Em produção, salve o erro em logs internos. Nunca exiba o erro bruto do MySQL para o usuário!
    die("Falha de Banco de Dados: Não foi possível salvar seu registro. Erro: " . $e->getMessage());
}
?>
