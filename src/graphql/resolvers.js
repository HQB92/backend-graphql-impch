const resolverUser = require('./resolvers/user.resolver');
const resolverChurch = require('./resolvers/church.resolver');
const resolverMember = require('./resolvers/member.resolver');
const resolverStatus = require('./resolvers/status.resolver');
const resolverBaptismRecord = require('./resolvers/baptismRecord.resolver');
const resolverOffering = require('./resolvers/offering.resolver');
const resolverMerriageRecord = require('./resolvers/merriageRecord.resolver');


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
		MerriageRecord: (_, parent, args, context) => ({
			...resolverMerriageRecord.MerriageRecordQuery
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
		MerriageRecord: (parent, args, context) => ({
			...resolverMerriageRecord.MerriageRecordMutation
		}),
	},
};

module.exports = resolvers;
