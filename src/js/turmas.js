// Variáveis globais
let modal = document.getElementById('modalTurmas');
let modalTitulo = document.getElementById('modalTitulo');
let formTurmas = document.getElementById('formTurmas');
let isEditMode = false;
let currentTurmaId = null;

// Função de integração com backend (simulação)
async function fetchTurmas(searchTerm = '') {
    try {
        // TODO: Substituir por chamada real à API Java
        // Exemplo de implementação futura:
        /*
        const response = await fetch('/api/turmas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
        */

        const mockTurmas = [
            {
                id: 1,
                nome: '2ª e 4ª | 9h30 - 7 a 12',
                unidade: 'Unidade Selles',
                professores: ['Professor 1', 'Professor 2']
            },
            {
                id: 2,
                nome: '3ª e 5ª | 14h00 - 10 a 15',
                unidade: 'Unidade Centro',        
                professores: ['Professor 2', 'Professor 3']
            }
        ];

        // Simula Filtros de Busca
        if (searchTerm) {
            return mockTurmas.filter(turma =>
                turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                turma.unidade.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return mockTurmas;
    } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        throw new Error('Erro ao carregar as turmas');
    }
}

// Função para atualizar a lista de turmas na Interface
function atualizarListasTurmas(turmas) {
    const container = document.querySelector('.main-content');
    const turmasHTML = turmas.map(turma => `
        <div class="table-row" data-id="${turma.id}">
            <div class="table-data">
                <p class="table-row-title">${turma.nome}</p>
                <p class="table-badge">${turma.unidade}</p>
            </div>
            <div class="table-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        </div>
    `).join('');

    const tableContent = container.querySelector('.table-content');
    if (tableContent) {
        tableContent.innerHTML = turmasHTML;
    } else {
        container.querySelector('.page-header').insertAdjacentHTML('afterend',
            `<div class="table-content">${turmasHTML}</div>`);
    }

    // Reattach event Listeners
    attachEventListeners();
}

//Função para excluir turma
async function  excluirTurma(turmaId) {
    if(confirm('Tem certeza que deseja excluir esta turma?')) {
        try {
            //TODO: Implementar chamada real à API JAVA
            console.log(`Excluindo Turma ${turmaId}`);

            //Simulação de exclusão bem sucedida
            const turmas = await fetchTurmas();
            const turmasAtualizadas = turmas.filter(turma => turma.id !== turmaId);
            updateTurmasList(turmasAtualizadas);

            alert('Turma excluída com sucesso!');
        } catch (error) {
            alert('Erro ao excluir turma.');
            console.error('Erro:', error);
        }
    }
}

// Função para salvar turma(adicionar/editar)
async function salvarTurma(turmaData) {
    try {
        //TODO: Implementar chamada real à API JAVA
        console.log('Salvando Turma:', turmaData);

        // Simula salvamento bem-sucedido
        const turmas = await fetchTurmas();
        if(turmaData.id) {
            //Atualização
            const index = turmas.findIndex(t => t.id === turmaData.id);
            if(index !== -1) {
                turmas[index] = {...turmas[index], ...turmaData};
            }
        } else {
            //Nova Turma
            turmaData.id = turmas.length + 1;
            turmas.push(turmaData);
        }

        updateTurmasList(turmas);
        return true;
    } catch (error) {
        console.error('Erro ao salvar turma:', error);
        return false;
    }
}

// Função para anexar event Listeners aos eleemntos dinâmicos
function attachEventListeners() {
    const editBtns = document.querySelectorAll('.table-actions .btn-edit');
    const deleteBtns = document.querySelectorAll('.table-actions .btn-delete');

    editBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const turmaId = this.closest('.table-row').dataset.id;
            const tumaData = {
                id: parseInt(turmaId),
                nome: this.closest('.table-row').querySelector('.table-row-title').textContent,
                unidade: this.closest('.table-row').querySelector('.table-badge').textContent,
                professores: ['Professor 1', 'Professor 2'] // TODO:  Buscar dados reais
            };
            abrirModalEditar(turmaData);
    });
    });
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const turmaId = parseInt(this.closest('.table-row').dataset.id);
            excluirTurma(turmaId);
        });
    });
}

// Elementos do modal
const cancelBtn = document.querySelector('.btn-cancel');
const addBtn = document.getElementById('btnAdicionar');
const editBtns = document.querySelectorAll('.table-actions .btn-edit');
const deleteBtns = document.querySelectorAll('.table-actions .btn-delete');

// Abrir modal para adicionar turma
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Turma';
    formTurmas.reset();
    modal.classList.add('show');
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

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function fecharModal() {
    const modalContent = modal.querySelector('.modal-content');
    
    // Adicionar classe de animação de fechamento
    modalContent.classList.add('close');
    
    // Aguardar a animação terminar (300ms) antes de esconder o modal
    setTimeout(() => {
        modal.classList.remove('show');
        modalContent.classList.remove('close');
        document.body.style.overflow = 'auto';
        formTurmas.reset();
        isEditMode = false;
        currentTurmaId = null;
    }, 300);
}

// Event listeners
// Configurações de paginação
const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let allTurmas = [];

// Função para renderizar turmas com paginação
async function renderTurmasWithPagination(turmas) {
    allTurmas = turmas;
    const paginationData = createPagination(turmas.length, ITEMS_PER_PAGE, currentPage);
    const paginatedTurmas = paginateItems(turmas, ITEMS_PER_PAGE, currentPage);
    
    // Renderiza as turmas da página atual
    atualizarListasTurmas(paginatedTurmas);
    
    // Renderiza os controles de paginação
    renderPaginationControls(paginationData, 'paginationContainer', (page) => {
        currentPage = page;
        renderTurmasWithPagination(allTurmas);
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    // Carregar turmas iniciais
    try {
        const turmas = await fetchTurmas();
        renderTurmasWithPagination(turmas);
    } catch (error) {
        alert('Erro ao carregar as turmas.');
    }

    // Adicionar evento de busca
    const searchInput = document.getElementById('pesquisaTurmas');
    if (searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    const turmas = await fetchTurmas(e.target.value);
                    atualizarListasTurmas(turmas);
                } catch (error) {
                    console.error('Erro na busca:', error);
                }
            }, 300); // Debounce de 300ms para evitar muitas requisições
        });
    }
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
        formTurmas.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const submitButton = formTurmas.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            
            try {
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
                    submitButton.disabled = false;
                    return;
                }
                
                const turmaData = {
                    nome: turmaNome,
                    unidade: unidade,
                    professores: professoresSelecionados
                };
                
                if (isEditMode) {
                    turmaData.id = currentTurmaId;
                }
                
                const resultado = await salvarTurma(turmaData);
                if (resultado) {
                    alert(isEditMode ? 'Turma atualizada com sucesso!' : 'Turma adicionada com sucesso!');
                    const turmasAtualizadas = await fetchTurmas();
                    atualizarListasTurmas(turmasAtualizadas);
                    fecharModal();
                } else {
                    alert('Erro ao salvar turma');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao salvar turma');
            } finally {
                submitButton.disabled = false;
            }
        });
    }
});

