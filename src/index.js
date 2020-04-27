import { GraphQLServer, PubSub } from 'graphql-yoga';
// * importing data
import db from './db';
// * importing resolvers
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

const pubsub = new PubSub(); // graphql subscriptions setup

const server = new GraphQLServer({ // graphql server setup
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query: Query,
        Mutation: Mutation,
        Subscription: Subscription,
        User: User,
        Post: Post,
        Comment: Comment
    },
    context: {
        db: db,
        pubsub
    }
});

server.start(() => {
    console.log('The GraphQLServer is up!');
});