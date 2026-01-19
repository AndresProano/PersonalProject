const CLIENT_ID = '252033594440-5vqjb115r800hgrnvif1fmhd88nh9b6u.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const FILE_NAME = 'house_organizer_backup.json';

let accessToken = localStorage.getItem('drive_token') || null;
let tokenClient;

function initDriveAuth() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
            accessToken = tokenResponse.access_token;
            localStorage.setItem('drive_token', accessToken);
            alert("Conectado a Google Drive");
            syncFromDrive(); 
        },
    });
}

async function syncToDrive() {
    if (!accessToken) return;

    const allData = {
        kitchenItems: JSON.parse(localStorage.getItem('kitchenItems')) || [],
        moneyItems: JSON.parse(localStorage.getItem('moneyItems')) || [],
        expenseItems: JSON.parse(localStorage.getItem('expenseItems')) || []
    };

    const metadata = {
        name: FILE_NAME,
        mimeType: 'application/json',
    };

    const fileContent = JSON.stringify(allData);
    const file = new Blob([fileContent], { type: 'application/json' });

    const fileId = await findFileId();
    
    let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    let method = 'POST';

    if (fileId) {
        url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
        method = 'PATCH';
    }

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: form
    });
    console.log("Sincronizado con Drive correctamente");
}

async function findFileId() {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}' and trashed=false`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await response.json();
    return data.files.length > 0 ? data.files[0].id : null;
}

async function syncFromDrive() {
    const fileId = await findFileId();
    if (!fileId) return;

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const driveData = await response.json();

    if (driveData.kitchenItems) localStorage.setItem('kitchenItems', JSON.stringify(driveData.kitchenItems));
    if (driveData.moneyItems) localStorage.setItem('moneyItems', JSON.stringify(driveData.moneyItems));
    if (driveData.expenseItems) localStorage.setItem('expenseItems', JSON.stringify(driveData.expenseItems));

    if (typeof render === 'function') render();
    if (typeof renderBank === 'function') {
        renderBank();
        renderExpenses();
    }
}