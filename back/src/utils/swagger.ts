import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'POS System API',
      version: '1.0.0',
      description: 'Backend API for Point of Sale System',
      contact: {
        name: 'POS System Support',
        email: 'support@possystem.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            userid: {
              type: 'integer',
              description: 'Unique identifier for the user'
            },
            username: {
              type: 'string',
              description: 'Username of the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address'
            },
            role: {
              type: 'string',
              enum: ['admin', 'cashier'],
              description: 'Role of the user',
              default: 'cashier'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account update timestamp'
            }
          }
        },
        Item: {
          type: 'object',
          required: ['name', 'price', 'category', 'stock_quantity'],
          properties: {
            itemid: {
              type: 'integer',
              description: 'Unique identifier for the item'
            },
            name: {
              type: 'string',
              description: 'Item name'
            },
            description: {
              type: 'string',
              description: 'Item description'
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Item price'
            },
            category: {
              type: 'string',
              description: 'Item category'
            },
            stock_quantity: {
              type: 'integer',
              description: 'Current stock quantity'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Item creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Item update timestamp'
            }
          }
        },
        Customer: {
          type: 'object',
          required: ['name', 'phone'],
          properties: {
            customerid: {
              type: 'integer',
              description: 'Unique identifier for the customer'
            },
            name: {
              type: 'string',
              description: 'Customer\'s full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Customer\'s email address'
            },
            phone: {
              type: 'string',
              description: 'Customer\'s phone number'
            },
            address: {
              type: 'string',
              description: 'Customer\'s delivery address'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Customer creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Customer update timestamp'
            }
          }
        },
        Order: {
          type: 'object',
          required: ['items'],
          properties: {
            orderid: {
              type: 'integer',
              description: 'Unique identifier for the order'
            },
            customerid: {
              type: 'integer',
              description: 'Customer ID (optional for walk-ins)'
            },
            items: {
              type: 'array',
              description: 'Array of ordered items with quantities',
              items: {
                type: 'object',
                properties: {
                  itemid: {
                    type: 'integer',
                    description: 'Item ID'
                  },
                  quantity: {
                    type: 'integer',
                    description: 'Quantity ordered'
                  },
                  price: {
                    type: 'number',
                    format: 'decimal',
                    description: 'Price per item at time of order'
                  },
                  item_name: {
                    type: 'string',
                    description: 'Item name'
                  }
                }
              }
            },
            total_amount: {
              type: 'number',
              format: 'decimal',
              description: 'Total order amount'
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'cancelled'],
              description: 'Order status',
              default: 'pending'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Order update timestamp'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'User username'
            },
            password: {
              type: 'string',
              description: 'User password'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  description: 'JWT access token'
                },
                refreshToken: {
                  type: 'string',
                  description: 'JWT refresh token'
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of validation errors'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'] // Path to the API routes
};

export const swaggerSpec = swaggerJSDoc(options);