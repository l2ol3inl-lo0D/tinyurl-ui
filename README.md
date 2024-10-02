## TinyUrl Application UI

### Dépendences
 - Serveur local sur l'adresse http://localhost:8080
 - Application TinyUrl

### Installation
```bash
npm install
```

### Exécution
```bash
npm start
```

### Utilisation
#### Page d'accueil
##### Cas nominal
- Entrer une URL valide
- Appuyer sur envoyer
- On peut cliquer sur le lien généré pour être redirigé vers le site original
- On peut copier et coller ce lien directement dans le surfeur afin d'être redirié

##### Cas erreur de connectivité au serveur
- Un message d'erreur est affiché

##### Cas d'URL non conforme
- Un message d'erreur est affiché

#### Page 404
- Lorsque le code entré dans la barre de recherche du surfeur n'est pas reconnu
- Appuyer sur retour pour revenir à la page d'accueil