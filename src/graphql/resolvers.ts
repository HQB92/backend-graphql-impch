import {GraphQLJSON} from 'graphql-type-json';
import resolverUser from './resolvers/user.resolver';
import resolverChurch from './resolvers/church.resolver';
import resolverMember from './resolvers/member.resolver';
import resolverStatus from './resolvers/status.resolver';
import resolverBaptismRecord from './resolvers/baptismRecord.resolver';
import resolverOffering from './resolvers/offering.resolver';
import resolverMerriageRecord from './resolvers/merriageRecord.resolver';


const resolvers = {
	JSON: GraphQLJSON,
	Query: {
		User: (_:any, parent:any, args:any, context:any) => ({
			...resolverUser.UserQuery
		}),
		Church: (_:any, parent:any, args:any, context:any) => ({
			...resolverChurch.ChurchQuery
		}),
		Member: (_:any, parent:any, args:any, context:any) => ({
			...resolverMember.MemberQuery
		}),
		Status: (_:any, parent:any, args:any, context:any) => ({
			...resolverStatus.StatusQuery
		}),
		BaptismRecord: (_:any, parent:any, args:any, context:any) => ({
			...resolverBaptismRecord.BaptismRecordQuery
		}),
		Offering: (_:any, parent:any, args:any, context:any) => ({
			...resolverOffering.OfferingQuery
		}),
		MerriageRecord: (_:any, parent:any, args:any, context:any) => ({
			...resolverMerriageRecord.MerriageRecordQuery
		}),
	},
	Mutation: {
		User: (_:any, parent:any, args:any, context:any) => ({
			...resolverUser.UserMutation
		}),
		Church: (_:any, parent:any, args:any, context:any) => ({
			...resolverChurch.ChurchMutation
		}),
		Member: (_:any, parent:any, args:any, context:any) => ({
			...resolverMember.MemberMutation
		}),
		Status: (_:any, parent:any, args:any, context:any) => ({
			...resolverStatus.StatusMutation
		}),
		BaptismRecord: (_:any, parent:any, args:any, context:any) => ({
			...resolverBaptismRecord.BaptismRecordMutation
		}),
		Offering: (_:any, parent:any, args:any, context:any) => ({
			...resolverOffering.OfferingMutation
		}),
		MerriageRecord: (_:any, parent:any, args:any, context:any) => ({
			...resolverMerriageRecord.MerriageRecordMutation
		}),
	},
};

export default resolvers;