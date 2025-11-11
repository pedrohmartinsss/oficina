// Array para armazenar os usuários
let usuarios = [];

// Função para carregar os usuários do localStorage
function carregarUsuarios() {
    try {
        const usuariosSalvos = localStorage.getItem('usuarios');
        if (usuariosSalvos) {
            usuarios = JSON.parse(usuariosSalvos);
            atualizarTabela();
        } else {
            console.log('Nenhum usuário encontrado no localStorage');
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// Verificar se o usuário logado é admin
document.addEventListener("DOMContentLoaded", function () {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Log para debug
    console.log('Usuário logado:', usuarioLogado);
    console.log('Valor de acesso:', usuarioLogado?.acesso);

    if (!usuarioLogado) {
        alert("Acesso restrito! É necessário fazer login.");
        window.location.href = "login.html";
        return;
    }

    // Aceitar tanto "Administrador" quanto "Administrador" (case insensitive)
    const acessoAdmin = usuarioLogado.acesso && (
        usuarioLogado.acesso === "Administrador" ||
        usuarioLogado.acesso.toLowerCase() === "administrador"
    );

    if (!acessoAdmin) {
        alert("Acesso restrito! Apenas administradores podem acessar esta página.");
        window.location.href = "Menu.html";
        return;
    }
});


// Função para atualizar a tabela de usuários
function atualizarTabela() {
    const tbody = document.querySelector('#tabelaUsuarios tbody');
    if (!tbody) {
        console.error('Elemento tbody não encontrado');
        return;
    }

    tbody.innerHTML = '';

    if (usuarios.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" style="text-align: center;">Nenhum usuário cadastrado</td>';
        tbody.appendChild(tr);
        return;
    }

    usuarios.forEach((usuario, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.login}</td>
            <td>${usuario.celular}</td>
            <td>${usuario.ativo ? 'Sim' : 'Não'}</td>
            <td>********</td>
            <td>${usuario.acesso}</td>
            <td class="acoes">
                <button onclick="visualizarUsuario(${index})" class="btn-visualizar" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editarUsuario(${index})" class="btn-editar" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="excluirUsuario(${index})" class="btn-excluir" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para visualizar usuário
function visualizarUsuario(index) {
    const usuario = usuarios[index];
    const modal = document.getElementById('visualizarModal');
    const info = document.getElementById('usuarioInfo');

    info.innerHTML = `
        <p><strong>Nome:</strong> ${usuario.nome}</p>
        <p><strong>Login:</strong> ${usuario.login}</p>
        <p><strong>Celular:</strong> ${usuario.celular}</p>
        <p><strong>Ativo:</strong> ${usuario.ativo ? 'Sim' : 'Não'}</p>
        <p><strong>Acesso:</strong> ${usuario.acesso}</p>
    `;

    modal.style.display = 'block';
}

// Função para editar usuário
function editarUsuario(index) {
    const usuario = usuarios[index];
    const modal = document.getElementById('editarModal');

    document.getElementById('editNome').value = usuario.nome;
    document.getElementById('editLogin').value = usuario.login;
    document.getElementById('editCelular').value = usuario.celular;
    document.getElementById('editAtivo').value = usuario.ativo;
    document.getElementById('editSenha').value = usuario.senha;
    document.getElementById('editAcesso').value = usuario.acesso;

    modal.style.display = 'block';

    // Atualizar o formulário para salvar as alterações
    document.getElementById('editarForm').onsubmit = (e) => {
        e.preventDefault();

        usuarios[index] = {
            nome: document.getElementById('editNome').value,
            login: document.getElementById('editLogin').value,
            celular: document.getElementById('editCelular').value,
            ativo: document.getElementById('editAtivo').value === 'true',
            senha: document.getElementById('editSenha').value,
            acesso: document.getElementById('editAcesso').value
        };

        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        atualizarTabela();
        modal.style.display = 'none';
    };
}

// Função para excluir usuário
function excluirUsuario(index) {
    const modal = document.getElementById('excluirModal');
    const info = document.getElementById('excluirInfo');
    const usuario = usuarios[index];

    info.innerHTML = `
        <p><strong>Nome:</strong> ${usuario.nome}</p>
        <p><strong>Login:</strong> ${usuario.login}</p>
    `;

    modal.style.display = 'block';

    document.getElementById('confirmarExclusao').onclick = () => {
        usuarios.splice(index, 1);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        atualizarTabela();
        modal.style.display = 'none';
    };
}

// Fechar modais quando clicar no X
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function () {
        this.parentElement.parentElement.style.display = 'none';
    };
});

// Fechar modais quando clicar fora deles
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Carregar usuários quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarUsuarios); 