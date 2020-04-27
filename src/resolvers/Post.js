// ? graphql references allow us to 
// ? connect custom types that have relationships
// ? with each other parent <-><-> child
// ? based on id's

const Post = {
    author(parent, args, ctx, info) {
        // here we are connecting/referencing the parent type -> !Post,
        // to the child type -> User!
        return ctx.db.users.find((user) => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
        return ctx.db.comments.filter((comment) => comment.post === parent.id);
    }
};

export { Post as default };