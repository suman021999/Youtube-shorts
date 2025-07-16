import {Router} from 'express'
import { loginaccount, logout, switchaccount } from '../controller/user.controller'



router.route("/login").post(loginaccount)
router.route("/login").post(switchaccount)
router.route("/logout").get(logout)

const router=Router()


export default router