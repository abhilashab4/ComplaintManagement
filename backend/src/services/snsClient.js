const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
require('dotenv').config();

const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function publishComplaint({ title, description, student, hostel }) {
  const message = `
New complaint submitted by ${student}:

Title: ${title}
Description: ${description}
Hostel: ${hostel || 'N/A'}
`;

  const params = {
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: message,
    Subject: "New Hostel Complaint Submitted"
  };

  try {
    const data = await snsClient.send(new PublishCommand(params));
    console.log("✅ SNS email sent:", data.MessageId);
  } catch (err) {
    console.error("❌ SNS error:", err);
  }
}

module.exports = { publishComplaint };