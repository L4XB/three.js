import { Mesh, PlaneGeometry, Ray, Sphere, SphereGeometry, Vector3 } from 'three';
import { Capsule } from '../../../../examples/jsm/math/Capsule.js';
import { Octree } from '../../../../examples/jsm/math/Octree.js';

function getDepth( octree ) {

	let depth = 0;

	for ( const subTree of octree.subTrees ) {

		depth = Math.max( depth, 1 + getDepth( subTree ) );

	}

	return depth;

}

export default QUnit.module( 'Maths', () => {

	QUnit.module( 'Octree', () => {

		QUnit.test( 'maxLevel applies to recursive splits', ( assert ) => {

			const octree = new Octree();
			octree.maxLevel = 1;
			octree.fromGraphNode( new Mesh( new SphereGeometry( 2, 12, 8 ) ) );

			assert.strictEqual( getDepth( octree ), 2, 'Stops after the configured number of recursive splits' );

			const result = octree.rayIntersect( new Ray( new Vector3( 0, 0, 5 ), new Vector3( 0, 0, - 1 ) ) );
			assert.ok( result, 'The limited tree still finds the sphere surface' );
			assert.ok( Math.abs( result.distance - 3 ) < 1e-8, 'The intersection distance is unchanged' );

		} );

		QUnit.test( 'trianglesPerLeaf applies to recursive splits', ( assert ) => {

			const octree = new Octree();
			octree.trianglesPerLeaf = 32;
			octree.fromGraphNode( new Mesh( new SphereGeometry( 2, 12, 8 ) ) );

			assert.strictEqual( getDepth( octree ), 2, 'Does not keep subdividing leaves below the configured capacity' );

			const result = octree.rayIntersect( new Ray( new Vector3( 0, 0, 5 ), new Vector3( 0, 0, - 1 ) ) );
			assert.ok( result, 'The coarser tree still finds the sphere surface' );
			assert.ok( Math.abs( result.distance - 3 ) < 1e-8, 'The intersection distance is unchanged' );

		} );

		QUnit.test( 'mirrored meshes collide on the side they are rendered from', ( assert ) => {

			for ( const scaleX of [ 1, - 1 ] ) {

				// -- a wall facing +z, mirrored across the YZ plane in the second run, which keeps it facing +z --
				const wall = new Mesh( new PlaneGeometry( 10, 10 ) );
				wall.scale.x = scaleX;

				const octree = new Octree().fromGraphNode( wall );

				const sphereHit = octree.sphereIntersect( new Sphere( new Vector3( 0, 0, 0.5 ), 1 ) );
				assert.deepEqual( sphereHit.normal.toArray(), [ 0, 0, 1 ], `scale.x ${ scaleX }: the sphere is pushed back to +z` );
				assert.ok( Math.abs( sphereHit.depth - 0.5 ) < 1e-8, `scale.x ${ scaleX }: by its overlap` );

				const capsuleHit = octree.capsuleIntersect( new Capsule( new Vector3( 0, - 1, 0.5 ), new Vector3( 0, 1, 0.5 ), 1 ) );
				assert.ok( capsuleHit, `scale.x ${ scaleX }: the capsule hits the wall` );
				assert.deepEqual( capsuleHit && capsuleHit.normal.toArray(), [ 0, 0, 1 ], `scale.x ${ scaleX }: the capsule is pushed back to +z` );

			}

		} );

	} );

} );
