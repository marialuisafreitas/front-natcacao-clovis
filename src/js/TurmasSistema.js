// Variáveis globais
let modal = document.getElementById('modalTurmas');
let modalTitulo = document.getElementById('modalTitulo');
let formTurmas = document.getElementById('formTurmas');
let isEditMode = false;
let currentTurmaId = null;

// Elementos do modal
const cancelBtn = document.querySelector('.btn-cancelar');
const addBtn = document.getElementById('btnAdicionar');
const editBtns = document.querySelectorAll('#editarTurmas button#editar');
const deleteBtns = document.querySelectorAll('#editarTurmas button#excluir');

// Abrir modal para adicionar turma
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Turma';
    formTurmas.reset();
    modal.classList.add('mostrar');
    document.body.style.overflow = 'hidden';
}

// Abrir modal para editar turma
function abrirModalEditar(turmaData) {
    isEditMode = true;
    modalTitulo.textContent = 'Editar Turma';
    currentTurmaId = turmaData.id;

    // Preencher formulário com dados da turma
    document.getElementById('turma').value = turmaData.nome || '';
    document.getElementById('unidade').value = turmaData.unidade || '';
    
    // Desmarcar todos os checkboxes primeiro
    document.getElementById('professor1').checked = false;
    document.getElementById('professor2').checked = false;
    document.getElementById('professor3').checked = false;
    
    // Se professor for um array, marcar todos os selecionados
    if (Array.isArray(turmaData.professores)) {
        turmaData.professores.forEach(prof => {
            if (prof === 'Professor 1') document.getElementById('professor1').checked = true;
            if (prof === 'Professor 2') document.getElementById('professor2').checked = true;
            if (prof === 'Professor 3') document.getElementById('professor3').checked = true;
        });
    } else if (turmaData.professor) {
        // Se for string única, marcar apenas esse
        if (turmaData.professor === 'Professor 1') document.getElementById('professor1').checked = true;
        if (turmaData.professor === 'Professor 2') document.getElementById('professor2').checked = true;
        if (turmaData.professor === 'Professor 3') document.getElementById('professor3').checked = true;
    }

    modal.classList.add('mostrar');
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function fecharModal() {
    const modalContent = modal.querySelector('.modal-content');
    
    // Adicionar classe de animação de fechamento
    modalContent.classList.add('fechar');
    
    // Aguardar a animação terminar (300ms) antes de esconder o modal
    setTimeout(() => {
        modal.classList.remove('mostrar');
        modalContent.classList.remove('fechar');
        document.body.style.overflow = 'auto';
        formTurmas.reset();
        isEditMode = false;
        currentTurmaId = null;
    }, 300);
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
            // Dados de exemplo - em produção, isso viria do backend ou do elemento pai
            const turmaData = {
                id: 1,
                nome: '2ª e 4ª | 9h30 - 7 a 12',
                unidade: 'Unidade Selles',
                professores: ['Professor 1', 'Professor 2']
            };
            abrirModalEditar(turmaData);
        });
    });

    // Botões excluir
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            excluirTurma();
        });
    });

    // Fechar modal com botão Cancelar
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
    if (formTurmas) {
        formTurmas.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const turmaNome = document.getElementById('turma').value;
            const unidade = document.getElementById('unidade').value;
            
            // Obter professores selecionados (pode ser múltiplos)
            const professoresSelecionados = [];
            if (document.getElementById('professor1').checked) {
                professoresSelecionados.push('Professor 1');
            }
            if (document.getElementById('professor2').checked) {
                professoresSelecionados.push('Professor 2');
            }
            if (document.getElementById('professor3').checked) {
                professoresSelecionados.push('Professor 3');
            }
            
            // Validar se pelo menos um professor foi selecionado
            if (professoresSelecionados.length === 0) {
                alert('Por favor, selecione pelo menos um professor responsável.');
                return;
            }
            
            const turmaData = {
                nome: turmaNome,
                unidade: unidade,
                professores: professoresSelecionados
            };
            
            if (isEditMode) {
                turmaData.id = currentTurmaId;
                console.log('Editando turma:', turmaData);
                // Aqui você pode adicionar a lógica para atualizar os dados
                alert('Turma atualizada com sucesso!');
            } else {
                console.log('Adicionando turma:', turmaData);
                // Aqui você pode adicionar a lógica para salvar os dados
                alert('Turma adicionada com sucesso!');
            }
            
            // Fechar modal após salvar
            fecharModal();
            
            // Aqui você pode adicionar feedback visual ou atualizar a lista
            // Por exemplo, adicionar a nova turma à lista ou recarregar os dados
        });
    }
});

