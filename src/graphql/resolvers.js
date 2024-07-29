const {
	resolverUser,
	resolverChurch,
	resolverMember,
	resolverStatus,
	resolverBaptismRecord,
	resolverOffering
} = require("./resolvers");

const resolvers = {
	Query: {
		User: (_, parent, args, context) => ({
			...resolverUser.UserQuery
		}),
		Church: (_, parent, args, context) => ({
			...resolverChurch.ChurchQuery
		}),
		Member: (_, parent, args, context) => ({
			...resolverMember.MemberQuery
		}),
		Status: (_, parent, args, context) => ({
			...resolverStatus.StatusQuery
		}),
		BaptismRecord: (_, parent, args, context) => ({
			...resolverBaptismRecord.BaptismRecordQuery
		}),
		Offering: (_, parent, args, context) => ({
			...resolverOffering.OfferingQuery
		}),
	},
	Mutation: {
		User: (parent, args, context) => ({
			...resolverUser.UserMutation
		}),
		Church: (parent, args, context) => ({
			...resolverChurch.ChurchMutation
		}),
		Member: (parent, args, context) => ({
			...resolverMember.MemberMutation
		}),
		Status: (parent, args, context) => ({
			...resolverStatus.StatusMutation
		}),
		BaptismRecord: (parent, args, context) => ({
			...resolverBaptismRecord.BaptismRecordMutation
		}),
		Offering: (parent, args, context) => ({
			...resolverOffering.OfferingMutation
		}),
	},
};

module.exports = resolvers;
