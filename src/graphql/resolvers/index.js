const resolverUser = require('./user.resolver');
const resolverChurch = require('./church.resolver');
const resolverMember = require('./member.resolver');
const resolverStatus = require('./status.resolver');
const resolverBaptismRecord = require('./baptismRecord.resolver');
const resolverOffering = require('./offering.resolver');

module.exports = {
    resolverUser,
    resolverChurch,
    resolverMember,
    resolverStatus,
    resolverBaptismRecord,
    resolverOffering
}