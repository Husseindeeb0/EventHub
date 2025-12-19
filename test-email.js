const { Resend } = require('resend');

const resend = new Resend('re_6shXNsYD_9yuYQ5aNhnMNK3U1qiTZYJgf');

(async function() {
  try {
    console.log("Attempting to send test email...");
    const data = await resend.emails.send({
      from: 'EventHub <onboarding@resend.dev>',
      to: 'delivered@resend.dev', // safe test address that always succeeds if key is valid
      subject: 'Test Email from EventHub',
      html: '<strong>It works!</strong>',
    });

    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
})();
