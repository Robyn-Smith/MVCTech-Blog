const HandleComment = async (event) => {
  event.preventDefault();

  const comment = document.querySelector('#comment').value.trim();
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  if (comment) {
    const result = await fetch(`/api/blog/${id}`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (result.ok) {
      document.location.replace(`/blog/${id}`);
    } else {
      alert('Unable to add comment.');
    }
  }
};

document
  .querySelector('.comment-form')
  .addEventListener('submit', HandleComment);