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
			
			$scope.fetchImages = function() {
				$scope.loadingClass = 'loading';
				$scope.imgCurrent = 0;

				$http.jsonp( 
					api.replace( '%tag%', $scope.tag )
				).success( function( data ) {
					delete $scope.loadingClass;

					$scope.images = data.data;

					// Set the first image active
					if ( data.data.length )
						$scope.makeActiveSlide( $scope.imgCurrent );

					// Cancel the previous update request
					if ( refreshApi )
						$timeout.cancel( refreshApi );

					// Check for new images on every loop
					if ( data.data.length )
						refreshApi = $timeout( $scope.fetchImages, 6000 * data.data.length );
				});
			}

			// Fetch images
			$timeout( $scope.fetchImages );

			$scope.advanceSlide = function() {
				// Method 1
				// Use a classname to highlight the current active slide
				if ( angular.isDefined( $scope.images ) && $scope.images.length )
					$scope.makeActiveSlide( $scope.imgCurrent + 1 );

				/*
				// Method 2
				// Just flush the array elements around
				if ( angular.isDefined( $scope.images ) )
					$scope.images.push( $scope.images.shift() );
				*/

				$timeout( $scope.advanceSlide, 6000 );
			}

			// Advance slides
			$timeout( $scope.advanceSlide );

			$scope.makeActiveSlide = function( index ) {
				// Inactivate the previous slide
				delete $scope.images[ $scope.imgCurrent ].activeClass;
				// Select the next slide
				$scope.imgCurrent = ( index ) % $scope.images.length;
				// Activate the next slide
				$scope.images[ $scope.imgCurrent ].activeClass = 'active';
			}

			$scope.tagChange = function() {
				if ( newReq )
					$timeout.cancel( newReq );

				newReq = $timeout( function() {
					$scope.fetchImages();
					$timeout.cancel( newReq );
				}, 1000);
			}
		}
	).filter(
		'escape', function () {
			return function( input ) {
				return escape( input );
			}
		}	
	);

