// ? Query Resolvers allows us to fetch data using 
// ? graphql queries 
// ? ie: user{
// ?    id
// ?    name   
// ? } -> returns the users id & name 

const Query = {
    users(parent, args, ctx, info) {
        if(!args.query) return ctx.db.users;
        return ctx.db.users.filter((user) => (user.name.toLowerCase().includes(args.query)));
    },
    me(){
        return {
            id: 'abc123',
            name: 'Gerard',
            email: 'gerard@example.com',
            age: 26
        }
    },
    post(){
        return {
            id: '123090',
            title: 'My first post!',
            body: 'GraphQL is pretty cool ;)!',
            published: true
        }
    },
    posts(parent, args, ctx, info) {
        if(!args.query) return ctx.db.posts;
        return ctx.db.posts.filter((post) => {
            return (post.title.toLowerCase().includes(args.query) || 
            post.body.toLowerCase().includes(args.query))
        });
    },
    comments(parent, args, ctx, info) {
        return ctx.db.comments;
    }
};

export { Query as default };