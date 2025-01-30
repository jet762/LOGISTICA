// Configuração do Firebase (use suas credenciais aqui)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    databaseURL: "https://logisticaagro-bf3f4-default-rtdb.europe-west1.firebasedatabase.app/null",
    projectId: "logisticaagro-bf3f4",
    storageBucket: "logisticaagro-bf3f4.firebasestorage.app",
    messagingSenderId: "740279361333",
    appId: "1:740279361333:web:1321499c13331f29edb67c"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Inicializa o mapa com OpenStreetMap
const map = L.map('map').setView([-23.55052, -46.633308], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Inicializa o geocoder corretamente
const geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
}).addTo(map);

// Função para adicionar local
function adicionarLocal() {
    const nome = document.getElementById("nomeLocal").value;
    const endereco = document.getElementById("enderecoLocal").value;

    if (nome === "" || endereco === "") {
        alert("Preencha todos os campos!");
        return;
    }

    // Usa o geocoder para buscar a localização do endereço
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

            // Exibe um alerta confirmando o local adicionado
            alert("Local adicionado!");
        } else {
            alert("Endereço não encontrado!");
        }
    });
}
