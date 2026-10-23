import { Box2 } from 'three';
import { SVGLoader } from '../../../../examples/jsm/loaders/SVGLoader.js';

export default QUnit.module( 'Addons', () => {

	QUnit.module( 'Loaders', () => {

		QUnit.module( 'SVGLoader', () => {

			QUnit.test( 'applies every transform of a transform list', ( assert ) => {

				const transforms = [
					'translate(10,20) scale(2)',
					'translate(10,20), scale(2)',
					'translate(10,20),scale(2)',
					'translate (10,20) scale (2)'
				];

				for ( const transform of transforms ) {

					const data = new SVGLoader().parse( `<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" transform="${ transform }"/></svg>` );
					const box = new Box2().setFromPoints( data.paths[ 0 ].subPaths[ 0 ].getPoints() );

					assert.deepEqual( [ box.min.x, box.min.y, box.max.x, box.max.y ], [ 10, 20, 12, 22 ], transform );

				}

			} );

		} );

	} );

} );
