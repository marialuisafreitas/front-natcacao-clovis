// Função para validação básica do formato do email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validação dos campos de login
function validateLoginFields(email, password) {
    if (!email || !password) {
        return { isValid: false, message: 'Por favor, preencha todos os campos.' };
    }

    if (!validateEmail(email)) {
        return { isValid: false, message: 'Por favor, insira um email válido.' };
    }

    return { isValid: true };
}

// Tentativa de login (mock). Substituir por chamada ao backend Java quando pronto.
async function attemptLogin(email, password) {
    try {
        const mockResponse = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@teste.com' && password === '123456') {
                    resolve({
                        success: true,
                        user: {
                            name: 'Administrador',
                            role: 'ADMIN'
                        }
                    });
                } else {
                    reject(new Error('Credenciais inválidas'));
                }
            }, 400);
        });

        const result = await mockResponse;
        if (result && result.success) {
            sessionStorage.setItem('userName', result.user.name);
            sessionStorage.setItem('userRole', result.user.role);
            return { success: true };
        }

        return { success: false, message: 'Erro desconhecido.' };
    } catch (err) {
        return { success: false, message: err.message || 'Email ou senha incorretos.' };
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Limpar sessão anterior
    sessionStorage.clear();

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = loginForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Entrando...';
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const validation = validateLoginFields(email, password);
        if (!validation.isValid) {
            alert(validation.message);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'ENTRAR';
            }
            return;
        }

        const result = await attemptLogin(email, password);
        if (result.success) {
            // Redireciona para Turmas (arquivo na mesma pasta pages)
            window.location.href = 'turmas.html';
        } else {
            alert(result.message);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'ENTRAR';
            }
        }
    });
});