// Variáveis globais
let modal = document.getElementById('modalFase');
let modalTitulo = document.getElementById('modalTitulo');
let formFase = document.getElementById('formFase');
let isEditMode = false;
let currentFaseId = null;

// Elementos do modal
const cancelBtn = document.querySelector('.btn-cancel');
const addBtn = document.getElementById('btnAdicionar');
const editBtns = document.querySelectorAll('.table-actions .btn-edit');
const deleteBtns = document.querySelectorAll('.table-actions .btn-delete');

// Abrir modal para adicionar fase
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Fase';
    formFase.reset();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Abrir modal para editar fase
function abrirModalEditar(faseData) {
    isEditMode = true;
    modalTitulo.textContent = 'Editar Fase';
    currentFaseId = faseData.id;

    // Preencher formulário com dados da fase
    document.getElementById('nomeFase').value = faseData.nome || '';
    
    // Aqui você pode adicionar lógica para preencher outras áreas do formulário
    // como atividades da fase, imagem, etc.

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
        formFase.reset();
        isEditMode = false;
        currentFaseId = null;
    }, 300);
}

// Excluir fase
function excluirFase() {
    if (confirm('Tem certeza que deseja excluir esta fase?')) {
        console.log('Fase excluída');
        // Aqui você pode adicionar a lógica para excluir a fase
        alert('Fase excluída com sucesso!');
    }
}

// --- Paginação e integração (nova) ---
const ITEMS_PER_PAGE_FASES = 5;
let currentFasesPage = 1;
let allFases = [];

async function fetchFases(searchTerm = '') {
    try {
        // TODO: substituir pela chamada real ao backend Java
        const mockFases = [
            { id: 1, nome: 'Golfinho Baby' },
            { id: 2, nome: 'Golfinho Infantil' },
            { id: 3, nome: 'Foca Iniciante' },
            { id: 4, nome: 'Estrela do Mar' },
            { id: 5, nome: 'Peixe Dourado' },
            { id: 6, nome: 'Marinheiro' }
        ];

        if (searchTerm) {
            return mockFases.filter(f => f.nome.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return mockFases;
    } catch (err) {
        console.error('Erro ao buscar fases:', err);
        return [];
    }
}

function renderFases(fases) {
    const container = document.querySelector('.main-content');
    const fasesHTML = fases.map(fase => `
        <div class="table-row" data-id="${fase.id}">
            <div class="table-data">
                <p class="table-row-title">${fase.nome}</p>
            </div>
            <div class="table-actions">
                <button class="btn-edit" data-user='${JSON.stringify(fase)}'>Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        </div>
    `).join('');

    const existingContent = container.querySelector('.table-content');
    if (existingContent) {
        existingContent.innerHTML = fasesHTML;
    } else {
        container.querySelector('.page-header').insertAdjacentHTML('afterend', `<div class="table-content">${fasesHTML}</div>`);
    }

    // Anexa listeners aos botões recém-criados
    attachEventListenersFases();
}

function attachEventListenersFases() {
    document.querySelectorAll('.table-actions .btn-edit').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', function () {
            let faseData = {};
            if (this.getAttribute('data-user')) {
                try { faseData = JSON.parse(this.getAttribute('data-user')); } catch (e) { }
            }
            if (!faseData.nome) {
                const tableRow = this.closest('.table-row');
                faseData = { id: parseInt(tableRow.dataset.id), nome: tableRow.querySelector('.table-row-title').textContent };
            }
            abrirModalEditar(faseData);
        });
    });

    document.querySelectorAll('.table-actions .btn-delete').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.table-row').dataset.id);
            // TODO: chamar API para excluir a fase
            if (confirm('Tem certeza que deseja excluir esta fase?')) {
                // Simula exclusão local
                allFases = allFases.filter(f => f.id !== id);
                renderFasesWithPagination(allFases);
                alert('Fase excluída com sucesso!');
            }
        });
    });
}

async function renderFasesWithPagination(fases) {
    allFases = fases;
    const paginationData = createPagination(fases.length, ITEMS_PER_PAGE_FASES, currentFasesPage);
    const paginated = paginateItems(fases, ITEMS_PER_PAGE_FASES, currentFasesPage);
    renderFases(paginated);
    renderPaginationControls(paginationData, 'paginationContainer', (page) => {
        currentFasesPage = page;
        renderFasesWithPagination(allFases);
    });
}

// Função para adicionar nova linha de atividade
function adicionarLinhaAtividade() {
    const activitiesList = document.getElementById('activitiesList');
    const newActivityRow = document.createElement('div');
    newActivityRow.className = 'activity-row';
    newActivityRow.innerHTML = `
        <input type="text" class="activity-input" placeholder="Insira a atividade">
        <div class="activity-actions">
            <button type="button" class="activity-btn-edit">
                <span class="material-symbols-outlined">edit</span>
            </button>
            <button type="button" class="activity-btn-delete">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    `;
    activitiesList.appendChild(newActivityRow);
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function () {
    // Carregar fases iniciais com paginação
    try {
        const fases = await fetchFases();
        renderFasesWithPagination(fases);
    } catch (err) {
        console.error('Erro ao carregar fases iniciais:', err);
    }

    // Botão adicionar novo
    if (addBtn) {
        addBtn.addEventListener('click', abrirModalAdicionar);
    }

    // Buscar fases com debounce
    const searchInput = document.getElementById('pesquisarFases');
    if (searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    currentFasesPage = 1;
                    const results = await fetchFases(e.target.value);
                    renderFasesWithPagination(results);
                } catch (err) {
                    console.error('Erro na busca de fases:', err);
                }
            }, 300);
        });
    }

    // Botões editar
    editBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Pegar dados do atributo data-user se disponível
            let faseData = {};
            
            if (btn.getAttribute('data-user')) {
                try {
                    faseData = JSON.parse(btn.getAttribute('data-user'));
                } catch (e) {
                    console.error('Erro ao parsear data-user:', e);
                }
            }
            
            // Se não houver data-user, usar dados de exemplo
            if (!faseData.nome) {
                // Pegar o nome da fase da linha da tabela
                const tableRow = btn.closest('.table-row');
                const faseName = tableRow.querySelector('.table-row-title').textContent;
                
                faseData = {
                    id: 1,
                    nome: faseName,
                    atividades: [] // Adicione outras propriedades conforme necessário
                };
            }
            
            abrirModalEditar(faseData);
        });
    });

    // Botões excluir
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            excluirFase();
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

    // Botão adicionar atividade
    const btnAddActivity = document.getElementById('btnAddActivity');
    if (btnAddActivity) {
        btnAddActivity.addEventListener('click', adicionarLinhaAtividade);
    }

    // Upload de imagem
    const imageUploadBox = document.getElementById('imageUploadBox');
    const imagemMascote = document.getElementById('imagemMascote');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageUploadBox && imagemMascote) {
        imageUploadBox.addEventListener('click', function() {
            imagemMascote.click();
        });

        imagemMascote.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    imageUploadBox.querySelector('.image-upload-icon').style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Submeter formulário
    if (formFase) {
        formFase.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const nomeFase = document.getElementById('nomeFase').value;
            
            // Coletar atividades
            const activityInputs = document.querySelectorAll('.activity-input');
            const atividades = [];
            activityInputs.forEach(input => {
                if (input.value.trim() !== '') {
                    atividades.push(input.value.trim());
                }
            });
            
            const faseData = {
                nome: nomeFase,
                atividades: atividades,
                imagem: imagemMascote.files[0] ? imagemMascote.files[0].name : null
            };
            
            if (isEditMode) {
                faseData.id = currentFaseId;
                console.log('Editando fase:', faseData);
                // Aqui você pode adicionar a lógica para atualizar os dados
                alert('Fase atualizada com sucesso!');
            } else {
                console.log('Adicionando fase:', faseData);
                // Aqui você pode adicionar a lógica para salvar os dados
                alert('Fase adicionada com sucesso!');
            }
            
            // Fechar modal após salvar
            fecharModal();
            
            // Aqui você pode adicionar feedback visual ou atualizar a lista
            // Por exemplo, adicionar a nova fase à lista ou recarregar os dados
        });
    }
});

