const addPostBtn = document.querySelector('.new-post-button');
const articleEl = document.querySelector('article');

addPostBtn.addEventListener('click', () => {
  articleEl.classList.remove('d-none');
});

const createDashboard = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#title').value.trim();
    const description = document.querySelector('#description').value.trim();
    
    if (title && description) {
      const result = await fetch(`/dashboard`, {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            description, description,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (result.ok) {
        document.location.replace(`/dashboard`);
      } else {
        alert('unable to add post');
      }
    }
  };
  
  document
    .querySelector('#create')
    .addEventListener('submit', createDashboard);