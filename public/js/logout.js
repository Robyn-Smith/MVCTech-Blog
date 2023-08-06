const logout = async () => {
    const result = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (result.ok) {
      document.location.replace('/');
    } else {
      alert('logout was unsuccessful');
    }
  };
  
  document.querySelector('#logout').addEventListener('click', logout);