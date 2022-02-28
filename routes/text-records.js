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
        'name',
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
        'com.reddit',
        'com.github',
        'com.linkedin',
        'com.twitter',
        'io.keybase',
        'org.telegram',
    ];

    const getTextRecords = async () => {
        const resolver = await provider.getResolver(req.params.address);
        
        if (!resolver) {
            return [];
        }

        const promises = keys.map(async (key) => ({ key: key, value: await resolver.getText(key) }));

        promises.push({ key: 'wallet.bitcoin', value: await resolver.getAddress(0) });
        promises.push({ key: 'wallet.ethereum', value: await resolver.getAddress() });

        const results = await Promise.all(promises);
        const records = results.reduce((obj, item) => (obj[item.key] = item.value, obj), {});

        return records;
    };

    getTextRecords().then((response) => {
        res.json(response);
    });
});

module.exports = router;
