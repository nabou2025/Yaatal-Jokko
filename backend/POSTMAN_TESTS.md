# YAATAL JOKKO — Guide de test Postman

## ✅ Checklist complétée

| Tâche                              | Statut |
|------------------------------------|--------|
| Fonction login dans AuthController | ✅     |
| Vérifier email en base             | ✅     |
| Vérifier mot de passe              | ✅     |
| Gérer erreur (mauvais identifiants)| ✅     |
| Retourner réponse JSON             | ✅     |
| Ajouter route /api/login           | ✅     |
| Tester avec Postman (guide ci-bas) | ✅     |
| Tester login incorrect             | ✅     |

---

## 🧪 Test 1 — Login CORRECT

**Méthode :** POST  
**URL :** `http://localhost:8000/api/auth/login`  
**Headers :**
```
Content-Type: application/json
Accept: application/json
```

**Body (JSON) :**
```json
{
    "email": "utilisateur@exemple.com",
    "password": "motdepasse123"
}
```

**Réponse attendue (200 OK) :**
```json
{
    "app": "Yaatal Jokko",
    "message": "Connexion réussie ! Bienvenue sur Yaatal Jokko.",
    "user": {
        "id": 1,
        "name": "Prénom Nom",
        "email": "utilisateur@exemple.com",
        "role": "apprenant"
    },
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

---

## 🧪 Test 2 — Login INCORRECT (mauvais mot de passe)

**Méthode :** POST  
**URL :** `http://localhost:8000/api/auth/login`  
**Headers :**
```
Content-Type: application/json
Accept: application/json
```

**Body (JSON) :**
```json
{
    "email": "utilisateur@exemple.com",
    "password": "mauvais_mdp"
}
```

**Réponse attendue (401 Unauthorized) :**
```json
{
    "app": "Yaatal Jokko",
    "message": "Yaatal Jokko : identifiants incorrects. Vérifiez votre email et mot de passe.",
    "errors": {
        "email": ["Les identifiants fournis sont incorrects."]
    }
}
```

---

## 🧪 Test 3 — Login avec email inexistant

**Body (JSON) :**
```json
{
    "email": "inexistant@exemple.com",
    "password": "nimportequoi"
}
```

**Réponse attendue (401 Unauthorized) :** — identique au test 2

---

## 🧪 Test 4 — Champs manquants (validation)

**Body (JSON) :**
```json
{
    "email": ""
}
```

**Réponse attendue (422 Unprocessable Entity) :**
```json
{
    "message": "Yaatal Jokko : l'email est obligatoire.",
    "errors": {
        "email": ["Yaatal Jokko : l'email est obligatoire."],
        "password": ["Yaatal Jokko : le mot de passe est obligatoire."]
    }
}
```

---

## ⚙️ Prérequis avant de tester

1. Lancer le serveur : `php artisan serve`
2. Vérifier que Sanctum est configuré dans `config/sanctum.php`
3. Avoir un utilisateur enregistré via `/api/auth/register` ou dans la BDD
4. Vérifier `.env` : `DB_DATABASE=yaatal_jokko`
