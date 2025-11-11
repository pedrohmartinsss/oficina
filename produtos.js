// Variável global para armazenar o índice do produto sendo editado/excluído
let produtoAtualIndex = -1;
let produtoParaExcluir = null;

// Função para carregar e exibir os produtos
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const tbody = document.querySelector('#tabelaProdutos tbody');

    if (!tbody) return;

    tbody.innerHTML = '';

    produtos.forEach((produto, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.codigo}</td>
            <td>${produto.nome}</td>
            <td>${produto.tipo}</td>
            <td>${produto.categoria}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
            <td>
                <button onclick="visualizarProduto('${produto.codigo}')" class="btn-visualizar">Visualizar</button>
                <button onclick="editarProduto('${produto.codigo}')" class="btn-editar">Editar</button>
                <button onclick="confirmarExclusao('${produto.codigo}')" class="btn-excluir">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para fechar qualquer modal
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Função para visualizar produto
function visualizarProduto(codigo) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(p => p.codigo === codigo);

    if (produto) {
        const modal = document.getElementById('visualizarModal');
        const produtoInfo = document.getElementById('produtoInfo');

        produtoInfo.innerHTML = `
            <table class="info-table">
                <tr>
                    <td>Código:</td>
                    <td>${produto.codigo}</td>
                </tr>
                <tr>
                    <td>Nome:</td>
                    <td>${produto.nome}</td>
                </tr>
                <tr>
                    <td>Tipo:</td>
                    <td>${produto.tipo}</td>
                </tr>
                <tr>
                    <td>Categoria:</td>
                    <td>${produto.categoria}</td>
                </tr>
                <tr>
                    <td>Quantidade:</td>
                    <td>${produto.quantidade}</td>
                </tr>
                <tr>
                    <td>Preço:</td>
                    <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                </tr>
            </table>
        `;

        modal.style.display = 'block';

        // Fechar modal quando clicar no X
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function () {
            modal.style.display = 'none';
        }

        // Fechar modal quando clicar fora dele
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
}

// Função para editar produto
function editarProduto(codigo) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(p => p.codigo === codigo);
    produtoAtualIndex = produtos.findIndex(p => p.codigo === codigo);

    if (produto) {
        const modal = document.getElementById('editarModal');

        // Preenche os campos do formulário
        document.getElementById('editCodigo').value = produto.codigo;
        document.getElementById('editNome').value = produto.nome;
        document.getElementById('editTipo').value = produto.tipo;
        document.getElementById('editCategoria').value = produto.categoria;
        document.getElementById('editQuantidade').value = produto.quantidade;
        document.getElementById('editPreco').value = produto.preco;

        modal.style.display = 'block';

        // Fechar modal quando clicar no X
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function () {
            modal.style.display = 'none';
            produtoAtualIndex = -1;
        }

        // Fechar modal quando clicar fora dele
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                produtoAtualIndex = -1;
            }
        }
    }
}

// Função para confirmar exclusão
function confirmarExclusao(codigo) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(p => p.codigo === codigo);

    if (produto) {
        produtoParaExcluir = codigo;
        const modal = document.getElementById('excluirModal');
        const excluirInfo = document.getElementById('excluirInfo');

        excluirInfo.innerHTML = `
            <table class="info-table">
                <tr>
                    <td>Código:</td>
                    <td>${produto.codigo}</td>
                </tr>
                <tr>
                    <td>Nome:</td>
                    <td>${produto.nome}</td>
                </tr>
                <tr>
                    <td>Tipo:</td>
                    <td>${produto.tipo}</td>
                </tr>
            </table>
        `;

        modal.style.display = 'block';

        // Fechar modal quando clicar no X
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function () {
            modal.style.display = 'none';
            produtoParaExcluir = null;
        }

        // Fechar modal quando clicar fora dele
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                produtoParaExcluir = null;
            }
        }
    }
}

// Função para excluir produto
function excluirProduto() {
    if (produtoParaExcluir) {
        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        produtos = produtos.filter(p => p.codigo !== produtoParaExcluir);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        fecharModal('excluirModal');
        produtoParaExcluir = null;
        carregarProdutos();
    }
}

// Função para salvar edição
function salvarEdicao(e) {
    e.preventDefault();

    if (produtoAtualIndex !== -1) {
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

        // Verifica se o novo código já existe em outro produto
        const novoCodigo = document.getElementById('editCodigo').value;
        const codigoExistente = produtos.findIndex((p, index) =>
            p.codigo === novoCodigo && index !== produtoAtualIndex
        );

        if (codigoExistente !== -1) {
            alert('Já existe um produto com este código.');
            return;
        }

        // Atualiza o produto
        produtos[produtoAtualIndex] = {
            codigo: novoCodigo,
            nome: document.getElementById('editNome').value,
            tipo: document.getElementById('editTipo').value,
            categoria: document.getElementById('editCategoria').value,
            quantidade: parseInt(document.getElementById('editQuantidade').value),
            preco: parseFloat(document.getElementById('editPreco').value)
        };

        // Salva as alterações
        localStorage.setItem('produtos', JSON.stringify(produtos));
        fecharModal('editarModal');
        produtoAtualIndex = -1;
        carregarProdutos();
    }
}

// Configura o formulário de edição
document.addEventListener('DOMContentLoaded', function () {
    carregarProdutos();

    // Configura o botão de confirmação de exclusão
    const confirmarExclusaoBtn = document.getElementById('confirmarExclusao');
    if (confirmarExclusaoBtn) {
        confirmarExclusaoBtn.addEventListener('click', excluirProduto);
    }

    // Configura o formulário de edição
    const editarForm = document.getElementById('editarForm');
    if (editarForm) {
        editarForm.addEventListener('submit', salvarEdicao);
    }
});

// Carrega os produtos quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarProdutos); 