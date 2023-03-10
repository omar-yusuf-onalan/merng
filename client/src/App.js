import './App.css';
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_POSTS = gql`
    query GetPosts {
        getPosts {
            id
            body
            createdAt
            username
        }
    }
`;
function DisplayPosts() {
    const { loading, error, data } = useQuery(GET_POSTS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
    return data.getPosts.map(({ id, body, createdAt, username }) => (
        <div key={id}>
            <h3>{username}</h3>
            <p>
                <strong>Content:</strong> {body}
            </p>
            <p>
                <strong>Created At:</strong> {createdAt}
            </p>
        </div>
    ));
}
export default function App() {
    return (
        <div>
            <h2>Hi World! </h2>
            <br />
            <DisplayPosts />
        </div>
    );
}
