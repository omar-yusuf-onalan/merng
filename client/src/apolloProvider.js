import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, gql } from '@apollo/client';
import React from 'react';
import App from './App';

const httpLink = new HttpLink({
    uri: 'http://localhost:5000',
    useGETForQueries: true,
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    connectToDevTools: true,
});
client.query({
    query: gql`
        query GetPosts {
            getPosts {
                id
                body
                createdAt
                username
            }
        }
    `,
});

export const apolloProvider = (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
