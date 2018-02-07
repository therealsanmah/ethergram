var handler = require('./src/handler');

exports.command = (req, res) => {
    // GCF entry point
    if (req.body.message === undefined) {
        // This is an error case, as "message" is required.
        res.status(400).send('No message defined!');
    } else {
        var message = req.body.message;
        console.log(message);
        // Everything is okay.
        return handler.handleTelegramRequest(message)
            .then(function (successMessage) {
                res.status(200).send({ message: successMessage });
            })
            .catch(function (err) {
                console.error(err);
                res.status(500).send({ error: err });
            });
    }
};