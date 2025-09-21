
const UserModel = require('../models/userModel')
const { getValidationErrorMessage } = require('../utils/validationUtils')

const userListController = async (req, res) => {
  try {
    const roleFilter = req.query.role;
    let users;
    if (roleFilter) {
      users = await UserModel.find({ role: roleFilter });
    } else {
      users = await UserModel.find();
    }

    res.json({ message: "Fetched users successfully", users });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong in the server. Please try again.",
    });
  }
};


const updateRoleController = async (req, res) => {
    try{
        const userId = req.body.userID
        const userRole = req.body.userRole
    
        const user = await UserModel.findById(userId)
        user.role = userRole
        await user.save()
            console.log("User before save:", user);
        res.json({"message": "Role updated successfully"})
    }catch(err){
        if (err.name === "ValidationError"){
            const message = getValidationErrorMessage(err)
            res.status(400).json({message: message})
        }
        else{
            res.status(500).json({message: "Something went wrong in the server. Please try after some time." ,  error: err.message,})
        }
    }
}

const toggleUserStatus = async (req, res) => {
  try {
    const { userID } = req.body;
    const user = await UserModel.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    res.json({ message: "User status updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = {updateRoleController, userListController, toggleUserStatus}