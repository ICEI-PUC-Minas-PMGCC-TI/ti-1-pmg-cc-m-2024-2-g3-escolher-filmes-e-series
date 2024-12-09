// Seleção de elementos
const userNameInput = document.getElementById('userName');
const ratingInput = document.getElementById('rating');
const commentTextInput = document.getElementById('commentText');
const submitBtn = document.getElementById('submitBtn');
const commentsDiv = document.getElementById('comments');
const noCommentsMessage = document.getElementById('no-comments');

// Função para carregar os comentários do localStorage
function loadComments() {
    const savedComments = JSON.parse(localStorage.getItem('comments')) || [];

    savedComments.forEach(comment => {
        addCommentToDOM(comment.name, comment.rating, comment.text, false);
    });

    if (savedComments.length > 0) {
        noCommentsMessage.style.display = 'none';
    }
}

// Função para salvar os comentários no localStorage
function saveComments() {
    const comments = Array.from(commentsDiv.querySelectorAll('.comment')).map(commentDiv => {
        return {
            name: commentDiv.querySelector('.comment-name').textContent,
            rating: parseFloat(commentDiv.querySelector('.comment-rating').textContent),
            text: commentDiv.querySelector('.comment-text').textContent.trim()
        };
    });

    localStorage.setItem('comments', JSON.stringify(comments));
}

// Função para adicionar um comentário ao DOM
function addCommentToDOM(name, rating, text, save = true) {
    // Cria o elemento do comentário
    const newComment = document.createElement('div');
    newComment.classList.add('comment');
    newComment.innerHTML = `
        <strong class="comment-name">${name}</strong>
        <span class="comment-rating"> avaliou: ${rating} / 10</span><br>
        <span class="comment-text">${text}</span>
        <button class="deleteBtn">Excluir</button>
    `;
    commentsDiv.appendChild(newComment);

    // Esconde a mensagem "Nenhum comentário enviado ainda"
    noCommentsMessage.style.display = 'none';

    // Atribui o evento de clique ao botão de exclusão
    const deleteBtn = newComment.querySelector('.deleteBtn');
    deleteBtn.addEventListener('click', () => {
        console.log('Excluir botão clicado!');
        // Remove o comentário do DOM
        newComment.remove();

        // Verifica se ainda há comentários, e exibe a mensagem padrão se necessário
        if (commentsDiv.querySelectorAll('.comment').length === 0) {
            noCommentsMessage.style.display = 'block';
        }

        // Atualiza o localStorage
        saveComments();
    });

    // Salva os comentários no localStorage, se necessário
    if (save) {
        saveComments();
    }
}

// Adiciona evento de clique ao botão de envio
submitBtn.addEventListener('click', () => {
    const userName = userNameInput.value.trim();
    const rating = parseFloat(ratingInput.value);
    const commentText = commentTextInput.value.trim();

    if (userName && !isNaN(rating) && rating >= 1 && rating <= 10 && commentText) {
        addCommentToDOM(userName, rating, commentText);

        userNameInput.value = '';
        ratingInput.value = '';
        commentTextInput.value = '';
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
});

// Carrega os comentários ao inicializar
loadComments();
