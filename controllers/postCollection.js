// const postModel=require("../models/postModel")


// exports.postCreate = async (req, res) => {
//     try {
//         const reqBody = req.body
//         const { user_id, post_id, name, ImageCode, Message } = reqBody
//         if (!user_id && !post_id && !name && !ImageCode && !Message)
//             return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are require!" })
//         const postdata = await postModel.create({
//             ...reqBody
//         })
//         return res.send({ responseCode: 200, success: true, responseMessage: "Post created successfully", responseResult: postdata })
//     }
//     catch (error) {
//         return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
//     }
// }