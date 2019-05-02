const button = document.getElementById('fav');
button.addEventListener('click', function(e) {
  console.log('has faveado');

  fetch('/faved', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('lo prsionaste ¡Verdad?');
        return;
      }
      throw new Error('Falló request');
    })
    .catch(function(error) {
      console.log(error); 
      return
    });
});