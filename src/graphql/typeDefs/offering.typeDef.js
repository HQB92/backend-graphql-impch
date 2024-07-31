const { gql } = require('apollo-server-express');

const dataTypesOffering = gql`
    type OfferingQuery {
        getAll(user: Int, churchId: Int, mes: Int, anio: Int): [Offering]
        getSummaryAll: SummaryOffering
        getSummaryByChurch(churchId: Int): SummaryOfferingChurch
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
    
    type SummaryOffering {
       churches: [SummaryOfferingChurch]
    }
    
    type SummaryOfferingChurch {
        churchId: Int!
        total: Int!
        count: Int!
    }
`;
module.exports = dataTypesOffering;
