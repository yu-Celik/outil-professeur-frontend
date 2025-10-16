# 🔐 Recommandations Sécurité - XSS & CSRF

## 📊 Analyse de Sécurité Actuelle

**Date:** 2025-10-16
**Status:** BON avec améliorations nécessaires

---

## ✅ Protections XSS (Cross-Site Scripting)

### Niveau: **9/10** (Excellent)

#### Access Token
- ✅ **Cookie HttpOnly** → JavaScript ne peut PAS y accéder
- ✅ Protection maximale contre vol XSS
- ✅ Durée courte (90 minutes)

#### Refresh Token
- ⚠️ **localStorage** → Accessible via JavaScript
- ✅ **MAIS: Rotation automatique** → Token volé invalide après 1 utilisation
- ✅ **MAIS: Détection réutilisation** → Backend révoque toute la chaîne
- ✅ **MAIS: Durée limitée** → 7 jours maximum

**Verdict XSS:** Protection excellente. Le dommage potentiel d'un vol de refresh token est limité par la rotation et la détection côté backend.

---

## ⚠️ Protections CSRF (Cross-Site Request Forgery)

### Niveau Actuel: **7/10** (Bon, mais améliorable)

### ✅ Protection Frontend (Implémentée)
Le frontend génère et envoie maintenant un CSRF token dans chaque requête:

```typescript
// Automatique dans toutes les requêtes API
headers: {
  'X-CSRF-Token': 'abc123...'  // Token unique par navigateur
}
```

### ⚠️ Protection Backend (CRITIQUE - À IMPLÉMENTER)

Le backend Rust **DOIT** configurer les cookies avec les attributs suivants:

```rust
// souz-api/src/auth/cookies.rs (ou équivalent)

use actix_web::cookie::{Cookie, SameSite};
use time::Duration;

pub fn create_auth_cookie(token: &str) -> Cookie<'static> {
    Cookie::build("auth_token", token.to_owned())
        .http_only(true)           // ✅ Protection XSS
        .secure(true)              // ⚠️ HTTPS uniquement (PROD)
        .same_site(SameSite::Strict)  // 🚨 CRITIQUE pour CSRF!
        .path("/")
        .max_age(Duration::minutes(90))
        .finish()
}

pub fn create_refresh_cookie(token: &str) -> Cookie<'static> {
    Cookie::build("refresh_token", token.to_owned())
        .http_only(true)
        .secure(true)              // HTTPS uniquement
        .same_site(SameSite::Strict)  // CRITIQUE!
        .path("/")
        .max_age(Duration::days(7))
        .finish()
}
```

---

## 🚨 CRITIQUE: SameSite Cookies

### Pourquoi c'est INDISPENSABLE?

Sans `SameSite=Strict`, un attaquant peut faire:

```html
<!-- Site malveillant: evil.com -->
<form action="https://votre-app.com/auth/logout" method="POST">
  <input name="refresh_token" value="[token_volé]">
</form>
<script>
  // Soumet automatiquement le formulaire
  document.forms[0].submit()
</script>
```

**Résultat:** Le navigateur envoie les cookies `auth_token` automatiquement!

### Solution: SameSite=Strict

```rust
.same_site(SameSite::Strict)  // Bloque envoi cross-origin
```

**Effet:**
- ✅ Cookies envoyés UNIQUEMENT depuis votre domaine
- ✅ Attaques CSRF bloquées automatiquement
- ✅ Protection native du navigateur

---

## 🛡️ Validation CSRF Token Backend (Recommandé)

En plus de `SameSite=Strict`, validez le token CSRF:

```rust
// souz-api/src/middleware/csrf.rs

use actix_web::{
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    http::header,
    Error, HttpResponse,
};
use futures::future::{ok, Ready};
use std::task::{Context, Poll};

pub struct CsrfProtection;

impl<S, B> Transform<S, ServiceRequest> for CsrfProtection
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = CsrfMiddleware<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(CsrfMiddleware { service })
    }
}

pub struct CsrfMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for CsrfMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = S::Future;

    fn poll_ready(&self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        // Skip CSRF check for GET, HEAD, OPTIONS (safe methods)
        let method = req.method();
        if method == "GET" || method == "HEAD" || method == "OPTIONS" {
            return self.service.call(req);
        }

        // Validate CSRF token for state-changing methods
        let csrf_token = req.headers().get("X-CSRF-Token");

        if csrf_token.is_none() {
            // Missing CSRF token
            return Box::pin(async {
                Ok(req.into_response(
                    HttpResponse::Forbidden()
                        .json(serde_json::json!({
                            "error": "CSRF token missing"
                        }))
                        .into_body(),
                ))
            });
        }

        // Token exists - continue
        // Note: Frontend génère token localement, pas besoin de valider contenu
        // SameSite=Strict + présence du header suffisent
        self.service.call(req)
    }
}
```

**Appliquer le middleware:**

```rust
// souz-api/src/main.rs

use actix_web::{App, HttpServer, middleware, web};
use crate::middleware::csrf::CsrfProtection;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(CsrfProtection)  // ← Ajouter ici
            .configure(auth_routes)
            .configure(api_routes)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

---

## 🎯 Checklist Sécurité Backend

### Cookies Configuration (CRITIQUE)

- [ ] **SameSite=Strict** sur `auth_token`
- [ ] **SameSite=Strict** sur `refresh_token`
- [ ] **HttpOnly=true** sur tous les cookies auth
- [ ] **Secure=true** en production (HTTPS)
- [ ] **Path=/** pour accessibilité globale
- [ ] **Max-Age** approprié (90min access, 7j refresh)

### CSRF Protection

- [ ] Valider présence header `X-CSRF-Token` sur POST/PUT/PATCH/DELETE
- [ ] Accepter requêtes sans CSRF pour GET/HEAD/OPTIONS
- [ ] Retourner 403 Forbidden si token manquant

### Autres Protections

- [ ] **Rate limiting** sur `/auth/login` (ex: 5 tentatives / 15min)
- [ ] **Rate limiting** sur `/auth/refresh` (ex: 10 refresh / heure)
- [ ] **Logs sécurité** pour failed logins et token reuse detected
- [ ] **CORS** configuré strictement (domaine spécifique, pas `*`)
- [ ] **HTTPS** obligatoire en production

---

## 📝 Exemple Configuration CORS Sécurisée

```rust
// souz-api/src/middleware/cors.rs

use actix_cors::Cors;

pub fn configure_cors() -> Cors {
    Cors::default()
        .allowed_origin("https://votre-app.com")  // Domaine spécifique!
        .allowed_methods(vec!["GET", "POST", "PUT", "PATCH", "DELETE"])
        .allowed_headers(vec![
            actix_web::http::header::AUTHORIZATION,
            actix_web::http::header::CONTENT_TYPE,
            actix_web::http::header::HeaderName::from_static("x-csrf-token"),
        ])
        .expose_headers(vec![
            actix_web::http::header::CONTENT_TYPE,
        ])
        .supports_credentials()  // CRITIQUE pour cookies
        .max_age(3600)
}
```

**Development:**
```rust
.allowed_origin("http://localhost:3000")
```

**Production:**
```rust
.allowed_origin("https://app.example.com")
```

**❌ JAMAIS:**
```rust
.allow_any_origin()  // Vulnérable!
```

---

## 🧪 Tests de Sécurité

### Test CSRF Attack (Sans SameSite)

```bash
# Créer page malveillante
cat > evil.html <<'EOF'
<!DOCTYPE html>
<html>
<body>
<h1>Free iPhone!</h1>
<form id="evil" action="http://localhost:8080/auth/logout" method="POST">
  <input name="refresh_token" value="stolen_token_123">
</form>
<script>document.getElementById('evil').submit()</script>
</body>
</html>
EOF

# Ouvrir dans navigateur (après login sur localhost:3000)
# Résultat attendu AVEC SameSite=Strict: Requête bloquée (cookies non envoyés)
# Résultat attendu SANS SameSite: Logout réussi (VULNÉRABLE!)
```

### Test XSS Injection

```javascript
// Tenter d'injecter script malveillant
const maliciousInput = '<img src=x onerror="alert(document.cookie)">'

// Soumettre via formulaire
// Résultat attendu: Cookies HttpOnly invisibles (document.cookie vide)
```

### Test Token Rotation

```bash
# 1. Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' \
  -c cookies.txt -v

# 2. Extraire refresh_token
REFRESH_TOKEN=$(jq -r '.session.refresh_token' response.json)

# 3. Utiliser token 2 fois
curl -X POST http://localhost:8080/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"$REFRESH_TOKEN\"}" \
  -b cookies.txt

# 4. Réutiliser ANCIEN token (devrait échouer)
curl -X POST http://localhost:8080/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"$REFRESH_TOKEN\"}" \
  -b cookies.txt

# Résultat attendu: 401 Unauthorized + "Token reuse detected"
```

---

## 📊 Score Sécurité Final

| Protection | Sans Backend Fix | Avec Backend Fix |
|-----------|-----------------|------------------|
| **XSS** | 9/10 | 9/10 |
| **CSRF** | 5/10 ⚠️ | 10/10 ✅ |
| **Token Theft** | 8/10 | 9/10 |
| **Replay Attack** | 9/10 | 10/10 |
| **Session Hijacking** | 7/10 | 9/10 |

**Score Global:**
- **Actuel:** 7.6/10 (Bon, mais améliorable)
- **Avec fix backend:** 9.4/10 (Excellent)

---

## 🚀 Actions Immédiates Requises

### Backend Team (URGENT - 1-2 heures)

1. ✅ **Ajouter `SameSite=Strict`** sur tous les cookies auth
   ```rust
   .same_site(SameSite::Strict)
   ```

2. ✅ **Valider `X-CSRF-Token`** header sur requêtes POST/PUT/PATCH/DELETE

3. ✅ **Configurer CORS** avec domaine spécifique + `supports_credentials()`

### Frontend Team (FAIT)

- ✅ Génération automatique CSRF token
- ✅ Envoi header `X-CSRF-Token` dans toutes les requêtes
- ✅ Clear CSRF token au logout

### DevOps (Production)

- [ ] **HTTPS obligatoire** (redirection automatique)
- [ ] **HSTS** activé (Strict-Transport-Security header)
- [ ] **Rate limiting** au niveau load balancer
- [ ] **Monitoring** tentatives CSRF et XSS

---

## 📚 Références

- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [MDN SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [OWASP Token Storage](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

---

**✅ Frontend PRÊT - Backend doit implémenter SameSite=Strict ASAP!**

Date: 2025-10-16
Priority: HIGH
Impact: CRITIQUE (protection CSRF)
