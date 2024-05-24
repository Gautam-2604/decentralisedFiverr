import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "..";
import authMiddleware from "../middleware";

const S3client = new S3Client({
    credentials:{
        accessKeyId:"Some Value",
        secretAccessKey:""

    },
    region: "us-east-1"
})



const router = Router()
const prismaClient = new PrismaClient()



//sig in with wallet

router.get('/presignedurl',authMiddleware,async(req,res)=>{
    //@ts-ignore
    const userId = req.userId
    const command = new PutObjectCommand({
        //aws not done
        Bucket: "some-bucket",
        Key:`fiver/${userId}/${Math.random()}/image.jpg`,       /*Important way to configure the storage */
        ContentType:'img/jpg'
    })
    const preSignedUrl = await getSignedUrl(S3client, command,{
        expiresIn: 3600
    })

    console.log(preSignedUrl);
    res.json({
        preSignedUrl
    })
    
})
router.post("/signin",async(req,res)=>{
    //Will add signing logic later
    const hardCodedWalletAddress = "123456789GAutam"
    const user = await prismaClient.user.findFirst({
        where:{
            address: hardCodedWalletAddress
        }
    })
    if(user){
        const token = jwt.sign({
            userId : user.id
        },JWT_SECRET)
        res.json({
            token
        })
    }else{
        const newUser = await prismaClient.user.create({
            data:{
                address: hardCodedWalletAddress
            }
        })
        const token = jwt.sign({
            userId : newUser.id
        }, JWT_SECRET)
        res.json({
            token
        })

    }

    

    })


export default router