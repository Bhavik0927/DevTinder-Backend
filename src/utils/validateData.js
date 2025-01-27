const validateData = (req) => {
    const { userName, email, password, skills,gender } = req.body;

    if (!userName || !email || !password || !gender) {
        throw new Error("All fields should be filled");
    } else if (skills?.length > 10) {
        throw new Error("Skills must be under 10")
    }
}

const validateEditProfileData = (req) =>{
    try{
        const ALLOWED_UPDATES = [
            "firstName",
            "lastName",
            "emailId",
            "photoUrl",
            "gender",
            "age",
            "skills"
        ];

        const isUpdateAllowed = Object.keys(data).every((val) => ALLOWED_UPDATES.includes(val));

        return isUpdateAllowed;
    }catch(error){
        console.log(error);
    }
}

module.exports = {validateData,validateEditProfileData};