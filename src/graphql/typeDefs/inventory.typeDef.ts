import { gql } from 'apollo-server-express';

const dataTypesInventory = gql`
    type InventoryQuery {
        getAll: [Inventory]
        getById(id: ID!): Inventory
        getByChurchAndYear(churchId: ID!, year: Int!): Inventory
        getByChurch(churchId: ID!): [Inventory]
    }
    
    type InventoryMutation {
        create(inventory: InventoryInput!): Response
        update(inventory: InventoryInput!): Response
        delete(id: ID!): Response
        createOrUpdateBuildingDetails(buildingDetails: BuildingDetailsInput!): Response
        createInventoryItem(item: InventoryItemInput!): Response
        createMultipleInventoryItems(items: [InventoryItemInput!]!): Response
        updateInventoryItem(id: ID!, item: InventoryItemInput!): Response
        deleteInventoryItem(id: ID!): Response
        deleteInventoryItemsByInventory(inventoryId: ID!): Response
    }

    type Inventory {
        id: ID!
        churchId: Int!
        year: Int!
        date: Date!
        observations: String
        church: Church
        buildingDetails: BuildingDetails
        items: [InventoryItem]
    }

    input InventoryInput {
        id: ID
        churchId: Int!
        year: Int!
        date: Date!
        observations: String
    }

    type BuildingDetails {
        id: ID!
        inventoryId: Int!
        propertyArea: Float
        builtArea: Float
        wallTypes: String
        floorTypes: String
        ceilingTypes: String
        roofCovering: String
        propertyEnclosure: String
        numberOfDoors: Int
        numberOfWindows: Int
        electricalEnergy: String
        electricalEnergyOther: String
        water: String
        waterOther: String
        bathroomDetails: String
        diningRoomDetails: String
    }

    input BuildingDetailsInput {
        inventoryId: Int!
        propertyArea: Float
        builtArea: Float
        wallTypes: String
        floorTypes: String
        ceilingTypes: String
        roofCovering: String
        propertyEnclosure: String
        numberOfDoors: Int
        numberOfWindows: Int
        electricalEnergy: String
        electricalEnergyOther: String
        water: String
        waterOther: String
        bathroomDetails: String
        diningRoomDetails: String
    }

    type InventoryItem {
        id: ID!
        inventoryId: Int!
        itemName: String!
        category: String!
        hasItem: Boolean
        quantity: Int
    }

    input InventoryItemInput {
        id: ID
        inventoryId: Int!
        itemName: String!
        category: String!
        hasItem: Boolean
        quantity: Int
    }
`;

export default dataTypesInventory;
