import uuidv4 from 'uuid/v4';

// ? Mutations Resolvers allows us to make our usual crud operations 
// ? (create, update, delete)
// ? ie: createUser(name: 'johndoe', email: 'johndoe@example.com'){
// ?    id
// ?    name 
// ?    email  
// ? } -> returns the user created object id, name, & email 

const Mutation = {
    createUser(parent, args, ctx, info) {
        const emailTaken = ctx.db.users.some((user) => user.email === args.data.email);
        if(emailTaken) throw new Error('Email taken!');
        const u = { 
            id: uuidv4(), 
            name: args.data.name, 
            email: args.data.email, 
            age: args.data.age 
            // ...args.data // the spread operator can be used to spread all values
        };
        ctx.db.users.push(u);
        return u;
    },
    updateUser(parent, args, ctx, info) {
        const { id,data } = args;
        const user = ctx.db.users.find((user) => user.id === id);
        if(!user) throw new Error('User does not Exist!');

        if(typeof data.email === 'string') {
            const emailTaken = ctx.db.users.some((user) => user.email === data.email);
            if(emailTaken) throw new Error('Email taken!');
            user.email = data.email;
        }
        if(typeof data.name === 'string') user.name = data.name;
        if(typeof data.name !== undefined) user.age = data.age;

        return user;
    },
    deleteUser(parent, args, ctx, info) {
        const userIndex = ctx.db.users.findIndex((user) => user.id === args.id);
        if(userIndex === -1) throw new Error('User does not Exist!');
        const deletedUsers = ctx.db.users.splice(userIndex, 1);
        ctx.db.posts = ctx.db.posts.filter((post) => {
            const match = post.author === args.id;

            if(match) {
                ctx.db.comments = ctx.db.comments.filter((comment) => comment.post !== post.id);
            }

            return !match;
        });
        ctx.db.comments = ctx.db.comments.filter((comment) => comment.author !== args.id);
        return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
        const userExists = ctx.db.users.some((user) => user.id === args.data.author);
        if(!userExists) throw new Error('User does not Exist!');
        const post = {
            id: uuidv4(),
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: args.data.author
            // ...args.data // the spread operator can be used to spread all values
        };
        ctx.db.posts.push(post);
        if(post.published) {
            ctx.pubsub.publish(`post`, { 
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        }
        return post;
    },
    updatePost(parent, args, ctx, info) {
        const { id, data } = args
        const post = ctx.db.posts.find((post) => post.id === id)
        const originalPost = { ...post }

        if (!post) throw new Error('Post not found');

        if (typeof data.title === 'string') post.title = data.title;

        if (typeof data.body === 'string') post.body = data.body;

        if (typeof data.published === 'boolean') {
            post.published = data.published;

            if (originalPost.published && !post.published) {
                ctx.pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            } else if (!originalPost.published && post.published) {
                ctx.pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });
            }
        } else if (post.published) {
            ctx.pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }

        return post;
    },
    deletePost(parent, args, ctx, info){
        const postIndex = ctx.db.posts.findIndex((post) => post.id === args.id);
        if(postIndex === -1) throw new Error('Post does not Exists');
        const [ deletedPost ] = ctx.db.posts.splice(postIndex, 1);
        ctx.db.comments = ctx.db.comments.filter((comment) => comment.post !== args.id);
        
        if(deletedPost.published) {
            ctx.pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost
                }
            });
        }

        return deletedPost;
    },
    createComment(parent, args, ctx, info) {
        const userExists = ctx.db.users.some((user) => user.id === args.data.author);
        const postFound = ctx.db.posts.find((post) => post.id === args.data.post && post.published);
        if(!userExists) throw new Error('User does not Exist');
        if(!postFound) throw new Error('Post does not Exist');
        const comment = {
            id: uuidv4(),
            text: args.data.text,
            author: args.data.author,
            post: args.data.post,
            // ...args.data // the spread operator can be used to spread all values
        };
        ctx.db.comments.push(comment);
        ctx.pubsub.publish(`comment ${args.data.post}`, { 
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });
        return comment;
    },
    updateComment(parent, args, ctx, info) {
        const { id, data } = args;
        const comment = ctx.db.comments.find((comment) => comment.id === id);
        if(!comment) throw new Error('Comment does not Exist!');
        if(typeof data.text === 'string') comment.text = data.text;
        ctx.pubsub.publish(`comment ${comment.post}`, { 
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        });
        return comment;
    },
    deleteComment(parent, args, ctx, info) {
        const commentIndex = ctx.db.comments.findIndex((comment) => comment.id === args.id); 
        if(commentIndex === -1) throw new Error('Comment does not Exist');
        const [ deletedComment ] = ctx.db.comments.splice(commentIndex, 1);
        ctx.pubsub.publish(`comment ${deletedComment.post}`, { 
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        });
        return deletedComment;
    }
};

export { Mutation as default };