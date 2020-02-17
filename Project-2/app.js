let container = document.getElementById('info-container');
let buttonSignIng = document.getElementById('google-signin');
let buttonSignOut = document.querySelector('.button-signout');

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    container.innerHTML = `
    <img
       src="${profile.getImageUrl()}"
        alt="user-img"
        class="user-img"
    />
    <div class="user-info">
        <span class="info-id">${profile.getId()}</span>
        <p class="info-name">${profile.getName()}</p>
        <p class="info-email">${profile.getEmail()}</p>
    </div>
    `;
    localStorageProvider.saveLS(id_token)
    buttonSignIng.style.display = 'none'
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
    container.innerHTML = '';
    localStorageProvider.deleteLS()
    buttonSignIng.style.display = 'block'
    window.location.reload()
}
let localStorageProvider = {
    saveLS: (token) => {
        localStorage.setItem('token', JSON.stringify(token))
    },
    deleteLS: () => {
        localStorage.removeItem('token')
    }
}