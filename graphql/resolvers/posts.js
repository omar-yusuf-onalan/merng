const Post = require('../../models/Post');
const User = require('../../models/User');
const checkAuth = require('../../util/checkAuth');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async deletePost(_, { postId }, context) {
            try {
                const tokenInfo = checkAuth(context);
                const user = await User.findById(tokenInfo.id);
                const post = await Post.findById(postId);

                if (user.username === post.username) {
                    await Post.findByIdAndDelete(postId);
                    return 'Post deleted successfully';
                } else {
                    throw new Error('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async createPost(_, { body }, context) {
            const tokenInfo = checkAuth(context);
            const user = await User.findById(tokenInfo.id);

            if (body.trim() === '') {
                throw new Error('Post body must not be empty');
            }

            const post = await Post.create({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
            });

            return post;
        },
    },
};
