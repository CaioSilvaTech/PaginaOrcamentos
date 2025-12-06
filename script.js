document.addEventListener('DOMContentLoaded', function() {
    const itensTable = document.getElementById('itens-orcamento');
    const adicionarItemBtn = document.getElementById('adicionar-item');
    const totalGeralInput = document.getElementById('total-geral');
    const gerarPdfBtn = document.getElementById('gerar-pdf');
    const elementoParaCapturar = document.querySelector('.container-orcamento');

    // Função para calcular o total de uma linha
    function calcularTotalLinha(row) {
        const quant = parseFloat(row.querySelector('.quant').value) || 0;
        const preco = parseFloat(row.querySelector('.preco-unitario').value) || 0;
        const totalItemInput = row.querySelector('.total-item');
        const total = quant * preco;

        // AQUI: Arredonda o total para o inteiro mais próximo
    totalItemInput.value = Math.round(total);
      
        calcularTotalGeral();
    }

// script.js (Função para calcular o total geral)
function calcularTotalGeral() {
    let totalGeral = 0;
    document.querySelectorAll('.total-item').forEach(input => {
        // Usa parseInt() ou Math.round() para garantir que a soma seja de inteiros
        totalGeral += parseInt(input.value) || 0; 
    });
    
    // AQUI: Arredonda o total geral para o inteiro mais próximo antes de exibir
    totalGeralInput.value = `R$ ${Math.round(totalGeral)}`;
}

   

    // Função para remover uma linha
    function removerLinha(row) {
        row.remove();
        calcularTotalGeral();
    }

    // Adiciona os event listeners para os campos de uma linha
    function adicionarListenersDeLinha(row) {
        const quantInput = row.querySelector('.quant');
        const precoInput = row.querySelector('.preco-unitario');
        const removerBtn = row.querySelector('.btn-remover-item');

        quantInput.addEventListener('input', () => calcularTotalLinha(row));
        precoInput.addEventListener('input', () => calcularTotalLinha(row));
        removerBtn.addEventListener('click', () => removerLinha(row));
    }

    // Adiciona um novo item (linha) à tabela
    adicionarItemBtn.addEventListener('click', function() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td data-label="Serviço"><textarea class="form-control" name="descricao[]" rows="2"></textarea></td>
            <td data-label="Quant"><input type="number" class="form-control quant" name="quant[]" min="0" value="0"></td>
            <td data-label="Preço Unitário"><input type="number" class="form-control preco-unitario" name="preco[]" min="0" value="0"></td>
            <td data-label="Total"><input type="text" class="form-control total-item" name="total[]" readonly></td>
            <td data-label="Ação"><button type="button" class="btn btn-danger btn-sm btn-remover-item"><i class="fas fa-trash"></i></button></td>
        `;
        itensTable.appendChild(newRow);
        
        adicionarListenersDeLinha(newRow);
        calcularTotalLinha(newRow);
    });

    // Inicialização: adiciona listeners e faz o cálculo inicial para a linha que já existe
    const linhasExistentes = itensTable.querySelectorAll('tr');
    linhasExistentes.forEach(row => {
        adicionarListenersDeLinha(row);
        calcularTotalLinha(row);
    });

   

    // === LÓGICA CORRIGIDA PARA GERAR IMAGEM PNG/JPEG ===
gerarPdfBtn.addEventListener('click', function() {
    
    // 1. CAPTURA O NOME DO CLIENTE
    const nomeCliente = document.getElementById('cliente').value.trim();
    
    // Define o nome do arquivo. Usa o nome do cliente ou um nome padrão.
    // Substituímos espaços por underscores e removemos caracteres especiais para evitar problemas.
    const nomeArquivoBase = nomeCliente ? nomeCliente.replace(/[^a-zA-Z0-9]/g, '_') : 'Sem_Cliente_Orçamento';
    const nomeArquivo = `${nomeArquivoBase}_Orçamento.png`;
    
    // Usa html2canvas para capturar o elemento completo
    html2canvas(elementoParaCapturar, {
        scale: 2, // Aumenta a qualidade da imagem
        allowTaint: true,
        useCORS: true
    }).then(canvas => {
        // Cria um link de download
        const link = document.createElement('a');
        
        // 2. USA O NOME DO CLIENTE NO ARQUIVO
        link.download = nomeArquivo; // Agora usa a variável definida acima
        
        // Converte o canvas para um URL de dados e define o link
        link.href = canvas.toDataURL('image/png');

        // Simula o clique no link para iniciar o download
        link.click();
        link.remove();
    }).catch(err => {
        console.error('Erro ao gerar a imagem:', err);
        alert('Não foi possível gerar a imagem. Verifique o console para mais detalhes.');
    });
});
    
    calcularTotalGeral();
});
