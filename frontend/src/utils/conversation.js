export const getNameOfConversation = (conversation, userId) => {
	if (!conversation) return '';
	const otherMembers = conversation.members.filter(
		(item) => item.userId !== userId
	);

	if (!conversation.isGroup) {
		return otherMembers[0].user.firstname + ' ' + otherMembers[0].user.lastname;
	} else {
		if (conversation.name) return conversation.name;
		else {
			return otherMembers.map((item, index, array) => {
				if (index !== array.length - 1) return item.user?.firstname + ', ';
				else return item.user?.firstname;
			});
		}
	}
};

export function getImageOfConversation(conversation, userId) {
	if (!conversation) return [];
	const otherMembers = conversation.members.filter(
		(item) => item.userId !== userId
	);
	if (conversation?.image) return conversation.image?.url;
	else {
		return otherMembers.map((item) => item.user?.avatar?.url).slice(0, 2);
	}
}
