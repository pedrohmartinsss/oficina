// Função para mostrar o pop-up
function mostrarPopup() {
    document.getElementById('successPopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// Função para fechar o pop-up
function fecharPopup() {
    document.getElementById('successPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    // Redireciona para a página de consulta após fechar o pop-up
    window.location.href = 'Consulta.html';
}

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('produtoForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Obtém os valores dos campos
            const codigo = document.getElementById('codigo').value;
            const nome = document.getElementById('nome').value;
            const tipo = document.getElementById('tipo').value;
            const categoria = document.getElementById('categoria').value;
            const quantidade = document.getElementById('quantidade').value;
            const preco = document.getElementById('preco').value;

            // Validação básica
            if (!codigo || !nome || !tipo || !categoria || !quantidade || !preco) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            // Cria o objeto do produto
            const produto = {
                codigo: codigo,
                nome: nome,
                tipo: tipo,
                categoria: categoria,
                quantidade: parseInt(quantidade),
                preco: parseFloat(preco)
            };

            // Recupera produtos existentes ou cria array vazio
            let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

            // Verifica se já existe um produto com o mesmo código
            const produtoExistente = produtos.find(p => p.codigo === produto.codigo);
            if (produtoExistente) {
                alert('Já existe um produto com este código.');
                return;
            }

            // Adiciona novo produto
            produtos.push(produto);

            // Salva no localStorage
            localStorage.setItem('produtos', JSON.stringify(produtos));

            // Limpa o formulário
            form.reset();

            // Mostra o pop-up de sucesso
            mostrarPopup();
        });
    }
}); 