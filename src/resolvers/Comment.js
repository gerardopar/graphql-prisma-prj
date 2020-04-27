// ? graphql references allow us to 
// ? connect custom types that have relationships
// ? with each other parent <-><-> child
// ? based on id's

const Comment = {
    author(parent, args, ctx, info) {
        return ctx.db.users.find((user) => user.id === parent.author);
    },
    post(parent, args, ctx, info){
        return ctx.db.posts.find((post) => post.id === parent.post)
    }
};

export { Comment as default };