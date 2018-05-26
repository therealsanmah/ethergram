const handler = require('./src/handler');

/* Local test */
function getMessage(message) {
  return {
    message_id: 6,
    from: {
      id: 465484482,
      is_bot: false,
      first_name: 'Sankaranarayanan',
      last_name: 'M',
      username: 'therealsankar',
      language_code: 'en-US',
    },
    chat: {
      id: -303724929,
      title: 'To The Moon and Back',
      type: 'group',
      all_members_are_administrators: true,
    },
    date: 1517848588,
    text: message,
    entities: [{ offset: 0, length: 4, type: 'bot_command' }],
  };
}

const message = getMessage('/set blah 0x12345');
handler
  .handleTelegramRequest(message)
  .then((success) => {
    console.log(success);
  })
  .catch((err) => {
    console.error(err);
  });
