// Adicionar usuário administrador extra via código
(function criarAdminExtra() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existe = usuarios.some(u => u.login === 'pedrohmartinss');
    if (!existe) {
        usuarios.push({
            nome: "Pedro Martins",
            login: "pedrohmartinss",
            senha: "07052002",
            acesso: "Administrador",
            ativo: true
        });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
})();

// Função para verificar as credenciais do usuário
function verificarLogin(event) {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    // Carregar usuários do localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    // Procurar usuário com as credenciais fornecidas
    const usuario = usuarios.find(u =>
        u.login === login &&
        u.senha === senha &&
        u.ativo === true
    );

    if (usuario) {
        // Salvar informações do usuário logado
        const usuarioLogado = {
            nome: usuario.nome,
            login: usuario.login,
            acesso: usuario.acesso
        };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

        // Log para debug
        console.log('Login realizado com sucesso!');
        console.log('Usuário logado:', usuarioLogado);
        console.log('Valor de acesso:', usuarioLogado.acesso);

        // Redirecionar para a página inicial
        window.location.href = 'Menu.html';
    } else {
        // Verificar se o usuário existe mas está inativo
        const usuarioInativo = usuarios.find(u =>
            u.login === login &&
            u.senha === senha &&
            u.ativo === false
        );

        if (usuarioInativo) {
            alert('Este usuário está inativo. Entre em contato com o administrador.');
        } else {
            alert('Login ou senha incorretos!');
        }
    }
}

// Função para verificar se já existe um usuário logado
function verificarUsuarioLogado() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        window.location.href = 'Menu.html';
    }
}

// Função para mostrar/ocultar senha
function toggleSenha() {
    const senhaInput = document.getElementById('senha');
    const tipo = senhaInput.type === 'password' ? 'text' : 'password';
    senhaInput.type = tipo;

    // Atualizar ícone
    const iconeSenha = document.querySelector('.toggle-senha i');
    iconeSenha.className = tipo === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

// Adicionar eventos quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    // Verificar se já existe usuário logado
    verificarUsuarioLogado();

    // Adicionar evento de submit ao formulário
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', verificarLogin);
    }

    // Adicionar evento para mostrar/ocultar senha
    const toggleSenhaBtn = document.querySelector('.toggle-senha');
    if (toggleSenhaBtn) {
        toggleSenhaBtn.addEventListener('click', toggleSenha);
    }
}); 