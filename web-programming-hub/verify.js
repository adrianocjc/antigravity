const fs = require('fs');
const path = require('path');
const vm = require('vm');

const baseDir = 'c:\\Users\\AdminUser\\Desktop\\Antigravity\\web-programming-hub';

// Expected files to verify
const filesToVerify = [
    { relative: 'index.html', type: 'html' },
    { relative: 'style.css', type: 'css' },
    { relative: 'app.js', type: 'js' },
    
    { relative: 'examples/atividade1/index.html', type: 'html' },
    { relative: 'examples/atividade1/style.css', type: 'css' },
    
    { relative: 'examples/atividade2/index.html', type: 'html' },
    { relative: 'examples/atividade2/style.css', type: 'css' },
    { relative: 'examples/atividade2/app.js', type: 'js' },
    
    { relative: 'examples/atividade3/index.html', type: 'html' },
    { relative: 'examples/atividade3/style.css', type: 'css' },
    { relative: 'examples/atividade3/app.js', type: 'js' },
    
    { relative: 'examples/atividade4/schema.sql', type: 'sql' },
    { relative: 'examples/atividade4/config.php', type: 'php' },
    { relative: 'examples/atividade4/index.php', type: 'php' },
    { relative: 'examples/atividade4/salvar.php', type: 'php' }
];

console.log('🔍 INICIANDO TESTES DE VALIDAÇÃO DE INTEGRIDADE...\n');
let success = true;

// 1. Check file existence and load them
filesToVerify.forEach(f => {
    const fullPath = path.join(baseDir, f.relative);
    if (!fs.existsSync(fullPath)) {
        console.error(`❌ [ERRO DE EXISTÊNCIA] Arquivo ausente: ${f.relative}`);
        success = false;
        return;
    }
    
    const stats = fs.statSync(fullPath);
    console.log(`✓ [PRESENÇA OK] ${f.relative.padEnd(40)} (${stats.size} bytes)`);

    const content = fs.readFileSync(fullPath, 'utf8');

    // 2. Syntax check JS
    if (f.type === 'js') {
        try {
            new vm.Script(content);
            console.log(`  └─ ✓ [SINTAXE JS VALIDA]`);
        } catch (err) {
            console.error(`  └─ ❌ [ERRO DE SINTAXE JS] no arquivo ${f.relative}:`, err.message);
            success = false;
        }
    }

    // 3. Simple balance check for HTML tags
    if (f.type === 'html') {
        const openedDivs = (content.match(/<div/g) || []).length;
        const closedDivs = (content.match(/<\/div>/g) || []).length;
        const openedArticles = (content.match(/<article/g) || []).length;
        const closedArticles = (content.match(/<\/article>/g) || []).length;
        
        if (openedDivs !== closedDivs || openedArticles !== closedArticles) {
            console.warn(`  └─ ⚠️ [AVISO ESTRUTURAL] Possível tag desbalanceada em ${f.relative}:`);
            console.warn(`     Divs abertas: ${openedDivs} | Fechadas: ${closedDivs}`);
            console.warn(`     Articles abertos: ${openedArticles} | Fechados: ${closedArticles}`);
        } else {
            console.log(`  └─ ✓ [ESTRUTURA BÁSICA HTML OK]`);
        }
    }
    
    // 4. Basic check for PHP opening/closing tags
    if (f.type === 'php') {
        if (!content.trim().startsWith('<?php')) {
            console.error(`  └─ ❌ [ERRO ESTRUTURAL PHP] Arquivo não começa com <?php: ${f.relative}`);
            success = false;
        } else {
            console.log(`  └─ ✓ [PHP ESTRUTURA OK]`);
        }
    }
});

console.log('\n==================================================');
if (success) {
    console.log('🎉 TODOS OS TESTES PASSARAM COM SUCESSO! 100% OK! 🎉');
} else {
    console.log('❌ OCORRERAM ERROS DE VALIDAÇÃO. VERIFIQUE OS LOGS ACIMA.');
}
console.log('==================================================');
process.exit(success ? 0 : 1);
