// Função para criar paginação
function createPagination(totalItems, itemsPerPage = 10, currentPage = 1) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Calcula o range de páginas a mostrar
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Ajusta o startPage se estiver próximo do final
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    // Gera array com números das páginas
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    // Calcula índices dos itens
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return {
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages,
        startPage,
        endPage,
        startIndex,
        endIndex,
        pages
    };
}

// Função para renderizar controles de paginação
function renderPaginationControls(paginationData, containerId, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { currentPage, totalPages, pages } = paginationData;

    let html = '<div class="pagination">';
    
    // Botão Previous
    html += `<button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
        ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
        &lt; Anterior
    </button>`;

    // Primeira página
    if (pages[0] > 1) {
        html += `
            <button class="pagination-btn" data-page="1">1</button>
            ${pages[0] > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
        `;
    }

    // Páginas numeradas
    pages.forEach(page => {
        html += `
            <button class="pagination-btn ${page === currentPage ? 'active' : ''}" 
                data-page="${page}">${page}</button>
        `;
    });

    // Última página
    if (pages[pages.length - 1] < totalPages) {
        html += `
            ${pages[pages.length - 1] < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
            <button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>
        `;
    }

    // Botão Next
    html += `<button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
        ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
        Próximo &gt;
    </button>`;

    html += '</div>';
    container.innerHTML = html;

    // Adiciona event listeners
    container.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!btn.disabled) {
                const page = parseInt(btn.dataset.page);
                onPageChange(page);
            }
        });
    });
}

// Função para paginar array de itens
function paginateItems(items, pageSize, currentPage) {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
}