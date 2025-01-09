// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/api/v1/users": {
            "post": {
                "description": "Create a new user with the provided payload.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Create a new user",
                "parameters": [
                    {
                        "description": "Create User Payload",
                        "name": "user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/user.CreateUserRequest"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "User created successfully",
                        "schema": {
                            "$ref": "#/definitions/user.CreateUserRequest"
                        }
                    },
                    "400": {
                        "description": "Invalid request or user creation failed",
                        "schema": {
                            "$ref": "#/definitions/user.CreateUserRequest"
                        }
                    }
                }
            }
        },
        "/users/search": {
            "get": {
                "description": "Retrieves a list of users based on the email query parameter.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "Search users by email",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Email address of the user to search for",
                        "name": "email",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Bad request, missing email query parameter",
                        "schema": {
                            "$ref": "#/definitions/handlers.HTTPError"
                        }
                    },
                    "500": {
                        "description": "Internal server error, failed to fetch users",
                        "schema": {
                            "$ref": "#/definitions/handlers.HTTPError"
                        }
                    }
                }
            }
        },
        "/users/{id}": {
            "get": {
                "description": "Retrieves a user by their unique ID. If the user is not found, a 404 Not Found error is returned.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "Get user by ID",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "User ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Bad request, missing id path parameter",
                        "schema": {
                            "$ref": "#/definitions/handlers.HTTPError"
                        }
                    },
                    "404": {
                        "description": "User not found",
                        "schema": {
                            "$ref": "#/definitions/handlers.HTTPError"
                        }
                    }
                }
            },
            "put": {
                "description": "Updates the details of an existing user. This requires the user ID and the data to be updated.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "Update user details",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "User ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Invalid request, missing parameters",
                        "schema": {
                            "$ref": "#/definitions/handlers.HTTPError"
                        }
                    },
                    "404": {
                        "description": "User not found",
                        "schema": {
                            "$ref": "#/definitions/handlers.HTTPError"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/handlers.HTTPError"
                        }
                    }
                }
            },
            "delete": {
                "description": "Deletes an existing user based on the user ID provided in the path parameter.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "Delete a user",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "User ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User successfully deleted",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "Invalid request, missing parameters or deletion error",
                        "schema": {
                            "$ref": "#/definitions/handlers.HTTPError"
                        }
                    },
                    "404": {
                        "description": "User not found",
                        "schema": {
                            "$ref": "#/definitions/handlers.HTTPError"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/handlers.HTTPError"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "handlers.HTTPError": {
            "description": "A standard error response structure",
            "type": "object",
            "properties": {
                "code": {
                    "type": "integer"
                },
                "message": {
                    "type": "string"
                }
            }
        },
        "user.CreateUserRequest": {
            "type": "object",
            "required": [
                "email",
                "first_name",
                "last_name",
                "password"
            ],
            "properties": {
                "email": {
                    "type": "string"
                },
                "first_name": {
                    "type": "string"
                },
                "last_name": {
                    "type": "string"
                },
                "password": {
                    "type": "string",
                    "minLength": 8
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "",
	Host:             "",
	BasePath:         "",
	Schemes:          []string{},
	Title:            "",
	Description:      "",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
