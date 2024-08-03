
import { DataTypes, Model, Sequelize } from 'sequelize';

class Member extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
}

export function initializeMember(sequelize: Sequelize): typeof Member {
  Member.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'members',
  });

  return Member;
}

export default Member;