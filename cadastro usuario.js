// Bloqueio de acesso para colaboradores não logados ou não administradores
document.addEventListener('DOMContentLoaded', function () {
    // obtém o usuário logado do localStorage (se houver)
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Log para debug (mostra objeto e propriedade 'acesso')
    console.log('Usuário logado:', usuarioLogado); // debug: imprime usuário
    console.log('Valor de acesso:', usuarioLogado?.acesso); // debug: imprime acesso

    // Se não há usuário logado, exibe aviso e redireciona para login
    if (!usuarioLogado) {
        alert('Acesso restrito. É necessário fazer login.');
        window.location.href = 'login.html'; // redireciona para login
        return; // interrompe execução
    }

    // Aceitar tanto 'Administrador' quanto 'administrador' (case-insensitive)
    // e ignorar espaços extras
    const acessoAdmin = typeof usuarioLogado.acesso === 'string' &&
        usuarioLogado.acesso.trim().toLowerCase() === 'admin';

    // Se o usuário não for administrador, proíbe acesso e volta ao menu
    if (!acessoAdmin) {
        alert('Acesso restrito. Apenas administradores podem acessar esta página.');
        window.location.href = 'Menu.html'; // redireciona para Menu
        return;
    }
});

// IIFE que garante a existência de um usuário administrador padrão (se necessário)
(function criarAdminExtra() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]'); // busca lista de usuários
    const existe = usuarios.some(u => u.login === 'pedrohmartinss'); // verifica existência por login
    if (!existe) {
        // adiciona um administrador padrão
        usuarios.push({
            nome: "Pedro Martins",
            login: "pedrohmartinss",
            senha: "07052002",
            acesso: "admin",
            ativo: true
        });
        // salva no localStorage se foi adicionado
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
})();

// Função para formatar o número de celular conforme digitação
function formatarCelular(input) {
    let value = input.value.replace(/\D/g, ''); // remove tudo que não for dígito
    if (value.length > 11) value = value.slice(0, 11); // limita a 11 dígitos

    if (value.length > 2) {
        // aplica parênteses no DDD
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
        // insere traço antes dos dois últimos dígitos
        value = `${value.slice(0, 9)}-${value.slice(9)}`;
    }

    input.value = value; // atualiza o valor do input com máscara
}

// Adicionar máscara ao campo de celular (ouvir evento input)
// OBS: assume que existe um elemento com id 'celular' na página
document.getElementById('celular').addEventListener('input', function () {
    formatarCelular(this); // formata enquanto o usuário digita
});

// Função para validar o formulário de cadastro de usuário
function validarFormulario() {
    const senha = document.getElementById('senha').value; // senha informada
    const confirmarSenha = document.getElementById('confirmarSenha').value; // confirmação
    const login = document.getElementById('login').value; // login desejado

    // Verificar se as senhas coincidem
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!'); // alerta se diferente
        return false; // validação falhou
    }

    // Verificar se o login já existe na lista de usuários
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuarios.some(usuario => usuario.login === login)) {
        alert('Este login já está em uso!'); // alerta se login duplicado
        return false; // validação falhou
    }

    return true; // passou nas validações
}

// Função para salvar o usuário (executada no submit do formulário)
function salvarUsuario(event) {
    event.preventDefault(); // evita comportamento padrão do submit

    if (!validarFormulario()) {
        return; // aborta se validação falhar
    }

    // monta objeto usuário a partir dos campos do formulário
    const usuario = {
        nome: document.getElementById('nome').value,
        login: document.getElementById('login').value,
        celular: document.getElementById('celular').value,
        senha: document.getElementById('senha').value,
        acesso: document.getElementById('acesso').value,
        ativo: document.getElementById('ativo').value === 'true' // converte string para boolean
    };

    try {
        // Carregar usuários existentes do localStorage
        let usuarios = [];
        const usuariosSalvos = localStorage.getItem('usuarios');
        if (usuariosSalvos) {
            usuarios = JSON.parse(usuariosSalvos);
        }

        // Adicionar novo usuário ao array
        usuarios.push(usuario);

        // Salvar o array atualizado no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Mostrar mensagem de sucesso ao usuário
        alert('Usuário cadastrado com sucesso!');

        // Redirecionar para a página de listagem de usuários
        window.location.href = 'Usuários.html';
    } catch (error) {
        console.error('Erro ao salvar usuário:', error); // log do erro
        alert('Erro ao salvar usuário. Por favor, tente novamente.');
    }
}

// Adicionar evento de submit ao formulário (chama salvarUsuario)
document.getElementById('cadastroForm').addEventListener('submit', salvarUsuario);

// Função para limpar o formulário com confirmação do usuário
document.querySelector('.reset-button').addEventListener('click', function () {
    if (confirm('Deseja realmente limpar todos os campos?')) {
        document.getElementById('cadastroForm').reset(); // reseta campos do formulário
    }
});
