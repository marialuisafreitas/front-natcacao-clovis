// Variáveis globais
let modal = document.getElementById('modalUsuario');
let modalTitulo = document.getElementById('modalTitulo');
let formUsuario = document.getElementById('formUsuario');
let isEditMode = false;
let currentUserId = null;

// Elementos do modal
const cancelBtn = document.querySelector('.btn-cancelar');
const addBtn = document.querySelector('button[onclick*="Adicionar"]') || document.querySelector('button');
const editBtns = document.querySelectorAll('#tabelaUsuarios button#editar');

// Abrir modal para adicionar usuário
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Usuário';
    formUsuario.reset();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Abrir modal para editar usuário
function abrirModalEditar(userData) {
    isEditMode = true;
    modalTitulo.textContent = 'Editar Usuário';

    // Preencher formulário com dados do usuário
    document.getElementById('nomeCompleto').value = userData.nome || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('nivelAcesso').value = userData.nivel || '';
    document.getElementById('senha').value = '';
    document.getElementById('confirmarSenha').value = '';

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function fecharModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    formUsuario.reset();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Botão adicionar novo
    const addButton = document.getElementById('btnAdicionar');
    if (addButton) {
        addButton.addEventListener('click', abrirModalAdicionar);
    }

    // Botões editar
    editBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const userData = JSON.parse(this.getAttribute('data-user'));
            abrirModalEditar(userData);
        });
    });

    // Fechar modal
    cancelBtn.addEventListener('click', fecharModal);

    // Fechar modal clicando fora dele
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            fecharModal();
        }
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const img = this.querySelector('img');

            if (input.type === 'password') {
                input.type = 'text';
                img.src = '../images/view.png';
                img.alt = 'olho aberto';
            } else {
                input.type = 'password';
                img.src = '../images/hidden.png';
                img.alt = 'olho fechado';
            }
        });
    });
});