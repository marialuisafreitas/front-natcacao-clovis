// Variáveis globais
let modal = document.getElementById('modalUsuario');
let modalTitulo = document.getElementById('modalTitulo');
let formUsuario = document.getElementById('formUsuario');
let isEditMode = false;
let currentUserId = null;

// Elementos do modal
const cancelBtn = document.querySelector('.btn-cancel');
const addBtn = document.getElementById('btnAdicionar');
const editBtns = document.querySelectorAll('.table-actions .btn-edit');
const deleteBtns = document.querySelectorAll('.table-actions .btn-delete');

// Abrir modal para adicionar usuário
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Usuário';
    formUsuario.reset();
    modal.style.display = 'flex';
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

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function fecharModal() {
    const modalContent = modal.querySelector('.modal-content');
    
    // Adicionar classe de animação de fechamento
    modalContent.classList.add('close');
    
    // Aguardar a animação terminar (300ms) antes de esconder o modal
    setTimeout(() => {
        modal.style.display = 'none';
        modalContent.classList.remove('close');
        document.body.style.overflow = 'auto';
        formUsuario.reset();
    }, 300);
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

        // Botões excluir
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            excluirUsuario();
        });
    });

    // Fechar modal
    if (cancelBtn) {
        cancelBtn.addEventListener('click', fecharModal);
    }

    // Fechar modal clicando fora dele
    if (modal) {
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                fecharModal();
            }
        });
    }

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const img = this.querySelector('img');

            if (input.type === 'password') {
                input.type = 'text';
                img.src = '../img/view.png';
                img.alt = 'olho aberto';
            } else {
                input.type = 'password';
                img.src = '../img/hidden.png';
                img.alt = 'olho fechado';
            }
        });
    });

    // Submeter formulário
    if (formUsuario) {
        formUsuario.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const nomeCompleto = document.getElementById('nomeCompleto').value;
            const email = document.getElementById('email').value;
            const nivelAcesso = document.getElementById('nivelAcesso').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            
            // Validar senhas
            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }
            
            const userData = {
                nome: nomeCompleto,
                email: email,
                nivel: nivelAcesso
            };
            
            if (isEditMode) {
                console.log('Editando usuário:', userData);
                alert('Usuário atualizado com sucesso!');
            } else {
                console.log('Adicionando usuário:', userData);
                alert('Usuário adicionado com sucesso!');
            }
            
            // Fechar modal após salvar
            fecharModal();
        });
    }
});

// Função para excluir usuário
function excluirUsuario() {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        console.log('Excluindo usuário...');
        alert('Usuário excluído com sucesso!');
    }
}