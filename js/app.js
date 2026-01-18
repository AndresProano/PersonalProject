//Logic of the PWA and register of Service Worker

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => 
            console.log('ServiceWorker registration successful with scope: '))
            .catch(error => console.error('ServiceWorker registration failed: ', error));
    });
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    //prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    //logic to show the install button
    const installBtn = document.getElementById('installBtn');
    if(installBtn){
        installBtn.style.display = 'block';
        installBtn.addEventListener('click', () => {
            deferredPrompt.prompt(); //show install prompt  
        });
    }
});



            