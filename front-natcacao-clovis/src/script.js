// Função para validar o formato do email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para mostrar mensagens de feedback
function showFeedback(elementId, isValid, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = isValid ? 'feedback-success' : 'feedback-error';
    }
}

// Função para verificar as credenciais com o backend
async function checkCredentials(email, password) {
    try {
        // Aqui você vai substituir este código pela chamada real ao seu backend
        const response = await fetch('sua-url-de-api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Credenciais inválidas');
        }

        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        return { 
            success: false, 
            error: 'Email ou senha incorretos'
        };
    }
}

// Função principal de validação do formulário
async function validateForm(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validação básica do formato do email
    if (!validateEmail(email)) {
        showFeedback('email-feedback', false, 'Por favor, insira um email válido');
        return;
    }

    // Validação básica da senha (não vazia)
    if (!password) {
        showFeedback('password-feedback', false, 'Por favor, insira sua senha');
        return;
    }

    // Limpar feedbacks anteriores
    showFeedback('email-feedback', true, '');
    showFeedback('password-feedback', true, '');

    try {
        const button = document.querySelector('button[type="submit"]');
        button.disabled = true;
        button.textContent = 'Entrando...';

        const result = await checkCredentials(email, password);

        if (result.success) {
            // Login bem sucedido - redirecionar para a página principal
            window.location.href = 'pagina-principal.html'; // Ajuste esta URL conforme necessário
        } else {
            // Login falhou
            showFeedback('password-feedback', false, result.error);
        }
    } catch (error) {
        showFeedback('password-feedback', false, 'Erro ao fazer login. Tente novamente.');
    } finally {
        const button = document.querySelector('button[type="submit"]');
        button.disabled = false;
        button.textContent = 'ENTRAR';
    }
}

// Adicionar listener quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', validateForm);
    }

    // Limpar feedbacks quando o usuário começar a digitar
    const inputs = ['email', 'password'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                showFeedback(`${id}-feedback`, true, '');
            });
        }
    });
});