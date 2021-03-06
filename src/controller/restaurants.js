const mongoose = require('mongoose');

const Restaurant = mongoose.model('Restaurant');

const upload = require('express-fileupload');

module.exports = {
    async index(req, res){
        const { page = 1 } = req.query;
        
        const restaurants = await Restaurant.paginate({}, { page, limit: 50 });

        return res.json(restaurants);
    },

    async view(req, res){
        const restaurant = await Restaurant.findById(req.params.id);

        return res.json(restaurant);
    },

    async create(req, res) {
        if(req.files) {
            const file = req.files.filename;
            
            await file.mv(`../uploads/${file.name}`, err => {
                if(err) {
                    res.send(false);
                } else {
                    const restaurant = Restaurant.create(req.body);
                    
                    if(restaurant) {
                        res.send(true);
                    } else {
                        res.send(false)
                    }
                }
            });
        } else {
            const restaurant = await Restaurant.create(req.body);
            
            if(restaurant) {
                res.send(true);
            } else {
                res.send(false)
            }
        }


        // return res.json(restaurant);
    },

    async edit(req, res){
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return res.json(restaurant);
    },

    async delete(req, res){
        await Restaurant.findByIdAndRemove(req.params.id);

        return res.send()
    }
};
