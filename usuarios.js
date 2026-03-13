// Array para armazenar os usuários em memória
let usuarios = []; // será preenchido a partir do localStorage

// Função para carregar os usuários do localStorage e atualizar a tabela
function carregarUsuarios() {
    try {
        const usuariosSalvos = localStorage.getItem('usuarios'); // lê string JSON
        if (usuariosSalvos) {
            usuarios = JSON.parse(usuariosSalvos); // parse para array
            atualizarTabela(); // atualiza a exibição
        } else {
            console.log('Nenhum usuário encontrado no localStorage'); // debug
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error); // log de erro
    }
}

// Verificar se o usuário logado tem acesso de administrador e bloquear acesso se não
document.addEventListener("DOMContentLoaded", function () {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Logs para debugar a sessão atual
    console.log('Usuário logado:', usuarioLogado);
    console.log('Valor de acesso:', usuarioLogado?.acesso);

    if (!usuarioLogado) {
        alert("Acesso restrito! É necessário fazer login."); // alerta para usuário não logado
        window.location.href = "login.html"; // redireciona para login
        return;
    }

    // Aceita 'Administrador' independentemente de capitalização ou espaços extras
    // utilizamos trim() e toLowerCase() para normalizar a string antes de comparar
    const acessoadministrador = typeof usuarioLogado.acesso === 'string' &&
        usuarioLogado.acesso.trim().toLowerCase() === 'admin';

    if (!acessoadministrador) {
        alert("Acesso restrito! Apenas administradores podem acessar esta página."); // alerta sem permissão
        window.location.href = "Menu.html"; // redireciona para Menu
        return;
    }
});


// Função para atualizar a tabela de usuários na UI
function atualizarTabela() {
    const tbody = document.querySelector('#tabelaUsuarios tbody'); // seleciona tbody
    if (!tbody) {
        console.error('Elemento tbody não encontrado'); // erro se não existir
        return;
    }

    tbody.innerHTML = ''; // limpa linhas

    // Se não houver usuários cadastrados, mostra mensagem
    if (usuarios.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" style="text-align: center;">Nenhum usuário cadastrado</td>';
        tbody.appendChild(tr);
        return;
    }

    // Monta uma linha para cada usuário com ações (visualizar, editar, excluir)
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
        tbody.appendChild(tr); // adiciona linha ao tbody
    });
}

// Função para visualizar usuário em modal
function visualizarUsuario(index) {
    const usuario = usuarios[index]; // pega usuário por índice
    const modal = document.getElementById('visualizarModal'); // modal de visualização
    const info = document.getElementById('usuarioInfo'); // container de info

    // Preenche informações detalhadas
    info.innerHTML = `
        <p><strong>Nome:</strong> ${usuario.nome}</p>
        <p><strong>Login:</strong> ${usuario.login}</p>
        <p><strong>Celular:</strong> ${usuario.celular}</p>
        <p><strong>Ativo:</strong> ${usuario.ativo ? 'Sim' : 'Não'}</p>
        <p><strong>Acesso:</strong> ${usuario.acesso}</p>
    `;

    modal.style.display = 'block'; // exibe modal
}

// Função para editar usuário (abre modal e atualiza ao submeter)
function editarUsuario(index) {
    const usuario = usuarios[index]; // obtém usuário
    const modal = document.getElementById('editarModal'); // modal de edição

    // Preenche campos do formulário com os valores atuais do usuário
    document.getElementById('editNome').value = usuario.nome;
    document.getElementById('editLogin').value = usuario.login;
    document.getElementById('editCelular').value = usuario.celular;
    document.getElementById('editAtivo').value = usuario.ativo;
    document.getElementById('editSenha').value = usuario.senha;
    document.getElementById('editAcesso').value = usuario.acesso;

    modal.style.display = 'block'; // mostra modal de edição

    // Atualizar o formulário para salvar as alterações ao submeter
    document.getElementById('editarForm').onsubmit = (e) => {
        e.preventDefault(); // evita comportamento padrão

        // Atualiza objeto no array com valores dos campos
        usuarios[index] = {
            nome: document.getElementById('editNome').value,
            login: document.getElementById('editLogin').value,
            celular: document.getElementById('editCelular').value,
            ativo: document.getElementById('editAtivo').value === 'true',
            senha: document.getElementById('editSenha').value,
            acesso: document.getElementById('editAcesso').value
        };

        localStorage.setItem('usuarios', JSON.stringify(usuarios)); // salva alterações
        atualizarTabela(); // atualiza UI
        modal.style.display = 'none'; // fecha modal
    };
}

// Função para excluir usuário com confirmação em modal
function excluirUsuario(index) {
    const modal = document.getElementById('excluirModal'); // modal de exclusão
    const info = document.getElementById('excluirInfo'); // container de info
    const usuario = usuarios[index]; // usuário selecionado

    // Mostra informações básicas antes de confirmar exclusão
    info.innerHTML = `
        <p><strong>Nome:</strong> ${usuario.nome}</p>
        <p><strong>Login:</strong> ${usuario.login}</p>
    `;

    modal.style.display = 'block'; // exibe modal

    // Ao confirmar, remove o usuário do array e salva
    document.getElementById('confirmarExclusao').onclick = () => {
        usuarios.splice(index, 1); // remove elemento do array
        localStorage.setItem('usuarios', JSON.stringify(usuarios)); // salva alterações
        atualizarTabela(); // atualiza tabela
        modal.style.display = 'none'; // fecha modal
    };
}

// Fechar modais quando clicar no X em qualquer modal
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function () {
        this.parentElement.parentElement.style.display = 'none'; // assume estrutura de DOM para fechar
    };
});

// Fechar modais quando clicar fora deles (qualquer elemento com classe 'modal')
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none'; // oculta modal clicado fora
    }
};

// Carregar usuários quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarUsuarios); 
