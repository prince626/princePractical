
import { comparePassword, hashPassword } from "../Hash/hashPassword.js";
import userData from "../Model/userModel.js";
import JWT from "jsonwebtoken";

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        if (!name || !email || !password || !phone || !address || !answer) {
            return res.send({ message: 'Please fill in all fields' })
        }
        if (password.length < 6) {
            return res.send({ message: 'Password should be at least 6 characters' });
        }
        if (!isValidEmail(email)) {
            return res.send({ message: 'Invalid email format' });
        }
        const checkuser = await userData.findOne({ email: email })
        if (checkuser) {
            return res.status(400).send({
                success: false,
                message: 'Already user Register Please Login'
            })
        }
        const hashedPassword = await hashPassword(password)
        const user = await new userData({ name, email, password: hashedPassword, phone, address, answer }).save()

        res.status(201).send({
            success: true,
            message: 'User Register Successfully',
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Registration', error
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).send({
                success: false,
                message: 'Please fill in all fields'
            })
        }
        const user = await userData.findOne({ email })
        if (!user) {
            return res.status(406).send({
                success: false,
                message: "Email is not Registerd"
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(403).send({
                success: false,
                message: "Invalid Password"
            })
        }
        const token = await JWT.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' })
        res.status(200).send({
            success: true,
            message: 'Login Successfullty',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Login', error
        })
    }
}