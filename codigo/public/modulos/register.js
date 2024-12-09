document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("login-section");
    const registerSection = document.getElementById("register-section");
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    // Alternância entre as seções de login e cadastro
    showRegisterLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginSection.classList.add("hidden");
        registerSection.classList.remove("hidden");
    });

    showLoginLink.addEventListener("click", (e) => {
        e.preventDefault();
        registerSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    });

    // Cadastro de Usuário
    document.getElementById("register-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const fullname = document.getElementById("register-fullname").value;
        const email = document.getElementById("register-email").value;
        const username = document.getElementById("register-username").value;
        const password = document.getElementById("register-password").value;

        if (localStorage.getItem(username)) {
            alert("Usuário já cadastrado. Por favor, escolha outro nome de usuário.");
            return;
        }

        const userData = { fullname, email, password };
        localStorage.setItem(username, JSON.stringify(userData));
        alert("Cadastro realizado com sucesso!");
        document.getElementById("register-form").reset();
        registerSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    });

    // Login do Usuário
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        const storedUser = localStorage.getItem(username);
        if (!storedUser) {
            alert("Usuário não encontrado. Verifique o nome de usuário ou cadastre-se.");
            return;
        }

        const userData = JSON.parse(storedUser);
        if (userData.password === password) {
            alert(`Bem-vindo, ${userData.fullname}!`);
            window.location.href = "dashboard.html"; // Redirecionar para a página protegida
        } else {
            alert("Senha incorreta. Tente novamente.");
        }
    });
});
