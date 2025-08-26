const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

module.exports = async (shipment, issues) => {
  const recipient = shipment?.sender?.contact; // adjust if needed
  if (!recipient) throw new Error('Sender contact (email) missing');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: 'Compliance Issues with Your Shipment',
    text: `Dear ${shipment.sender?.name || 'Customer'},

Your shipment (ID: ${shipment._id}) cannot proceed due to the following compliance issues:

${(issues || []).map(i => `- ${i}`).join('\n')}

Please rectify these issues to continue processing your shipment.

Regards,
Compliance Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Compliance issue mail sent.');
  } catch (error) {
    console.error('Email send error:', error.message);
    throw error;
  }
};
