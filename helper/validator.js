const { body } = require('express-validator');

exports.validateUpdateStudent = [body('ROLLID', 'roll id cannot be empty').notEmpty().trim().escape(),
body('NAME', 'Name cannot be empty').notEmpty().trim().escape(),
body('TITLE', 'TITLE cannot be empty').notEmpty().trim().escape(),
body('CLASS', 'CLASS cannot be empty').notEmpty().trim().escape(),
body('SECTION', 'SECTION cannot be empty').notEmpty().trim().escape()]

