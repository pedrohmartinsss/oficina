//Função para bloquear tela para colaboradores
document.addEventListener('DOMContentLoaded', function () {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Log para debug
    console.log('Usuário logado:', usuarioLogado);
    console.log('Valor de acesso:', usuarioLogado?.acesso);

    if (!usuarioLogado) {
        alert('Acesso restrito. É necessário fazer login.');
        window.location.href = 'login.html';
        return;
    }

    // Aceitar tanto "Administrador" quanto "Administrador" (case insensitive)
    const acessoAdmin = usuarioLogado.acesso && (
        usuarioLogado.acesso === 'Administrador' ||
        usuarioLogado.acesso.toLowerCase() === 'administrador'
    );

    if (!acessoAdmin) {
        alert('Acesso restrito. Apenas administradores podem acessar esta página.');
        window.location.href = 'Menu.html';
        return;
    }
});

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

// Função para formatar o número de celular
function formatarCelular(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
        value = `${value.slice(0, 9)}-${value.slice(9)}`;
    }

    input.value = value;
}

// Adicionar máscara ao campo de celular
document.getElementById('celular').addEventListener('input', function () {
    formatarCelular(this);
});

// Função para validar o formulário
function validarFormulario() {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const login = document.getElementById('login').value;

    // Verificar se as senhas coincidem
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return false;
    }

    // Verificar se o login já existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuarios.some(usuario => usuario.login === login)) {
        alert('Este login já está em uso!');
        return false;
    }

    return true;
}

// Função para salvar o usuário
function salvarUsuario(event) {
    event.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const usuario = {
        nome: document.getElementById('nome').value,
        login: document.getElementById('login').value,
        celular: document.getElementById('celular').value,
        senha: document.getElementById('senha').value,
        acesso: document.getElementById('acesso').value,
        ativo: document.getElementById('ativo').value === 'true'
    };

    try {
        // Carregar usuários existentes
        let usuarios = [];
        const usuariosSalvos = localStorage.getItem('usuarios');
        if (usuariosSalvos) {
            usuarios = JSON.parse(usuariosSalvos);
        }

        // Adicionar novo usuário
        usuarios.push(usuario);

        // Salvar no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Mostrar mensagem de sucesso
        alert('Usuário cadastrado com sucesso!');

        // Redirecionar para a página de usuários
        window.location.href = 'Usuários.html';
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        alert('Erro ao salvar usuário. Por favor, tente novamente.');
    }
}

// Adicionar evento de submit ao formulário
document.getElementById('cadastroForm').addEventListener('submit', salvarUsuario);

// Função para limpar o formulário
document.querySelector('.reset-button').addEventListener('click', function () {
    if (confirm('Deseja realmente limpar todos os campos?')) {
        document.getElementById('cadastroForm').reset();
    }
});