const { gql } = require('apollo-server-express');

const dataTypesOffering = gql`
    type OfferingQuery {
        getAll(user: Int, churchId: Int, mes: Int, anio: Int): [Offering]
        getSummaryAll(mes: Int, anio: Int): [SummaryOfferingChurch]
        getSummaryByChurch(churchId: Int, mes: Int, anio: Int): SummaryOfferingChurch
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
    

    
    type SummaryOfferingChurch {
        churchId: Int!
        name: String!
        total: Int!
        count: Int!
    }
`;
module.exports = dataTypesOffering;
