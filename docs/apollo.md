# **Apollo Mutation Cheat Sheet**

## **1. Server-Side Definition**

### **TypeDefs:**

Define the shape of the data and operations.

- **Input Type**:
This is typically used to group multiple input values together.

```graphql
input UserInput {
    id: ID!
    username: String!
}
```

- **Mutation**:
Declare the actual mutation and the data it expects.

```graphql
type Mutation {
    updateUser(input: UserInput!): User!
}
```

### **Resolvers:**

Implement the logic to fetch the data. The mutation's name in the resolver should match the name defined in the Mutation typedef.

```javascript
{
  Mutation: {
    updateUser: async (_, { input }, context) => {
      // Logic to perform the mutation
    }
  }
}
```

## **2. Client-Side Definition**

### **Mutation Definition:**

Use the `gql` tag to define the mutation as per the server-side definition.

```javascript
import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UserInput!) {
    updateUser(input: $input) {
      id
      username
    }
  }
`;
```

- `$input`: Variable declaration. The `$` denotes a variable. It's like a placeholder for the actual values you'll provide when you execute the mutation.
  
- `UpdateUser`: This is the operation name. It's optional but recommended as it makes your code clearer and helps with debugging.

### **Calling the Mutation on the Client:**

```javascript
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from './path-to-your-mutation-definition';

function UpdateUserComponent() {
  const [updateUser, { data, loading, error }] = useMutation(UPDATE_USER);

  const handleUpdate = async () => {
    try {
      const response = await updateUser({ 
        variables: { 
          input: { 
            id: "someID", 
            username: "newUsername" 
          } 
        }
      });

    } catch (err) {
      console.error("Error updating user:", err);
    }
  }

  return (
    // Your component JSX, including perhaps a button to trigger handleUpdate
  );
}
```

- `useMutation`: Apollo Client hook to execute a mutation.
  
- `updateUser`: This function triggers the mutation. It's named after the mutation but can be renamed to anything.
  
- `variables`: The actual values you're passing to the mutation, matching the `$input` placeholder.

---

### **Key Points to Remember:**

- Always ensure your client-side mutation matches the shape of your server-side mutation.
  
- The variables you pass in on the client should match the expected input as defined on the server.
  
- Always handle potential errors – network errors, GraphQL errors, etc.
  
- Check the Apollo Client and Apollo Server docs periodically. They're a rich resource and have many advanced features not covered in this cheat sheet.

---

You can use this markdown in any markdown-supported platform like GitHub, GitLab, or even in Markdown editors/viewers.
