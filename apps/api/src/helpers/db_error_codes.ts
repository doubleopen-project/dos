// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

export const dbErrorCodeResMessagesMap = new Map([
    [
        "P1000",
        {
            message: "Authentication failed against database server.",
            description:
                "Authentication failed against database server at {database_host}, the provided database credentials for {database_user} are not valid. Please make sure to provide valid database credentials for the database server at {database_host}.",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P1001",
        {
            message: "Unable to reach database server.",
            description:
                "Can't reach database server at {database_host}:{database_port} Please make sure your database server is running at {database_host}:{database_port}.",
            requiresAction: false,
            requiresTracking: true,
            severity: "MODERATE",
        },
    ],
    [
        "P1002",
        {
            message: "Database server was reached but timed out.",
            description:
                "The database server at {database_host}:{database_port} was reached but timed out. Please try again. Please make sure your database server is running at {database_host}:{database_port}. ",
            requiresAction: false,
            requiresTracking: true,
            severity: "MODERATE",
        },
    ],
    [
        "P1003",
        {
            message: "Database does not exist error.",
            description:
                "Database {database_file_name} does not exist at {database_file_path} / Database {database_name}.{database_schema_name} does not exist on the database server at {database_host}:{database_port} / Database {database_name} does not exist on the database server at {database_host}:{database_port}.",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P1008",
        {
            message: "Database server operations timed out.",
            description: "Operations timed out after {time}",
            requiresAction: false,
            requiresTracking: true,
            severity: "MODERATE",
        },
    ],
    [
        "P1009",
        {
            message: "Database already exists error.",
            description:
                "Database {database_name} already exists on the database server at {database_host}:{database_port}",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P1010",
        {
            message: "Database server denied access.",
            description:
                "User {database_user} was denied access on the database {database_name}",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P1011",
        {
            message: "Error with database server connection.",
            description: "Error opening a TLS connection: {message}",
            requiresAction: false,
            requiresTracking: true,
            severity: "MODERATE",
        },
    ],
    [
        "P1012",
        {
            message: "Database schema issue.",
            description: "Schema issue",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P1013",
        {
            message: "Error with database string.",
            description: "The provided database string is invalid. {details}",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P1014",
        {
            message: "Database model issue.",
            description:
                "The underlying {kind} for model {model} does not exist.",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P1015",
        {
            message: "Database version and schema mismatch.",
            description:
                "Your Prisma schema is using features that are not supported for the version of the database. Database version: {database_version}. Errors: {errors}",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P1016",
        {
            message: "Database query has incorrect number of parameters.",
            description:
                "Your raw query had an incorrect number of parameters. Expected: {expected}, actual: {actual}.",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P1017",
        {
            message: "Database server has closed the connection.",
            description: "Server has closed the connection.",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P2000",
        {
            message: "Database query error: Value too long.",
            description:
                "The provided value for the column is too long for the column's type. Column: {column_name}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2001",
        {
            message: "Database query error: Record not found.",
            description:
                "The record searched for in the where condition ({model_name}.{argument_name} = {argument_value}) does not exist",
            requiresAction: false,
            requiresTracking: false,
            severity: null,
        },
    ],
    [
        "P2002",
        {
            message: "Database query error: Unique constraint failed.",
            description: "Unique constraint failed on the {constraint}",
            requiresAction: false,
            requiresTracking: true,
            severity: "LOW",
        },
    ],
    [
        "P2003",
        {
            message: "Database query error: Foreign key constraint failed.",
            description:
                "Foreign key constraint failed on the field: {field_name}",
            requiresAction: true,
            requiresTracking: false,
            severity: "MODERATE",
        },
    ],
    [
        "P2004",
        {
            message: "Database query error: Constraint failed.",
            description:
                "A constraint failed on the database: {database_error}",
            requiresAction: true,
            requiresTracking: false,
            severity: "MODERATE",
        },
    ],
    [
        "P2005",
        {
            message:
                "Database query error: Value stored in the database is invalid for the field's type.",
            description:
                "The value {field_value} stored in the database for the field {field_name} is invalid for the field's type",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2006",
        {
            message: "Database query error: Provided value is not valid.",
            description:
                "The provided value {field_value} for {model_name} field {field_name} is not valid",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2007",
        {
            message: "Database query error: Data validation error.",
            description: "Data validation error {database_error}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2008",
        {
            message: "Database query error: Failed to parse the query.",
            description:
                "Failed to parse the query {query_parsing_error} at {query_position}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2009",
        {
            message: "Database query error: Failed to validate the query.",
            description:
                "Failed to validate the query: {query_validation_error} at {query_position}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2010",
        {
            message: "Database query error: Raw query failed.",
            description: "Raw query failed. Code: {code}. Message: {message}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2011",
        {
            message: "Database query error: Null constraint violation.",
            description: "Null constraint violation on the {constraint}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2012",
        {
            message: "Database query error: Missing a required value.",
            description: "Missing a required value at {path}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2013",
        {
            message: "Database query error: Missing a required argument.",
            description:
                "Missing the required argument {argument_name} for field {field_name} on {object_name}.",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2014",
        {
            message: "Database query error: Required relation violation.",
            description:
                "The change you are trying to make would violate the required relation '{relation_name}' between the {model_a_name} and {model_b_name} models.",
            requiresAction: false,
            requiresTracking: false,
            severity: null,
        },
    ],
    [
        "P2015",
        {
            message: "Database query error: Related record not found.",
            description: "A related record could not be found. {details}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2016",
        {
            message: "Database query error: Query interpretation error.",
            description: "Query interpretation error. {details}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2017",
        {
            message: "Database query error: Records not connected.",
            description:
                "The records for relation {relation_name} between the {parent_name} and {child_name} models are not connected.",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2018",
        {
            message:
                "Database query error: Required connected records not found.",
            description:
                "The required connected records were not found. {details}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2019",
        {
            message: "Database query error: Input error.",
            description: "Input error. {details}",
            requiresAction: false,
            requiresTracking: false,
            severity: null,
        },
    ],
    [
        "P2020",
        {
            message: "Database query error: Value out of range.",
            description: "Value out of range for the type. {details}",
            requiresAction: false,
            requiresTracking: false,
            severity: null,
        },
    ],
    [
        "P2021",
        {
            message: "Database query error: Table does not exist.",
            description:
                "The table {table} does not exist in the current database.",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P2022",
        {
            message: "Database query error: Column does not exist.",
            description:
                "The column {column} does not exist in the current database.",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P2023",
        {
            message: "Database query error: Inconsistent column data.",
            description: "Inconsistent column data: {message}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2024",
        {
            message:
                "Database query error: Connection pool timeout. Please retry.",
            description:
                "Timed out fetching a new connection from the connection pool. (More info: http://pris.ly/d/connection-pool\n\n(Current connection pool timeout: {timeout}, connection limit: {connection_limit})",
            requiresAction: false,
            requiresTracking: true,
            severity: "LOW",
        },
    ],
    [
        "P2025",
        {
            message: "Database query error: Required records not found.",
            description:
                "An operation failed because it depends on one or more records that were required but not found. {cause}",
            requiresAction: false,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2026",
        {
            message: "Database query error: Unsupported feature.",
            description:
                "The current database provider doesn't support a feature that the query used: {feature}",
            requiresAction: true,
            requiresTracking: false,
            severity: "CRITICAL",
        },
    ],
    [
        "P2027",
        {
            message: "Database query error: Multiple errors.",
            description:
                "Multiple errors occurred on the database during query execution: {errors}",
            requiresAction: true,
            requiresTracking: false,
            severity: "MODERATE",
        },
    ],
    [
        "P2028",
        {
            message: "Database query error: Transaction API error.",
            description: "Transaction API error: {error}",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2030",
        {
            message: "Database query error: Fulltext index not found.",
            description:
                "Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2033",
        {
            message: "Database query error: Number out of range.",
            description:
                "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers",
            requiresAction: true,
            requiresTracking: false,
            severity: "LOW",
        },
    ],
    [
        "P2034",
        {
            message: "Database query error: Transaction failed. Please retry.",
            description:
                "Transaction failed due to a write conflict or a deadlock. Please retry your transaction",
            requiresAction: false,
            requiresTracking: true,
            severity: "LOW",
        },
    ],
]);
