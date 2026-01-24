import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Inventory from './inventory.model';

interface BuildingDetailsAttributes {
    id: number;
    inventoryId: number;
    propertyArea?: number | null;
    builtArea?: number | null;
    wallTypes?: string | null; // JSON string para múltiples opciones
    floorTypes?: string | null; // JSON string para múltiples opciones
    ceilingTypes?: string | null; // JSON string para múltiples opciones
    roofCovering?: string | null; // JSON string para múltiples opciones
    propertyEnclosure?: string | null; // JSON string para múltiples opciones
    numberOfDoors?: number | null;
    numberOfWindows?: number | null;
    electricalEnergy?: string | null; // sí/no/otro
    electricalEnergyOther?: string | null;
    water?: string | null; // potable/pozo/otro
    waterOther?: string | null;
    bathroomDetails?: string | null; // JSON string
    diningRoomDetails?: string | null; // JSON string
}

interface BuildingDetailsCreationAttributes extends Optional<BuildingDetailsAttributes, 'id'> {}

class BuildingDetails extends Model<BuildingDetailsAttributes, BuildingDetailsCreationAttributes> implements BuildingDetailsAttributes {
    public id!: number;
    public inventoryId!: number;
    public propertyArea?: number | null;
    public builtArea?: number | null;
    public wallTypes?: string | null;
    public floorTypes?: string | null;
    public ceilingTypes?: string | null;
    public roofCovering?: string | null;
    public propertyEnclosure?: string | null;
    public numberOfDoors?: number | null;
    public numberOfWindows?: number | null;
    public electricalEnergy?: string | null;
    public electricalEnergyOther?: string | null;
    public water?: string | null;
    public waterOther?: string | null;
    public bathroomDetails?: string | null;
    public diningRoomDetails?: string | null;
}

BuildingDetails.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    inventoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Un inventario solo puede tener un detalle de construcción
        references: {
            model: Inventory,
            key: 'id',
        },
    },
    propertyArea: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    builtArea: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    wallTypes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    floorTypes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ceilingTypes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    roofCovering: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    propertyEnclosure: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    numberOfDoors: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    numberOfWindows: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    electricalEnergy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    electricalEnergyOther: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    water: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    waterOther: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bathroomDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    diningRoomDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'BuildingDetails',
    tableName: 'BuildingDetails',
});

BuildingDetails.belongsTo(Inventory, { foreignKey: 'inventoryId', as: 'inventory' });

export default BuildingDetails;
