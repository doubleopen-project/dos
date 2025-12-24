# SPDX-FileCopyrightText: 2025 Double Open Oy
#
# SPDX-License-Identifier: MIT

terraform {
    required_providers {
        keycloak = {
            source = "keycloak/keycloak"
            version = "5.6.0"
        }
    }
}

locals {
    keycloak_url = "http://auth:8080"
}

provider "keycloak" {
    client_id     = "admin-cli"
    username      = "keycloak-admin"
    password      = "keycloak-admin"
    url           = local.keycloak_url
}

# Get the admin role from the master realm. This is needed to assign the 
# admin role to the keycloak-admin user
data "keycloak_role" "admin" {
  realm_id  = "master"
  name      = "admin"
}

# Add an admin user to the master realm.
resource "keycloak_user" "keycloak_admin" {
  realm_id   = "master"
  username   = "admin"
  enabled    = true

  initial_password {
    value     = "admin"
    temporary = false
  }
}

# Assign the admin role to the keycloak-admin user in the master realm.
resource "keycloak_user_roles" "keycloak_admin_roles" {
  realm_id = "master"
  user_id  = keycloak_user.keycloak_admin.id

  role_ids = [
    data.keycloak_role.admin.id
  ]
}

# Add a realm for the DOS application.
resource "keycloak_realm" "dos_dev_realm" {
    realm = "dos-dev"
    enabled = true
    display_name = "DOS Development"
}

# Add a client for the DOS UI application.
resource "keycloak_openid_client" "dos_ui_openid_client" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = "dos-dev-ui"
    name = "DOS UI Client"
    enabled = true
    access_type = "CONFIDENTIAL"
    standard_flow_enabled = true
    direct_access_grants_enabled = true
    service_accounts_enabled = true

    # In local development, the client secret is not sensitive information.
    # In production, it should be stored securely (or let Keycloak generate it).
    client_secret = "ui-client-secret"

    authorization {
        policy_enforcement_mode = "ENFORCING"
        decision_strategy = "UNANIMOUS"
    }

    root_url = "http://localhost:3000"
    valid_redirect_uris = ["/*", "http://clearance-ui:3000/*"]
    valid_post_logout_redirect_uris = ["/*", "http://clearance-ui:3000/*"]
    web_origins = ["+"] # + means all origins of Valid Redirect URIs
}

# Add a client for the DOS API application.
resource "keycloak_openid_client" "dos_api_openid_client" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = "dos-dev-api"
    name = "DOS API Client"
    enabled = true
    access_type = "CONFIDENTIAL"
    standard_flow_enabled = true
    direct_access_grants_enabled = true
    service_accounts_enabled = true

    # In local development, the client secret is not sensitive information.
    # In production, it should be stored securely (or let Keycloak generate it).
    client_secret = "api-client-secret"

    authorization {
        policy_enforcement_mode = "ENFORCING"
        decision_strategy = "UNANIMOUS"
    }

    root_url = "http://localhost:5000"
    valid_redirect_uris = ["http://localhost:3000/*", "http://localhost:3002/*"]
    valid_post_logout_redirect_uris = ["http://localhost:3000/*", "http://localhost:3002/*"]
    web_origins = ["+"] # + means all origins of Valid Redirect URIs
}

# Get the realm-management client. This is needed to assign roles to the
# service account of the API client.
data "keycloak_openid_client" "realm_management_client" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = "realm-management"
}

# Get the "view-users" role from the realm-management client.
data "keycloak_role" "realm_management_view_users_role" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = data.keycloak_openid_client.realm_management_client.id
    name = "view-users"
}

# Get the "manage-users" role from the realm-management client.
data "keycloak_role" "realm_management_manage_users_role" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = data.keycloak_openid_client.realm_management_client.id
    name = "manage-users"
}

# Assign the "view-users" role to the service account of the API client.
resource "keycloak_openid_client_service_account_role" "api_client_role_view_users" {
    realm_id = keycloak_realm.dos_dev_realm.id
    service_account_user_id = keycloak_openid_client.dos_api_openid_client.service_account_user_id
    client_id = data.keycloak_openid_client.realm_management_client.id
    role = data.keycloak_role.realm_management_view_users_role.name
}

# Assign the "manage-users" role to the service account of the API client.
resource "keycloak_openid_client_service_account_role" "api_client_role_manage_users" {
    realm_id = keycloak_realm.dos_dev_realm.id
    service_account_user_id = keycloak_openid_client.dos_api_openid_client.service_account_user_id
    client_id = data.keycloak_openid_client.realm_management_client.id
    role = data.keycloak_role.realm_management_manage_users_role.name
}

### Roles

# Add a client role for admins for the DOS API client.
resource "keycloak_role" "dos_api_client_role_admin" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = keycloak_openid_client.dos_api_openid_client.id
    name = "ADMIN"
}

# Add a client role for users for the DOS API client.
resource "keycloak_role" "dos_api_client_role_user" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = keycloak_openid_client.dos_api_openid_client.id
    name = "USER"
}

# Add realm role for admins for the DOS application.
resource "keycloak_role" "realm_role_app_admin" {
    realm_id = keycloak_realm.dos_dev_realm.id
    name = "app-admin"
    composite_roles = [
        keycloak_role.dos_api_client_role_admin.id
    ]
}

# Add realm role for users for the DOS application.
resource "keycloak_role" "realm_role_app_user" {
    realm_id = keycloak_realm.dos_dev_realm.id
    name = "app-user"
    composite_roles = [
        keycloak_role.dos_api_client_role_user.id
    ]
}

# Add realm role for read-only users for the DOS application.
resource "keycloak_role" "realm_role_app_read_only_user" {
    realm_id = keycloak_realm.dos_dev_realm.id
    name = "app-read-only-user"
}

### Authorization services for the DOS API client
# https://www.keycloak.org/docs/latest/authorization_services/index.html

## Add scopes for the authorization services for the DOS API client.

# Add create scope for the authorization services for the DOS API client.
resource "keycloak_openid_client_authorization_scope" "create_scope" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    name               = "POST"
    realm_id           = keycloak_realm.dos_dev_realm.id
}

# Add read scope for the authorization services for the DOS API client.
resource "keycloak_openid_client_authorization_scope" "read_scope" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    name               = "GET"
    realm_id           = keycloak_realm.dos_dev_realm.id
}

# Add update scope for the authorization services for the DOS API client.
resource "keycloak_openid_client_authorization_scope" "update_scope" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    name               = "PUT"
    realm_id           = keycloak_realm.dos_dev_realm.id
}

# Add delete scope for the authorization services for the DOS API client.
resource "keycloak_openid_client_authorization_scope" "delete_scope" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    name               = "DELETE"
    realm_id           = keycloak_realm.dos_dev_realm.id
}

## Add resources for the authorization services for the DOS API client.

# Add resource for clearance items.
resource "keycloak_openid_client_authorization_resource" "clearance_items" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    name               = "ClearanceItems"
    display_name       = "Clearance Items"
    realm_id           = keycloak_realm.dos_dev_realm.id

    scopes = [
        keycloak_openid_client_authorization_scope.create_scope.name,
        keycloak_openid_client_authorization_scope.read_scope.name,
        keycloak_openid_client_authorization_scope.update_scope.name,
        keycloak_openid_client_authorization_scope.delete_scope.name
    ]
}

# Add resource for package data.
resource "keycloak_openid_client_authorization_resource" "package_data" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    name               = "PackageData"
    display_name       = "Package Data"
    realm_id           = keycloak_realm.dos_dev_realm.id

    scopes = [
        keycloak_openid_client_authorization_scope.read_scope.name,
        keycloak_openid_client_authorization_scope.delete_scope.name
    ]
}

## Add policies for the authorization services for the DOS API client.

# Add policy that allows any users to access the resource.
resource "keycloak_openid_client_role_policy" "any_user_policy" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    realm_id           = keycloak_realm.dos_dev_realm.id
    name               = "Any user policy"
    description        = "By applying this policy, any user will be granted access to the permitted resource."
    type               = "role"
    logic              = "POSITIVE"
    decision_strategy  = "UNANIMOUS"
    role {
        id = keycloak_role.realm_role_app_admin.id
        required = false
    }
    role {
        id = keycloak_role.realm_role_app_user.id
        required = false
    }
    role {
        id = keycloak_role.realm_role_app_read_only_user.id
        required = false
    }
}

# Add policy that allows only app-users and app-admins to access the resource.
resource "keycloak_openid_client_role_policy" "only_app_users_and_app_admins_policy" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    realm_id           = keycloak_realm.dos_dev_realm.id
    name               = "Only app-users and app-admins policy"
    description        = "By applying this policy, only users with the app-user or app-admin role will be granted access to the permitted resource."
    type               = "role"
    logic              = "POSITIVE"
    decision_strategy  = "UNANIMOUS"
    role {
        id = keycloak_role.realm_role_app_user.id
        required = false
    }
    role {
        id = keycloak_role.realm_role_app_admin.id
        required = false
    }
}

## Add permissions for the authorization services for the DOS API client.

# Add permission for creating, updating and deleting clearance items.
resource "keycloak_openid_client_authorization_permission" "cud_clearance_items_permission" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    realm_id           = keycloak_realm.dos_dev_realm.id
    name               = "Create, update and delete clearance items"
    type               = "scope"

    policies = [
        keycloak_openid_client_role_policy.only_app_users_and_app_admins_policy.id
    ]

    resources = [
        keycloak_openid_client_authorization_resource.clearance_items.id
    ]

    scopes = [
        keycloak_openid_client_authorization_scope.create_scope.id,
        keycloak_openid_client_authorization_scope.update_scope.id,
        keycloak_openid_client_authorization_scope.delete_scope.id
    ]
}

# Add permission for reading clearance items.
resource "keycloak_openid_client_authorization_permission" "r_clearance_items_permission" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    realm_id           = keycloak_realm.dos_dev_realm.id
    name               = "Read clearance items"
    type               = "scope"

    policies = [
        keycloak_openid_client_role_policy.any_user_policy.id
    ]

    resources = [
        keycloak_openid_client_authorization_resource.clearance_items.id
    ]

    scopes = [
        keycloak_openid_client_authorization_scope.read_scope.id
    ]
}

# Add permission for reading package and file data.
resource "keycloak_openid_client_authorization_permission" "r_package_data_permission" {
    resource_server_id = keycloak_openid_client.dos_api_openid_client.resource_server_id
    realm_id           = keycloak_realm.dos_dev_realm.id
    name               = "Read package and file data"
    type               = "scope"

    policies = [
        keycloak_openid_client_role_policy.any_user_policy.id
    ]

    resources = [
        keycloak_openid_client_authorization_resource.package_data.id
    ]

    scopes = [
        keycloak_openid_client_authorization_scope.read_scope.id
    ]
}

### Users

# Add a user to the DOS development realm.
resource "keycloak_user" "test_user" {
    realm_id = keycloak_realm.dos_dev_realm.id
    username = "test-user"
    enabled = true

    email = "test-user@example.com"
    first_name = "Test"
    last_name = "User"

    initial_password {
        value = "test-user"
        temporary = false
    }
}

# Assign the "app-user" role to the test user.
resource "keycloak_user_roles" "test_user_roles" {
  realm_id = keycloak_realm.dos_dev_realm.id
  user_id  = keycloak_user.test_user.id

  role_ids = [
    keycloak_role.realm_role_app_user.id
  ]
}

# Add an admin user to the DOS development realm.
resource "keycloak_user" "test_admin" {
    realm_id = keycloak_realm.dos_dev_realm.id
    username = "test-admin"
    enabled = true

    email = "test-admin@example.com"
    first_name = "Test"
    last_name = "Admin"

    initial_password {
        value = "test-admin"
        temporary = false
    }
}

# Assign the "app-admin" role to the test admin user.
resource "keycloak_user_roles" "test_admin_roles" {
  realm_id = keycloak_realm.dos_dev_realm.id
  user_id  = keycloak_user.test_admin.id

  role_ids = [
    keycloak_role.realm_role_app_admin.id
  ]
}

# Add a read-only user to the DOS development realm.
resource "keycloak_user" "test_readonly" {
    realm_id = keycloak_realm.dos_dev_realm.id
    username = "test-readonly"
    enabled = true

    email = "test-readonly@example.com"
    first_name = "Test"
    last_name = "Readonly"

    initial_password {
        value = "test-readonly"
        temporary = false
    }
}

# Assign the "app-read-only-user" role to the test read-only user.
resource "keycloak_user_roles" "test_readonly_roles" {
  realm_id = keycloak_realm.dos_dev_realm.id
  user_id  = keycloak_user.test_readonly.id

  role_ids = [
    keycloak_role.realm_role_app_read_only_user.id
  ]
}

# This resource is used to run a script that patches the client roles mapper
# and the realm roles mapper in Keycloak to enable the "Add to userinfo" and
# "Add to ID token" options. This needs a workaround because the mapper would
# need to be imported and then updated, but the mapper doesn't exist yet when
# the terraform apply is run, so the import would need to be done in between,
# which would break the automation of creating the Keycloak setup.
resource "null_resource" "patch_roles_mappers" {
    provisioner "local-exec" {
        command = <<EOT
        /workspace/scripts/patch-roles-mappers.sh \
            ${local.keycloak_url} \
            ${keycloak_realm.dos_dev_realm.id} \
            ${keycloak_user.keycloak_admin.username} \
            ${keycloak_user.keycloak_admin.initial_password[0].value}
        EOT
    }

    depends_on = [keycloak_realm.dos_dev_realm]

    # Triggers for the script to run again.
    triggers = {
        # Changes that recreate the realm will trigger the script to run again.
        realm_id = keycloak_realm.dos_dev_realm.id
    }
}

## Clients for ORT Server for local development in the same realm.

# Add a client for ORT Server.
resource "keycloak_openid_client" "ort_server_openid_client" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = "ort-server"
    name = "ORT Server Client"
    enabled = true
    access_type = "CONFIDENTIAL"
    standard_flow_enabled = true
    service_accounts_enabled = true

    client_secret = "client-secret"

    valid_redirect_uris = ["http://localhost:8081/*", "http://localhost:8080/*"]
}

# Add a client for ORT Server UI.
resource "keycloak_openid_client" "ort_server_ui_openid_client" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = "ort-server-ui"
    name = "ORT Server UI Client"
    enabled = true
    access_type = "PUBLIC"
    standard_flow_enabled = true

    root_url = "http://localhost:8082"
    valid_redirect_uris = ["/*"]
    valid_post_logout_redirect_uris = ["/*"]
    web_origins = ["+"]
    admin_url = "http://localhost:8082"
}

# Get the "roles" client scope so it can be extended with a new client roles mapper.
data "keycloak_openid_client_scope" "roles" {
  realm_id = keycloak_realm.dos_dev_realm.id
  name     = "roles"
}

# Add protocol mapper for the realm-management client roles
resource "keycloak_generic_protocol_mapper" "realm_management_client_roles_mapper" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_scope_id = data.keycloak_openid_client_scope.roles.id
    name = "Realm management client roles mapper"
    protocol = "openid-connect"
    protocol_mapper = "oidc-usermodel-client-role-mapper"

    config = {
        "introspection.token.claim" = "true"
        "multivalued" = "true"
        "userinfo.token.claim" = "true"
        "id.token.claim" = "true"
        "lightweight.claim" = "false"
        "access.token.claim" = "true"
        "claim.name" = "resource_access.$${client_id}.roles"
        "jsonType.label" = "String"
        "usermodel.clientRoleMapping.clientId" = "realm-management"
    }
}

# Get the "realm-admin" role from the realm-management client.
data "keycloak_role" "realm_management_realm_admin_role" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = data.keycloak_openid_client.realm_management_client.id
    name = "realm-admin"
}

# Assign the "realm-admin" role to the service account of the ORT Server client.
resource "keycloak_openid_client_service_account_role" "ort_server_realm_admin_role" {
    realm_id = keycloak_realm.dos_dev_realm.id
    service_account_user_id = keycloak_openid_client.ort_server_openid_client.service_account_user_id
    client_id = data.keycloak_openid_client.realm_management_client.id
    role = data.keycloak_role.realm_management_realm_admin_role.name
}

# Add group SUPERUSERS to the realm.
resource "keycloak_group" "superusers" {
    realm_id = keycloak_realm.dos_dev_realm.id
    name = "SUPERUSERS"
}

# Add role superuser for the ORT Server client.
resource "keycloak_role" "ort_server_superuser" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_id = keycloak_openid_client.ort_server_openid_client.id
    name = "superuser"
}

# Assign the superuser role to the SUPERUSERS group.
resource "keycloak_group_roles" "superuser_group_roles" {
    realm_id = keycloak_realm.dos_dev_realm.id
    group_id = keycloak_group.superusers.id

    role_ids = [
        keycloak_role.ort_server_superuser.id
    ]
}

# Add the test admin user to the SUPERUSERS group.
resource "keycloak_group_memberships" "superuser_group_members" {
    realm_id = keycloak_realm.dos_dev_realm.id
    group_id = keycloak_group.superusers.id

    members = [
        keycloak_user.test_admin.username
    ]
}

# Add protocol mapper for the dos-dev-api client roles
resource "keycloak_generic_protocol_mapper" "dos_api_client_roles_mapper" {
    realm_id = keycloak_realm.dos_dev_realm.id
    client_scope_id = data.keycloak_openid_client_scope.roles.id
    name = "DOS API client roles mapper"
    protocol = "openid-connect"
    protocol_mapper = "oidc-usermodel-client-role-mapper"

    config = {
        "introspection.token.claim" = "true"
        "multivalued" = "true"
        "userinfo.token.claim" = "true"
        "id.token.claim" = "true"
        "lightweight.claim" = "false"
        "access.token.claim" = "true"
        "claim.name" = "resource_access.$${client_id}.roles"
        "jsonType.label" = "String"
        "usermodel.clientRoleMapping.clientId" = "${keycloak_openid_client.dos_api_openid_client.client_id}"
    }
}
