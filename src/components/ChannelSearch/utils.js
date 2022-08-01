export const channelByUser = async ({
  client,
  setActiveChannel,
  channel,
  selectedMessage,
  messageAuthorName,
  messageAuthorID,
  attachments,
  channelName
}) => {
  const newChannel = await client.channel("messaging", {
    members: [channel.id, client.userID || ""],
  })
  const forwardMessage = {
    text: selectedMessage,
    channel_name: channelName,
    message_author_name: messageAuthorName,
    message_author_id: messageAuthorID,
    forward_message: true,
    attachments: attachments,
  }
  if (newChannel) {
    await setActiveChannel(newChannel);
    if (selectedMessage || (attachments && attachments.length)) {
      setTimeout(() => {
        newChannel.sendMessage(forwardMessage);
      }, 1000);
    }
  } else {
    return setActiveChannel(newChannel);
  }
};
