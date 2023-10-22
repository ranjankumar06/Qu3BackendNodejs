const moment = require('moment');
const mongo = require('mongodb');
const year = moment().format('YYYY');
const userModel = require('./models/userModel');
// const postModel = require('./models/postModel')(year);
const commentModel = require("./models/commentsModel");
const likeModel = require("./models/likeModel");
const followModel = require("./models/followModel");
const setting = require("./models/settingModel");
const followingModel = require('./models/followingModel');
const blockModel = require('./models/blockModel');
const reportModel = require('./models/reportModel');
const commentReplyModel = require('./models/commentReplyModel');
const likeReplyModel = require('./models/likeReplyModel');
const likeCommentModel = require('./models/likeCommentModel');
const masterTableModel = require('./models/masterTableModel');
const MongoCli = require('./config/mongo-client');


var appSocket
var userSocket


// appInSession stores an array of all active socket connections


const initializeSocket = (sio, socket, data) => {
    /**
     * initializeSocket sets up all the socket event listeners. 
     */

    // initialize global variables.
    appSocket = sio
    userSocket = socket
    userdata = data
    // console.log("message3", userdata);

    // console.log("socketId", userSocket.id);

    // socket.on('message', () => {

    //     // socket.emit('message', { message: socket.id });
    // // appSocket.on("userPostRelatedData", userPostRelatedData)

    // })
    // Create user data

    if (userdata.key == "createUserPost") {
        createUserPost(userdata.data)
    }
    else if (userdata.key == "updateUserPost") {
        updatePost(userdata.data)
    }
    else if (userdata.key == "deleteUserPost") {
        deletePost(userdata.data)
    }
    else if (userdata.key == "postViewer") {
        increasePostViewer(userdata.data)
    }
    else if (userdata.key == "userSocket") {
        socketUser(userdata.data)
    }
    else if (userdata.key == "disconnect") {
        onDisconnect(userdata.data)
    }
    else if (userdata.key == "postComments") {
        savePostComment(userdata.data)
    }
    else if (userdata.key == "postLikes") {
        savePostLike(userdata.data)
    }
    else if (userdata.key == "userFollower") {
        saveUserFollower(userdata.data)
    }
    else if (userdata.key == "userUnfollow") {
        saveUserUnfollower(userdata.data)
    }
    else if (userdata.key == "followingUser") {
        saveUserFollowing(userdata.data)
    }
    else if (userdata.key == "removeFollowing") {
        removeFollowing(userdata.data)
    }
    else if (userdata.key == "saveSetting") {
        saveSetting(userdata.data)
    }
    else if (userdata.key == "deleteComments") {
        deleteComment(userdata.data)
    }
    else if (userdata.key == "getPost") {
        getPostForUser(userdata.data)
    }
    else if (userdata.key == "blockUser") {
        blockUser(userdata.data)
    }
    else if (userdata.key == "unblockUser") {
        unblockUser(userdata.data)
    }
    else if (userdata.key == "reportPost") {
        reportUser(userdata.data)
    }
    else if (userdata.key == "postReply") {
        replyOnComment(userdata.data)
    }
    else if (userdata.key == "deleteReply") {
        deleteReplyOnComment(userdata.data)
    }
    else if (userdata.key == "getUserPost") {
        getSpecificPost(userdata.data)
    }
    else if (userdata.key == "likeComment") {
        saveCommentlike(userdata.data)
    }
    else if (userdata.key == "likeReply") {
        saveReplylike(userdata.data)
    }
    else if (userdata.key == "scanCount") {
        saveScanCount(userdata.data)
    }
    else {
        console.log("shhh! koi hai...");
    }

}

async function socketUser(userSocket) {

    //   console.log("socket", appSocket.id);
    const findUser = await userModel.findOne({ _id: userSocket.user_id });
    if (findUser.isOnline == false) {
        const user = await userModel.findOneAndUpdate({ _id: userSocket.user_id }, {
            $set: {
                socket_id: userSocket.socket_id,
                isOnline: true,
            }
        });
        const data = {
            key: "userSocket",
            data: user
        }
        appSocket.sockets.in(userSocket.socket_id).emit('message', { success: true, userPost: data });
    }
    else {
        const user = await userModel.findOneAndUpdate({ _id: userSocket.user_id }, {
            $set: {
                socket_id: "",
                isOnline: false,
            }
        });
    }

}

//  create post
async function createUserPost(userPostData) {
    await MongoCli.init();
    const now = moment();
    const tabelYear = moment().format('YYYY');
    const lastYear = Number(tabelYear) - Number(1);
    const lastYearTableName = "post" + lastYear;
    const tasks = await MongoCli.db.collection(lastYearTableName).find({}).toArray();
    let postData = null;
    const lastPost = tasks.at(-1);
    const findPostId = await postModel.find({})
    const postLength = findPostId.length;
    if (lastPost != null) {
        postData = lastPost.post_id;
    }
    else {
        postData = postLength
    }
 
    const findUserSocket = await userModel.findOne({ _id: userPostData.user_id });
    const user = await postModel.create({
        user_id: userPostData.user_id,
        post_id: Number(postData) + Number(1),
        post: userPostData.post,
        post_tag: userdata.post_tag,
        post_category: userPostData.post_category,
        comments_allow: userPostData.comments_allow,
        post_time: now
    });
    const tableName = "post" + tabelYear;
    const findMasterTable = await masterTableModel.findOne({ post_table_name: tableName });
    if (findMasterTable) {
        const saveToMasterTable = await masterTableModel.findOneAndUpdate({ post_table_name: tableName }, {
            $set: {
                to: user.post_id
            }
        })
    }
    else {
        const saveToMasterTable = await masterTableModel.create({
            post_table_name: tableName,
            from: user.post_id,
            to: user.post_id
        });
    }

    const data = {
        key: "createUserPost",
        data: user
    }

    // console.log("Current session", appSessionData);
    // console.log("Get_dataaaaa.....................");

    appSocket.sockets.in(findUserSocket.socket_id).emit('message', { success: true, userPost: data });

}

//  update post
async function updatePost(updatePostData) {
    const findUserSocket = await userModel.findOne({ _id: userPostData.user_id });
    const updateUserPost = await postModel.findByIdAndUpdate({ post_id: updatePostData.post_id },
        {
            $set: {
                post_tag: updatePostData.post_tag,
                post_category: updatePostData.post_category,
                comments_allow: updatePostData.comments_allow,
            }
        },
        {
            new: true
        });

    const data = {
        key: "createUserPost",
        data: updateUserPost
    }

    appSocket.sockets.in(findUserSocket.socket_id).emit('message', { success: true, userUpdatePost: data });
}

// Delete Post
async function deletePost(deletePostData) {
    const findUserSocket = await userModel.findOne({ _id: deletePostData.user_id });
    const updateUserPost = await postModel.findByIdAndUpdate({ post_id: deletePostData.post_id },
        {
            $set: {
                post_status: false,

            }
        },
        {
            new: true
        });

    const data = {
        key: "createUserPost",
        data: updateUserPost
    }

    appSocket.sockets.in(findUserSocket.socket_id).emit('message', { success: true, userUpdatePost: data });
}

// Increase views on post
async function increasePostViewer(postViewData) {
    console.log("jhkjhj")
    const findUserSocket = await userModel.findOne({ _id: postViewData.user_id });
    const userViewed = await postModel.findOne({ _id: postViewData.post_id });
    let postViewed = null;
    for (let userExist of userViewed.viewer) {
        if (userExist.user_id == postViewData.user_id) {
            postViewed = true
        }
        else {
            postViewed = false
        }
    }
    console.log("user", postViewed);

    if (postViewed == false || userViewed.viewer == "") {
        const viewPost = await postModel.findOneAndUpdate({ _id: postViewData.post_id },
            {
                $set: {
                    views: Number(userViewed.views) + Number(1)
                },
                $push: {
                    viewer: {
                        user_id: postViewData.user_id
                    }
                }
            }, { new: true }
        )
        const data = {
            key: "postViewer",
            data: userViewed
        }

        appSocket.sockets.in(findUserSocket.socket_id).emit('message', { success: true, postViewer: data });
    }
    else {
        const userViewed = await postModel.findOne({ _id: postViewData.post_id });
        const data = {
            key: "postViewer",
            data: userViewed
        }
        appSocket.sockets.in(findUserSocket.socket_id).emit('message', { success: true, postViewer: data });
    }

}

// create post comment
async function savePostComment(commentData) {

    const getCommentUserSocketId = await userModel.findOne({ _id: commentData.user_id });
    const getUserPostId = await postModel.findOne({ _id: commentData.post_id });

    const saveComment = await commentModel.create({
        user_id: getUserPostId.user_id,
        post_id: commentData.post_id,
        comment_by_user: commentData.user_id,
        comment: commentData.comment,
        comment_notification: true,
        comment_status: true

    });

    const updateCommentCount = await postModel.findOneAndUpdate({ _id: commentData.post_id },
        {
            $set: {
                comments: Number(getUserPostId.comments) + Number(1)
            }
        })

    const getComments = await commentModel.find({ $and: [{ post_id: commentData.post_id }, { comment_status: true }] });
    const data = {
        key: "postComments",
        data: getComments
    }
    appSocket.sockets.in(getCommentUserSocketId.socket_id).emit('message', { success: true, commentdata: data });

}

// Delete user comment on post
async function deleteComment(commentData) {
    const getCommentUserSocketId = await userModel.findOne({ _id: commentData.user_id });
    const getUserPostId = await postModel.findOne({ _id: commentData.post_id });
    const updatePostComment = await commentModel.findOneAndUpdate({ _id: commentData.comment_id },
        {
            $set: {
                comment_status: false
            }
        },
        {
            new: true
        })
    const updateCommentCount = await postModel.findOneAndUpdate({ _id: commentData.post_id },
        {
            $set: {
                comments: Number(getUserPostId.comments) - Number(1)
            }
        })
    // for (let i = 0; i <= commentLength.length; i++) {
    //     console.log("id>>>", i)
    //     if (updatePostComment.comments[i]._id == commentData.comment_id) {
    //         updatePostComment.comments[i].comment_notification = true,
    //             updatePostComment.comments[i].comment_status = false
    //         break;
    //     }
    // }
    // updatePostComment.save()
    const getComments = await commentModel.find({ $and: [{ post_id: commentData.post_id }, { comment_status: true }] });
    const data = {
        key: "deleteComments",
        data: getComments
    }
    appSocket.sockets.in(getCommentUserSocketId.socket_id).emit('message', { success: true, commentdata: data });

}

// Reply on comment
async function replyOnComment(replyData) {
    const getCommentUserSocketId = await userModel.findOne({ _id: replyData.user_id });
    const getUserPostId = await postModel.findOne({ _id: replyData.post_id });
    const saveComment = await commentReplyModel.create({
        user_id: getUserPostId.user_id,
        post_id: replyData.post_id,
        comment_id: replyData.comment_id,
        reply_to_user_id: replyData.reply_to_user_id,
        reply: replyData.comment,
        reply_notification: true,
        reply_status: true

    });

    const getReply = await commentReplyModel.find({ $and: [{ post_id: replyData.post_id }, { reply_status: true }] });
    const data = {
        key: "postReply",
        data: getReply
    }
    appSocket.sockets.in(getCommentUserSocketId.socket_id).emit('message', { success: true, commentdata: data });
}

// delete reply on comment 
async function deleteReplyOnComment(deleteReply) {
    const getCommentUserSocketId = await userModel.findOne({ _id: deleteReply.user_id });
    const getUserPostId = await userModel.findOne({ _id: deleteReply.post_id });
    const updatePostComment = await commentModel.findOneAndUpdate({ _id: deleteReply.reply_id },
        {
            $set: {
                reply_status: false
            }
        },
        {
            new: true
        })
    const getReply = await commentReplyModel.find({ $and: [{ post_id: replyData.post_id }, { reply_status: true }] });
    const data = {
        key: "deleteReply",
        data: getReply
    }
    appSocket.sockets.in(getCommentUserSocketId.socket_id).emit('message', { success: true, commentdata: data });
}

// save like of comment and Reply
async function saveCommentlike(likeCommentData) {
    const getCommentUserSocketId = await userModel.findOne({ _id: likeCommentData.user_id });
    const getUserPostId = await postModel.findOne({ _id: likeCommentData.post_id });
    const findUserAndComment = await likeCommentModel.findOne({ $and: [{ post_id: likeCommentData.post_id }, { like_by_user_id: likeCommentData.user_id }] });
    if (findUserAndComment) {
        const findUserAndComment = await likeCommentModel.findOneAndDelete({ $and: [{ post_id: likeCommentData.post_id }, { like_by_user_id: likeCommentData.user_id }] });
        const getLike = await likeCommentData.find({ post_id: likeCommentData.post_id });
        const data = {
            key: "likeComment",
            data: getLike
        }
        appSocket.sockets.in(getCommentUserSocketId.socket_id).emit('message', { success: true, commentdata: data });
    }
    else {
        const saveCommentLike = await likeCommentModel.create({
            user_id: getUserPostId.user_id,
            post_id: likeCommentData.post_id,
            like_by_user_id: likeCommentData.user_id,
            comment_id: likeCommentData.comment_id,
        });

        const getLike = await likeCommentModel.find({ post_id: likeCommentData.post_id });
        const data = {
            key: "likeComment",
            data: getLike
        }
        appSocket.sockets.in(getCommentUserSocketId.socket_id).emit('message', { success: true, commentdata: data });
    }

}

// like reply

async function saveReplylike(likeReplyData) {
    const getCommentUserSocketId = await userModel.findOne({ _id: likeReplyData.user_id });
    const getUserPostId = await postModel.findOne({ _id: likeReplyData.post_id });
    const findUserAndComment = await likeReplyModel.findOne({ $and: [{ post_id: likeReplyData.post_id }, { like_by_user_id: likeReplyData.user_id }] });
    if (findUserAndComment) {
        const findUserAndComment = await likeReplyModel.findOneAndDelete({ $and: [{ post_id: likeReplyData.post_id }, { like_by_user_id: likeReplyData.user_id }] });
        const getLike = await likeReplyData.find({ post_id: likeReplyData.post_id });
        const data = {
            key: "likeReply",
            data: getLike
        }
        appSocket.sockets.in(getCommentUserSocketId.socket_id).emit('message', { success: true, commentdata: data });
    }
    else {
        const saveReplyLike = await likeReplyModel.create({
            user_id: getUserPostId.user_id,
            post_id: likeReplyData.post_id,
            like_by_user_id: likeReplyData.user_id,
            reply_id: likeReplyData.comment_id,
        });

        const getLike = await likeReplyModel.find({ post_id: likeReplyData.post_id });
        const data = {
            key: "likeReply",
            data: getLike
        }
        appSocket.sockets.in(getCommentUserSocketId.socket_id).emit('message', { success: true, commentdata: data });
    }

}

// create post like
async function savePostLike(likeData) {
    const getLikeUserSocketId = await userModel.findOne({ _id: likeData.user_id });
    const getUserPostId = await postModel.findOne({ _id: likeData.post_id });

    const getUserLike = await likeModel.findOne({ $and: [{ post_id: likeData.post_id }, { like_by_user: likeData.user_id }] });
    if (getUserLike) {
        const updateLike = await likeModel.findOneAndDelete({ $and: [{ post_id: likeData.post_id }, { like_by_user: likeData.user_id }] });
        const updateCommentCount = await postModel.findOneAndUpdate({ _id: likeData.post_id },
            {
                $set: {
                    likes: Number(getUserPostId.likes) - Number(1)
                }
            })
        const getLike = await likeModel.find({ post_id: likeData.post_id });
        const data = {
            key: "postLikes",
            data: getLike
        }
        appSocket.sockets.in(getLikeUserSocketId.socket_id).emit('message', { success: true, commentdata: data });

    } else {
        const saveLike = await likeModel.create({
            user_id: getUserPostId.user_id,
            post_id: likeData.post_id,
            like_by_user: likeData.user_id,
            like_notification: true,

        });
        const updateCommentCount = await postModel.findOneAndUpdate({ _id: likeData.post_id },
            {
                $set: {
                    likes: Number(getUserPostId.likes) + Number(1)
                }
            })
        const getLike = await likeModel.find({ post_id: likeData.post_id });
        const data = {
            key: "postLikes",
            data: getLike
        }
        appSocket.sockets.in(getLikeUserSocketId.socket_id).emit('message', { success: true, commentdata: data });
    }


}

// Save user follower
async function saveUserFollower(followerData) {
    const getFollowerUserSocketId = await userModel.findOne({ _id: followerData.follower_id });
    const getUserFollower = await followModel.findOne({ $and: [{ user_id: followerData.user_id }, { follower_id: followerData.follower_id }] });
    if (getUserFollower) {
        const data = {
            key: "userFollower",
            data: getUserFollower
        }
        appSocket.sockets.in(getFollowerUserSocketId.socket_id).emit('message', { success: true, data: data });
    }
    else {
        const createUserFollower = await followModel.create({
            user_id: followerData.user_id,
            follower_id: followerData.follower_id,
            follow_status: true,
            notification_seen: true,
            follow_date: moment()

        });
        const findFollowerUser = await followingModel.create({
            user_id: followerData.follower_id,
            following_id: followerData.user_id,
            following_status: true,
            following_date: moment()
        });

        const data = {
            key: "userFollower",
            data: createUserFollower
        }

        appSocket.sockets.in(getFollowerUserSocketId.socket_id).emit('message', { success: true, data: data });
    }






    appSocket.sockets.in(getFollowerUserSocketId.socket_id).emit('message', { success: true, data: data });

}

// Remove user follower and following
async function saveUserUnfollower(unfollowerData) {
    const getUnfollowerUserSocketId = await userModel.findOne({ _id: unfollowerData.unfollower_id });
    const getUserUnfollower = await followModel.findOneAndUpdate({ $and: [{ user_id: unfollowerData.user_id }, { follower_id: unfollowerData.unfollower_id }] },
        {
            $set: {
                follow_status: false,
                unfollow_date: moment(),

            },
        }, {
        new: true
    });

    const updatePostFollower = await followingModel.findOneAndUpdate({ $and: [{ user_id: unfollowerData.unfollower_id }, { follower_id: unfollowerData.user_id }] },
        {
            $set: {
                following_status: false,
                unfollowing_date: moment(),
            }

        }, {
        new: true
    })

    const data = {
        key: "userFollower",
        data: getUserUnfollower
    }
    appSocket.sockets.in(getUnfollowerUserSocketId.socket_id).emit('message', { success: true, data: data });

}


// Save setting
async function saveSetting(settingData) {
    const getUserSocketId = await userModel.findOne({ _id: settingData.user_id });
    const getUserSetting = await setting.findOne({ user_id: settingData.user_id });
    if (getUserSetting) {
        const updateSetting = await setting.findOneAndUpdate({ user_id: settingData.user_id },
            {
                $set: {
                    setting: settingData.setting
                }
            }, {
            new: true,
        })
    }
    else {
        const saveUserFollower = await settingData.create({
            post_id: settingData.user_id,
            setting: settingData.setting

        });
    }


    const data = {
        key: "saveSetting",
        data: getUserSetting
    }
    appSocket.sockets.in(getUserSocketId.socket_id).emit('message', { success: true, data: data });

}


// Get post 
// var q = models.Post.find().sort('date', -1).limit(10);
// q.execFind(function(err, posts) {
//   // will be of length 10
// });
async function getPostForUser(userData) {
    let allPost = [];
    const limit = userData.limit;
    const page = userData.page;
    const startindex = (page - 1) * limit
    const endindex = page * limit
    const user = await userModel.findOne({ _id: userData.user_id });
    if (user.status == true) {
        const followingByUser = await followingModel.findOne({ user_id: userData.user_id });
        const findFollowingUser = await followingModel.find({ user_id: userData.user_id });
        const followingUserPost = await postModel.find({ user_id: findFollowingUser.following_id }).sort({ createdAt: -1 });

        for (let post of followingUserPost) {
            if (userData.user_id != followingUserPost.viewer.user_id || followingUserPost.viewer == "") {
                allPost.push(post);
                break;
            }
        }
        const followingUserPostCount = allPost.length;

        allPost.push(followingUserPost);
        const getRandomPost = await postModel.find({});
        console.log("number0", allPost);
        const first100 = getRandomPost.slice(startindex, endindex);
        allPost.push(first100);

        const data = {
            key: "getPost",
            data: allPost
        }
        appSocket.sockets.in(user.socket_id).emit('message', { success: true, data: data });
    }
    else {
        const getRandomPost = await postModel.find({}).sort({ createdAt: -1 });
        const first100 = getRandomPost.slice(startindex, endindex);
        allPost.push(first100);


        const data = {
            key: "getPost",
            data: allPost
        }
        // console.log("data",data.data);
        appSocket.sockets.in(user.socket_id).emit('message', { success: true, data: data });
    }


}

// Block User

async function blockUser(userData) {

    const findUserSocketId = await userModel.findOne({ _id: userData.user_id });
    const findUserInBlockList = await blockModel.findOne({ $and: [{ user_id: userData.user_id }, { block_user_id: userData.blocked_user_id }] });

    if (!findUserInBlockList) {
        const createBlockUser = await blockModel.create({
            user_id: userData.user_id,
            block_user_id: userData.blocked_user_id,
            blocked_date: moment(),
            status: true,
            block_count: Number(1)
        });

        const data = {
            key: "blockUser",
            data: createBlockUser
        }
        // console.log("data",data.data);
        appSocket.sockets.in(findUserSocketId.socket_id).emit('message', { success: true, data: data });
    } else {

        const updateUserBlockList = await blockModel.findOneAndUpdate({ $and: [{ user_id: userData.user_id }, { block_user_id: userData.blocked_user_id }] },
            {
                $set: {
                    block_count: Number(findUserInBlockList.block_count) + Number(1),
                    blocked_date: moment(),
                    status: true,
                }
            },
            { new: true })
        const data = {
            key: "blockUser",
            data: updateUserBlockList
        }
        // console.log("data",data.data);
        appSocket.sockets.in(findUserSocketId.socket_id).emit('message', { success: true, data: data });

    }

}

async function unblockUser(userData) {
    const findUserSocketId = await userModel.findOne({ _id: userData.user_id });
    const findUserInBlockList = await blockModel.findOne({ $and: [{ user_id: userData.user_id }, { block_user_id: userData.unblocked_user_id }] })

    if (findUserInBlockList) {
        const updateUserBlockList = await blockModel.findOneAndUpdate({ $and: [{ user_id: userData.user_id }, { block_user_id: userData.unblocked_user_id }] },
            {
                $set: {
                    unblocked_date: moment(),

                    status: false,
                }
            },
            { new: true })
        const data = {
            key: "unblockUser",
            data: updateUserBlockList
        }
        // console.log("data",data.data);
        appSocket.sockets.in(findUserSocketId.socket_id).emit('message', { success: true, data: data });
    } else {
        const data = {
            key: "unblockUser",
            data: findUserInBlockList
        }
        // console.log("data",data.data);
        appSocket.sockets.in(findUserSocketId.socket_id).emit('message', { success: true, data: data });
    }


}

// report user and post
async function reportUser(userData) {
    const findUserSocketId = await userModel.findOne({ _id: userData.user_id });
    const userFind = await postModel.findOne({ _id: userData.post_id });
    const reportUser = await reportModel.create({
        user_id: userData.user_id,
        post_id: userData.post_id,
        reported_user_id: userData.reported_user_id,
        description: userData.description,
        reported_date: moment()
    });
    const data = {
        key: "reportPost",
        data: reportUser
    }

    appSocket.sockets.in(findUserSocketId.socket_id).emit('message', { success: true, data: data });
}

// get specific post
async function getSpecificPost(postData) {
    const getPost = await postModel.findOne({ _id: postData.post_id });
    const getPostComment = await commentModel.find({ $and: [{ post_id: postData.post_id }, { comment_status: true }] });
    const getLike = await likeModel.find({ post_id: postData.post_id });
    const finalData = {
        post: getPost,
        comments: getPostComment,
        likes: getLike
    }

    const data = {
        key: "getUserPost",
        data: finalData
    }

    appSocket.sockets.in(findUserSocketId.socket_id).emit('message', { success: true, data: data });
}

// scan count
async function saveScanCount(scanCountData) {
    const findUserSocketId = await userModel.findOne({ _id: scanCountData.user_id });

    const saveCount = await userModel.findByIdAndUpdate({ _id: scanCountData.user_id });
    for (let post of saveCount.QR) {
        if (post.post_id == scanCountData.post_id) {
            post.scan_count += Number(1);
            break;
        }
    }
    saveCount.save();
    const Count = await userModel.findOne({ _id: scanCountData.user_id });
    const data = {
        key: "scanCount",
        data: Count
    }

    appSocket.sockets.in(findUserSocketId.socket_id).emit('message', { success: true, data: data });
}

// Save user Offline Or Online
async function onDisconnect(disconnectSocket) {

    const disconnectUser = await userModel.findOneAndUpdate({ socket_id: disconnectSocket.socket_id },
        {
            $set: {
                socket_id: disconnectUser.socket_id,
                isOnline: false
            }
        },
        { new: true });
    appSocket.sockets.in(disconnectSocket.socket_id).emit('disconnect', { success: true, disconnect: disconnectUser });
}


module.exports = {
    initializeSocket,
}