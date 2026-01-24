// Importar el índice de modelos para inicializar las asociaciones
import '../db/models/index';
import InventoryModel from '../db/models/inventory.model';
import BuildingDetailsModel from '../db/models/buildingDetails.model';
import InventoryItemModel from '../db/models/inventoryItem.model';
import ChurchModel from '../db/models/church.model';

interface InventoryData {
    id?: number;
    churchId: number;
    year: number;
    date: string;
    observations?: string;
}

interface BuildingDetailsData {
    inventoryId: number;
    propertyArea?: number;
    builtArea?: number;
    wallTypes?: string;
    floorTypes?: string;
    ceilingTypes?: string;
    roofCovering?: string;
    propertyEnclosure?: string;
    numberOfDoors?: number;
    numberOfWindows?: number;
    electricalEnergy?: string;
    electricalEnergyOther?: string;
    water?: string;
    waterOther?: string;
    bathroomDetails?: string;
    diningRoomDetails?: string;
}

interface InventoryItemData {
    inventoryId: number;
    itemName: string;
    category: string;
    hasItem?: boolean;
    quantity?: number;
}

export interface ServiceResponse {
    code: number;
    message: string;
    data?: any;
}

const getAllInventories = async (): Promise<InventoryModel[]> => {
    return await InventoryModel.findAll({
        include: [
            { model: ChurchModel, as: 'church' },
            { model: BuildingDetailsModel, as: 'buildingDetails' },
            { model: InventoryItemModel, as: 'items' },
        ],
    });
};

const getInventoryById = async (id: number): Promise<InventoryModel | null> => {
    return await InventoryModel.findByPk(id, {
        include: [
            { model: ChurchModel, as: 'church' },
            { model: BuildingDetailsModel, as: 'buildingDetails' },
            { model: InventoryItemModel, as: 'items' },
        ],
    });
};

const getInventoryByChurchAndYear = async (churchId: number, year: number): Promise<InventoryModel | null> => {
    return await InventoryModel.findOne({
        where: { churchId, year },
        include: [
            { model: ChurchModel, as: 'church' },
            { model: BuildingDetailsModel, as: 'buildingDetails' },
            { model: InventoryItemModel, as: 'items' },
        ],
    });
};

const getInventoriesByChurch = async (churchId: number): Promise<InventoryModel[]> => {
    return await InventoryModel.findAll({
        where: { churchId },
        include: [
            { model: ChurchModel, as: 'church' },
            { model: BuildingDetailsModel, as: 'buildingDetails' },
            { model: InventoryItemModel, as: 'items' },
        ],
        order: [['year', 'DESC']],
    });
};

const createInventory = async (inventoryData: InventoryData): Promise<ServiceResponse> => {
    if (!inventoryData) {
        return {
            code: 400,
            message: 'Los datos del inventario son requeridos',
        };
    }

    const { churchId, year } = inventoryData;
    
    if (!churchId || !year) {
        return {
            code: 400,
            message: 'Los campos churchId y year son requeridos',
        };
    }
    
    // Verificar que no exista un inventario para esta iglesia en este año
    const existingInventory = await InventoryModel.findOne({ where: { churchId, year } });
    if (existingInventory) {
        return {
            code: 400,
            message: `Ya existe un inventario para esta iglesia en el año ${year}`,
        };
    }

    // Convertir la fecha de string a Date
    const inventoryDataWithDate = {
        ...inventoryData,
        date: new Date(inventoryData.date),
    };

    const inventory = await InventoryModel.create(inventoryDataWithDate);
    return {
        code: 200,
        message: 'Inventario creado exitosamente',
        data: inventory,
    };
};

const updateInventory = async (inventoryData: InventoryData): Promise<ServiceResponse> => {
    const { id } = inventoryData;
    if (!id) {
        return {
            code: 400,
            message: 'ID es requerido',
        };
    }

    // Si se está cambiando el año o la iglesia, verificar que no exista otro inventario
    if (inventoryData.year || inventoryData.churchId) {
        const currentInventory = await InventoryModel.findByPk(id);
        if (currentInventory) {
            const churchId = inventoryData.churchId || currentInventory.churchId;
            const year = inventoryData.year || currentInventory.year;
            
            const existingInventory = await InventoryModel.findOne({
                where: { churchId, year },
            });
            
            if (existingInventory && existingInventory.id !== id) {
                return {
                    code: 400,
                    message: `Ya existe un inventario para esta iglesia en el año ${year}`,
                };
            }
        }
    }

    // Convertir la fecha de string a Date si existe
    const { date, ...restData } = inventoryData;
    const updateData = {
        ...restData,
        ...(date && { date: new Date(date) }),
    };

    await InventoryModel.update(updateData, { where: { id } });
    return {
        code: 200,
        message: 'Inventario actualizado exitosamente',
    };
};

const deleteInventory = async (id: number): Promise<ServiceResponse> => {
    // Eliminar items y building details relacionados
    await InventoryItemModel.destroy({ where: { inventoryId: id } });
    await BuildingDetailsModel.destroy({ where: { inventoryId: id } });
    
    const result = await InventoryModel.destroy({ where: { id } });
    if (result === 0) {
        return {
            code: 400,
            message: 'Inventario no existe',
        };
    }
    return {
        code: 200,
        message: 'Inventario eliminado exitosamente',
    };
};

// Building Details
const createOrUpdateBuildingDetails = async (buildingDetailsData: BuildingDetailsData): Promise<ServiceResponse> => {
    if (!buildingDetailsData) {
        return {
            code: 400,
            message: 'Los datos de detalles de construcción son requeridos',
        };
    }

    const { inventoryId } = buildingDetailsData;
    
    if (!inventoryId) {
        return {
            code: 400,
            message: 'El campo inventoryId es requerido',
        };
    }
    
    const existing = await BuildingDetailsModel.findOne({ where: { inventoryId } });
    
    if (existing) {
        await BuildingDetailsModel.update(buildingDetailsData, { where: { inventoryId } });
        return {
            code: 200,
            message: 'Detalles de construcción actualizados exitosamente',
        };
    } else {
        await BuildingDetailsModel.create(buildingDetailsData);
        return {
            code: 200,
            message: 'Detalles de construcción creados exitosamente',
        };
    }
};

const getBuildingDetailsByInventoryId = async (inventoryId: number): Promise<BuildingDetailsModel | null> => {
    return await BuildingDetailsModel.findOne({ where: { inventoryId } });
};

// Inventory Items
const createInventoryItem = async (itemData: InventoryItemData): Promise<ServiceResponse> => {
    await InventoryItemModel.create(itemData);
    return {
        code: 200,
        message: 'Item de inventario creado exitosamente',
    };
};

const createMultipleInventoryItems = async (items: InventoryItemData[]): Promise<ServiceResponse> => {
    if (!items) {
        return {
            code: 400,
            message: 'Los items son requeridos',
        };
    }

    if (!Array.isArray(items)) {
        return {
            code: 400,
            message: 'Los items deben ser un array',
        };
    }

    if (items.length === 0) {
        return {
            code: 400,
            message: 'Se requiere al menos un item',
        };
    }

    await InventoryItemModel.bulkCreate(items);
    return {
        code: 200,
        message: 'Items de inventario creados exitosamente',
    };
};

const getInventoryItemsByInventoryId = async (inventoryId: number): Promise<InventoryItemModel[]> => {
    return await InventoryItemModel.findAll({ where: { inventoryId } });
};

const updateInventoryItem = async (id: number, itemData: Partial<InventoryItemData>): Promise<ServiceResponse> => {
    await InventoryItemModel.update(itemData, { where: { id } });
    return {
        code: 200,
        message: 'Item de inventario actualizado exitosamente',
    };
};

const deleteInventoryItem = async (id: number): Promise<ServiceResponse> => {
    const result = await InventoryItemModel.destroy({ where: { id } });
    if (result === 0) {
        return {
            code: 400,
            message: 'Item de inventario no existe',
        };
    }
    return {
        code: 200,
        message: 'Item de inventario eliminado exitosamente',
    };
};

const deleteInventoryItemsByInventoryId = async (inventoryId: number): Promise<ServiceResponse> => {
    await InventoryItemModel.destroy({ where: { inventoryId } });
    return {
        code: 200,
        message: 'Items de inventario eliminados exitosamente',
    };
};

export {
    getAllInventories,
    getInventoryById,
    getInventoryByChurchAndYear,
    getInventoriesByChurch,
    createInventory,
    updateInventory,
    deleteInventory,
    createOrUpdateBuildingDetails,
    getBuildingDetailsByInventoryId,
    createInventoryItem,
    createMultipleInventoryItems,
    getInventoryItemsByInventoryId,
    updateInventoryItem,
    deleteInventoryItem,
    deleteInventoryItemsByInventoryId,
};
