// Variáveis globais
let modal = document.getElementById('modalUnidade');
let modalTitulo = document.getElementById('modalTitulo');
let formUnidade = document.getElementById('formUnidade');
let isEditMode = false;
let currentUnitId = null;

// Elementos do modal
const cancelBtn = document.querySelector('.btn-cancelar');
const addBtn = document.getElementById('btnAdicionar');
const editBtns = document.querySelectorAll('#editarUnidade button#editar');

// Abrir modal para adicionar unidade
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Unidade';
    formUnidade.reset();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Abrir modal para editar unidade
function abrirModalEditar(unitData) {
    isEditMode = true;
    modalTitulo.textContent = 'Editar Unidade';

    // Preencher formulário com dados da unidade
    document.getElementById('nomeUnidade').value = unitData.nome || '';
    document.getElementById('cep').value = unitData.cep || '';

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function fecharModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    formUnidade.reset();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Botão adicionar novo
    if (addBtn) {
        addBtn.addEventListener('click', abrirModalAdicionar);
    }

    // Botões editar
    editBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const unitData = JSON.parse(this.getAttribute('data-user'));
            abrirModalEditar(unitData);
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

    // Submeter formulário
    if (formUnidade) {
        formUnidade.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const nomeUnidade = document.getElementById('nomeUnidade').value;
            const cep = document.getElementById('cep').value;
            
            // Aqui você pode adicionar a lógica para salvar os dados
            console.log('Salvando unidade:', { nome: nomeUnidade, cep: cep });
            
            // Fechar modal após salvar
            fecharModal();
            
            // Aqui você pode adicionar feedback visual ou atualizar a lista
            alert('Unidade salva com sucesso!');
        });
    }
});

