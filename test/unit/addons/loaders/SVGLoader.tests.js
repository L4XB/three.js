import { Box2 } from 'three';
import { SVGLoader } from '../../../../examples/jsm/loaders/SVGLoader.js';

export default QUnit.module( 'Addons', () => {

	QUnit.module( 'Loaders', () => {

		QUnit.module( 'SVGLoader', () => {

			QUnit.test( 'resolves and clamps rect corner radii', ( assert ) => {

				const cases = {
					// a radius larger than half the side is clamped, so the rect keeps its size
					'width="10" height="4" rx="5"': { start: [ 5, 0 ], box: [ 0, 0, 10, 4 ] },
					// a negative radius is invalid and the other one is missing, so the corners are square
					'width="10" height="10" rx="-1"': { start: [ 0, 0 ], box: [ 0, 0, 10, 10 ] },
					// "auto" takes the other radius
					'width="10" height="10" rx="auto" ry="3"': { start: [ 3, 0 ], box: [ 0, 0, 10, 10 ] }
				};

				for ( const [ attributes, expected ] of Object.entries( cases ) ) {

					const data = new SVGLoader().parse( `<svg xmlns="http://www.w3.org/2000/svg"><rect ${ attributes }/></svg>` );
					const points = data.paths[ 0 ].subPaths[ 0 ].getPoints();
					const box = new Box2().setFromPoints( points );

					assert.deepEqual( [ points[ 0 ].x, points[ 0 ].y ], expected.start, attributes );
					assert.deepEqual( [ box.min.x, box.min.y, box.max.x, box.max.y ], expected.box, attributes );

				}

			} );

		} );

	} );

} );
