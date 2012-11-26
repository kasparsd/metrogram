/*
	Created by Kaspars Dambis
	http://konstruktors.com
*/

var metrogram = angular.module(
		'metrogram', []
	).controller(
		'slideshow', function ( $scope, $http, $timeout ) {
			// Set the API endpoint
			var api = 'https://api.instagram.com/v1/tags/%tag%/media/recent?access_token=257058201.9af4692.3d68e63b114944a0be332da732923a23&callback=JSON_CALLBACK',
				newReq, refreshApi;
			
			function fetchImages() {
				$scope.loadingClass = 'loading';

				$http.jsonp( 
					api.replace( '%tag%', $scope.tag )
				).success( function( data ) {
					delete $scope.loadingClass;

					$scope.images = data.data;

					if ( refreshApi )
						$timeout.cancel( refreshApi );

					refreshApi = $timeout( fetchImages, 6000 * data.data.length );
				});
			}

			// Check for new images on every loop
			$timeout( fetchImages );

			function advanceSlide() {
				/*
				// Method 1
				// Use a classname to highlight the current active slide
				if ( $scope.images ) {
					// Hide the current slide
					if ( $scope.images[ current ].active )
						delete $scope.images[ current ].active;

					// Choose the next slide
					if ( current < $scope.images.length )
						++current;	
					else
						current = 0;

					$scope.images[ current ].active = 'active';
				}
				*/

				// Method 2
				// The Angular way -- just flush the array elements around
				if ( angular.isDefined( $scope.images ) )
					$scope.images.push( $scope.images.shift() );

				$timeout( advanceSlide, 6000 );
			}

			// Advance slides
			$timeout( advanceSlide );

			$scope.tagChange = function() {
				if ( newReq )
					$timeout.cancel( newReq );

				newReq = $timeout( function() {
					fetchImages();
					$timeout.cancel( newReq );
				}, 500);
			}
		}
	).filter(
		'escape', function () {
			return function( input ) {
				return escape( input );
			}
		}	
	);

