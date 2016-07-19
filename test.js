function init(moduleName, provideTests) {
    (function(global) {
        if(typeof exports === 'object') {
            provideTests(require('.'));
        } else {
            modules.require([moduleName], function(module) {
                provideTests(module);

                mocha.checkLeaks();
                mocha.run();
            });
        }
    })(typeof window !== 'undefined' ? window : global);
}

init('ramer-douglas-peucker-algorithm', function(module) {
    describe('Ramer-Douglas-Peucker algorithm', function() {
        it('should filter array of 2D coordinates', function() {
            var polyline = [[0,0], [50, 0], [100, 100]];

            if(polyline.length !== 3) throw 'error';
            if(module(polyline, 50).length !== 2) throw 'error';
        });
    });
});
