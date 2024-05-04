
const express = require('express'); // Import express using require
const mongoose = require('mongoose'); // Import Mongoose using require
const morgan = require('morgan');
const blogRoutes = require('./routes/backendBLOGSRoutes.js'); // Import routes using require
const usersRoutes = require('./routes/backendUSERSRoutes.js'); // Import routes using require
const cookieParser = require('cookie-parser');
const cors = require('cors');

const hostname = '127.0.0.1';
const app = express();
const port = process.env.port || 9090;
const databaseName = 'ReadyBackendDB';

// Cela afichera les requêtes MongoDB dans le terminal
mongoose.set('debug', true);
// Utilisation des promesses ES6 pour Mongoose, donc aucune callback n'est nécessaire
mongoose.Promise = global.Promise;

// Se connecter à MongoDB
mongoose
// remove the / next to $
.connect('mongodb://127.0.0.1:27017/dababaseName')  // change dataBaseName
.then(() => {
    // Une fois connecté, afficher un message de réussite sur la console
    console.log('Connected to DB');
})
.catch(err => {
    // Si quelque chose ne va pas, afficher l'erreur sur la console
    console.log(err);
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use('/blog',blogRoutes);
app.use('/',usersRoutes);

/**
 * Démarrer le serveur à l'écoute des connexions
 */
app.listen(port, hostname,() => {
    console.log('Server running at http://localhost:9090/');
})





