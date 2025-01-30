// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    databaseURL: "SEU_DATABASE_URL",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Inicializa o Leaflet.js
const map = L.map('map').setView([-23.55052, -46.633308], 12);

// Adiciona o OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Adiciona um geocodificador (para converter endereços em coordenadas)
const geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
}).addTo(map);

// Carregar locais do Firebase
database.ref("locais").on("child_added", (snapshot) => {
    const data = snapshot.val();
    L.marker([data.posicao.lat, data.posicao.lng])
        .addTo(map)
        .bindPopup(`<b>${data.nome}</b><br>${data.endereco}`);
});

// Adicionar um local
function adicionarLocal() {
    const nome = document.getElementById("nomeLocal").value;
    const endereco = document.getElementById("enderecoLocal").value;

    if (nome === "" || endereco === "") {
        alert("Preencha todos os campos!");
        return;
    }

    // Geocodifica o endereço para obter as coordenadas
    geocoder.options.geocoder.geocode(endereco, (results) => {
        if (results.length > 0) {
            const posicao = results[0].center;

            // Salva no Firebase
            database.ref("locais").push({
                nome,
                endereco,
                posicao: {
                    lat: posicao.lat,
                    lng: posicao.lng
                }
            });

            alert("Local adicionado!");
        } else {
            alert("Endereço não encontrado!");
        }
    });
}
