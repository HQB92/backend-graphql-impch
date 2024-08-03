import { DataTypes, Model, Sequelize } from 'sequelize';

class Status extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
}

export function initializeStatus(sequelize: Sequelize): typeof Status {
    Status.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        description: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'statuses',
    });

    return Status;
}

export default Status;