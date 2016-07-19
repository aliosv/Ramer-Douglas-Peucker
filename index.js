(function(global) {
    function init(settings) {
        var depsModulesNames = Object.keys(settings.dependencies);

        if(typeof exports === 'object') {
            module.exports = settings.init(depsModulesNames.reduce(function(prev, moduleName, index) {
                prev[depsModulesNames[index]] = require(settings.dependencies[moduleName]);
                return prev;
            }, {}));
        } else {
            global.modules.define(settings.name, depsModulesNames, function(provide) {
                provide(settings.init(Array.prototype.slice.call(arguments, 1).reduce(function(prev, module, index) {
                    prev[depsModulesNames[index]] = module;
                    return prev;
                }, {})));
            });
        }
    }

    init({
        name : 'ramer-douglas-peucker-algorithm',
        // Key - module name(for yModules)
        // Value - path to module(for nodeJs require)
        dependencies : {},
        init : function(deps) {
            return function(polyline, tolerance) {
                var approximatedVertexIndexes = [],
                    getSegmentLength = function(segment) {
                        return Math.sqrt(Math.pow(segment[1][0] - segment[0][0], 2) + Math.pow(segment[1][1] - segment[0][1], 2));
                    },
                    dotProduct = function(v1, v2) {
                        return v1[0] * v2[0] + v1[1] * v2[1];
                    },
                    getDistance = function(point, segment) {
                        var vector1 = [segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]],
                            vector2 = [point[0] - segment[0][0], point[1] - segment[0][1]],
                            dp1,
                            dp2,
                            b;

                        if((dp1 = dotProduct(vector2, vector1)) <= 0) return getSegmentLength([point, segment[0]]);
                        if((dp2 = dotProduct(vector1, vector1)) <= dp1) return getSegmentLength([point, segment[1]]);
                        b = dp1 / dp2;
                        return getSegmentLength([point, [segment[0][0] + b * vector1[0], segment[0][1] + b * vector1[1]]]);
                    },
                    decimate = function(tol, L, j, k) {
                        var distance,
                            maxDistance = 0,
                            indexOfFarthest;

                        if(j >= k) return;

                        for(var i = j + 1; i <= k; i += 1) {
                            distance = getDistance(L[i], [L[j], L[k]]);

                            if(distance > tol && distance > maxDistance) {
                                maxDistance = distance;
                                indexOfFarthest = i;
                            }
                        }

                        if(maxDistance > tol) {
                            approximatedVertexIndexes.push(indexOfFarthest);
                            decimate(tol, L, j, indexOfFarthest);
                            decimate(tol, L, indexOfFarthest, k);
                        }
                    };

                approximatedVertexIndexes.push(0);
                decimate(tolerance, polyline, 0, polyline.length - 1);
                approximatedVertexIndexes.push(polyline.length - 1);

                return approximatedVertexIndexes.sort(function(a, b) {
                    return a - b;
                }).map(function(val) {
                    return polyline[val];
                });
            };
        }
    });
})(typeof window !== 'undefined' ? window : global);
