import BaptismRecordService from '../db/models/baptismRecord.model';
import logger from '../utils/logger';

interface BaptismRecordData {
    childRUT: string;
    childFullName: string;
    childDateOfBirth: Date;
    fatherRUT?: string | null;
    fatherFullName?: string | null;
    motherRUT: string;
    motherFullName: string;
    placeOfRegistration: string;
    baptismDate: Date;
    registrationNumber: string;
    registrationDate: Date;
}

export interface ServiceResponse {
    code: number;
    message: string;
    data?: any;
    error?: string;
}

const getAllBaptismRecords = async (): Promise<BaptismRecordService[]> => {
    try {
        return await BaptismRecordService.findAll({ 
            order: [
                ['createdAt', 'DESC'],
            ]
        });
    } catch (error) {
        logger.logError('BaptismRecord - getAllBaptismRecords', error);
        throw error;
    }
};

const getBaptismRecordById = async (id: string): Promise<BaptismRecordService | null> => {
    try {
        return await BaptismRecordService.findByPk(id);
    } catch (error) {
        logger.logError('BaptismRecord - getBaptismRecordById', error);
        throw error;
    }
};

const getBaptismRecordByChildRUT = async (childRUT: string): Promise<BaptismRecordService | null> => {
    try {
        return await BaptismRecordService.findOne({ where: { childRUT } });
    } catch (error) {
        logger.logError('BaptismRecord - getBaptismRecordByChildRUT', error);
        throw error;
    }
};

const createBaptismRecord = async (baptismRecordData: BaptismRecordData): Promise<ServiceResponse> => {
    try {
        const requiredFields: (keyof BaptismRecordData)[] = [
            'childRUT', 'childFullName', 'childDateOfBirth',
            'motherRUT', 'motherFullName', 'placeOfRegistration',
            'baptismDate', 'registrationNumber', 'registrationDate'
        ];

        for (const field of requiredFields) {
            if (!baptismRecordData[field]) {
                return {
                    code: 400,
                    message: `Campo requerido faltante: ${field}`,
                };
            }
        }

        const existingRecord = await BaptismRecordService.findOne({
            where: { childRUT: baptismRecordData.childRUT }
        });

        if (existingRecord) {
            return {
                code: 400,
                message: 'Registro de bautizo ya existe para este RUT',
            };
        }

        const newRecord = await BaptismRecordService.create(baptismRecordData);

        logger.logResponse('BaptismRecord - createBaptismRecord', newRecord);

        return {
            code: 201,
            message: 'Registro de bautizo creado exitosamente',
            data: newRecord
        };
    } catch (error: any) {
        logger.logError('BaptismRecord - createBaptismRecord', error);
        return {
            code: 500,
            message: 'Error interno del servidor al crear el registro de bautizo',
            error: error.message
        };
    }
};

const updateBaptismRecord = async (baptismRecordData: Partial<BaptismRecordData>): Promise<ServiceResponse> => {
    try {
        const { childRUT } = baptismRecordData;

        if (!childRUT) {
            return {
                code: 400,
                message: 'childRUT es requerido para actualizar el registro',
            };
        }

        const existingRecord = await BaptismRecordService.findOne({
            where: { childRUT }
        });

        if (!existingRecord) {
            return {
                code: 404,
                message: 'Registro de bautizo no encontrado',
            };
        }

        await BaptismRecordService.update(baptismRecordData, {
            where: { childRUT }
        });

        logger.logResponse('BaptismRecord - updateBaptismRecord', { childRUT });

        return {
            code: 200,
            message: 'Registro de bautizo actualizado exitosamente',
        };
    } catch (error: any) {
        logger.logError('BaptismRecord - updateBaptismRecord', error);
        return {
            code: 500,
            message: 'Error interno del servidor al actualizar el registro de bautizo',
            error: error.message
        };
    }
};

const deleteBaptismRecord = async (childRUT: string): Promise<ServiceResponse> => {
    try {
        if (!childRUT) {
            return {
                code: 400,
                message: 'childRUT es requerido para eliminar el registro',
            };
        }

        const result = await BaptismRecordService.destroy({
            where: { childRUT }
        });

        if (result === 0) {
            return {
                code: 404,
                message: 'Registro de bautizo no encontrado',
            };
        }

        logger.logResponse('BaptismRecord - deleteBaptismRecord', { childRUT });

        return {
            code: 200,
            message: 'Registro de bautizo eliminado exitosamente',
        };
    } catch (error: any) {
        logger.logError('BaptismRecord - deleteBaptismRecord', error);
        return {
            code: 500,
            message: 'Error interno del servidor al eliminar el registro de bautizo',
            error: error.message
        };
    }
};

export {
    getAllBaptismRecords,
    getBaptismRecordById,
    getBaptismRecordByChildRUT,
    createBaptismRecord,
    updateBaptismRecord,
    deleteBaptismRecord,
};
