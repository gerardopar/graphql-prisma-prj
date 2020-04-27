const Subscription = {  
    post: {
        subscribe(parent, args, ctx, info) {
            return ctx.pubsub.asyncIterator(`post`);
        }
    },
    comment: {
        subscribe(parent, args, ctx, info) {
            const post = ctx.db.posts.find((post) => post.id === args.postId && post.published);
            if(!post) throw new Error('Post not found!');

            return ctx.pubsub.asyncIterator(`comment ${args.postId}`);
        }
    },
    
};

export { Subscription as default };