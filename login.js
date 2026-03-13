// IIFE que garante a presença de um usuário administrador padrão
(function criarAdminExtra() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]'); // carrega lista de usuários
    const existe = usuarios.some(u => u.login === 'pedrohmartinss'); // verifica existência pelo login
    if (!existe) {
        // adiciona usuário administrador padrão
        usuarios.push({
            nome: "Pedro Martins",
            login: "pedrohmartinss",
            senha: "07052002",
            acesso: "admin",
            ativo: true
        });
        localStorage.setItem('usuarios', JSON.stringify(usuarios)); // salva no localStorage
    }
})();

// Função para verificar as credenciais do usuário (chamada no submit)
function verificarLogin(event) {
    event.preventDefault(); // evita recarregamento automático

    const login = document.getElementById('login').value; // pega login do formulário
    const senha = document.getElementById('senha').value; // pega senha do formulário

    // Carregar usuários do localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]'); // array de usuários

    // Procurar usuário com as credenciais fornecidas e que esteja ativo
    const usuario = usuarios.find(u =>
        u.login === login &&
        u.senha === senha &&
        u.ativo === true
    );

    if (usuario) {
        // Normalizar perfil de acesso para um formato padrão
        const acessoBruto = (usuario.acesso || '').trim().toLowerCase();
        let acessoNormalizado = acessoBruto;
        if (['administrador', 'administrador(a)', 'admin'].includes(acessoBruto)) {
            acessoNormalizado = 'admin';
        }

        // Salvar informações do usuário logado no localStorage já com acesso padronizado
        const usuarioLogado = {
            nome: usuario.nome,
            login: usuario.login,
            acesso: acessoNormalizado
        };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado)); // persiste sessão

        // Log para debug
        console.log('Login realizado com sucesso!');
        console.log('Usuário logado:', usuarioLogado);
        console.log('Valor de acesso:', usuarioLogado.acesso);

        // Redirecionar para a página inicial após login bem-sucedido
        window.location.href = 'Menu.html';
    } else {
        // Se não encontrou usuário ativo, verifica se existe inativo com as mesmas credenciais
        const usuarioInativo = usuarios.find(u =>
            u.login === login &&
            u.senha === senha &&
            u.ativo === false
        );

        if (usuarioInativo) {
            alert('Este usuário está inativo. Entre em contato com o administrador.'); // alerta para usuário inativo
        } else {
            alert('Login ou senha incorretos!'); // alerta para credenciais inválidas
        }
    }
}

// Função para verificar se já existe um usuário logado e redirecionar
function verificarUsuarioLogado() {
    const usuarioLogado = localStorage.getItem('usuarioLogado'); // verifica item no localStorage
    if (usuarioLogado) {
        window.location.href = 'Menu.html'; // redireciona se sessão existe
    }
}

// Função para mostrar/ocultar senha no campo de senha
function toggleSenha() {
    const senhaInput = document.getElementById('senha'); // input da senha
    const tipo = senhaInput.type === 'password' ? 'text' : 'password'; // alterna tipo
    senhaInput.type = tipo; // aplica tipo alterado

    // Atualizar ícone de acordo com o estado (mostra olho aberto/fechado)
    const iconeSenha = document.querySelector('.toggle-senha i');
    iconeSenha.className = tipo === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'; // troca classe do ícone
}

// Adicionar eventos quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    // Verificar se já existe usuário logado na sessão
    verificarUsuarioLogado();

    // Adicionar evento de submit ao formulário de login (se existir)
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', verificarLogin); // vincula verificação ao submit
    }

    // Adicionar evento para mostrar/ocultar senha (se botão existir)
    const toggleSenhaBtn = document.querySelector('.toggle-senha');
    if (toggleSenhaBtn) {
        toggleSenhaBtn.addEventListener('click', toggleSenha); // vincula toggle de senha
    }
});
