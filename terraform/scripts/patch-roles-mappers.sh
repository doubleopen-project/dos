# SPDX-FileCopyrightText: 2025 Double Open Oy
# 
# SPDX-License-Identifier: MIT

#!/bin/sh

KEYCLOAK_URL="$1"
REALM="$2"
USERNAME="$3"
PASSWORD="$4"

# Get admin access token
TOKEN=$(curl -s \
  -d "client_id=admin-cli" \
  -d "username=${USERNAME}" \
  -d "password=${PASSWORD}" \
  -d "grant_type=password" \
  "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
  | jq -r .access_token)

# Get client scope ID for "roles"
SCOPE_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "${KEYCLOAK_URL}/admin/realms/${REALM}/client-scopes" \
  | jq -r '.[] | select(.name == "roles") | .id')

# Get mapper ID for "client roles"
CLIENT_ROLES_MAPPER_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "${KEYCLOAK_URL}/admin/realms/${REALM}/client-scopes/${SCOPE_ID}/protocol-mappers/models" \
  | jq -r '.[] | select(.name == "client roles") | .id')

# Get mapper ID for "realm roles"
REALM_ROLES_MAPPER_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "${KEYCLOAK_URL}/admin/realms/${REALM}/client-scopes/${SCOPE_ID}/protocol-mappers/models" \
  | jq -r '.[] | select(.name == "realm roles") | .id')

# Patch the client roles mapper to enable the "Add to userinfo" and "Add to ID token" options
curl -s -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "${KEYCLOAK_URL}/admin/realms/${REALM}/client-scopes/${SCOPE_ID}/protocol-mappers/models/${CLIENT_ROLES_MAPPER_ID}" \
  -d '{
    "id": "'"${CLIENT_ROLES_MAPPER_ID}"'",
    "name": "client roles",
    "protocol": "openid-connect",
    "protocolMapper": "oidc-usermodel-client-role-mapper",
    "config": {
      "claim.name": "resource_access.${client_id}.roles",
      "jsonType.label": "String",
      "multivalued": "true",
      "userinfo.token.claim": "true",
      "access.token.claim": "true",
      "id.token.claim": "true"
    }
  }'

# Patch the realm roles mapper to enable the "Add to userinfo" and "Add to ID token" options
curl -s -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "${KEYCLOAK_URL}/admin/realms/${REALM}/client-scopes/${SCOPE_ID}/protocol-mappers/models/${REALM_ROLES_MAPPER_ID}" \
  -d '{
    "id": "'"${REALM_ROLES_MAPPER_ID}"'",
    "name": "realm roles",
    "protocol": "openid-connect",
    "protocolMapper": "oidc-usermodel-realm-role-mapper",
    "config": {
      "claim.name": "realm_access.roles",
      "jsonType.label": "String",
      "multivalued": "true",
      "userinfo.token.claim": "true",
      "access.token.claim": "true",
      "id.token.claim": "true"
    }
  }'
