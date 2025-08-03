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
        totalItemInput.value = total.toFixed(2);
        calcularTotalGeral();
    }

    // Função para calcular o total geral
    function calcularTotalGeral() {
        let totalGeral = 0;
        document.querySelectorAll('.total-item').forEach(input => {
            totalGeral += parseFloat(input.value) || 0;
        });
        totalGeralInput.value = `R$ ${totalGeral.toFixed(2)}`;
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
            <td data-label="Serviço"><input type="text" class="form-control" name="descricao[]"></td>
            <td data-label="Quant"><input type="number" class="form-control quant" name="quant[]" min="0" value="0"></td>
            <td data-label="Preço Unitário"><input type="number" class="form-control preco-unitario" name="preco[]" step="0.01" min="0" value="0.00"></td>
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
        // Usa html2canvas para capturar o elemento completo
        html2canvas(elementoParaCapturar, {
            scale: 2, // Aumenta a qualidade da imagem
            allowTaint: true, // Ignora restrições de origem para o canvas
            useCORS: true // Ajuda a carregar imagens de outras origens
        }).then(canvas => {
            // Cria um link de download
            const link = document.createElement('a');
            link.download = 'orcamento_policall.png'; // Nome e formato do arquivo

            // Converte o canvas para um URL de dados e define o link
            link.href = canvas.toDataURL('image/png'); // Altere para 'image/jpeg' se preferir

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