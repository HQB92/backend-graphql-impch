import Church from './church.model';
import User from './user.model';
import Member from './member.model';
import Status from './status.model';
import BaptismRecord from './baptismRecord.model';
import Inventory from './inventory.model';
import BuildingDetails from './buildingDetails.model';
import InventoryItem from './inventoryItem.model';

// Definir relaciones adicionales después de importar todos los modelos
Inventory.hasOne(BuildingDetails, { foreignKey: 'inventoryId', as: 'buildingDetails' });
Inventory.hasMany(InventoryItem, { foreignKey: 'inventoryId', as: 'items' });

export {
    Church,
    User,
    Member,
    Status,
    BaptismRecord,
    Inventory,
    BuildingDetails,
    InventoryItem
};
