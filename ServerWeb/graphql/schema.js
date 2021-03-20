var { graphql, buildSchema } = require('graphql');

var schema = buildSchema(`

    type User {
        name: String
        id: String
        email: String
        password: String
    }

  type Product {
      id: String
      name: String
      title: String
      author: String
      price: Float
      weight: Float
      pictureLink: String
      seller: String
  }

  type Query {
    userByName(userName: String): User
    users: [User]
    hello: String
    userById(userId: String): User
    userByEmail(userEmail: String): User
    products: [Product]
    productById(productId: String): Product
  }
`);

module.exports = schema;