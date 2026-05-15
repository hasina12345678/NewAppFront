# Variable
### 1. Let  (modifiable)

```javascript
let age = 20;
age = 25;

console.log(age); // 25
```

### 2. const (non réassignable)
**Boite**
```javascript
const nom = "Jean";
nom = "Paul"; // ❌ erreur
```
**Objet, Pas la boite**
```javascript
const user = { nom: "Jean" };
user.nom = "Paul";

console.log(user.nom); // "Paul"
```

# Fonctions
**Simple**
```javascript
function addition(a, b) {
  return a + b;
}

addition(2, 3); // 5
```

**Fléchée**
```javascript
const addition = (a, b) => a + b;
```

# Tableau
```javascript
const notes = [10, 15, 18];
console.log(notes[0]); // 10
```
**map** (Transformation)
```javascript
const result = notes.map(n => n * 2);

[20, 30, 36] // resultat
```
**filter** (filtrer)
```javascript
const result = notes.filter(n => n > 10);

[15, 18] // resultat
```
**Objet** (Structure)
```javascript
const user = {
  nom: "Jean",
  age: 20
};

console.log(user.nom); // "Jean"
```

# Destructuring
Pour extraire rapidement des valeurs.
``` javascript
const user = { nom: "Jean", age: 20 };
const { nom, age } = user;

nom = "Jean" // resultat
age = 20


const notes = [10, 15];
const [a, b] = notes;

a = 10 // resultat
b = 15 
```
# Modules (import/export)
```javascript
//math.js
export const addition = (a, b) => a + b;

// appel
import { addition } from "./math.js";

console.log(addition(2, 3)); // 5
```

# Promises & async/await
**Une Promise = “Je te donnerai une réponse plus tard”**

#### Problème de base
- Certaines opérations prennent du temps:
    - API
    - base de données
    - fichier
``` javascript
const promesse = new Promise((resolve) => {
  resolve("OK");
});

promesse.then(result => console.log(result)); 

OK // resultat
```

**async / await (version moderne)**
```javascript
const getData = async () => {
  const res = await fetch("https://api.com");
  const data = await res.json();
  console.log(data);
};

// async → la fonction devient asynchrone
// await → “attends le résultat avant de continuer”
```
# JSX
#### React est une bibliothèque JavaScript qui sert à :
- créer des interfaces utilisateur (UI)
- de manière dynamique et réactive

**React = UI basée sur des données**

``
Si les données changent → l’affichage change automatiquement``

``` javascript
// sans react
document.getElementById("text").innerText = "Bonjour";

// avec reat
const element = <h1>Bonjour</h1>;

// js + html, {} = injecter JS
const nom = "Hasina";
const element = <h1>Bonjour {nom}</h1>;

// js dans jsx
const a = 5;
const b = 3;

<h1>{a + b}</h1> // 8

// condition simple 
const isLogged = true;

<h1>{isLogged ? "Connecté" : "Non connecté"}</h1> // Connecté

// JSX doit avoir un seul parent
return (
  <h1>Bonjour</h1>
  <p>Test</p>
); // ❌ Incorrect
return (
  <div>
    <h1>Bonjour</h1>
    <p>Test</p>
  </div>
); // ✅ Correct
```

# Composant
**Une application React = assemblage de composants**

- Pour rendre un COMPOSANT DYNAMIQUE

    **Props**
     ```javascript
        // statique
        function User() {
            return <h1>Jean</h1>;
        }

        // avec props
        function User(props) {
            return <h1>{props.nom}</h1>;
        }
        // utilisation
        <User nom="Hasina" />
        <User nom="Jean" />

        // version moderne
        function User({ nom }) {
            return <h1>{nom}</h1>;
        }

        function User({ nom, age }) {
            return (
                <div>
                <h1>{nom}</h1>
                <p>{age}</p>
                </div>
            );
        }
        // Utilisation
        <User nom="Hasina" age={25} />
        ```
# State (Gestion d' état)
 - Le state :
    - une donnée interne d’un composant
    - qui peut changer dans le temps
    - et qui met à jour automatiquement l’affichage

- ##  useState
    - Syntaxe
    ``` javascript
    const [state, setState] = useState(valeurInitiale);

    // exemple 1
        import { useState } from "react";

        function App() {
            const [count, setCount] = useState(0);
            return <h1>{count}</h1>; // 0
        }
        // setCount = fonction pour modifier

    // exemple 2
        function App() {
            const [count, setCount] = useState(0);

            return (
                <div>
                <h1>{count}</h1>
                <button onClick={() => setCount(1)}>Changer</button>
                </div>
            );
        }
        // au depart 0, apres clic 1
        // quand on fait setCount(1); = met à jour count, re-exécute le composant, met à jour l’écran

    // exemple 3
        setCount(count + 1);
        setCount(count + 1);
        // +1 seulement (pas +2)

        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        // +2
        // React met à jour de manière asynchrone, prev = valeur réelle au moment de l’update
    ```

    - State avec objets
    ``` javascript
        const [user, setUser] = useState({
            nom: "Jean",
            age: 20
        });

        user.age = 25; // ❌ interdit, React ne détecte pas

        // bonne facon
        setUser({
            ...user,
            age: 25
        }); // age = 25

        // Pourquoi ...user ? => Pour garder les autres propriétés
    ```
    - State vs Props
        - Props = viennent du parent, lecture seule
        - Props = viennent du parent, lecture seule
    
    ```javascript
        function User({ nom }) {
            const [age, setAge] = useState(20);

            return (
                <div>
                <h1>{nom}</h1>
                <p>{age}</p>
                </div>
            );
        }
        // nom → props (fixe)
        // age → state (modifiable)
    ```

# Re-render (très important)
**Quand React re-render ?**
    `Quand le state change`

**React ne recharge PAS la page, Il met juste à jour ce qui change**

```javascript
    import { useState } from "react";

    function App() {
        const [count, setCount] = useState(0);

        return (
            <div>
            <h1>{count}</h1>

            <button onClick={() => setCount(count + 1)}>
                +
            </button>

            <button onClick={() => setCount(count - 1)}>
                -
            </button>
            </div>
        );
    }
```

# Evenement
**Un événement = ➡️ une action utilisateur**

- cliquer → onClick
- taper → onChange
- taper → onChange
1. ### Onclick
    ``` javascript
    function App() {
        const handleClick = () => {
            console.log("Bouton cliqué");
        };

        return <button onClick={handleClick}>Clique</button>;
        //<button onClick={handleClick()}> la fonction s’exécute immédiatement, pas au clic ❌

        // correct
        <button onClick={handleClick}>
    }
    ```
    ``` javascript
    // Modifier un state avec événement
    import { useState } from "react";
    function App() {
        const [count, setCount] = useState(0);

        return (
            <button onClick={() => setCount(count + 1)}>
            {count}
            </button>
        );
    }
    ```
2. ### onChange (input)
**Comment récupérer ce que l’utilisateur tape ?**
``` javascript
    import { useState } from "react";

    function App() {
        const [text, setText] = useState("");

        return (
            <input onChange={(e) => setText(e.target.value)} />
        );
    }
    // e = événement
    // e.target = input
    // e.target.value = texte tapé
```
``` javascript
    // Afficher la valeur saisie
    function App() {
        const [text, setText] = useState("");

        return (
            <div>
            <input onChange={(e) => setText(e.target.value)} />
            <h1>{text}</h1>
            </div>
        );
    }
```
```javascript
    // [e.target.name]: e.target.value
    // met à jour dynamiquement nom ou age = si Hasina, 25 alors { nom: "Hasina", age: "25" }
    function App() {
    const [form, setForm] = useState({
        nom: "",
        age: ""
    });

    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value
        });
    };

    return (
        <div>
        <input name="nom" onChange={handleChange} />
        <input name="age" onChange={handleChange} />
        </div>
    );
    }
```

3. ### onSubmit (Formulaires)

```javascript
    function App() {
        const [name, setName] = useState("");

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log(name);
        };

        return (
            <form onSubmit={handleSubmit}>
            <input onChange={(e) => setName(e.target.value)} />
            <button type="submit">Envoyer</button>
            </form>
        );
    }
    // onSubmit → quand on envoie formulaire
    // e.preventDefault() → empêche rechargement page
```

# Hooks essentiels
**Un Hook =
➡️ une fonction spéciale React
➡️ qui permet d’ajouter des capacités dans un composant**

### Exemple :
- useState → gérer données
- useEffect → gérer effets (API, timer…)
- useRef → accéder DOM / stocker valeur
- useRef → accéder DOM / stocker valeur

1. ## useEffect
    Exécuter du code après le rendu du composant

    **Syntaxe**
    ```javascript
    useEffect(() => {
        // code
    }, [dépendances]);
    ```
    **Cas 1 : UNE seule fois (montage)**
    ```javascript
    import { useEffect } from "react";

    useEffect(() => {
    console.log("Chargement");
    }, []);
    // [] = aucune dépendance
    // donc React exécute une seule fois
    ```

    **Cas 2 : exécuté quand une VALEUR CHANGE**
    ```javascript
    useEffect(() => {
        console.log("count changé");
    }, [count]);
    // React surveille count
    // si change → exécute effect
    ```

    **Cas 3 : exécuté à chaque render**
    ```javascript
    useEffect(() => {
        console.log("render");
    });
    // ⚠️ sans tableau
    ```
    ```md
    | Cas   | Dépendances | Quand exécuté  |
    | ----- | ----------- | -------------- |
    | `[]`  | vide        | une fois       |
    | `[x]` | variable    | quand x change |
    | rien  | —           | chaque render  |
    ```

    ```md
    | Phase   | useEffect       |
    | ------- | --------------- |
    | Mount   | []              |
    | Update  | [state]         |
    | Unmount | return function |
    ```
2. ### useRef
    - **accéder au DOM**

    - **stocker une valeur sans re-render**

    ```javascript
    import { useRef } from "react";

    function App() {
        const inputRef = useRef();

        const focus = () => {
            inputRef.current.focus();
        };

        return (
            <div>
            <input ref={inputRef} />
            <button onClick={focus}>Focus</button>
            </div>
        );
    }
    // ref={inputRef} → lie au DOM
    // inputRef.current → élément réel
    // resultat = clic bouton → curseur dans input
    ```
    ```javascript
    // Stocker valeur (sans re-render)
    const countRef = useRef(0);
    countRef.current++;
    ```

    ```md
    | useState     | useRef           |
    | ------------ | ---------------- |
    | re-render    | pas de re-render |
    | UI dynamique | stockage interne |
    ```

# Rendering conditionnel
1. ## Ternaire
    **Syntaxe**

    ``
    condition ? valeurSiVrai : valeurSiFaux
    ``

    ```javascript
    function App() {
        const isLogged = false;

        return (
            <h1>
            {isLogged ? "Bienvenue" : "Connexion requise"}
            </h1>
        );
    }
    ```
2. ## && (affichage conditionnel simple)
    - **si condition vraie → affiche**
    - **sinon → n’affiche rien**
    ```javascript
    function App() {
        const isLogged = true;

        return (
            <div>
            {isLogged && <h1>Bienvenue</h1>}
            </div>
        );
    }

    // Cas reel
    function App() {
        const isLoading = true;

        return (
            <div>
            {isLoading && <p>Chargement...</p>}
            </div>
        );
    }
    ```


# map + key (Listes et clés)
- **map** transformer une liste de données → UI
    ```javascript
    function App() {
        const names = ["Jean", "Paul", "Marie"];

        return (
            <ul>
            {names.map(name => (
                <li>{name}</li>
            ))}
            </ul>
        );
    }
    ```

- **key** 
    - React sait :
        - quel élément a changé
        - lequel supprimer
        - lequel ajouter


```javascript
function App() {
  const products = [
    { id: 1, name: "PC" },
    { id: 2, name: "Phone" }
  ];

  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

# Router
**Installation**

``npm install react-router-dom``

```javascript
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
        </Routes>
    );
}
```

```javascript
<a href="/about">About</a> 
// ❌ Mauvais , recharge la page ❌

// ✅ Bon (React Router)
import { Link } from "react-router-dom";
<Link to="/about">About</Link>
```

**useNavigate**
```javascript
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/about")}>
            Aller About
        </button>
    );
}
```

**Route dynamique**
```javascript
// passe le variable et affiche
<Route path="/user/:id" element={<User />} />

// recupere le variable en parametre
import { useParams } from "react-router-dom";

function User() {
  const { id } = useParams();

  return <h1>User ID: {id}</h1>;
}
```


# API

- ## Fecth
    - retourne une Promise
    - pas directement les données
    ``` javascript
        fetch("https://api.example.com/users")

        // Version Coorecte
        fetch("https://api.example.com/users")
            .then(res => res.json())
            .then(data => console.log(data));
        // fetch = appel API
        // res.json = convertit JSON
        // date = donnees utilisable
    ```

- ## async / await
    - plus lisible que .then()
    ```javascript
        const getUsers = async () => {
        const res = await fetch("https://api.example.com/users");
        const data = await res.json();

        console.log(data);
        };
    ```

- ## useEffect + API
    ```javascript
        import { useState, useEffect } from "react";

        function App() {
            const [users, setUsers] = useState([]);

            useEffect(() => {
                const getUsers = async () => {
                    const res = await fetch("https://jsonplaceholder.typicode.com/users");
                    const data = await res.json();
                    setUsers(data);
                };

                getUsers();
            }, []);

            return (
                <div>
                {users.map(user => (
                    <h3 key={user.id}>{user.name}</h3>
                ))}
                </div>
            );
        }
    ```

- ## Axios
    - auto JSON
    - ``npm install axios``

    ```javascript
    import axios from "axios";

    const getUsers = async () => {
        const res = await axios.get("https://api.example.com/users");

        console.log(res.data);
    };
    ```


# Context API
**Le problème : “prop drilling”**

``App → Page → Layout → Navbar → Button``

Et tu veux envoyer une donnée (ex: utilisateur connecté).

## Context API = ➡️ système React pour partager des données globales
- exemples:
    - utilisateur connecté
    - thème (dark/light)
    - langue
    - panier e-commerce

**creation du Context**
```javascript
import { createContext } from "react";

export const UserContext = createContext();

//crée un “espace global”
```

**Provider (fournisseur de données)**
```javascript
import { UserContext } from "./UserContext";

function App() {
    const user = { name: "Jean", age: 25 };

    return (
        <UserContext.Provider value={user}>
            <Home />
            <Navbar />
            <Dashboard />
            <Profile />
        </UserContext.Provider>
    );
    // Tous ces composants peuvent accéder au user
}
```

**Consommation du Context**
```javascript
import { useContext } from "react";
import { UserContext } from "./UserContext";

function Home() {
    const user = useContext(UserContext);

    return <h1>{user.name}</h1>;
}
```

# Syntaxe de boucle
```javascript
    const produits = await getProduits();

    // Boucle for classique
    for (let i = 0; i < produits.data.length; i++) {
        console.log(`Produit ${i+1}:`, produits.data[i]);
    }

    // Boucle for...of (plus simple)
    for (const produit of produits.data) {
        console.log("Produit:", produit);
        console.log("  - ID:", produit.id);
        console.log("  - Nom:", produit.name);
    }

    // Boucle forEach (pratique)
    produits.data.forEach((produit, index) => {
        console.log(`${index + 1}. ${produit.name} (ID: ${produit.id})`);
    });
```

# Syntaxe de concatenation, func, boucle
```javascript
// ==================== 1. VARIABLES & CONCATÉNATION ====================
const nom = "Jean";
const age = 25;
const prix = 99.99;
const estActif = true;

// Concaténation avec +
const message1 = "Bonjour " + nom + ", tu as " + age + " ans";
console.log(message1); // "Bonjour Jean, tu as 25 ans"

// Template literal (backticks) - RECOMMANDÉ
const message2 = `Bonjour ${nom}, tu as ${age} ans, prix: ${prix}€`;
console.log(message2); // "Bonjour Jean, tu as 25 ans, prix: 99.99€"

// Avec calcul
const message3 = `Dans 5 ans, tu auras ${age + 5} ans`;
console.log(message3); // "Dans 5 ans, tu auras 30 ans"

// Condition dans template
const message4 = `Statut: ${estActif ? "Actif" : "Inactif"}`;
console.log(message4); // "Statut: Actif"

// Objet dans template
const user = { name: "Pierre", role: "admin" };
const message5 = `Utilisateur: ${user.name}, Rôle: ${user.role}`;
console.log(message5); // "Utilisateur: Pierre, Rôle: admin"


// ==================== 2. FONCTIONS ====================

// Fonction déclarée (classique) - hoisting (peut être appelée avant sa déclaration)
function direBonjour(nom) {
    return `Bonjour ${nom}`;
}
console.log(direBonjour("Marie")); // "Bonjour Marie"

// Fonction expression dans const (fléchée) - MODERNE (recommandée)
const direBonsoir = (nom) => {
    return `Bonsoir ${nom}`;
};
console.log(direBonsoir("Paul")); // "Bonsoir Paul"

// Fonction fléchée (une ligne - return implicite)
const double = (x) => x * 2;
console.log(double(5)); // 10

// Fonction fléchée (sans paramètre)
const getDate = () => new Date().toLocaleDateString();
console.log(getDate()); // "10/05/2026"

// Fonction fléchée avec un paramètre (parenthèses optionnelles)
const carre = x => x * x;
console.log(carre(4)); // 16

// Fonction async (pour API)
const getProduits = async () => {
    // Simule un appel API
    return [
        { id: 1, name: "Voiture", price: 10000 },
        { id: 2, name: "Moto", price: 5000 }
    ];
};

// Appel de fonction async
const charger = async () => {
    const resultat = await getProduits();
    console.log("Produits chargés:", resultat);
};


// ==================== 3. BOUCLES ====================

const produits = [
    { id: 1, nom: "Voiture", prix: 10000, stock: 5 },
    { id: 2, nom: "Moto", prix: 5000, stock: 3 },
    { id: 3, nom: "Vélo", prix: 500, stock: 10 }
];

// Boucle for (classique - avec index)
console.log("=== BOUCLE FOR ===");
for (let i = 0; i < produits.length; i++) {
    console.log(`${i + 1}. ${produits[i].nom} - ${produits[i].prix}€`);
}

// Boucle for...of (accès direct aux éléments)
console.log("=== BOUCLE FOR...OF ===");
for (const produit of produits) {
    console.log(`Produit: ${produit.nom}, Stock: ${produit.stock}`);
}

// Boucle forEach (méthode tableau) - RECOMMANDÉE
console.log("=== BOUCLE FOREACH ===");
produits.forEach((produit, index) => {
    console.log(`${index}. ${produit.nom} coûte ${produit.prix}€`);
});

// Boucle for...in (pour les objets - rarement utilisé)
console.log("=== BOUCLE FOR...IN ===");
const premierProduit = produits[0];
for (const cle in premierProduit) {
    console.log(`${cle}: ${premierProduit[cle]}`);
}

// Boucle while
console.log("=== BOUCLE WHILE ===");
let i = 0;
while (i < produits.length) {
    console.log(produits[i].nom);
    i++;
}


// ==================== 4. LECTURE DE DONNÉES JSON / API ====================

// Structure typique d'une réponse API
const reponseAPI = {
    data: [
        { id: 1, name: "Produit A", price: 100 },
        { id: 2, name: "Produit B", price: 200 },
        { id: 3, name: "Produit C", price: 300 }
    ],
    meta: {
        total: 3,
        page: 1
    }
};

// Accès aux données
console.log("=== ACCÈS AUX DONNÉES ===");
console.log("Objet complet:", reponseAPI);
console.log("Tableau:", reponseAPI.data);
console.log("Premier produit:", reponseAPI.data[0]);
console.log("Nom du premier produit:", reponseAPI.data[0].name);
console.log("Total des produits:", reponseAPI.meta.total);

// Parcourir les données de l'API
console.log("=== PARCOURS DONNÉES API ===");
reponseAPI.data.forEach(produit => {
    console.log(`ID: ${produit.id}, Nom: ${produit.name}, Prix: ${produit.price}€`);
});

// Avec for...of
for (const produit of reponseAPI.data) {
    console.log(`Le ${produit.name} coûte ${produit.price}€`);
}

// Transformations
const noms = reponseAPI.data.map(p => p.name);
console.log("Liste des noms:", noms); // ["Produit A", "Produit B", "Produit C"]

const prixTotal = reponseAPI.data.reduce((total, p) => total + p.price, 0);
console.log(`Prix total: ${prixTotal}€`); // "Prix total: 600€"

const produitsChers = reponseAPI.data.filter(p => p.price > 150);
console.log("Produits >150€:", produitsChers); // [{id:2, name:"Produit B", price:200}]

// Opérateur ?. (optional chaining) - éviter les erreurs si null/undefined
const reponseVide = { data: null };
console.log(reponseVide.data?.[0]?.name ?? "Aucun produit");


// ==================== 5. EXEMPLE COMPLET AVEC API ====================

// Simulation d'appel API
const getAllProduits = async () => {
    // Simule une API Bagisto
    return {
        data: [
            { id: 1, name: "Voiture2", price: 50.00 },
            { id: 2, name: "Voiture1", price: 50.00 }
        ],
        links: { first: "...", last: "..." },
        meta: { total: 2 }
    };
};

// Fonction principale
const handleChargement = async () => {
    try {
        console.log("=== CHARGEMENT DES PRODUITS ===");
        
        const reponse = await getAllProduits();
        
        // Vérifier si données existent
        if (!reponse.data) {
            console.log("Aucune donnée reçue");
            return;
        }
        
        // Afficher informations générales
        console.log(`Total des produits: ${reponse.meta.total}`);
        console.log(`Nombre dans data: ${reponse.data.length}`);
        
        // Afficher chaque produit
        console.log("\n--- Liste des produits ---");
        reponse.data.forEach((produit, index) => {
            console.log(`${index + 1}. ${produit.name} : ${produit.price}€ (ID: ${produit.id})`);
        });
        
        // Utiliser template literals pour un résumé
        const nomProduits = reponse.data.map(p => p.name).join(", ");
        console.log(`\nProduits disponibles: ${nomProduits}`);
        
        // Filtrer et transformer
        const produitsChers = reponse.data.filter(p => p.price > 40);
        console.log(`Produits >40€: ${produitsChers.length} produit(s)`);
        
        // Afficher en JSON formaté
        console.log("\n--- Format JSON ---");
        console.log(JSON.stringify(reponse.data, null, 2));
        
    } catch (erreur) {
        console.error("Erreur lors du chargement:", erreur.message);
    }
};

// Exécuter
// handleChargement();

console.log("\n=== FIN DU RÉSUMÉ ===");
```

# Appel des listes, utiliseeee map
```javascript
    {products.map((p) => (
        <p key={p.id}>{p.name}</p>
    ))}
```

# Formulaire
```javascript
    // state
    const [formData, setFormData] = useState({
    nom: '',
    age: '',
    date: '',
    categorie: '',
    });

    /// Recuperer les valeurs
    const handleChange = (e) => {
        setFormData({
            ...formData,    // garde les anciens valeurs
            [e.target.name]: e.target.value
        });
    };

    /// Les inputs 
    <input type="text" name="nom" value={formData.nom} onChange={handleChange} />

    <input type="number" name="age" value={formData.age} onChange={handleChange} />

    <input type="date" name="date" value={formData.date} onChange={handleChange} />

    <select name="categorie" value={formData.categorie} onChange={handleChange} >
        <option value="">Choisir</option>
        <option value="pc">PC</option>
        <option value="phone">Téléphone</option>
    </select>

    /// pour fichier
    <input type="file" onChange={handleFileChange} />

    const [file, setFile] = useState(null);
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    
    /// Submit
    const handleSubmit = (e) => {
        e.preventDefault();     // empêche le rechargement de la page.
        console.log(formData);
    };

```
