const {Client} = require('intercom-client');

const client = new Client({ tokenAuth: { token: process.env.INTERCOM_SECRET_KEY } });

const customerRequestController = async(req,res) =>{
    const user = req.local.user; // Get from your frontend authentication
    console.log(user);

    try {
        await client.conversations.create({
            user_id: userId,
            // ...other conversation attributes
        });
        res.sendStatus(200); 
    } catch (error) {
        res.status(500).send(error); 
    }
};

module.exports = customerRequestController;