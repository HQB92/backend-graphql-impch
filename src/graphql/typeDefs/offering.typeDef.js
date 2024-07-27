const { gql } = require('apollo-server-express');

const dataTypesOffering = gql`
    type OfferingQuery {
        getAll(user: Int, churchId: Int): [Offering]
        getById(id: Int!): Offering
    }
		
    type OfferingMutation {
				create(offering: OfferingInput!): Response
				update(offering: OfferingInput): Response
				delete(id: Int!): Response
		}
    		
		type Offering {
				id: Int!
				amount: Int!
				date: Date!
				type: String
				churchId: Int!
				userId: Int!
				state: Boolean!
		}

		input OfferingInput {
				id: Int
				amount: Int
				date: Date
				type: String
				churchId: Int
				userId: Int
				state: Boolean
		}

`;
module.exports = dataTypesOffering;
