import * as inventoryService from '../../services/inventory.service';
import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext, GraphQLArgs } from '../types';

const resolversInventory = {
    InventoryQuery: {
        getAll: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - getAll');
            logger.logUser('Inventory - getAll', context.user);
            logger.logArgs('Inventory - getAll', args);
            validateContext(context.user, 'Inventory');
            try {
                const inventories = await inventoryService.getAllInventories();
                logger.logResponses('Inventory - getAll', inventories);
                return inventories;
            } catch (error) {
                logger.logError('Inventory - getAll', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - getAll');
            }
        },
        getById: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - getById');
            logger.logUser('Inventory - getById', context.user);
            logger.logArgs('Inventory - getById', args);
            console.log('Inventory getById - Full args object:', JSON.stringify(args, null, 2));
            console.log('Inventory getById - args.id:', args.id, 'type:', typeof args.id);
            console.log('Inventory getById - args keys:', Object.keys(args || {}));
            validateContext(context.user, 'Inventory');
            try {
                if (!args || !args.id) {
                    console.error('Inventory getById - args o args.id es undefined. Full args:', args);
                    throw new Error('ID es requerido');
                }
                // El ID puede venir como string o number desde GraphQL
                const id = typeof args.id === 'string' ? parseInt(args.id, 10) : Number(args.id);
                console.log('Inventory getById - parsed id:', id, 'from args.id:', args.id);
                if (isNaN(id) || id <= 0) {
                    console.error('Inventory getById - ID parseado inválido:', id, 'original:', args.id);
                    logger.logError('Inventory - getById', new Error(`ID inválido: ${args.id}`));
                    throw new Error(`ID inválido: ${args.id}`);
                }
                const inventory = await inventoryService.getInventoryById(id);
                logger.logResponse('Inventory - getById', inventory);
                return inventory;
            } catch (error) {
                logger.logError('Inventory - getById', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - getById');
            }
        },
        getByChurchAndYear: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - getByChurchAndYear');
            logger.logUser('Inventory - getByChurchAndYear', context.user);
            logger.logArgs('Inventory - getByChurchAndYear', args);
            validateContext(context.user, 'Inventory');
            try {
                const inventory = await inventoryService.getInventoryByChurchAndYear(
                    Number(args.churchId),
                    Number(args.year)
                );
                logger.logResponse('Inventory - getByChurchAndYear', inventory);
                return inventory;
            } catch (error) {
                logger.logError('Inventory - getByChurchAndYear', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - getByChurchAndYear');
            }
        },
        getByChurch: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - getByChurch');
            logger.logUser('Inventory - getByChurch', context.user);
            logger.logArgs('Inventory - getByChurch', args);
            validateContext(context.user, 'Inventory');
            try {
                const inventories = await inventoryService.getInventoriesByChurch(Number(args.churchId));
                logger.logResponses('Inventory - getByChurch', inventories);
                return inventories;
            } catch (error) {
                logger.logError('Inventory - getByChurch', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - getByChurch');
            }
        },
    },
    InventoryMutation: {
        create: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - create');
            logger.logUser('Inventory - create', context.user);
            logger.logArgs('Inventory - create', args);
            validateContext(context.user, 'Inventory');
            try {
                if (!args.inventory) {
                    return {
                        code: 400,
                        message: 'Los datos del inventario son requeridos',
                    };
                }
                
                const response = await inventoryService.createInventory(args.inventory);
                logger.logResponse('Inventory - create', response);
                return response;
            } catch (error) {
                logger.logError('Inventory - create', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - create');
            }
        },
        update: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - update');
            logger.logUser('Inventory - update', context.user);
            logger.logArgs('Inventory - update', args);
            validateContext(context.user, 'Inventory');
            try {
                const response = await inventoryService.updateInventory(args.inventory);
                logger.logResponse('Inventory - update', response);
                return response;
            } catch (error) {
                logger.logError('Inventory - update', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - update');
            }
        },
        delete: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - delete');
            logger.logUser('Inventory - delete', context.user);
            logger.logArgs('Inventory - delete', args);
            validateContext(context.user, 'Inventory');
            try {
                const response = await inventoryService.deleteInventory(Number(args.id));
                logger.logResponse('Inventory - delete', response);
                return response;
            } catch (error) {
                logger.logError('Inventory - delete', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - delete');
            }
        },
        createOrUpdateBuildingDetails: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - createOrUpdateBuildingDetails');
            logger.logUser('Inventory - createOrUpdateBuildingDetails', context.user);
            logger.logArgs('Inventory - createOrUpdateBuildingDetails', args);
            validateContext(context.user, 'Inventory');
            try {
                if (!args.buildingDetails) {
                    return {
                        code: 400,
                        message: 'Los datos de detalles de construcción son requeridos',
                    };
                }
                
                const response = await inventoryService.createOrUpdateBuildingDetails(args.buildingDetails);
                logger.logResponse('Inventory - createOrUpdateBuildingDetails', response);
                return response;
            } catch (error) {
                logger.logError('Inventory - createOrUpdateBuildingDetails', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - createOrUpdateBuildingDetails');
            }
        },
        createInventoryItem: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - createInventoryItem');
            logger.logUser('Inventory - createInventoryItem', context.user);
            logger.logArgs('Inventory - createInventoryItem', args);
            validateContext(context.user, 'Inventory');
            try {
                const response = await inventoryService.createInventoryItem(args.item);
                logger.logResponse('Inventory - createInventoryItem', response);
                return response;
            } catch (error) {
                logger.logError('Inventory - createInventoryItem', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - createInventoryItem');
            }
        },
        createMultipleInventoryItems: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - createMultipleInventoryItems');
            logger.logUser('Inventory - createMultipleInventoryItems', context.user);
            logger.logArgs('Inventory - createMultipleInventoryItems', args);
            validateContext(context.user, 'Inventory');
            try {
                if (!args.items) {
                    return {
                        code: 400,
                        message: 'Los items son requeridos',
                    };
                }
                
                if (!Array.isArray(args.items) || args.items.length === 0) {
                    return {
                        code: 400,
                        message: 'Se requiere al menos un item',
                    };
                }
                
                const response = await inventoryService.createMultipleInventoryItems(args.items);
                logger.logResponse('Inventory - createMultipleInventoryItems', response);
                return response;
            } catch (error) {
                logger.logError('Inventory - createMultipleInventoryItems', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - createMultipleInventoryItems');
            }
        },
        updateInventoryItem: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - updateInventoryItem');
            logger.logUser('Inventory - updateInventoryItem', context.user);
            logger.logArgs('Inventory - updateInventoryItem', args);
            validateContext(context.user, 'Inventory');
            try {
                const response = await inventoryService.updateInventoryItem(Number(args.id), args.item);
                logger.logResponse('Inventory - updateInventoryItem', response);
                return response;
            } catch (error) {
                logger.logError('Inventory - updateInventoryItem', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - updateInventoryItem');
            }
        },
        deleteInventoryItem: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - deleteInventoryItem');
            logger.logUser('Inventory - deleteInventoryItem', context.user);
            logger.logArgs('Inventory - deleteInventoryItem', args);
            validateContext(context.user, 'Inventory');
            try {
                const response = await inventoryService.deleteInventoryItem(Number(args.id));
                logger.logResponse('Inventory - deleteInventoryItem', response);
                return response;
            } catch (error) {
                logger.logError('Inventory - deleteInventoryItem', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - deleteInventoryItem');
            }
        },
        deleteInventoryItemsByInventory: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Inventory - deleteInventoryItemsByInventory');
            logger.logUser('Inventory - deleteInventoryItemsByInventory', context.user);
            logger.logArgs('Inventory - deleteInventoryItemsByInventory', args);
            validateContext(context.user, 'Inventory');
            try {
                const response = await inventoryService.deleteInventoryItemsByInventoryId(Number(args.inventoryId));
                logger.logResponse('Inventory - deleteInventoryItemsByInventory', response);
                return response;
            } catch (error) {
                logger.logError('Inventory - deleteInventoryItemsByInventory', error);
                throw error;
            } finally {
                logger.logEnd('Inventory - deleteInventoryItemsByInventory');
            }
        },
    },
};

export default resolversInventory;
