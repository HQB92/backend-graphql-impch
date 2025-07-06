const BaptismRecordService = require('./src/services/baptismRecord.service');
const logger = require('./src/utils/logger');

async function testBaptismRecordService() {
    try {
        console.log('🧪 Iniciando pruebas del servicio de BaptismRecord...\n');

        // Datos de prueba
        const testData = {
            childRut: '12345678-9',
            childFullName: 'Juan Pérez González',
            childDateOfBirth: '2020-01-15',
            fatherRut: '98765432-1',
            fatherFullName: 'Carlos Pérez',
            motherRut: '11223344-5',
            motherFullName: 'María González',
            placeOfRegistration: 'Iglesia San Juan',
            baptismDate: '2023-06-15',
            registrationNumber: 'BAP-2023-001',
            registrationDate: '2023-06-20'
        };

        console.log('📝 Datos de prueba:', testData);

        // Prueba 1: Crear registro
        console.log('\n1️⃣ Probando creación de registro...');
        const createResult = await BaptismRecordService.createBaptismRecord(testData);
        console.log('Resultado de creación:', createResult);

        // Prueba 2: Obtener todos los registros
        console.log('\n2️⃣ Probando obtener todos los registros...');
        const allRecords = await BaptismRecordService.getAllBaptismRecords();
        console.log('Total de registros:', allRecords.length);
        console.log('Primer registro:', allRecords[0]);

        // Prueba 3: Buscar por childRut
        console.log('\n3️⃣ Probando búsqueda por childRut...');
        const foundRecord = await BaptismRecordService.getBaptismRecordByChildRut(testData.childRut);
        console.log('Registro encontrado:', foundRecord);

        // Prueba 4: Intentar crear duplicado
        console.log('\n4️⃣ Probando creación de duplicado...');
        const duplicateResult = await BaptismRecordService.createBaptismRecord(testData);
        console.log('Resultado de duplicado:', duplicateResult);

        // Prueba 5: Actualizar registro
        console.log('\n5️⃣ Probando actualización...');
        const updateData = {
            ...testData,
            childFullName: 'Juan Carlos Pérez González'
        };
        const updateResult = await BaptismRecordService.updateBaptismRecord(updateData);
        console.log('Resultado de actualización:', updateResult);

        // Prueba 6: Eliminar registro
        console.log('\n6️⃣ Probando eliminación...');
        const deleteResult = await BaptismRecordService.deleteBaptismRecord(testData.childRut);
        console.log('Resultado de eliminación:', deleteResult);

        console.log('\n✅ Todas las pruebas completadas exitosamente!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
    }
}

// Ejecutar las pruebas
testBaptismRecordService();