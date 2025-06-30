import { Router } from 'express'

const router = Router()


let statusPortao = 0

router.get('/',(req, res) =>{

    res.json({status: statusPortao})
})

router.post('/altera-status', (req, res) =>{

    const {novoStatus} = req.body
    if (novoStatus === 0 || novoStatus ===1){
        statusPortao = novoStatus
        res.json({success: true, status: statusPortao})
    }else{
        res.status(400).json({success: false, message:"status invalido"})
    }
})

export default router