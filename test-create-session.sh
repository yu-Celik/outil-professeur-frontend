#!/bin/bash

# Script de test pour créer une session via l'API
# Usage: ./test-create-session.sh

echo "🧪 Test de création de session via API"
echo "========================================"
echo ""

# 1. D'abord, vérifions qu'on est authentifié
echo "1️⃣ Test authentification..."
AUTH_RESPONSE=$(curl -s -c cookies.txt http://localhost:8080/auth/me 2>&1)

if echo "$AUTH_RESPONSE" | grep -q "curl"; then
  echo "❌ Erreur: Vous devez d'abord vous connecter depuis le navigateur"
  echo "   Allez sur http://localhost:3000 et connectez-vous"
  echo "   Ensuite, copiez le cookie auth_token depuis DevTools"
  exit 1
fi

echo "✅ Authentifié"
echo ""

# 2. Lister les classes disponibles
echo "2️⃣ Récupération des classes..."
CLASSES=$(curl -s -b cookies.txt http://localhost:8080/classes?limit=1)
echo "Classes: $CLASSES"
echo ""

# 3. Lister les time slots disponibles
echo "3️⃣ Récupération des time slots..."
TIMESLOTS=$(curl -s -b cookies.txt http://localhost:8080/time-slots?limit=1)
echo "Time slots: $TIMESLOTS"
echo ""

# 4. Créer une session de test
echo "4️⃣ Création d'une session de test..."
echo ""

# À ADAPTER avec vos vrais UUIDs
SESSION_DATA='{
  "class_id": "REMPLACER_PAR_UUID_CLASSE",
  "subject_id": "REMPLACER_PAR_UUID_MATIERE",
  "time_slot_id": "REMPLACER_PAR_UUID_TIMESLOT",
  "session_date": "2025-01-20",
  "status": "planned",
  "objectives": "Test API Integration",
  "content": "Session créée depuis le script de test",
  "is_makeup": false
}'

echo "📤 Payload:"
echo "$SESSION_DATA" | jq . 2>/dev/null || echo "$SESSION_DATA"
echo ""

# Décommenter pour créer vraiment :
# CREATE_RESPONSE=$(curl -s -b cookies.txt -X POST \
#   -H "Content-Type: application/json" \
#   -d "$SESSION_DATA" \
#   http://localhost:8080/course-sessions)
#
# echo "📥 Réponse:"
# echo "$CREATE_RESPONSE" | jq . 2>/dev/null || echo "$CREATE_RESPONSE"

echo ""
echo "✅ Script prêt - Éditez les UUIDs avant d'exécuter la création"
