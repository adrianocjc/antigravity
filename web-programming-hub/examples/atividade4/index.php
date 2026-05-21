<?php 
// 1. Importação da conexão para possibilitar listagem subsequente dos feedbacks
require_once 'config.php'; 
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulário de Feedback Acadêmico - PHP & MySQL</title>
    <style>
        /* Estilos rápidos para demonstração organizada em sala de aula */
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            background: #f1f5f9; 
            padding: 2rem; 
            color: #1e293b;
        }
        .container-wrapper {
            max-width: 1100px;
            margin: 0 auto;
        }
        header {
            margin-bottom: 2rem;
            text-align: center;
        }
        header h1 {
            color: #2563eb;
            margin-bottom: 0.5rem;
        }
        .grid { 
            display: grid; 
            grid-template-columns: 1fr 1.5fr; 
            gap: 2rem; 
        }
        @media (max-width: 800px) {
            .grid { grid-template-columns: 1fr; }
        }
        .box { 
            background: #ffffff; 
            padding: 2rem; 
            border-radius: 8px; 
            border: 1px solid #e2e8f0; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
        .form-group { 
            margin-bottom: 1.25rem; 
        }
        .form-group label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-weight: 600; 
        }
        .form-group input, .form-group textarea { 
            width: 100%; 
            padding: 0.6rem; 
            border: 1px solid #cbd5e1; 
            border-radius: 4px; 
            box-sizing: border-box; 
            outline: none;
        }
        .form-group input:focus, .form-group textarea:focus {
            border-color: #2563eb;
        }
        .btn { 
            background: #2563eb; 
            color: #ffffff; 
            border: none; 
            padding: 0.75rem 1.5rem; 
            border-radius: 4px; 
            cursor: pointer; 
            font-weight: bold; 
            width: 100%;
            transition: background 0.2s;
        }
        .btn:hover { 
            background: #1d4ed8; 
        }
        .feedback-item { 
            border-bottom: 1px solid #e2e8f0; 
            padding: 1.25rem 0; 
        }
        .feedback-item:last-child { 
            border: none; 
        }
        .feedback-item h4 {
            margin: 0 0 0.5rem 0;
            font-size: 1.05rem;
        }
        .feedback-item p {
            margin: 0 0 0.5rem 0;
            font-size: 0.95rem;
            color: #475569;
        }
        .success { 
            color: #16a34a; 
            background: #dcfce7; 
            padding: 1rem; 
            border-radius: 4px; 
            margin-bottom: 1.5rem; 
            border: 1px solid #bbf7d0;
            font-weight: 500;
        }
    </style>
</head>
<body>

    <div class="container-wrapper">
        <header>
            <h1>Painel de Feedback de Alunos</h1>
            <p>Integração Cliente-Servidor com Formulários e Banco de Dados Relacional</p>
        </header>

        <div class="grid">
            
            <!-- Coluna 1: O Formulário de Entrada -->
            <section class="box">
                <h2>Enviar Feedback</h2>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 1rem 0 1.5rem 0;">
                
                <?php if (isset($_GET['sucesso'])): ?>
                    <div class="success">
                        ✓ Sucesso! Dados inseridos com sucesso no MySQL.
                    </div>
                <?php endif; ?>

                <form action="salvar.php" method="POST">
                    <div class="form-group">
                        <label for="nome">Nome Completo</label>
                        <input type="text" id="nome" name="nome" required placeholder="Digite seu nome" maxlength="100">
                    </div>
                    <div class="form-group">
                        <label for="email">E-mail Acadêmico</label>
                        <input type="email" id="email" name="email" required placeholder="exemplo@universidade.edu" maxlength="100">
                    </div>
                    <div class="form-group">
                        <label for="mensagem">Sua Mensagem</label>
                        <textarea id="mensagem" name="mensagem" rows="5" required placeholder="Escreva seu feedback para os professores..."></textarea>
                    </div>
                    <button type="submit" class="btn">Enviar Informação</button>
                </form>
            </section>

            <!-- Coluna 2: Lista de Feedbacks salvos -->
            <section class="box">
                <h2>Registros no Banco de Dados</h2>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 1rem 0 1.5rem 0;">
                
                <div class="feedbacks-container">
                    <?php
                    try {
                        // Seleciona todos os feedbacks ordenando do mais recente para o mais antigo
                        $stmt = $pdo->query("SELECT nome, email, mensagem, data_envio FROM feedbacks ORDER BY data_envio DESC");
                        $feedbacks = $stmt->fetchAll();

                        if (count($feedbacks) === 0) {
                            echo "<p style='color:#64748b; text-align:center; padding: 2rem 0;'>Nenhum feedback armazenado até o momento.</p>";
                        } else {
                            foreach ($feedbacks as $fb) {
                                echo "<div class='feedback-item'>";
                                
                                // htmlspecialchars previne falhas de Cross-Site Scripting (XSS)
                                $nomeSeguro = htmlspecialchars($fb['nome']);
                                $emailSeguro = htmlspecialchars($fb['email']);
                                $mensagemSegura = nl2br(htmlspecialchars($fb['mensagem']));
                                $dataFormatada = date('d/m/Y H:i', strtotime($fb['data_envio']));

                                echo "<h4>" . $nomeSeguro . " <span style='font-weight:normal; font-size:0.8rem; color:#64748b;'>(" . $emailSeguro . ")</span></h4>";
                                echo "<p>" . $mensagemSegura . "</p>";
                                echo "<small style='color:#94a3b8;'>Enviado em: " . $dataFormatada . "</small>";
                                
                                echo "</div>";
                            }
                        }
                    } catch (PDOException $e) {
                        echo "<p style='color:#ef4444;'>Erro crítico ao listar dados do MySQL: " . htmlspecialchars($e->getMessage()) . "</p>";
                    }
                    ?>
                </div>
            </section>

        </div>
    </div>

</body>
</html>
