const blockModel = require("../models/blockModel")
// const userModel = require("../models/userModel")

exports.blockUser = async (req, res) => {
    try {
        const { user_id, block_user_id } = req.body
        if (!block_user_id && !user_id)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required !" })
        const blockData = await blockModel.create({
            user_id,
            block_user_id
        })
        if (blockData)
            return res.send({ responseCode: 200, success: true, responseMessage: "User block successfully", responseResult: blockData })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message, });
    }
}