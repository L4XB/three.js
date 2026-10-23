import { SVGLoader } from '../../../../examples/jsm/loaders/SVGLoader.js';

export default QUnit.module( 'Addons', () => {

	QUnit.module( 'Loaders', () => {

		QUnit.module( 'SVGLoader', () => {

			QUnit.test( 'reads points with the number syntax of path data', ( assert ) => {

				const cases = {
					'0,0 10-5 20,0': [[ 0, 0 ], [ 10, - 5 ], [ 20, 0 ]],
					'0,0 .5.5 1E1,0': [[ 0, 0 ], [ 0.5, 0.5 ], [ 10, 0 ]],
					'0 , 0 10 , 0': [[ 0, 0 ], [ 10, 0 ]],
					'0,0 10,0 x 20,20': [[ 0, 0 ], [ 10, 0 ]] // points after a syntax error are dropped
				};

				for ( const [ points, expected ] of Object.entries( cases ) ) {

					const data = new SVGLoader().parse( `<svg xmlns="http://www.w3.org/2000/svg"><polyline points="${ points }"/></svg>` );
					const actual = data.paths[ 0 ].subPaths[ 0 ].getPoints().map( ( p ) => [ p.x, p.y ] );

					assert.deepEqual( actual, expected, points );

				}

			} );

		} );

	} );

} );
