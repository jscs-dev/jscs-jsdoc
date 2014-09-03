var expect = require('chai').expect;
var fnBody = global.fnBody;

describe('test', function() {
    describe('fnBody', function() {
        it('should not fail', function() {
            expect(fnBody(function() {
                /**
                 * yolo
                 */

                // yep.
            }))
                .to.eq('/**\n * yolo\n */\n\n// yep.\n');
        });
    });
});
