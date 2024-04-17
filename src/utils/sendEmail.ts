import nodemailer from 'nodemailer';

const sendEmail = async (email: string, subject: string, html: string) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.NODEMAILER_HOST,
			port: 2525,
			auth: {
				user: process.env.NODEMAILER_USER,
				pass: process.env.NODEMAILER_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: 'books.api@gmail.com',
			to: email,
			subject,
			html,
		});
	} catch (error) {
		console.log(error, 'email not sent');
	}
};

export default sendEmail;
