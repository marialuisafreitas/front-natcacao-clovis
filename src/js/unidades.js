// Variáveis globais
let modal = document.getElementById('modalUnidade');
let modalTitulo = document.getElementById('modalTitulo');
let formUnidade = document.getElementById('formUnidade');
let isEditMode = false;
let currentUnitId = null;

// Elementos do modal
const cancelBtn = document.querySelector('.btn-cancel');
const addBtn = document.getElementById('btnAdicionar');
const editBtns = document.querySelectorAll('.table-actions .btn-edit');

// Abrir modal para adicionar unidade
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Unidade';
    formUnidade.reset();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Abrir modal para editar unidade
function abrirModalEditar(unitData) {
    isEditMode = true;
    modalTitulo.textContent = 'Editar Unidade';

    // Preencher formulário com dados da unidade
    document.getElementById('nomeUnidade').value = unitData.nome || '';
    document.getElementById('cep').value = unitData.cep || '';

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
        formUnidade.reset();
    }, 300);
}

// --- Paginação e integração (nova) ---
const ITEMS_PER_PAGE_UNIDADES = 5;
let currentUnidadesPage = 1;
let allUnidades = [];

async function fetchUnidades(searchTerm = '') {
    try {
        // TODO: substituir por chamada real ao backend Java
        const mockUnidades = [
            { id: 1, nome: 'Unidade Portal', cep: '12000-000' },
            { id: 2, nome: 'Unidade Selles', cep: '12111-111' },
            { id: 3, nome: 'Unidade Centro', cep: '12222-222' }
        ];

        if (searchTerm) {
            return mockUnidades.filter(u => u.nome.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return mockUnidades;
    } catch (err) {
        console.error('Erro ao buscar unidades:', err);
        return [];
    }
}

function renderUnidades(unidades) {
    const container = document.querySelector('.main-content');
    const html = unidades.map(u => `
        <div class="table-row" data-id="${u.id}">
            <div class="table-data">
                <p class="table-row-title">${u.nome}</p>
            </div>
            <div class="table-actions">
                <button class="btn-edit" data-user='${JSON.stringify(u)}'>Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        </div>
    `).join('');

    const existing = container.querySelector('.table-content');
    if (existing) existing.innerHTML = html;
    else container.querySelector('.page-header').insertAdjacentHTML('afterend', `<div class="table-content">${html}</div>`);

    attachEventListenersUnidades();
}

function attachEventListenersUnidades() {
    document.querySelectorAll('.table-actions .btn-edit').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', function () {
            const data = this.getAttribute('data-user');
            if (data) {
                abrirModalEditar(JSON.parse(data));
            } else {
                const row = this.closest('.table-row');
                abrirModalEditar({ id: parseInt(row.dataset.id), nome: row.querySelector('.table-row-title').textContent });
            }
        });
    });

    document.querySelectorAll('.table-actions .btn-delete').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.closest('.table-row').dataset.id);
            if (confirm('Tem certeza que deseja excluir esta unidade?')) {
                // TODO: chamada real para backend
                allUnidades = allUnidades.filter(u => u.id !== id);
                renderUnidadesWithPagination(allUnidades);
                alert('Unidade excluída com sucesso!');
            }
        });
    });
}

async function renderUnidadesWithPagination(unidades) {
    allUnidades = unidades;
    const paginationData = createPagination(unidades.length, ITEMS_PER_PAGE_UNIDADES, currentUnidadesPage);
    const paginated = paginateItems(unidades, ITEMS_PER_PAGE_UNIDADES, currentUnidadesPage);
    renderUnidades(paginated);
    renderPaginationControls(paginationData, 'paginationContainer', (page) => {
        currentUnidadesPage = page;
        renderUnidadesWithPagination(allUnidades);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function () {
    // Carregar unidades iniciais com paginação
    try {
        const unidades = await fetchUnidades();
        renderUnidadesWithPagination(unidades);
    } catch (err) {
        console.error('Erro ao carregar unidades iniciais:', err);
    }

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

    // Buscar unidades com debounce
    const searchInput = document.getElementById('pesquisarUnidades');
    if (searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    currentUnidadesPage = 1;
                    const results = await fetchUnidades(e.target.value);
                    renderUnidadesWithPagination(results);
                } catch (err) {
                    console.error('Erro na busca de unidades:', err);
                }
            }, 300);
        });
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

