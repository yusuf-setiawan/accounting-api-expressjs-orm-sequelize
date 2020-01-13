'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return [queryInterface.addColumn(
            'Akuns',
            'isActive',
            Sequelize.BOOLEAN
        ), ];
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Akuns', 'isActive');
    }
};