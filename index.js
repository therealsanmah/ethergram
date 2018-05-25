const handler = require('./src/handler');

exports.command = (req, res) => {
  // GCF entry point
  if (req.body.message === undefined) {
    // This is an error case, as "message" is required.
    return res.status(400).send('No message defined!');
  }
  const { message } = req.body;
  console.log(message);
  // Everything is okay.
  return handler
    .handleTelegramRequest(message)
    .then((successMessage) => {
      res.status(200).send({ message: successMessage });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: err });
    });
};
