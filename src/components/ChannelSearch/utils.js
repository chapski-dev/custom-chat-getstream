export const channelByUser = async ({
  client,
  setActiveChannel,
  channel,
  selectedMessage,
  messageAuthorName,
  messageAuthorID,
  attachments,
}) => {
  const newChannel = await client.channel("messaging", {
    members: [channel.id, client.userID || ""],
  });
  console.log("channelByUser newChannel: ",newChannel);

  if (newChannel) {
    await setActiveChannel(newChannel).then(() => {
      if (selectedMessage || (attachments && attachments.length)) {
        newChannel.sendMessage({
          text: selectedMessage,
          message_author_name: messageAuthorName,
          message_author_id: messageAuthorID,
          forward_message: true,
          attachments: attachments,
        });
      }
    })
  } else {
    return setActiveChannel(newChannel);
  }
};
