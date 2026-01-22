import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Church from './church.model';

interface OfferingAttributes {
    id: number;
    amount: number;
    date: Date;
    type?: string | null;
    churchId: number;
    userId: number;
    state: boolean;
}

interface OfferingCreationAttributes extends Optional<OfferingAttributes, 'id' | 'type'> {}

class Offering extends Model<OfferingAttributes, OfferingCreationAttributes> implements OfferingAttributes {
    public id!: number;
    public amount!: number;
    public date!: Date;
    public type?: string | null;
    public churchId!: number;
    public userId!: number;
    public state!: boolean;
}

Offering.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    churchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Church,
            key: 'id'
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Offering',
    tableName: 'Offerings',
});

Offering.belongsTo(Church, { foreignKey: 'churchId', as: 'church' });
Church.hasMany(Offering, { foreignKey: 'id', as: 'offerings' });

export default Offering;
