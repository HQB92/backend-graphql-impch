import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Inventory from './inventory.model';

interface InventoryItemAttributes {
    id: number;
    inventoryId: number;
    itemName: string;
    category: string; // 'ACCESORIO' o 'VAJILLA_Y_CUBIERTOS'
    hasItem?: boolean | null; // Solo para ACCESORIO (si/no)
    quantity?: number | null;
}

interface InventoryItemCreationAttributes extends Optional<InventoryItemAttributes, 'id' | 'hasItem' | 'quantity'> {}

class InventoryItem extends Model<InventoryItemAttributes, InventoryItemCreationAttributes> implements InventoryItemAttributes {
    public id!: number;
    public inventoryId!: number;
    public itemName!: string;
    public category!: string;
    public hasItem?: boolean | null;
    public quantity?: number | null;
}

InventoryItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    inventoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Inventory,
            key: 'id',
        },
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['ACCESORIO', 'VAJILLA_Y_CUBIERTOS']],
        },
    },
    hasItem: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'InventoryItem',
    tableName: 'InventoryItems',
});

InventoryItem.belongsTo(Inventory, { foreignKey: 'inventoryId', as: 'inventory' });

export default InventoryItem;
