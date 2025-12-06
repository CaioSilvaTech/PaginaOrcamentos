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

        totalItemInput.value = Math.round(total);
        calcularTotalGeral();
    }

    // Total geral
    function calcularTotalGeral() {
        let totalGeral = 0;
        document.querySelectorAll('.total-item').forEach(input => {
            totalGeral += parseInt(input.value) || 0;
        });

        totalGeralInput.value = `R$ ${Math.round(totalGeral)}`;
    }

    // Remover linha
    function removerLinha(row) {
        row.remove();
        calcularTotalGeral();
    }

    // Listeners de linha
    function adicionarListenersDeLinha(row) {
        const quantInput = row.querySelector('.quant');
        const precoInput = row.querySelector('.preco-unitario');
        const removerBtn = row.querySelector('.btn-remover-item');

        quantInput.addEventListener('input', () => calcularTotalLinha(row));
        precoInput.addEventListener('input', () => calcularTotalLinha(row));
        removerBtn.addEventListener('click', () => removerLinha(row));
    }

    // Função para equalizar alturas das textareas
    function equalizarAlturasTextareas() {
        const textareas = document.querySelectorAll("textarea");

        textareas.forEach(ta => ta.style.height = "auto");

        let maior = 0;
        textareas.forEach(ta => {
            const h = ta.scrollHeight;
            if (h > maior) maior = h;
        });

        textareas.forEach(ta => {
            ta.style.height = maior + "px";
        });
    }

    // Adicionar item
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
        equalizarAlturasTextareas();
    });

    // --- CORREÇÃO IMPORTANTE AQUI ---
    document.addEventListener("input", function(e) {
        if (e.target.classList.contains("quant") || e.target.classList.contains("preco-unitario")) {
            const row = e.target.closest("tr");
            calcularTotalLinha(row);
        }
        equalizarAlturasTextareas();
    });

    // --- GERAR IMAGEM / PNG ---
    gerarPdfBtn.addEventListener("click", function () {
        const nomeCliente = document.getElementById('cliente').value.trim();
        const nomeArquivoBase = nomeCliente ? nomeCliente.replace(/[^a-zA-Z0-9]/g, '_') : 'Sem_Cliente_Orçamento';
        const nomeArquivo = `${nomeArquivoBase}_Orçamento.png`;

        const originalHeight = elementoParaCapturar.style.height;

        elementoParaCapturar.style.height = "auto";
        elementoParaCapturar.style.minHeight = elementoParaCapturar.scrollHeight + "px";

        const textareas = document.querySelectorAll("textarea");
        const divsTemp = [];

        textareas.forEach((ta, index) => {
            const div = document.createElement("div");
            div.classList.add("div-textarea-captura");

            div.style.whiteSpace = "pre-wrap";
            div.style.wordBreak = "break-word";
            div.style.border = "1px solid #ced4da";
            div.style.padding = "8px";
            div.style.background = "white";
            div.style.height = ta.scrollHeight + "px";

            div.style.fontFamily = getComputedStyle(ta).fontFamily;
            div.style.fontSize = getComputedStyle(ta).fontSize;
            div.style.lineHeight = getComputedStyle(ta).lineHeight;

            div.textContent = ta.value;

            ta.style.display = "none";
            ta.parentNode.insertBefore(div, ta);

            divsTemp[index] = div;
        });

        html2canvas(elementoParaCapturar, {
            scale: 2,
            allowTaint: true,
            useCORS: true,
            scrollY: 0,
            scrollX: 0,
            windowWidth: document.body.scrollWidth,
            windowHeight: document.body.scrollHeight
        }).then(canvas => {
            const link = document.createElement("a");
            link.download = nomeArquivo;
            link.href = canvas.toDataURL("image/png");
            link.click();

            textareas.forEach((ta, index) => {
                divsTemp[index].remove();
                ta.style.display = "block";
            });

            elementoParaCapturar.style.height = originalHeight;
            elementoParaCapturar.style.minHeight = "";

        }).catch(err => {
            console.error("Erro ao gerar a imagem:", err);
            alert("Erro ao gerar a imagem.");
        });
    });

    calcularTotalGeral();
});
