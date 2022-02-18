var createError = require('http-errors');
var express = require('express');
var router = express.Router();
const { ethers } = require('ethers');

router.get('/', function(req, res, next) {
    res.send('');
});

router.get('/:address', function(req, res, next) {
    if (!req.params.address.endsWith('.eth')) {
        return next(createError(400, 'Invalid Address'));
    }

    const network = 'homestead'; // mainnet

    const provider = new ethers.providers.InfuraProvider(network, {
        infura: {
            projectId: process.env.INFURA_ID,
            projectSecret: process.env.INFURA_SECRET,
        }
    });

    const keys = [
        'avatar',
        'description',
        'display',
        'email',
        'keywords',
        'mail',
        'notice',
        'location',
        'phone',
        'url',
        'com.discord',
        'com.github',
        'com.linkedin',
        'com.twitter',
        'io.keybase',
        'org.telegram',
    ];

    const getTextRecords = async () => {
        const resolver = await provider.getResolver(req.params.address);
        
        const results = await Promise.all(keys.map(async (key) => (
            {
                key: key,
                value: await resolver.getText(key)
            }
        )));

        const records = results.reduce((obj, item) => (obj[item.key] = item.value, obj), {});

        records['address'] = await resolver.getAddress();

        return records;
    };

    getTextRecords().then((response) => {
        res.json(response);
    })
});

module.exports = router;
