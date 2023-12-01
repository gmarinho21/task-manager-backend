const Resend = require("resend");

const resend = new Resend.Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async function (registeredName, registeredEmail) {
  try {
    const data = await resend.emails.send({
      from: "Onboarding <welcome@gabrielm.com.br>",
      to: [registeredEmail],
      subject: "Welcome!",
      html: `<strong>${registeredName}, thank you for registering!</strong>`,
    });

    console.log(data);
  } catch (error) {
    console.error(error);
    console.log(error);
  }
};

module.exports = sendWelcomeEmail;
