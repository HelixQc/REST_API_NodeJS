const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const userModel = require('../models/UserModel') 
const cors = require('cors');
router.use(cookieParser());
router.use(cors());
/***Simple CRUD for User***/
router.post('/createUser', async (req, res) => {
    const data = new userModel({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/readUsers', async (req, res) =>{ 
    try{
        const data = await userModel.find();
        res.json(data)
    }catch(error){
        res.status(500).json({message: error.message})
    }    
});

router.patch('/updateUser/', async (req, res) =>{
    //will need to be change to a post and hide the id in the body
    try{
        const username  = req.cookies['login']
        const user = await userModel.findOne({ username: username });
        const id = user.id;
        const updatedData = req.body;
        const options = {new: true};
        const result = await userModel.findByIdAndUpdate(id, updatedData, options)
        res.send(result)
    }catch(error){
        res.status(400).json({message: error.message})
    }    
});

router.delete('/deleteUser/', async (req, res) => {
    try{
        const username  = req.cookies['login']
        const user = await userModel.findOne({ username: username });
        const id = user.id;
        const result = await userModel.findByIdAndDelete(id)
        res.send("The Object have been deleted: \n"+ result)
    }catch(error){
        res.status(400).json({message: error.message})
    }    
});

/***More Query if needed for User***/
router.get('/findByIdUser/:id', async (req, res) => {
    try{
        const data = await userModel.findById(req.params.id)
        res.json(data)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/rules', async (req, res) => {
    try {
        const data = await userModel.find();
        const rules = data
            .filter(item => item.rule !== null && item.rule !== undefined)
            .map(item => item.rule) 
            .reduce((acc, val) => acc.concat(val), [])
            .map(rule => (rule)); 
            console.log(rules)
        res.json( rules );
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/comments', async (req, res) => {
    try {
        const data = await userModel.find();
        const comments = data
            .filter(item => item.comment !== null && item.comment !== undefined)
            .map(item => item.comment)
            .reduce((acc, val) => acc.concat(val), []) 
            .map(comment => (comment)); 
        console.log(comments)
        res.json(comments);
        
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/addRules', async (req, res) => {
    try {
        const username = req.body.username;
        const newRule = req.body.rule;
        let user = await userModel.findOne({ username: username });

        if (!user) {
            user = new userModel({
                username: username,
                rule: [newRule]
            });
        } else {
            user.rule.push(newRule);
        }

        const savedUser = await user.save();
        console.log("Rule added with success:", savedUser);
        res.status(200).json({ message: "Rule added successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/addComments', async (req, res) => {
    try {
        const username = req.body.username;
        const newComment = req.body.comments;
        let user = await userModel.findOne({ username: username });

        if (!user) {
            user = new userModel({
                username: username,
                comments: [newComment]
            });
        } else {
            user.comment.push(newComment);
        }

        const savedUser = await user.save();
        console.log("Comments added with success:", savedUser);
        res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
});

/***Login & logout***/
/***Don't use this method to create a real login 
 * method this is only for testing purposes***/
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(404).send('Username or password is incorrect');
        }

        if (user.password === password) {
        
            res.cookie('login', user.username , { maxAge: 3600000 }); 

            return res.send({username : user.username});

        } else {
            return res.status(401).send({message:'Username or password incorrect'});
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.post('/logout', (req, res) => {
    try{
    res.clearCookie('login');
    res.send('Logout successful.');
} catch (error) {
    return res.status(500).send({ message: error.message });
}
});


module.exports = router;