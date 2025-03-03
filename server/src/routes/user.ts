import { Request, Response, Router } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { validateToken } from "../middleware/validateToken"
import { User, IUser } from "../models/User"

const userRouter : Router = Router();

userRouter.post("/register",
    body("username").escape(),
    body("password"),
    async (req: Request, res: Response):Promise<any> => {
        const errors: Result<ValidationError> = validationResult(req)
        if(!errors.isEmpty()) {
            //console.log(errors);
            return res.status(400).json({errors: errors.array()})
            
        }
    try{
        const existingUser: IUser | null = await User.findOne({username: req.body.username})
        //console.log(existingUser)
        if (existingUser) {
            return res.status(403).json({username: "username already in use"})
        }

        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)

        await User.create({
            username: req.body.username,
            password: hash
        })

        return res.status(200).json({message: "User registered successfully"})    
    } catch (error: any) {
        console.error(`Error during registration: ${error}`)
        return res.status(500).json({error: "Internal Server Error"})
    } 

})

userRouter.get("/list", async (req: Request, res: Response):Promise<any> => {
    try{
        const users: IUser[] = await User.find()
        return res.status(200).json(users)
     }catch(error: any){
        console.error(`Error fetching user list: ${error}`)
        return res.status(500).json({error: "Internal server error"})
    }
})


userRouter.post("/login", 
body("username").escape(),
body("password"),
async (req: Request, res: Response):Promise<any> =>{
    try {
        const existingUser: IUser | null = await User.findOne({username: req.body.username})
        if (!existingUser){
            return res.status(401).json({message: "Login failed"})
        }
        const userId = existingUser._id
        if(bcrypt.compareSync(req.body.password, existingUser.password)){
            const JwtPayload: JwtPayload ={
                username: existingUser.username
            }
            const token: string = jwt.sign(JwtPayload, process.env.SECRET as string)

            return res.status(200).json({success: true, token, userId})
        }
        return res.status(401).json({message: "Login failed"})

    } catch(error: any){
        console.error(`Error during user login: ${error}`)
        return res.status(500).json({ error: "Internal server error" })
    }


})
export default userRouter;