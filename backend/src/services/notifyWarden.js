const { PublishCommand } = require("@aws-sdk/client-sns");
const snsClient = require("./snsClient");

async function notifyWarden(complaint) {
  const message = `
New complaint submitted by ${complaint.studentName}:

Title: ${complaint.title}
Description: ${complaint.description}
Hostel: ${complaint.hostelName || complaint.hostelId}
`;

  const params = {
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: message,
    Subject: "New Hostel Complaint Submitted"
  };

  try {
    const data = await snsClient.send(new PublishCommand(params));
    console.log("✅ Notification sent:", data.MessageId);
  } catch (err) {
    console.error("❌ Error sending notification:", err);
  }
}

module.exports = notifyWarden;