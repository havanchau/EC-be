import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getEmailTemplate = (username: string) => `
<h1>Xin chào ${username},</h1>

<p>Chúng tôi rất vui mừng được thông báo rằng đơn hàng của bạn đã được xác nhận!</p>

<p>Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm/dịch vụ của chúng tôi. Chúng tôi cam kết sẽ mang đến cho bạn những trải nghiệm mua sắm tốt nhất và sản phẩm chất lượng hàng đầu.</p>

<p>Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi qua email này hoặc qua hotline: [SỐ HOTLINE CỦA CÔNG TY].</p>

<p>Chúng tôi hy vọng bạn sẽ hài lòng với sản phẩm vừa mua và rất mong được phục vụ bạn trong tương lai.</p>

<p>Trân trọng,</p>

<p>Đội ngũ [Tên Công Ty]</p>
<p>Địa chỉ: [Địa chỉ công ty]</p>
<p>Email: [Email công ty]</p>
<p>Hotline: [Số hotline công ty]</p>
`;

export const sendEmail = async (to: string, subject: string, username: string) => {
  try {
    const html = getEmailTemplate(username);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};
