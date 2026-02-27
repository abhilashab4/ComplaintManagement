const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
});

const publishComplaint = async (complaint) => {
  try {
    const command = new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Subject: "New Hostel Complaint",
      Message: JSON.stringify(complaint),
    });

    const response = await snsClient.send(command);
    console.log("SNS Message Published:", response.MessageId);
  } catch (error) {
    console.error("SNS Error:", error.message);
  }
};

module.exports = { publishComplaint };