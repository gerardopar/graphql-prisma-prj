// demo user data
let users = [
    {
        id: '1a',
        name: 'johndoe',
        email: 'johndoe@example.com',
        age: null
    },
    {
        id: '2a',
        name: 'janedoe',
        email: 'janedoe@example.com',
        age: null
    }
];

// demo post data
let posts = [
    {
        id: '001',
        title: 'GraphQL',
        body: "Is it better then a REST API?",
        published: true,
        author: '1a'
    },
    {
        id: '002',
        title: 'React.JS',
        body: 'Is an awesome front end framework :)!',
        published: false,
        author: '2a'
    },
    {
        id: '003',
        title: 'Node.js',
        body: 'Is way better then PHP >:D',
        published: true,
        author: '1a'
    }
];

// demo comments data
let comments = [
    {
        id: '1',
        text: 'GraphQL is pretty cool',
        author: '2a',
        post: '001' 
    },
    {
        id: '2',
        text: 'GraphQL will take over REST APIs',
        author: '2a',
        post: '001'
    },
    {
        id: '3',
        text: 'PHP is old lol!',
        author: '1a',
        post: '003'
    },
    {
        id: '4',
        text: 'node.js is great!',
        author: '2a',
        post: '003' 
    },
];

const db = {
    users: users,
    posts: posts, 
    comments: comments
};

export { db as default };