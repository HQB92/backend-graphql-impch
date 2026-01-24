import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Church from './church.model';

interface InventoryAttributes {
    id: number;
    churchId: number;
    year: number;
    date: Date;
    observations?: string | null;
}

interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id' | 'observations'> {}

class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
    public id!: number;
    public churchId!: number;
    public year!: number;
    public date!: Date;
    public observations?: string | null;
}

Inventory.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    churchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Church,
            key: 'id',
        },
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    observations: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Inventory',
    tableName: 'Inventories',
    indexes: [
        {
            unique: true,
            fields: ['churchId', 'year'],
            name: 'unique_inventory_per_church_per_year',
        },
    ],
});

Inventory.belongsTo(Church, { foreignKey: 'churchId', as: 'church' });
Church.hasMany(Inventory, { foreignKey: 'churchId', as: 'inventories' });

export default Inventory;
