import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../../config/database';

class Church extends Model {
    public id!: number;
    public name!: string;
    public address!: string;
}

export function initializeChurch(sequelize: Sequelize): typeof Church {
    Church.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        address: {
            type: new DataTypes.STRING(128),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'churches',
    });

    return Church;
}

export default Church;