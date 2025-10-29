// Verifica a autenticação do usuário
function checkAuth() {
    const userName = sessionStorage.getItem('userName');
    if (!userName) {
        // Redireciona para a página de login
        window.location.href = window.location.pathname.endsWith('login.html') ? 'login.html' : '../pages/login.html';
        return false;
    }
    return true;
}

// Faz logout do usuário
function handleLogout() {
    sessionStorage.clear();
    // Levar para a página de login
    window.location.href = window.location.pathname.endsWith('login.html') ? 'login.html' : '../pages/login.html';
}

// Atualiza o nome do usuário na sidebar
function updateUserName() {
    const userName = sessionStorage.getItem('userName') || 'Usuário';
    const el = document.querySelector('.sidebar h1');
    if (el) el.textContent = `Olá, ${userName}`;
}

// Inicializa controles de navegação
function initNavigation() {
    // Em páginas internas, verificar autenticação
    if (!window.location.pathname.endsWith('login.html')) {
        checkAuth();
        updateUserName();
    }

    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
}

document.addEventListener('DOMContentLoaded', initNavigation);